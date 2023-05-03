import { gql } from "graphql-request";

// GraphQL query to get missions by a specific user and app
export const getMissionsByUserAndRequirements = gql`
  query getMissionsByUserAndRequirements(
    $user: String!
    $app: String!
  ) {
    missions(where: { user: $user, app: $app }) {
      id
      mission_id
    }
  }
`;

// GraphQL query to get missions for the leaderboard based on app ID and a specific date range
export const getMissionsForLeaderboard = gql`
  query getMissionsForLeaderboard(
    $appId: String!
    $createdAt_gte: String!
    $createdAt_lte: String!
  ) {
    missions(
      where: {
        createdAt_lte: $createdAt_lte
        createdAt_gte: $createdAt_gte
        app: $appId
      }
    ) {
      id
      mission_id
      user {
        id
      }
    }
  }
`;
