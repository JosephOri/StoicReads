import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  AUTH_GOOGLE_LOGIN_URL,
  USER_IDENTIFIER_KEY,
  AUTH_ONLINEUSERS_URL,
  MESSAGE_GETCONVERSATION_URL,

} from "../utils/constants";
import AuthTokens from "../interfaces/AuthTokens";
import { User } from "../interfaces/User";
import { CredentialResponse } from "@react-oauth/google";
import axios, { AxiosError } from "axios";


interface OnlineUsersResponse {
  users: User[];
}

interface Message {
  sender: string;
  receiver: string;
  text: string;
}

interface ConversationResponse {
  messages: Message[];
}

export const getTokens = () => {
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
};

export const saveTokens = (tokens: AuthTokens, userIdentifier: string) => {
  localStorage.setItem(USER_IDENTIFIER_KEY, userIdentifier);
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const googleLogin = async (
  credentialResponse: CredentialResponse
): Promise<User> => {
  console.log("credentialResponse", credentialResponse);
  try {
    const response = await axios.post<User>(
      AUTH_GOOGLE_LOGIN_URL,
      credentialResponse.credential
    );
    console.log("google credentials", credentialResponse.credential);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError;
    console.log("error response", error.message);
    throw err;
  }
};


export const fetchOnlineUsers = async (
  userId: string
): Promise<OnlineUsersResponse | null> => {
  try {
    const response = await fetch(AUTH_ONLINEUSERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: OnlineUsersResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching online users:", error);
    return null;
  }
};


export const getHistoryMessages = async (
  sender: string,
  receiver: string
): Promise<ConversationResponse | null> => {
  try {
    const response = await fetch(
      MESSAGE_GETCONVERSATION_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender, receiver }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data: ConversationResponse = await response.json();
    console.log("getConversation", data);
    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null;
  }
};
