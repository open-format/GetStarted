import axios from "axios";

class RewardService {
  static async triggerReward(
    address: string,
    token: string,
    amount: number,
    id: string
  ) {
    const data = { receiver: address, token, amount, id };

    try {
      const res = await axios.post("api/reward", data);
      return res.data;
    } catch (err) {
      throw new Error(`Reward API failed: ${String(err)}`);
    }
  }
}

export default RewardService;
