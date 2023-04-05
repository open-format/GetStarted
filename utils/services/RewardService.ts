import axios from "axios";

class RewardService {
  static async triggerReward(data: RewardParams) {
    try {
      const res = await axios.post("api/reward", data);
      return res.data;
    } catch (err) {
      throw new Error(`Reward API failed: ${String(err)}`);
    }
  }
}

export default RewardService;
