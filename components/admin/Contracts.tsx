import { ResponseData, Variables } from "@/types";
import { fromWei, useRawRequest } from "@openformat/react";
import { gql } from "graphql-request";
import { toast } from "react-hot-toast";

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
            totalSupply
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

  const copyContractId = (contractId: string) => {
    navigator.clipboard.writeText(contractId);
    toast.success("Copied!");
  };

  const badges = contracts?.filter(
    (contract) => contract.type === "Badge"
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-xs sm:text-sm font-semibold text-gray-900 sm:pl-6">
                      ID
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Created At
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Supply
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {badges.map((contract) => (
                    <tr key={contract.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs sm:text-sm font-medium text-gray-900 sm:pl-6">
                        <button
                          className="focus:outline-none"
                          onClick={() => copyContractId(contract.id)}
                        >
                          {contract.id}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-gray-500">
                        {new Date(
                          contract.createdAt * 1000
                        ).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-gray-500">
                        {contract.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-gray-500">
                        {contract.metadata.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-gray-500">
                        {contract.type === "Badge"
                          ? contract.metadata.totalSupply
                          : fromWei(contract.metadata.totalSupply)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contracts;
