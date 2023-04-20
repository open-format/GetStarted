import { useEffect } from "react";
import Head from "next/head";
import { ConnectButton, useWallet } from "@openformat/react";
import SignUpWithMagicLink from "@/components/auth/SignUpWithMagicLink";
import { useLoggedInAddress } from "../contexts/LoggedInAddressContext";
import { GetServerSideProps, NextPage } from "next";
import { withUserCreation } from "@/lib/withUserCreation";
import SignOutButton from "../components/auth/SignOutButton";
import { useUser } from "@supabase/auth-helpers-react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Web3AuthProps, Web2AuthProps, LoginProps } from "@/types";

const Web3Auth: React.FC<Web3AuthProps> = ({ user }) => (
  <>
    <h2 className="text-center m-4">Web3 Auth</h2>
    <p className="text-xs text-center leading-5 text-gray-500 p-4">
      The web3 connect wallet login enables you to authenticate via your
      blockchain-based digital wallet, providing decentralized and secure
      access.
    </p>
    <div className="md:absolute bottom-28 left-0 right-0 flex justify-center">
      {!user && <ConnectButton />}
    </div>
  </>
);

const Web2Auth: React.FC<Web2AuthProps> = ({ address, user }) => (
  <>
    <h2 className="text-center md:mt-4 md:border-transparent mt-10 mb-4 border-t md:pt-0 pt-14">
      Web2 Auth
    </h2>
    <p className="text-xs text-center leading-5 text-gray-500 p-4">
      The traditional web2 login allows you to access the authenticate using a
      magiclink.
    </p>
    <div className="relative left-0 right-0 flex justify-center">
      {!address && !user && <SignUpWithMagicLink />}
      <div className="md:absolute bottom-20 left-0 right-0 flex justify-center">
        {!address && user && <SignOutButton />}
      </div>
    </div>
  </>
);

const Login: NextPage<LoginProps> = (props) => {
  const { setLoggedInAddress } = useLoggedInAddress();
  const { address } = useWallet();
  const user = useUser();

  useEffect(() => {
    if (props.loggedInAddress) {
      setLoggedInAddress(props.loggedInAddress);
    }
  }, [props.loggedInAddress, setLoggedInAddress]);

  return (
    <div className="max-w-3xl mx-auto p-4 w-screen">
      <Head>
        <title>Login</title>
      </Head>
      <h1 className="text-left">Login</h1>
      <main className="w-full justify-center items-center mx-auto">
        <div className="flex justify-center mt-4">
          <div className="relative max-w-3xl mx-auto  bg-white border border-gray-400 rounded-lg m-4 p-4 min-h-96">
            <div className="grid md:grid-cols-2 h-full">
              <div className="mx-auto relative w-80 h-full">
                {user && (
                  <div className="absolute w-full h-full rounded-lg backdrop-blur "></div>
                )}
                <Web3Auth user={user} />
              </div>

              {!address && !user && (
                <div className="absolute md:border-l border-gray-300 h-72 mt-6 flex items-center left-1/2 md:transform -translate-x-1/2">
                  <span className="bg-white">
                    <LockClosedIcon className="hidden md:block w-8 h-8 -ml-4 bg-white text-gray-300" />
                  </span>
                </div>
              )}
              <div className="mx-auto w-full relative h-full">
                {address && (
                  <div className="absolute w-full h-full rounded-lg backdrop-blur "></div>
                )}
                <Web2Auth address={address ?? null} user={user} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const userCreationProps = await withUserCreation(ctx);

  if ("props" in userCreationProps) {
    return { props: { ...userCreationProps.props } };
  } else {
    // Handle the case when there's a redirect or another type of result
    return userCreationProps;
  }
};

export default Login;
