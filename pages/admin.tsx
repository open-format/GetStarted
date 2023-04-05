import React from "react";
import Head from "next/head";
import CreateContract from "../components/admin/CreateContract";

const Admin: React.FC = () => {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <div>
        <h1>Admin</h1>
        <CreateContract />
      </div>
    </>
  );
};

export default Admin;
