// utils/services/RewardService.ts

// Import necessary dependencies
import {
  getActionsByUserAndRequirements,
  getMissionsByUserAndRequirements,
} from "@/queries";
import { RewardParams, Mission, Action } from "@/types";
import { OpenFormatSDK } from "@openformat/sdk";
import axios from "axios";

// RewardService class to handle user actions, missions, and rewards
class RewardService {
  sdk: OpenFormatSDK;
  // Constructor takes an OpenFormatSDK instance as an argument
  constructor(sdk: OpenFormatSDK) {
    this.sdk = sdk;
  }

  // Method to get a list of completed action IDs by a specific user
  async getUserCompletedActions(address: string): Promise<string[]> {
    const response = await this.sdk.subgraph.rawRequest(
      getActionsByUserAndRequirements,
      {
        user: address.toLowerCase(),
        app: this.sdk.appId.toLowerCase(),
      }
    );

    const actionIds = response.actions.map((action: Action) => action.type_id);
    return actionIds;
  }

  // Method to get a list of completed mission IDs by a specific user
  async getUserCompletedMissions(address: string): Promise<string[]> {
    const response = await this.sdk.subgraph.rawRequest(
      getMissionsByUserAndRequirements,
      {
        user: address.toLowerCase(),
        app: this.sdk.appId.toLowerCase(),
      }
    );

    const missionIds = response.missions.map(
      (mission: Mission) => mission.type_id
    );
    return missionIds;
  }

  // Method to trigger rewards based on the provided RewardParams
  async trigger(data: RewardParams): Promise<void> {
    try {
      const res = await axios.post("api/reward", data);
      return res.data;
    } catch (err) {
      throw new Error(`Reward API failed: ${String(err)}`);
    }
  }
}

export default RewardService;
