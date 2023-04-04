import actions from "../actions.json";
import RewardService from "../utils/services/RewardService";

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
      tokens: [{ amount: amount, token: token, type: RewardType.XP }],
    };
    return RewardService.triggerReward(params);
  }

  get(): ActionType {
    return this.action;
  }
}

export default Action;
