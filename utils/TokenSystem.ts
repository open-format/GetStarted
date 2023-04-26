import TokenService from "@/services/TokenService";
import {
  Action,
  Mission,
  MissionRequirement,
  RewardParams,
  User,
} from "@/types";
import {
  ActivityType,
  OpenFormatSDK,
  RewardType,
  
  toWei,
} from "@openformat/react";

import actions from "../actions.json";
import missions from "../missions.json";

export default class TokenSystem {
  private tokenService: TokenService;
  private actions: Action[];
  private missions: Mission[];

  constructor(sdk: OpenFormatSDK) {
    this.tokenService = new TokenService(sdk);
    this.actions = actions;
    //@TO-DO need to fix this type error
    //@ts-ignore
    this.missions = missions;
  }

  /**
   * Retrieves a user object with relevant information based on the given address.
   * @async
   * @function
   * @param {string} address - The user's unique blockchain address.
   * @returns {Promise<User>} A promise that resolves to an object containing the user's address, XP, completed actions, and completed missions.
   * @throws {Error} If there is an issue fetching the user's information.
   * @example
   * // Get the user's information
   * const user = await getUser('0x1234abcd...');
   */
  async getUser(address: string): Promise<User> {
    const completedActions =
      await this.tokenService.getUserCompletedActions(address);

    const xp = this.calculateUserXP(completedActions);
    const completedMissions =
      this.calculateCompletedMissions(completedActions);

    return {
      id: "",
      name: "",
      address,
      xp,
      completedActions,
      completedMissions,
      rewarded: [],
    };
  }

  async handleCompletedAction(
    address: string,
    actionId: string
  ): Promise<User> {
    // Get completed actions from the subgraph
    const completedActions =
      await this.tokenService.getUserCompletedActions(address);

    const previousMissions =
      await this.tokenService.getUserCompletedMissions(address);

    completedActions.push(actionId);

    const xp = this.calculateUserXP(completedActions);

    const completedMissions =
      this.calculateCompletedMissions(completedActions);

    const action = this.getActionById(actionId);

    // Trigger reward for the completed action
    const data: RewardParams = {
      receiver: address,
      tokens: [],
    };

    data.tokens.push({
      id: action.id,
      address: action.address,
      amount: toWei(action.amount.toString()),
      type: RewardType.XP,
      activityType: ActivityType.ACTION,
    });

    // Check for any newly completed missions
    const previousMissionsSet = new Set(previousMissions);
    for (const missionId of completedMissions) {
      if (!previousMissionsSet.has(missionId)) {
        // Trigger reward for the completed mission
        const mission = this.getMissionById(missionId);

        mission.tokens?.map((token) => {
          //if URI = It's a badge
          if (token.uri) {
            data.tokens.push({
              id: mission.id,
              address: token.address,
              amount: 1,
              type: RewardType.BADGE,
              activityType: ActivityType.MISSION,
              tokenURI: token.uri,
            });
          } else {
            data.tokens.push({
              id: mission.id,
              address: token.address,
              amount: toWei(token.amount.toString()),
              type: RewardType.REWARD_CURRENCY,
              activityType: ActivityType.MISSION,
            });
          }
        });

        // Add the mission to the previous missions to prevent duplicate rewards
        previousMissionsSet.add(missionId);
      }
    }

    await this.tokenService.trigger(data);

    return {
      id: "",
      name: "",
      address,
      xp,
      rewarded: data.tokens,
      completedActions,
      completedMissions: Array.from(previousMissionsSet),
    };
  }

  private calculateUserXP(completedActions: string[]): number {
    let xp = 0;

    for (const actionId of completedActions) {
      const action = this.actions.find((a) => a.id === actionId);
      if (action) {
        xp += action.xp ?? 0;
      }
    }

    return xp;
  }

  private calculateCompletedMissions(
    completedActions: string[]
  ): string[] {
    const completedMissions: string[] = [];

    for (const mission of this.missions) {
      const actionCounts = this.getActionCounts(completedActions);

      if (
        this.isMissionCompleted(actionCounts, mission.requirements)
      ) {
        completedMissions.push(mission.id);
      }
    }

    return completedMissions;
  }

  private getActionCounts(
    completedActions: string[]
  ): Map<string, number> {
    const actionCounts = new Map<string, number>();

    for (const actionId of completedActions) {
      actionCounts.set(
        actionId,
        (actionCounts.get(actionId) || 0) + 1
      );
    }

    return actionCounts;
  }

  private isMissionCompleted(
    actionCounts: Map<string, number>,
    requirements: MissionRequirement[]
  ): boolean {
    for (const requirement of requirements) {
      if (
        (actionCounts.get(requirement.actionId) || 0) <
        requirement.count
      ) {
        return false;
      }
    }

    return true;
  }

  getActionById(id: string): Action {
    const action = this.actions.find((action) => action.id === id);
    if (!action) {
      throw new Error(`Action with ID ${id} not found.`);
    }
    return action;
  }

  getMissionById(id: string): Mission {
    const mission = this.missions.find((action) => action.id === id);
    if (!mission) {
      throw new Error(`Action with ID ${id} not found.`);
    }
    return mission;
  }
}
