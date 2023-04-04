import actions from "../actions.json";
import RewardService from "../utils/services/RewardService";
import missions from "../missions.json";

enum RewardType {
  XP,
  REWARD_CURRENCY,
  BADGE,
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

    const triggerMission = true;

    if (triggerMission) {
      const mission = missions.find(
        (mission) => mission.requirements[0].actionId === id
      );

      if (mission) {
        params.tokens.push({
          amount: mission.amount,
          token: mission.token,
          type: RewardType.REWARD_CURRENCY,
          actionType: "mission",
        });

        params.tokens.push({
          amount: 1, // Assuming only 1 badge is awarded for each mission
          token: mission.badge,
          type: RewardType.BADGE,
          actionType: "mission",
        });
      }
    }

    return RewardService.triggerReward(params);
  }

  get(): ActionType {
    return this.action;
  }
}

export default Action;
