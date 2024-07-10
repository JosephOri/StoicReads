import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { getTokens } from "../services/auth.service";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFound from "../pages/NotFound/NotFound";
import SignupPage from "../pages/SignupPage/SignupPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { applicationRoutes } from "../utils/constants";
import { Layout } from "../components/Layout/Layout";
import CreatePost from "../pages/CreatePost/CreatePost";

const RequireAuth = () => {
  const { accessToken, refreshToken } = getTokens();
  const isBothTokens = accessToken && refreshToken;
  return isBothTokens ? (
    <Outlet />
  ) : (
    <Navigate to={applicationRoutes.LOGIN} replace />
  );
};

const RedirectIfAuthenticated = () => {
  const { accessToken, refreshToken } = getTokens();
  const isBothTokens = accessToken && refreshToken;
  return isBothTokens ? (
    <Navigate to={applicationRoutes.HOME} replace />
  ) : (
    <Outlet />
  );
};

export const AppRoutes = () => (
  <Routes>
    <Route element={<RequireAuth />}>
      <Route element={<Layout />}>
        <Route path={applicationRoutes.HOME} element={<HomePage />} />
        <Route path={applicationRoutes.CREATE_POST} element={<CreatePost />} />
      </Route>
    </Route>

    <Route element={<RedirectIfAuthenticated />}>
      <Route path={applicationRoutes.LOGIN} element={<LoginPage />} />
      <Route path={applicationRoutes.SIGNUP} element={<SignupPage />} />
    </Route>
    <Route path={applicationRoutes.NOT_FOUND} element={<NotFound />} />
    <Route path="*" element={<ErrorPage />} />
  </Routes>
);
