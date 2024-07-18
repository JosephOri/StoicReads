import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { getTokens } from "../services/auth.service";
import HomePage from "../pages/HomePage/HomePage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFound from "../pages/NotFound/NotFound";
import SignupPage from "../pages/SignupPage/SignupPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { applicationRoutes } from "../utils/constants";
import { Layout } from "../components/Layout/Layout";
import Post from "../pages/CreatePost/Post";
import User from "../pages/User/User";

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
        <Route path={applicationRoutes.PROFILE} element={<ProfilePage />} />
        <Route path={applicationRoutes.CREATE_POST} element={<Post />} />
        <Route path={applicationRoutes.USER} element={<User />} />
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
