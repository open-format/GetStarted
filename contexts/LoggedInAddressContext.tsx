// contexts/LoggedInAddressContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface LoggedInAddressContextValue {
  loggedInAddress: string | null;
  setLoggedInAddress: (address: string | null) => void;
}

const LoggedInAddressContext =
  createContext<LoggedInAddressContextValue | null>(null);

export const useLoggedInAddress = () => {
  const context = useContext(LoggedInAddressContext);

  if (!context) {
    throw new Error(
      "useLoggedInAddress must be used within LoggedInAddressProvider"
    );
  }

  return context;
};

interface LoggedInAddressProviderProps {
  children: ReactNode;
}

export const LoggedInAddressProvider = ({
  children,
}: LoggedInAddressProviderProps) => {
  const [loggedInAddress, setLoggedInAddress] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? window.localStorage.getItem("loggedInAddress")
      : null
  );

  useEffect(() => {
    if (loggedInAddress) {
      window.localStorage.setItem("loggedInAddress", loggedInAddress);
    } else {
      window.localStorage.removeItem("loggedInAddress");
    }
  }, [loggedInAddress]);

  return (
    <LoggedInAddressContext.Provider
      value={{ loggedInAddress, setLoggedInAddress }}
    >
      {children}
    </LoggedInAddressContext.Provider>
  );
};
