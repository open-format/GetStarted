// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  message: string;
};

// Simulate the SDK call
async function simulateSDKCall(data: Array<any>) {
  console.log("Data passed to the SDK:", data);
  // Simulate a delay if needed, for example: await new Promise(resolve => setTimeout(resolve, 1000));
  const [address, token, amount, id] = data;
  return Promise.resolve({
    success: true,
    message: `Reward triggered for address: ${address}, token: ${token}, amount: ${amount}, id: ${id}`,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { receiver, token, amount, id } = req.body;
    const data = [receiver, token, amount, id];

    try {
      const sdkResponse = await simulateSDKCall(data);
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
