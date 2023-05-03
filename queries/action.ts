import { gql } from "graphql-request";

// Define the getActionsByUserAndRequirements query
export const getActionsByUserAndRequirements = gql`
  query getActionByUserAndRequirements(
    $user: String!
    $app: String!
  ) {
    actions(where: { user: $user, app: $app }) {
      id
      action_id
    }
  }
`;

// Define the getActionsForLeaderboard query
export const getActionsForLeaderboard = gql`
  query getActionsForLeaderboard(
    $appId: String!
    $createdAt_gte: String!
    $createdAt_lte: String!
  ) {
    actions(
      where: {
        createdAt_lte: $createdAt_lte
        createdAt_gte: $createdAt_gte
        app: $appId
      }
    ) {
      id
      amount
      action_id
      user {
        id
      }
    }
  }
`;

// Define the getActionsForProfile query
export const getActionsForProfile = gql`
  query MyQuery($userId: String!, $appId: String!) {
    actions(where: { user: $userId, app: $appId }) {
      action_id
      amount
    }
  }
`;
