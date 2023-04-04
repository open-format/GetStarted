// import RewardService from "../services/RewardService";

// export default class Action {
//   action: ActionType;

//   constructor(id: string) {
//     const action = actions[id];
//     if (action) {
//       this.action = action;
//    } else {
//   throw new Error("Action not found");
//  }
//  }

//   async trigger(address: string): Promise<any> {
//     const { receiver, token, xp } = this.action;
//     return RewardService.triggerReward(address, token, xp);
//   }

//   get(): ActionType {
//     return this.action;
//   }
// }
