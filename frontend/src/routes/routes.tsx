import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getTokens } from "../services/auth.service";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFound from "../pages/NotFound/NotFound";
import SignupPage from "../pages/SignupPage/SignupPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { applicationRoutes } from "../utils/constants";
import { Layout } from "../components/Layout/Layout";

interface AuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: AuthProps) => {
  const { accessToken, refreshToken } = getTokens();
  const isBothTokens = accessToken && refreshToken;
  return isBothTokens ? (
    children
  ) : (
    <Navigate to={applicationRoutes.LOGIN} replace />
  );
};

const RedirectIfAuthenticated = ({ children }: AuthProps) => {
  const { accessToken, refreshToken } = getTokens();
  const isBothTokens = accessToken && refreshToken;
  return isBothTokens ? (
    <Navigate to={applicationRoutes.HOME} replace />
  ) : (
    children
  );
};

export const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route
        path={applicationRoutes.HOME}
        element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
    </Route>
    <Route
      path={applicationRoutes.LOGIN}
      element={
        <RedirectIfAuthenticated>
          <LoginPage />
        </RedirectIfAuthenticated>
      }
    />
    <Route
      path={applicationRoutes.SIGNUP}
      element={
        <RedirectIfAuthenticated>
          <SignupPage />
        </RedirectIfAuthenticated>
      }
    />

    <Route path={applicationRoutes.NOT_FOUND} element={<NotFound />} />
    <Route path="*" element={<ErrorPage />} />
  </Routes>
);
