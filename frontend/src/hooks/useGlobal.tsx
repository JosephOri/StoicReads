import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useEffect,
  useMemo,
} from "react";
import { getTokens } from "../services/auth.service";
import axios from "axios";
import { AUTH_URL } from "../utils/constants";

type User = Record<string, any>;

interface GlobalContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  userIdentifier: string | null;
  setUserIdentifier: (identifier: string | null) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userIdentifier, setUserIdentifier] = useState<string | null>(
    localStorage.getItem("UserIdentifier")
  );
  const rawTokens = getTokens();

  const tokens = useMemo(
    () => ({
      accessToken: rawTokens.accessToken,
      refreshToken: rawTokens.refreshToken,
    }),
    [rawTokens.accessToken, rawTokens.refreshToken]
  );

  useEffect(() => {
    const fetchUser = async () => {
      if (tokens.accessToken && tokens.refreshToken && userIdentifier) {
        try {
          const userAPI = await axios.get(
            `${AUTH_URL}/user?username=${userIdentifier}`
          );
          setUser(userAPI.data);
        } catch (error) {
          console.error("Failed to fetch user", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [tokens.accessToken, tokens.refreshToken, userIdentifier]);

  return (
    <GlobalContext.Provider
      value={{ user, setUser, userIdentifier, setUserIdentifier }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};
