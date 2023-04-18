// pages/admin.tsx
import React from "react";
import Head from "next/head";
import CreateContract from "../components/admin/CreateContract";
import Contracts from "../components/admin/Contracts";
import { useWallet } from "@openformat/react";
import styles from "../styles/Admin.module.css";

const Admin: React.FC = () => {
  const { address } = useWallet();

  return (
    <div className={styles.admin}>
      <Head>
        <title>Admin</title>
      </Head>
      <div className={styles.description}>
        <p>
          <code className={styles.code}>ADMIN</code>
        </p>
      </div>
      {address ? (
        <div className={styles.tablecontainer}>
          <div className={styles.table}>
            <CreateContract />
          </div>
          <div className={styles.table}>
            <Contracts />
          </div>
        </div>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
};

export default Admin;
