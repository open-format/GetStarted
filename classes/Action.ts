import actions from "../actions.json";
import RewardService from "../utils/services/RewardService";
import missions from "../missions.json";
import subgraph from "../subgraph.json";

function getActionCount(
  actionId: string,
  receiver: string
): Record<string, number> {
  const rewards = subgraph.data.rewards;
  const subgraphResponse = rewards.filter(
    (reward) => reward.name && reward.receiver === receiver
  );

  // Count the occurrences of each action name using reduce
  const actionCounts = subgraphResponse.reduce(
    (accumulator: Record<string, number>, reward) => {
      accumulator[reward.name] = (accumulator[reward.name] || 0) + 1;
      return accumulator;
    },
    {}
  );
  console.log("actions counts:", actionCounts);
  return actionCounts;
}

class Action {
  action: ActionType;

  constructor(id: string) {
    const action = actions.find((action: ActionType) => action.id === id);

    if (action) {
      this.action = action;
    } else {
      throw new Error("Action not found");
    }
  }

  async trigger(address: string): Promise<any> {
    const { amount, id, token } = this.action;
    // need to pass receiver address
    const actionCount = getActionCount(id);

    const mission = missions.find((mission) =>
      mission.requirements.every(
        (requirement) =>
          actionCount[requirement.actionId] &&
          actionCount[requirement.actionId] >= requirement.count
      )
    );

    // missionTokens should return an array of tokens generated for missions
    const missionTokens = this.handleMissions;
    const triggerMission = Boolean(mission);

    const params: RewardParams = {
      receiver: address,
      tokens: [
        {
          amount: amount,
          token: token,
          type: RewardType.XP,
          actionType: "action",
        },
      ],
    };

    if (triggerMission) {
      const mission = missions.find(
        (mission) => mission.requirements[0].actionId === id
      );

      if (mission) {
        if (mission.token !== undefined) {
          params.tokens.push({
            amount: mission.amount,
            token: mission.token,
            type: RewardType.REWARD_CURRENCY,
            actionType: "mission",
          });
        }

        if (mission.badge !== undefined) {
          params.tokens.push({
            amount: 1, // Assuming only 1 badge is awarded for each mission
            token: mission.badge,
            type: RewardType.BADGE,
            actionType: "mission",
          });
        }
      }
    }

    return RewardService.triggerReward(params);
  }

  handleMissions() {
    // handle missions logic, return the tokens.
  }

  get(): ActionType {
    return this.action;
  }
}

export default Action;
