import { gql } from "graphql-request";

export const getActionsByUserAndRequirements = gql`
  query getActionByUserAndRequirements($user: String!, $app: String!) {
    actions(where: { user: $user, app: $app }) {
      id
      type_id
    }
  }
`;

export const getActionsForLeaderboard = gql`
  query getActionsForLeaderboard($appId: String!) {
    actions(where: { app: $appId }) {
      id
      amount
      type_id
      user {
        id
      }
    }
  }
`;
