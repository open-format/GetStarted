import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;

  try {
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res
        .status(200)
        .json({ message: "Check your email for the magic link!" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
