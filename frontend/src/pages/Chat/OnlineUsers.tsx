import React, { useState, useEffect } from "react";
import { fetchOnlineUsers } from "../../services/auth.service";
import { Socket } from "socket.io-client"; // Import Socket type if you're using socket.io
import { User } from "../../interfaces/User";

interface OnlineUsersProps {
  startChat: (user: User) => void;
  updateSelectedUser: (user: User | null) => void;
  userId: string;
  socket: Socket; // Ensure you have the correct type for socket
}

const OnlineUsers: React.FC<OnlineUsersProps> = ({
  startChat,
  updateSelectedUser,
  userId,
  socket,
}) => {
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: User }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOnlineUsers(userId);
        if (Array.isArray(data)) {
          const usersObject = data.reduce<{ [key: string]: User }>(
            (acc: { [key: string]: User }, user: User) => {
              acc[String(user._id)] = user;
              return acc;
            },
            {}
          );
          setOnlineUsers(usersObject);
          console.log("usersObject", usersObject);
        } else {
          console.error("Invalid response format for online users:", data);
        }
      } catch (error) {
        console.error("Error fetching online users:", error);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const handleOnUserConnected = ({ user }: { user: User }) => {
      if (String(user._id) !== userId) {
        setOnlineUsers((prevUsers) => ({
          ...prevUsers,
          [String(user._id)]: user,
        }));
      }
    };

    const handleOnUserDisconnected = ({
      disconnectedUserId,
    }: {
      disconnectedUserId: string;
    }) => {
      console.log("disconnectedUserId", disconnectedUserId);
      updateSelectedUser(null);
      setOnlineUsers((prevUsers) => {
        const updatedUsers = { ...prevUsers };
        delete updatedUsers[disconnectedUserId];
        return updatedUsers;
      });
    };

    socket.on("userConnected", handleOnUserConnected);
    socket.on("userDisconnected", handleOnUserDisconnected);

    return () => {
      socket.off("userConnected", handleOnUserConnected);
      socket.off("userDisconnected", handleOnUserDisconnected);
    };
  }, [socket, updateSelectedUser, userId]);

  return (
    <div className="online-users">
      <h3>Online Users</h3>
      <ul>
        {Object.values(onlineUsers).map((user) => (
          <li key={String(user._id)} onClick={() => startChat(user)}>
            {user.userName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
