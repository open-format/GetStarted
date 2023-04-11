import React from "react";
import { ConnectButton } from "@openformat/react";
import SignUpWithMagicLink from "./SignUpWithMagicLink";

interface AuthProps {}

const Login: React.FC<AuthProps> = () => {
  return (
    <div>
      <h2>Authentication</h2>
      <ConnectButton />
      {/* Add authentication logic and UI here */}
      <SignUpWithMagicLink />
    </div>
  );
};

export default Login;
