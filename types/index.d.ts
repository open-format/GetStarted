import { RewardType } from "@openformat/react";
import { BigNumber } from "ethers";

// MissionRequirement interface represents requirements for a mission
interface MissionRequirement {
  actionId: string;
  count: number;
}

// Mission interface represents a mission with requirements, rewards, and badges
interface Mission {
  id: string;
  description: string;
  requirements: MissionRequirement[];
  amount?: number;
  tokens?: TriggerToken[];
  badge?: string;
  badge_URI?: string;
  user?: User;
  mission_id?: string;
}

// User interface represents a user with rewards, address, XP, and completed actions/missions
interface User {
  id: string;
  name: string;
  address: string;
  xp: number;
  rewarded: Token[];
  completedActions: string[];
  completedMissions: string[];
}

// Reward type represents reward details
type Reward = {
  amount: number;
  token: string;
  type: string;
};

// ActionType type represents an action with its ID, token, amount, and description
type ActionType = {
  id: string;
  token: string;
  amount: number;
  description: string;
};

// Token type represents token details
type Token = {
  id: string;
  amount: BigNumber | number;
  address: string;
  type: RewardType;
  activityType: string;
  tokenURI?: string;
};

// TriggerToken type represents trigger token details
type TriggerToken = {
  address: string;
  amount: number;
  uri?: string;
};

// RewardParams interface represents reward parameters
interface RewardParams {
  receiver: string;
  tokens: Token[];
}

// ContractData interface represents contract data with ID and creation date
interface ContractData {
  id: string;
  createdAt: string;
}

// QueryResult interface represents a query result with a list of contracts
interface QueryResult {
  contracts: ContractData[];
}

// ActionsLeaderboardProps interface represents properties for the Actions Leaderboard component
interface ActionsLeaderboardProps {
  appId: string;
  createdAtGte: string;
  createdAtLte: string;
  formatUserId: (id: string) => string;
}

// Action interface represents an action performed by a user
interface Action {
  id: string;
  user: User;
  amount: number;
  description: string;
  address: string;
  xp?: number;
  user?: string;
  action_id?: string;
}

// QueryResult interface represents a query result with a list of actions and missions
interface QueryResult {
  actions: Action[];
  missions: Mission[];
}

// MissionsLeaderboardProps interface represents properties for the Missions Leaderboard component
interface MissionsLeaderboardProps {
  appId: string;
  createdAtGte: string;
  createdAtLte: string;
  formatUserId: (id: string) => string;
}

// LeaderboardEntry interface represents a leaderboard entry
interface LeaderboardEntry {
  user_id: string;
  action_id: string;
  mission_id: string;
  [key: string]: any;
}

// FormatData interface represents formatting details for the Leaderboard Table component
interface FormatData {
  header: string;
  formatUserId: (id: string) => string;
  valueKey: string;
  formatValue: (value: any) => any;
}

// LeaderboardTableProps interface represents properties for the Leaderboard Table component
interface LeaderboardTableProps {
  title: string;
  data: LeaderboardEntry[] | null;
  formatData: FormatData;
}

// HeaderProps interface represents properties for the Header component
interface HeaderProps {}

// AuthProps interface represents properties for the Auth component
interface AuthProps {}

// ResponseData interface represents response data for user profile actions and missions
interface ProfileResponseData {
  actions?: Action[];
  missions?: Mission[];
}

// TimeRangeDropdownProps interface represents properties for the Time Range Dropdown component
interface TimeRangeDropdownProps {
  onChange: (value: string) => void;
}

// Data type represents the structure of the response for a reward
type Data = {
  success: boolean;
  message: string;
  params?: any;
};

// Contract interface represents a contract with its ID, creation timestamp, type, and metadata
interface Contract {
  id: string;
  createdAt: number;
  type: string;
  metadata: {
    name: string;
    totalSupply: string;
  };
}

// ResponseData interface represents response data for a list of contracts
interface ResponseData {
  contracts: Contract[];
}

// Variables interface represents variables for a GraphQL query
interface Variables {
  appId: string;
}

//AppData interface to represent the shape of data
interface AppData {
  app: {
    owner: {
      id: string;
    };
  };
}
