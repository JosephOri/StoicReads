import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFound from "../pages/NotFound/NotFound";
import SignupPage from "../pages/SignupPage/SignupPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import RouteGuard from "@components/RouteGuard";
import { Routes } from "@interfaces/Routes.ts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: (
      <RouteGuard route={Routes.LOGIN}>
        <LoginPage />
      </RouteGuard>
    ),
  },
  {
    path: "/signup",
    element: (
      <RouteGuard route={Routes.SIGNUP}>
        <SignupPage />
      </RouteGuard>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
