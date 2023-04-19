// components/admin/Contracts.tsx

// Import necessary dependencies
import { useRawRequest } from "@openformat/react";
import { gql } from "graphql-request";
import styles from "../../styles/Contracts.module.css";
import { ResponseData, Variables } from "@/types";

// Contracts component
function Contracts() {
  // Fetch contract data using useRawRequest hook
  const { data } = useRawRequest<ResponseData, Variables>({
    query: gql`
      query MyQuery($appId: String!) {
        contracts(where: { app: $appId }) {
          id
          createdAt
          type
          metadata {
            name
          }
        }
      }
    `,
    variables: { appId: process.env.NEXT_PUBLIC_APP_ID },
  });

  // Show loading message while data is being fetched
  if (!data) {
    return <p>Loading data...</p>;
  }

  // Map and transform contracts data
  const contracts = data.contracts.map((contract) => ({
    ...contract,
    type: contract.type === "NFT" ? "Badge" : contract.type,
  }));

  // Render contracts in a table
  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Created At</th>
            <th>Type</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr className={styles.item} key={contract.id}>
              <td className={styles.item}>{contract.id}</td>
              <td className={styles.item}>
                {new Date(contract.createdAt * 1000).toLocaleDateString()}
              </td>
              <td className={styles.item}>{contract.type}</td>
              <td className={styles.item}>{contract.metadata.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Contracts;
