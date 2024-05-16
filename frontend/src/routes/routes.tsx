import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFound from "../pages/NotFound/NotFound";
import SignupPage from "../pages/SignupPage/SignupPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import RouteGuard from "@components/RouteGuard";
import { Routes as Links } from "@constants/Routes";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} errorElement={<ErrorPage />} />
      <Route
        path="/login"
        element={
          <RouteGuard route={Links.LOGIN}>
            <LoginPage />
          </RouteGuard>
        }
      />
      <Route
        path="/signup"
        element={
          <RouteGuard route={Links.SIGNUP}>
            <SignupPage />
          </RouteGuard>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
