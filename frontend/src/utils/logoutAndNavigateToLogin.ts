import { NavigateFunction } from 'react-router-dom';
import axios from 'axios';
import { allowCorsForAxios } from './allowCorsForAxios';
import {
  ACCESS_TOKEN_KEY,
  AUTH_LOGOUT_URL,
  REFRESH_TOKEN_KEY,
} from './constants';

export const logoutAndNavigateToLogin = async (navigate: NavigateFunction) => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  navigate('/login');
  allowCorsForAxios(axios);
  await axios.post(AUTH_LOGOUT_URL, {
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  });
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
