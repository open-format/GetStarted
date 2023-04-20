import { Data } from "@/types";
import { Chains, OpenFormatSDK } from "@openformat/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

// Initialize the OpenFormatSDK with necessary configurations
const sdk = new OpenFormatSDK({
  network: Chains.polygonMumbai,
  appId: process.env.NEXT_PUBLIC_APP_ID || "",
  signer: process.env.NEXT_PRIVATE_KEY,
});

// API handler for the reward endpoint
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Check if the request method is POST
  if (req.method === "POST") {
    try {
      // Trigger the reward using OpenFormatSDK
      await sdk.Reward.trigger(req.body);

      // Return a successful response with the reward details
      return res.json({
        success: true,
        message: "Reward triggered successfully",
        params: req.body,
      });
    } catch (error) {
      // Handle errors in triggering the reward
      if (error instanceof Error) {
        res
          .status(500)
          .json({ success: false, message: error.message });
      } else {
        res
          .status(500)
          .json({ success: false, message: String(error) });
      }
    }
  } else {
    // If the request method is not POST, return a "Method Not Allowed" error
    res.setHeader("Allow", "POST");
    res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }
}
