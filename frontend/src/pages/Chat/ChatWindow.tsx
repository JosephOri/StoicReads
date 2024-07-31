import React, {
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";

import { User } from "../../interfaces/User";

interface Message {
  sender: string;
  text: string;
}

interface ChatWindowProps {
  selectedUser: User | null;
  userId: string;
  messages: Message[];
  newMessage: string;
  handleKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void;
  sendMessage: (e: MouseEvent<HTMLButtonElement>) => void;
  setNewMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedUser,
  userId,
  messages,
  newMessage,
  handleKeyPress,
  sendMessage,
  setNewMessage,
}) => {
  useEffect(() => {
    console.log("ChatWindow messages:", messages);
  }, [messages]);

  return (
    <div className="chat-window">
      {selectedUser ? (
        <div>
          <h3>Chatting with {selectedUser.userName}</h3>

          {/* Display Messages */}
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.sender === userId ? "sent" : "received"}
              >
                <strong>
                  {message.sender === userId ? "You" : selectedUser.userName}:
                </strong>{" "}
                {message.text}
              </div>
            ))}
          </div>

          {/* Input for Sending Messages */}
          <div className="message-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewMessage(e.target.value)
              }
              onKeyPress={handleKeyPress}
            />
            <button onClick={sendMessage} disabled={!newMessage.trim()}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <p>Select a user to start a chat</p>
      )}
    </div>
  );
};

export default ChatWindow;
