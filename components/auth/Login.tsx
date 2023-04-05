import React from "react";
import { ConnectButton } from "@openformat/react";

interface AuthProps {}

const Login: React.FC<AuthProps> = () => {
  return (
    <div>
      <h2>Authentication</h2>
      <ConnectButton />
      {/* Add authentication logic and UI here */}
    </div>
  );
};

export default Login;
