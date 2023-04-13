import styles from "@/styles/Home.module.css";
import RewardSystem from "@/utils/RewardSystem";
import { useOpenFormat, useWallet } from "@openformat/react";
import { Inter } from "next/font/google";
import Head from "next/head";
import React from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Wallet } from "ethers";
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
        toast.success(message);
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

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  // Check if the user already exists in the "profiles" table
  const { data: existingUsers, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id);

  if (!existingUsers || existingUsers.length === 0) {
    // The user does not exist in the "profiles" table, create a new wallet and get the private key
    const wallet = Wallet.createRandom();
    const privateKey = wallet.privateKey;

    // Get the wallet address and set the wallet address
    const walletAddress = wallet.address;

    // Insert the private key into the profiles table
    const { data: userData, error: insertError } = await supabase
      .from("profiles")
      .insert([
        {
          id: session.user.id,
          email: session.user.email,
          private_key: privateKey,
          wallet_address: walletAddress,
        },
      ]);

    if (insertError) {
      console.error("Error inserting user into profiles table:", insertError);
    }
  }

  const { data: userProfile, error } = await supabase
    .from("profiles")
    .select("id, wallet_address")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile data:", error);
  }

  return {
    props: {
      initialSession: session,
      user: session.user,
      userProfile: userProfile,
    },
  };
};
