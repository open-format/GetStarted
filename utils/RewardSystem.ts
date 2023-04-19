import {
  Action,
  Mission,
  MissionRequirement,
  RewardParams,
  User,
} from "@/types";
import RewardService from "@/utils/services/RewardService";
import { ActivityType, OpenFormatSDK, RewardType } from "@openformat/sdk";
import actionsData from "../actions.json";
import missionsData from "../missions.json";

// RewardSystem class to handle user rewards and manage actions and missions
export default class RewardSystem {
  private rewardService: RewardService;
  private actions: Action[];
  private missions: Mission[];

  // Constructor takes an OpenFormatSDK instance as an argument
  constructor(sdk: OpenFormatSDK) {
    this.rewardService = new RewardService(sdk);
    this.actions = actionsData as Action[];
    this.missions = missionsData as Mission[];
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

  // getUser method retrieves user information based on the given address
  async getUser(address: string): Promise<User> {
    const completedActions = await this.rewardService.getUserCompletedActions(
      address
    );

    const xp = this.calculateUserXP(completedActions);
    const completedMissions = this.calculateCompletedMissions(completedActions);

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

  // handleCompletedAction method triggers rewards for completed actions and missions
  async handleCompletedAction(
    address: string,
    actionId: string
  ): Promise<User> {
    // Get completed actions from the subgraph
    const completedActions = await this.rewardService.getUserCompletedActions(
      address
    );

    const previousMissions = await this.rewardService.getUserCompletedMissions(
      address
    );

    completedActions.push(actionId);

    const xp = this.calculateUserXP(completedActions);

    const completedMissions = this.calculateCompletedMissions(completedActions);

    const action = this.getActionById(actionId);

    // Trigger reward for the completed action
    const data: RewardParams = {
      receiver: address,
      tokens: [],
    };

    data.tokens.push({
      id: action.id,
      address: action.address,
      amount: action.amount,
      type: RewardType.XP,
      activityType: ActivityType.ACTION,
    });

    // Check for any newly completed missions
    const previousMissionsSet = new Set(previousMissions);
    for (const missionId of completedMissions) {
      if (!previousMissionsSet.has(missionId)) {
        // Trigger reward for the completed mission
        const mission = this.getMissionById(missionId);

        mission.tokens.map((token) => {
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
              amount: token.amount,
              type: RewardType.REWARD_CURRENCY,
              activityType: ActivityType.MISSION,
            });
          }
        });

        // Add the mission to the previous missions to prevent duplicate rewards
        previousMissionsSet.add(missionId);
      }
    }

    await this.rewardService.trigger(data);

    return {
      id: "", // Add a unique identifier for the user
      name: "", // Add the user's name
      rewarded: data.tokens,
      address,
      xp,
      completedActions,
      completedMissions: Array.from(previousMissionsSet),
    };
  }

  // calculateUserXP method calculates the user's XP based on completed actions
  private calculateUserXP(completedActions: string[]): number {
    let xp = 0;

    for (const actionId of completedActions) {
      const action = this.actions.find((a) => a.id === actionId);
      if (action) {
        xp += action.xp;
      }
    }

    return xp;
  }

  // calculateCompletedMissions method calculates the missions completed by the user
  private calculateCompletedMissions(completedActions: string[]): string[] {
    const completedMissions: string[] = [];

    for (const mission of this.missions) {
      const actionCounts = this.getActionCounts(completedActions);

      if (this.isMissionCompleted(actionCounts, mission.requirements)) {
        completedMissions.push(mission.id);
      }
    }

    return completedMissions;
  }

  // getActionCounts method counts the occurrences of each action in the completedActions array
  private getActionCounts(completedActions: string[]): Map<string, number> {
    const actionCounts = new Map<string, number>();

    for (const actionId of completedActions) {
      actionCounts.set(actionId, (actionCounts.get(actionId) || 0) + 1);
    }

    return actionCounts;
  }

  // isMissionCompleted method checks if a mission is completed based on actionCounts and mission requirements
  private isMissionCompleted(
    actionCounts: Map<string, number>,
    requirements: MissionRequirement[]
  ): boolean {
    for (const requirement of requirements) {
      if ((actionCounts.get(requirement.actionId) || 0) < requirement.count) {
        return false;
      }
    }

    return true;
  }

  // getActionById method retrieves an action by its ID
  getActionById(id: string): Action {
    const action = this.actions.find((action) => action.id === id);
    if (!action) {
      throw new Error(`Action with ID ${id} not found.`);
    }
    return action;
  }

  // getMissionById method retrieves a mission by its ID
  getMissionById(id: string): Mission {
    const mission = this.missions.find((action) => action.id === id);
    if (!mission) {
      throw new Error(`Action with ID ${id} not found.`);
    }
    return mission;
  }
}
