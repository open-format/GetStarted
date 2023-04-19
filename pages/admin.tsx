import React from "react";
import Head from "next/head";
import CreateContract from "../components/admin/CreateContract";
import Contracts from "../components/admin/Contracts";
import { useWallet } from "@openformat/react";
import styles from "../styles/Admin.module.css";

// Admin page component
const Admin: React.FC = () => {
  // Use the useWallet hook to get the user's wallet address
  const { address } = useWallet();

  return (
    <div className={styles.admin}>
      {/* Set the page title to "Admin" */}
      <Head>
        <title>Admin</title>
      </Head>
      {/* Display the "ADMIN" heading */}
      <div className={styles.description}>
        <p>
          <code className={styles.code}>ADMIN</code>
        </p>
      </div>
      {/* Check if the user's wallet is connected */}
      {address ? (
        // If the wallet is connected, display the CreateContract and Contracts components
        <div className={styles.tablecontainer}>
          <div className={styles.table}>
            <CreateContract />
          </div>
          <div className={styles.table}>
            <Contracts />
          </div>
        </div>
      ) : (
        // If the wallet is not connected, prompt the user to connect their wallet
        <p>Please connect your wallet</p>
      )}
    </div>
  );
};

// Export the Admin component as the default export
export default Admin;
