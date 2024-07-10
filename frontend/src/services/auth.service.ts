import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  AUTH_GOOGLE_LOGIN_URL,
} from "../utils/constants";
import AuthTokens from "../interfaces/AuthTokens";

import { User } from "../interfaces/User";
import { CredentialResponse } from "@react-oauth/google";
import axios, { AxiosError } from "axios";

export const getTokens = () => {
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
};

export const saveTokens = (tokens: AuthTokens) => {
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
