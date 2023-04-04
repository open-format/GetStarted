type Reward = {
  amount: number;
  token: string;
  type: string;
};

type ActionType = {
  id: string;
  token: string;
  amount: number;
  description: string;
};

type Token = {
  amount: number;
  token: string;
  type: RewardType;
};

interface RewardParams {
  receiver: string;
  tokens: Token[];
}
