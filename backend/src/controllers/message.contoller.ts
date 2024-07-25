import { Request, Response } from "express";
import MessageModel from "../models/MessageModel";

export interface AuthRequest extends Request {
  user: { _id: string };
}

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { sender, receiver } = req.body;
    const conversation = await MessageModel.find(
      {
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      },
      { _id: 0 }
    ); // Exclude the _id field from the returned documents
    res.send(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const savePrivateMessage = async ({
  sender,
  receiver,
  text,
}: {
  sender: string;
  receiver: string;
  text: string;
}) => {
  try {
    const message = new MessageModel({ sender, receiver, text });
    await message.save();
    return message;
  } catch (error: any) {
    console.error("Error saving message:", error.message);
    return null;
  }
};
