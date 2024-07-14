import axios from "axios";
import {
  ACCESS_TOKEN_KEY,
  AUTH_LOGOUT_URL,
  REFRESH_TOKEN_KEY,
} from "./constants";

export const logout = async () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (refreshToken) {
    await axios.post(
      AUTH_LOGOUT_URL,
      {},
      {
        headers: {
          authorization: refreshToken,
        },
      }
    );
  }
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
