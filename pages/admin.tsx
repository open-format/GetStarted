import React from "react";
import Head from "next/head";
import CreateContract from "../components/admin/CreateContract";
import Contracts from "../components/admin/Contracts";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

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
