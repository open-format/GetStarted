import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Wallet } from "ethers";

export const withUserCreation = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      props: {},
    };
  }

  const { data: existingUsers, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id);

  if (!existingUsers || existingUsers.length === 0) {
    const wallet = Wallet.createRandom();
    const privateKey = wallet.privateKey;
    const walletAddress = wallet.address;

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

  let loggedInAddress = null;
  if (userProfile?.wallet_address) {
    loggedInAddress = userProfile.wallet_address.toLowerCase();
  } else if (session.user.wallet_address) {
    loggedInAddress = session.user.wallet_address.toLowerCase();
  }

  return {
    props: {
      initialSession: session,
      user: session.user,
      userProfile: userProfile,
      loggedInAddress: loggedInAddress,
    },
  };
};
