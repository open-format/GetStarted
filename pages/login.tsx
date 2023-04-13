import { useEffect } from "react";
import Head from "next/head";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { ConnectButton, useWallet } from "@openformat/react";
import SignUpWithMagicLink from "@/components/auth/SignUpWithMagicLink";
import { supabase } from "../utils/supabaseClient";
import { useLoggedInAddress } from "../contexts/LoggedInAddressContext";

const columnStyle = {
  flex: 1,
  marginRight: "10px",
  position: "relative",
  padding: "10px",
};

const disabledCoverStyle = {
  pointerEvents: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const columnsStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const centeredContentStyle = {
  maxWidth: "500px",
  margin: "0 auto",
};

const DisableableConnectButton = ({ disabled }) => (
  <div style={{ position: "relative" }}>
    <ConnectButton />
    {disabled && <div style={disabledCoverStyle} />}
  </div>
);

const DisableableSignUpWithMagicLink = ({ disabled }) => (
  <div style={{ position: "relative" }}>
    <SignUpWithMagicLink />
    {disabled && <div style={disabledCoverStyle} />}
  </div>
);

const Login: React.FC = ({ user, userProfile }) => {
  const { loggedInAddress, setLoggedInAddress } = useLoggedInAddress();
  const { address } = useWallet();

  // set logged in address depending on whether logged in via web2 or web3
  useEffect(() => {
    if (address) {
      setLoggedInAddress(address.toLowerCase());
    } else if (userProfile?.wallet_address) {
      setLoggedInAddress(userProfile.wallet_address.toLowerCase());
    } else if (user.wallet_address) {
      setLoggedInAddress(user.wallet_address.toLowerCase());
    } else {
      setLoggedInAddress(null);
    }
  }, [address, userProfile, user, setLoggedInAddress]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // Remove the "supabase-auth-token" cookie. https://github.com/supabase/auth-helpers/issues/178
      document.cookie =
        "supabase-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.reload();
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div style={centeredContentStyle}>
        <h1>Login</h1>
        {address && (
          <>
            <p>You are signed in via your wallet. Wallet Address: {address}</p>
          </>
        )}
        {userProfile && (
          <>
            <p>
              You are signed in via MagicLink. Wallet Address:{" "}
              {userProfile.wallet_address}
            </p>
          </>
        )}
        <div style={columnsStyle}>
          <div style={columnStyle}>
            <DisableableConnectButton disabled={!!userProfile} />
          </div>
          <div style={columnStyle}>
            {userProfile ? (
              <button onClick={handleSignOut}>Sign out</button>
            ) : (
              <DisableableSignUpWithMagicLink disabled={!!address} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session ? session.user : { id: "N/A" };

  // Check if the user already exists in the "profiles" table
  const { data: userProfile, error } =
    user.id !== "N/A"
      ? await supabase
          .from("profiles")
          .select("id, wallet_address")
          .eq("id", user.id)
          .single()
      : { data: null, error: null };

  if (error) {
    console.error("Error fetching user profile data:", error);
  }

  return {
    props: {
      initialSession: session,
      user: user,
      userProfile: userProfile,
    },
  };
};
