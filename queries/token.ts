import { gql } from "graphql-request";

export const getTokenByName = gql`
  query getTokenByName($app: String!, $name: String!) {
    contracts(
      where: { app: $app, metadata_: { name_contains_nocase: $name } }
    ) {
      id
      metadata {
        name
      }
    }
  }
`;
