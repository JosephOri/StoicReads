import { createBrowserRouter,redirect } from "react-router-dom";
import { getTokens } from "../services/auth.service";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFound from "../pages/NotFound/NotFound";
import SignupPage from "../pages/SignupPage/SignupPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

const authLoader = async () => {
    const { accessToken, refreshToken } = getTokens();
    const isBothTokens = accessToken && refreshToken;
    if (isBothTokens) {
      return null;
    }
    return redirect("/login");
};

const unauthLoader = async () => {
    const { accessToken, refreshToken } = getTokens();
    const isBothTokens = accessToken && refreshToken;
    if (isBothTokens) {
      return redirect("/");
    }
    return null;
}

export const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      loader: authLoader,
      errorElement: <ErrorPage/>,
    },
    {
      path: "/login",
      loader: unauthLoader,
      element: <LoginPage />,
    },
    {
      path: "/signup",
      loader: unauthLoader,
      element: <SignupPage />,
    },
    {
      path: "*",
      element: <NotFound/>
    },
  ]);