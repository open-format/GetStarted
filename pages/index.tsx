import React, { useCallback } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Action from "../classes/Action";

const inter = Inter({ subsets: ["latin"] });

const address = "0xe";

export default function Home() {
  const handleConnect = useCallback(async () => {
    const connectAction = new Action("connect");
    try {
      await connectAction.trigger(address);
      alert(`Action completed: ${connectAction.get().description}`);
    } catch (error) {
      console.error("Error in connect action:", error);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Dapp Template</title>
        <meta name="description" content="OPENFORMAT - Dapp Template" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <button onClick={handleConnect}>Connect</button>
      </main>
    </>
  );
}
