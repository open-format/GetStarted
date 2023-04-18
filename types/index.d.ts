// types/index.d.ts
import { RewardType } from "@openformat/sdk";

// Action interface
interface Action {
  id: string;
  amount: number;
  description: string;
  address: string;
  xp: number;
}

// MissionRequirement interface
interface MissionRequirement {
  actionId: string;
  count: number;
}

// Mission interface
interface Mission {
  id: string;
  description: string;
  amount: number;
  tokens: TriggerToken[];
  badge: string;
  badge_URI: string;
  requirements: MissionRequirement[];
}

// User interface
interface User {
  rewarded: Token[];
  address: string;
  xp: number;
  completedActions: string[];
  completedMissions: string[];
}

// Reward type
type Reward = {
  amount: number;
  token: string;
  type: string;
};

// ActionType type
type ActionType = {
  id: string;
  token: string;
  amount: number;
  description: string;
};

// Token type
type Token = {
  id: string;
  amount: number;
  address: string;
  type: RewardType;
  activityType: string;
  tokenURI?: string;
};

// TriggerToken type
type TriggerToken = {
  address: string;
  amount: number;
  uri?: string;
};

// RewardParams interface
interface RewardParams {
  receiver: string;
  tokens: Token[];
}

// ContractData interface
interface ContractData {
  id: string;
  createdAt: string;
}

// QueryResult interface
interface QueryResult {
  contracts: ContractData[];
}

// ActionsLeaderboardProps interface
interface ActionsLeaderboardProps {
  appId: string;
  createdAtGte: string;
  createdAtLte: string;
  formatUserId: (id: string) => string;
}

// User interface
interface User {
  id: string;
  name: string;
}

// Action interface
interface Action {
  id: string;
  user: User;
  type_id: string;
  amount?: number;
}

// QueryResult interface
interface QueryResult {
  actions: Action[];
  missions: Mission[];
}

// MissionsLeaderboardProps interface
interface MissionsLeaderboardProps {
  appId: string;
  createdAtGte: string;
  createdAtLte: string;
  formatUserId: (id: string) => string;
}

// Mission interface
interface Mission {
  id: string;
  user: User;
  type_id: string;
}

// LeaderboardEntry interface
interface LeaderboardEntry {
  user_id: string;
  type_id: string;
  [key: string]: any;
}

// FormatData interface
interface FormatData {
  header: string;
  formatUserId: (id: string) => string;
  valueKey: string;
  formatValue: (value: any) => any;
}

// LeaderboardTableProps interface
interface LeaderboardTableProps {
  title: string;
  data: LeaderboardEntry[] | null;
  formatData: FormatData;
}

// HeaderProps interface
interface HeaderProps {}

// AuthProps interface
interface AuthProps {}

// Action interface
interface Action {
  type_id: string;
  amount: number;
}

// Mission interface
interface Mission {
  type_id: string;
}

// ResponseData interface
interface ProfileResponseData {
  actions?: Action[];
  missions?: Mission[];
}

// TimeRangeDropdownProps interface
interface TimeRangeDropdownProps {
  onChange: (value: string) => void;
}

// reward Data

type Data = {
  success: boolean;
  message: string;
  params?: any;
};

interface Contract {
  id: string;
  createdAt: number;
  type: string;
  metadata: {
    name: string;
  };
}

interface ResponseData {
  contracts: Contract[];
}

interface Variables {
  appId: string;
}
