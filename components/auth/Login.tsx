import React from "react";
import { ConnectButton } from "@openformat/react";
import SignUpWithMagicLink from "./SignUpWithMagicLink";

const Login = () => {
  return (
    <div>
      <h2>Authentication</h2>
      <ConnectButton />

      <SignUpWithMagicLink />
    </div>
  );
};

export default Login;
