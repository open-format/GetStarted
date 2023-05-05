import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create authenticated Supabase Client
  const serverSupabase = createServerSupabaseClient({ req, res });

  // Check if we have a session
  const {
    data: { session },
  } = await serverSupabase.auth.getSession();

  if (!session) {
    return res.status(401).json({
      error: "not_authenticated",
      description:
        "The user does not have an active session or is not authenticated",
    });
  }

  // Run queries with RLS on the server
  const { data, error } = await serverSupabase
    .from("profiles")
    .select("private_key")
    .eq("id", session.user.id);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res
      .status(200)
      .json({ privateKey: data && data[0]?.private_key });
  }
};

export default handler;
