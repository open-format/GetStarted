import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cookies = new Cookies(req, res);
    const walletAddress = cookies.get("walletAddress");

    if (!walletAddress) {
      return res.status(404).json({ error: "Wallet address not found." });
    }

    return res.status(200).json({ walletAddress });
  } catch (error) {
    return res.status(500).json({ error: "Error processing request." });
  }
}
