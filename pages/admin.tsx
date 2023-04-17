import React from "react";
import Head from "next/head";
import CreateContract from "../components/admin/CreateContract";
import Contracts from "../components/admin/Contracts";
import { useWallet } from "@openformat/react";

const Admin: React.FC = () => {
  const { address } = useWallet();

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <div>
        <h1>Admin</h1>
        {address ? (
          <>
            <CreateContract />
            <Contracts />
          </>
        ) : (
          <p>Please connect your wallet</p>
        )}
      </div>
    </>
  );
};

export default Admin;
