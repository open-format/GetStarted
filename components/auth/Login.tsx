import { useState, useEffect } from "react";
import { useWallet } from "@openformat/react";
import { supabase } from "@/utils/supabaseClient";
import { useLoggedInAddress } from "@/contexts/LoggedInAddressContext";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { useUser, Session } from "@supabase/auth-helpers-react";
import SignOutButton from "./SignOutButton";
import { ConnectButton } from "@openformat/react";

const Login: React.FC = () => {
  const [isSignOutVisible, setIsSignOutVisible] = useState(false);
  const { address } = useWallet();
  const { setLoggedInAddress, loggedInAddress } =
    useLoggedInAddress();
  const user = useUser();

  const maskedAddress =
    loggedInAddress?.substring(0, 5) +
    "..." +
    loggedInAddress?.substring(36);

  const toggleSignOutVisibility = () => {
    setIsSignOutVisible(!isSignOutVisible);
  };

  useEffect(() => {
    if (address) {
      setLoggedInAddress(address);
    }
  }, [address, setLoggedInAddress]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_OUT") {
          setLoggedInAddress(null);
        } else if (event === "SIGNED_IN" && session) {
          const { data: userProfile, error } = await supabase
            .from("profiles")
            .select("wallet_address")
            .eq("id", session.user.id)
            .single();
          if (userProfile) {
            setLoggedInAddress(userProfile.wallet_address);
          }
        }
      }
    );

    // Clean up the listener when the component is unmounted
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="group flex">
      {!user && <ConnectButton />}
      {user && (
        <div
          className={`bg-gray-100 hover:bg-gray-200 transition-all durtion-3000 rounded-lg cursor-pointer group ${
            isSignOutVisible ? "hover:bg-gray-200 px-0 py-0" : ""
          }`}
          onClick={toggleSignOutVisibility}
        >
          <div
            className={`${
              isSignOutVisible
                ? "hidden"
                : "block px-4 py-2 transition-all durtion-3000 "
            }`}
          >
            {maskedAddress}
          </div>
          <div
            className={`${
              isSignOutVisible
                ? "block mx-auto transition-all durtion-3000 "
                : "hidden"
            }`}
          >
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
