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
    if (!isBothTokens) {
      return null;
    }
    return redirect("/login");
};


export const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      loader: authLoader,
      errorElement: <ErrorPage/>,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "*",
      element: <NotFound/>
    },
  ]);