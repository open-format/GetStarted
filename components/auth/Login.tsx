// components/auth/Login.tsx

// Import necessary dependencies
import React from "react";
import { ConnectButton } from "@openformat/react";
import { AuthProps } from "@/types";

// Login component
const Login: React.FC<AuthProps> = () => {
  return (
    <div>
      <ConnectButton />
    </div>
  );
};

export default Login;
