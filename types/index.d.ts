import { RewardType } from "@openformat/sdk";

interface Action {
  id: string;
  amount: number;
  description: string;
  address: string;
}

interface MissionRequirement {
  actionId: string;
  count: number;
}

interface Mission {
  id: string;
  description: string;
  amount: number;
  tokens: TriggerToken[];
  badge: string;
  badge_URI: string;
  requirements: MissionRequirement[];
}

interface User {
  address: string;
  xp: number;
  completedActions: string[];
  completedMissions: string[];
}

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
  id: string;
  amount: number;
  address: string;
  type: RewardType;
  activityType: string;
  tokenURI?: string;
};

type TriggerToken = {
  address: string;
  amount: number;
  uri?: string;
};

interface RewardParams {
  receiver: string;
  tokens: Token[];
}

interface ContractData {
  id: string;
  createdAt: string;
}

interface QueryResult {
  contracts: ContractData[];
}
