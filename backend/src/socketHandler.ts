import * as UserController from "./controllers/auth.controller";
import * as MessageController from "./controllers/message.contoller";
import { Server } from "socket.io";

export function handleSocket(io: Server) {
  io.on("connection", handleConnection);

  async function handleConnection(socket: any) {
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);

    // Wait for a short period to allow potential removal to complete
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = await UserController.updateSocketId(userId, socket.id);
    io.emit("userConnected", {
      user: user
        ? { _id: user._id, socketId: socket.id, userName: user.userName }
        : null,
    });

    socket.on("send_private_message", handlePrivateMessage);

    socket.on("disconnect", handleDisconnect);

    async function handlePrivateMessage({
      sender,
      receiver,
      text,
    }: {
      sender: string;
      receiver: any;
      text: string;
    }) {
      try {
        const message = await MessageController.savePrivateMessage({
          sender,
          receiver: receiver._id,
          text,
        });
        if (message) {
          io.to(receiver.socketId).emit("private_message_received", {
            message,
          });
        }
      } catch (error: any) {
        console.error("Error handling private message:", error.message);
      }
    }

    async function handleDisconnect() {
      try {
        console.log("User disconnected");
        const disconnectedUserId = await UserController.removeSocketId(
          socket.id
        );
        console.log(disconnectedUserId);
        io.emit("userDisconnected", { disconnectedUserId });
      } catch (error: any) {
        console.error("Error handling disconnect:", error.message);
      }
    }
  }
}
