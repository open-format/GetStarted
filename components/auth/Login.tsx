import React from "react";
import { ConnectButton } from "@openformat/react";

interface AuthProps {}

const Login: React.FC<AuthProps> = () => {
  return (
    <div>
      <ConnectButton />
    </div>
  );
};

export default Login;
