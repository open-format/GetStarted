import { OpenFormatSDK } from "@openformat/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  message: string;
};

const sdk = new OpenFormatSDK({
  network: "localhost",
  appId: process.env.NEXT_PUBLIC_APP_ID,
  signer: process.env.NEXT_PRIVATE_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      await sdk.Reward.trigger(req.body);

      return res.json({ params: req.body });
    } catch (error) {
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
    res.setHeader("Allow", "POST");
    res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }
}
