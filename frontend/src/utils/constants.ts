export const ACCESS_TOKEN_KEY = "access-token";
export const REFRESH_TOKEN_KEY = "refresh-token";
export const USER_IDENTIFIER_KEY = "userIdentifier";
export const BACKEND_URL = "https://node07.cs.colman.ac.il";
export const AUTH_URL = `${BACKEND_URL}/auth`;
export const AUTH_LOGIN_URL = `${AUTH_URL}/login`;
export const AUTH_REGISTER_URL = `${AUTH_URL}/register`;
export const AUTH_LOGOUT_URL = `${AUTH_URL}/logout`;
export const AUTH_GOOGLE_URL = `${AUTH_URL}/google`;
export const USERS_URL = `${AUTH_URL}/user`;
export const UPDATE_URL = `${AUTH_URL}/update`;
export const AUTH_GOOGLE_LOGIN_URL = `${AUTH_URL}/google/login`;
export const AUTH_ONLINEUSERS_URL = `${AUTH_URL}/online-users`;
export const POSTS_URL = `${BACKEND_URL}/post`;
export const COMMENTS_URL = `${BACKEND_URL}/comment`;
export const DEFAULT_IMAGE = `${BACKEND_URL}/uploads/defaultImage.jpg`;
export const MESSAGE_URL = `${BACKEND_URL}/message`;
export const MESSAGE_GETCONVERSATION_URL = `${MESSAGE_URL}/getConversation`;

export const applicationRoutes = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  CREATE_POST: "/create-post",
  USER: "/user",
  EDIT_POST: "/edit-post/:postId",
  EDIT_PROFILE: "/edit-profile/:userId",
  NOT_FOUND: "*",
  PROFILE: "/profile",
  CHAT: "/chat",
};
