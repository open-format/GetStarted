import styles from "@/styles/Home.module.css";
import RewardSystem from "@/utils/RewardSystem";
import { useOpenFormat, useWallet } from "@openformat/react";
import { Inter } from "next/font/google";
import Head from "next/head";
import React from "react";
import toast from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address } = useWallet();
  const { sdk } = useOpenFormat();

  const rewardSystem = new RewardSystem(sdk);

  async function handleConnect() {
    if (address) {
      const user = await rewardSystem.handleCompletedAction(address, "connect");

      for (const token of user.rewarded) {
        let message = `Thank you for completing the `;
        if (token.activityType === "ACTION") {
          message += `action ${token.id}`;
        } else if (token.activityType === "MISSION") {
          message += `mission ${token.id}`;
        }
        message += `, you have received ${token.amount} ${token.type}`;
        toast.success(message, {
          duration: 5000,
        });
      }
    }
  }

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
