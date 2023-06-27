import {
  getActionsByUserAndRequirements,
  getMissionsByUserAndRequirements,
} from "@/queries";
import { Action, Mission, RewardParams } from "@/types";
import { OpenFormatSDK } from "@openformat/sdk";
import axios from "axios";

export default class TokenService {
  sdk: OpenFormatSDK;
  constructor(sdk: OpenFormatSDK) {
    this.sdk = sdk;
  }

  async getUserCompletedActions(address: string): Promise<string[]> {
    const response = await this.sdk.subgraph.rawRequest(
      getActionsByUserAndRequirements,
      {
        user: address.toLowerCase(),
        app: this.sdk.appId.toLowerCase(),
      }
    );

    const actionIds = response.actions.map(
      (action: Action) => action.action_id
    );
    return actionIds;
  }

  async getUserCompletedMissions(address: string): Promise<string[]> {
    const response = await this.sdk.subgraph.rawRequest(
      getMissionsByUserAndRequirements,
      {
        user: address.toLowerCase(),
        app: this.sdk.appId.toLowerCase(),
      }
    );

    const missionIds = response.missions.map(
      (mission: Mission) => mission.mission_id
    );
    return missionIds;
  }

  async trigger(data: RewardParams): Promise<void> {
    try {
      const res = await axios.post("api/reward", data);
      return res.data;
    } catch (err) {
      throw new Error(`Reward API failed: ${String(err)}`);
    }
  }
}
