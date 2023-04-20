import { useEffect } from "react";
import Head from "next/head";
import { useWallet } from "@openformat/react";
import SignUpWithMagicLink from "@/components/auth/SignUpWithMagicLink";
import { useLoggedInAddress } from "../contexts/LoggedInAddressContext";
import { GetServerSideProps, NextPage } from "next";
import { withUserCreation } from "@/lib/withUserCreation";
import SignOutButton from "../components/auth/SignOutButton";

const columnStyle = {
  flex: 1,
  marginRight: "10px",
  position: "relative",
  padding: "10px",
};

const columnsStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const centeredContentStyle = {
  maxWidth: "500px",
  margin: "0 auto",
};

type LoginProps = {
  loggedInAddress: string;
  userProfile: {
    id: string;
    wallet_address: string;
  };
};

const Login: NextPage<LoginProps> = (props) => {
  const { setLoggedInAddress } = useLoggedInAddress();
  const { address } = useWallet();

  useEffect(() => {
    if (props.loggedInAddress) {
      setLoggedInAddress(props.loggedInAddress);
    }
  }, [props.loggedInAddress, setLoggedInAddress]);

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

        <div style={columnsStyle}>
          <div style={columnStyle}></div>
          <div style={columnStyle}>
            <SignOutButton />

            <SignUpWithMagicLink />
          </div>
        </div>
      </div>
    </>
  );
};
// This page  is wrapped in this CreateUser function to ensure a new user wallet is created in Supabase on first sign in.
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const userCreationProps = await withUserCreation(ctx);
  return { props: { ...userCreationProps.props } };
};

export default Login;
