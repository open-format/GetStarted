import styles from "@/styles/Home.module.css";
import RewardSystem from "@/utils/RewardSystem";
import { useOpenFormat, useWallet } from "@openformat/react";
import Head from "next/head";
import React from "react";
import toast from "react-hot-toast";

export default function Home() {
  const { address } = useWallet();
  const { sdk } = useOpenFormat();

  const rewardSystem = new RewardSystem(sdk);

  async function handleConnect() {
    if (address) {
      // Add loading toast
      const loadingToastId = toast.loading(
        "Processing... this can take a while depending on chain network conditions."
      );

      try {
        const user = await rewardSystem.handleCompletedAction(
          address,
          "connect"
        );
        // Dismiss loading toast
        toast.dismiss(loadingToastId);

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
      } catch (error) {
        console.error(error);
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        toast.error("An error occurred. Please try again later.");
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
      <h1>Home</h1>
      <main>
        {address ? (
          <div>
            <p>Click on the button below to trigger an action.</p>
            <button onClick={handleConnect}>Trigger Action</button>
          </div>
        ) : (
          <p>Please connect your wallet</p>
        )}
      </main>
    </>
  );
}
