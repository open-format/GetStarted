// queries/index.ts

// Import the action-related GraphQL queries
import {
  getActionsByUserAndRequirements,
  getActionsForLeaderboard,
} from "./action";

// Import the mission-related GraphQL queries
import {
  getMissionsByUserAndRequirements,
  getMissionsForLeaderboard,
} from "./mission";

// Export the imported queries for easy access
export {
  getActionsByUserAndRequirements,
  getActionsForLeaderboard,
  getMissionsByUserAndRequirements,
  getMissionsForLeaderboard,
};
