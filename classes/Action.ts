import actions from "../actions.json";

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
    const { token, xp } = this.action;
    console.log(
      `Triggering action for address: ${address}, token: ${token}, xp: ${xp}`
    );
    // replace console.log with actual logic to trigger action
    return Promise.resolve();
  }

  get(): ActionType {
    return this.action;
  }
}

export default Action;
