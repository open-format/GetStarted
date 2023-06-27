import { Data } from "@/types";
import { Chains, OpenFormatSDK } from "@openformat/sdk";
import { RelayerParams } from "defender-relay-client";
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";
import type { NextApiRequest, NextApiResponse } from "next";

const credentials: RelayerParams = {
  apiKey: process.env.NEXT_RELAYER_API_KEY || "",
  apiSecret: process.env.NEXT_RELAYER_API_SECRET || "",
};

if (!credentials.apiKey || !credentials.apiSecret) {
  throw new Error("claimNFT: Invalid relayer credentials");
}

//@dev use defender as a signer instead of EOA
const provider = new DefenderRelayProvider(credentials);
const signer = new DefenderRelaySigner(credentials, provider, {
  speed: "fast",
});

// Initialize the OpenFormatSDK with necessary configurations
const sdk = new OpenFormatSDK({
  network: Chains.polygonMumbai,
  appId: process.env.NEXT_PUBLIC_APP_ID || "",
  signer: signer,
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
      await sdk.Reward.createBadge(req.body);

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
