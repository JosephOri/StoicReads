import { createBrowserRouter,redirect } from "react-router-dom";
import { getTokens } from "../services/auth.service";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFound from "../pages/NotFound/NotFound";
import SignupPage from "../pages/SignupPage/SignupPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { applicationRoutes } from "../utils/constants";

const authLoader = async () => {
    const { accessToken, refreshToken } = getTokens();
    const isBothTokens = accessToken && refreshToken;
    if (isBothTokens) {
      return null;
    }
    return redirect(applicationRoutes.LOGIN);
};

const unauthLoader = async () => {
    const { accessToken, refreshToken } = getTokens();
    const isBothTokens = accessToken && refreshToken;
    if (isBothTokens) {
      return redirect(applicationRoutes.HOME);
    }
    return null;
}

export const router = createBrowserRouter([
    {
      path: applicationRoutes.HOME,
      element: <HomePage />,
      loader: authLoader,
      errorElement: <ErrorPage/>,
    },
    {
      path: applicationRoutes.LOGIN,
      loader: unauthLoader,
      element: <LoginPage />,
    },
    {
      path: applicationRoutes.SIGNUP,
      loader: unauthLoader,
      element: <SignupPage />,
    },
    {
      path: applicationRoutes.NOT_FOUND,
      element: <NotFound/>
    },
  ]);