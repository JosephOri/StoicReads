import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants';
import AuthTokens from '../interfaces/AuthTokens';

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
