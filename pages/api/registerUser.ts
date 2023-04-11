import { NextApiRequest, NextApiResponse } from "next";
import { Wallet } from "ethers";
import { supabase } from "../../utils/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = req.body;

  try {
    // Check if the user already exists in the "users" table
    const { data: existingUsers, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id);

    if (userError) {
      return res.status(500).json({ error: "Error fetching user." });
    } else if (existingUsers && existingUsers.length > 0) {
      // The user already exists in the "users" table, do nothing
      return res.status(200).json({ existingUser: true });
    } else {
      // The user does not exist in the "users" table, create a new wallet and get the private key
      const wallet = Wallet.createRandom();
      const privateKey = wallet.privateKey;

      // Get the wallet address and set the wallet address
      const walletAddress = wallet.address;

      // Insert the private key into the users table
      const { data: userData, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            email: user.email,
            private_key: privateKey,
            wallet_address: walletAddress,
          },
        ]);

      if (insertError) {
        return res.status(500).json({ error: "Error inserting user." });
      }

      return res.status(200).json({ privateKey, walletAddress });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error processing request." });
  }
}
