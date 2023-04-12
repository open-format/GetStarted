import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
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
    }

    // Get the user associated with the email
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email);

    if (userError || !users || users.length === 0) {
      return res.status(500).json({ error: "Error fetching user." });
    }

    const userId = users[0].id;

    // Set the user id in an HTTP-only cookie
    const cookies = new Cookies(req, res);
    cookies.set("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res
      .status(200)
      .json({ message: "Check your email for the magic link!" });
  } catch (error) {
    return res.status(500).json({ error: "Error processing request." });
  }
}
