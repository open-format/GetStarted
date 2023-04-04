import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  message: string;
};

async function simulateSDKCall(data: RewardParams) {
  console.log("Data passed to the SDK:", data); // Fix this line
  // Simulate a delay if needed, for example: await new Promise(resolve => setTimeout(resolve, 1000));

  return Promise.resolve({
    success: true,
    message: `Reward triggered for address: ${
      data.receiver
    }, tokens: ${JSON.stringify(data.tokens)}`,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { receiver, tokens } = req.body; // Fix this line

    try {
      const sdkResponse = await simulateSDKCall(req.body);
      res.status(200).json(sdkResponse);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: String(error) });
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
