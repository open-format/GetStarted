import actions from "../actions.json";
import RewardService from "../utils/services/RewardService";

type ActionType = {
  id: string;
  token: string;
  description: string;
  xp: number;
};

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

  async trigger(address?: string): Promise<any> {
    const { token, xp, id } = this.action;
    console.log(
      `Triggering action for address: ${address}, token: ${token}, xp: ${xp}, id: ${id}`
    );

    // Provide a default value for the address parameter
    const defaultAddress = "0x0000000000000000000000000000000000000000";
    return RewardService.triggerReward(
      address || defaultAddress,
      token,
      xp,
      id
    );
  }

  get(): ActionType {
    return this.action;
  }
}

export default Action;
