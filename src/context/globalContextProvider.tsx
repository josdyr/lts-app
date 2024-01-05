import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import apiService from "../services/api";
import { GlobalContextType } from "./types";

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export function GlobalProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const api = apiService();
  const [pubSubToken, setPubSubToken] = useState<string>("");

  useEffect(() => {
    fetchAndUpdatePubSubToken();
  }, []);

  const fetchAndUpdatePubSubToken = async () => {
    try {
      await fetchPubSubToken();
    } catch (error) {
      console.log("Something went wrong: " + error);
    }
  };

  const fetchPubSubToken = async () => {
    const response = await api.getPubSubAccessToken();
    if (response) {
      setPubSubToken(response.token);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        pubSubToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("error");
  }
  return context;
}
