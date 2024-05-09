import { createBrowserRouter,redirect } from "react-router-dom";
import { getTokens } from "../services/auth.service";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFound from "../pages/NotFound/NotFound";
import SignupPage from "../pages/SignupPage/SignupPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

const authLoader = async () => {
    const tokens = getTokens();
    if (tokens.accessToken && tokens.refreshToken) {
      return null;
    }
    return redirect("/login");
};
const unauthenticatedAuthLoader = async () => {
  const tokens = getTokens();
  if (!tokens.accessToken || !tokens.refreshToken) {
    return null;
  }
  return redirect("/");
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
      loader: unauthenticatedAuthLoader,
      element: <LoginPage />,
    },
    {
      path: "/signup",
      loader: unauthenticatedAuthLoader,
      element: <SignupPage />,
    },
    {
      path: "*",
      element: <NotFound/>
    },
  ]);