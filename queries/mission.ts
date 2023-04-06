import { gql } from "graphql-request";

export const getMissionsByUserAndRequirements = gql`
  query getMissionsByUserAndRequirements(
    $user: String!
    $app: String!
  ) {
    missions(where: { user: $user, app: $app }) {
      id
      type_id
    }
  }
`;
