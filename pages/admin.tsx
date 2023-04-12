import React from "react";
import Head from "next/head";
import CreateContract from "../components/admin/CreateContract";
import Contracts from "../components/admin/Contracts";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Wallet } from "ethers";
import { supabase } from "../utils/supabaseClient";

const Admin: React.FC = ({ user, userProfile }) => {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <div>
        <h1>Admin</h1>
        <p>User ID: {user.id}</p>
        {userProfile && (
          <>
            <p>Wallet Address: {userProfile.wallet_address}</p>
          </>
        )}
        <CreateContract />
        <Contracts />
      </div>
    </>
  );
};
export default Admin;

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

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
