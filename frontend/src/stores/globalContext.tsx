import React, { createContext, useState, useContext, useEffect } from "react";
import { getTokens } from "@services/auth.service.ts";

interface GlobalContextProps {
  isAuthenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

type GlobalProviderProps = {
  children: React.ReactNode;
};

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    const authLoader = async () => {
      const { accessToken, refreshToken } = getTokens();
      const isBothTokens: boolean = !!accessToken && !!refreshToken;
      setAuthenticated(isBothTokens);
    };

    authLoader();
    console.log("isAuthenticated", isAuthenticated);
  }, []);
  return (
    <GlobalContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};
