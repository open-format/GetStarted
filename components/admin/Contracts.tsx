import { useRawRequest } from "@openformat/react";
import { gql } from "graphql-request";

interface ContractData {
  id: string;
  createdAt: string;
}

interface QueryResult {
  contracts: ContractData[];
}

function Contracts() {
  const { data } = useRawRequest<QueryResult>({
    query: gql`
      query MyQuery {
        contracts(where: { app: "${process.env.NEXT_PUBLIC_APP_ID}" }) {
          id
          createdAt
          metadata {
      name
    }
  }
}
    `,
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
