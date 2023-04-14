import { gql } from "graphql-request";

export const getMissionsByUserAndRequirements = gql`
  query getMissionsByUserAndRequirements($user: String!, $app: String!) {
    missions(where: { user: $user, app: $app }) {
      id
      type_id
    }
  }
`;

export const getMissionsForLeaderboard = gql`
  query getMissionsForLeaderboard($appId: String!) {
    missions(where: { app: $appId }) {
      id
      type_id
      user {
        id
      }
    }
  }
`;
