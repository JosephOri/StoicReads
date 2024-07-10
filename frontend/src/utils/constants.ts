export const ACCESS_TOKEN_KEY = "access-token";
export const REFRESH_TOKEN_KEY = "refresh-token";
export const BASE_URL = "http://localhost:3000";
export const AUTH_URL = `${BASE_URL}/auth`;
export const AUTH_LOGIN_URL = `${AUTH_URL}/login`;
export const AUTH_REGISTER_URL = `${AUTH_URL}/register`;
export const AUTH_LOGOUT_URL = `${AUTH_URL}/logout`;
export const AUTH_GOOGLE_URL = `${AUTH_URL}/google`;
export const AUTH_GOOGLE_LOGIN_URL = `${AUTH_URL}/google/login`;

export const applicationRoutes = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  CREATE_POST: "/create-post",
  NOT_FOUND: "*",
};
