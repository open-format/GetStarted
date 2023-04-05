import { useRawRequest } from "@openformat/react";
import { gql } from "graphql-request";

function Contracts() {
  const { data } = useRawRequest<QueryResult>({
    query: gql`
      query MyQuery($appId: String!) {
        contracts(where: { app: $appId }) {
          id
          createdAt
          metadata {
            name
          }
        }
      }
    `,
    variables: { appId: process.env.NEXT_PUBLIC_APP_ID },
  });

  return (
    <div>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default Contracts;
