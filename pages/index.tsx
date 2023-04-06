import styles from "@/styles/Home.module.css";
import RewardSystem from "@/utils/RewardSystem";
import { useOpenFormat, useWallet } from "@openformat/react";
import { Inter } from "next/font/google";
import Head from "next/head";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address } = useWallet();
  const { sdk } = useOpenFormat();

  const rewardSystem = new RewardSystem(sdk);

  async function handleConnect() {
    if (address) {
      const updatedUser = await rewardSystem.handleCompletedAction(
        address,
        "connect"
      );

      // Display the updated user information or process rewards as needed
      console.log(updatedUser);
    }
  }

  return (
    <>
      <Head>
        <title>Dapp Template</title>
        <meta
          name="description"
          content="OPENFORMAT - Dapp Template"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <button onClick={handleConnect}>Connect</button>
      </main>
    </>
  );
}
