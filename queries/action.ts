import { gql } from "graphql-request";

export const getActionsByUserAndRequirements = gql`
  query getActionByUserAndRequirements(
    $user: String!
    $app: String!
  ) {
    actions(where: { user: $user, app: $app }) {
      id
      type_id
    }
  }
`;
