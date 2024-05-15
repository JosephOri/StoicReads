import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobal } from "@stores/globalContext";
import { Routes } from "@interfaces/Routes";

type Route = (typeof Routes)[keyof typeof Routes];

interface RouteGuardProps extends PropsWithChildren {
  route: Route;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, route }) => {
  const { isAuthenticated } = useGlobal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(route, { replace: true });
    }
  }, [navigate, isAuthenticated]);

  return <>{children}</>;
};

export default RouteGuard;
