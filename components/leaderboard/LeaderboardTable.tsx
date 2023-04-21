import { LeaderboardTableProps } from "@/types";

// LeaderboardTable component definition
const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  title,
  data,
  formatData,
}) => {
  // Render the component
  return (
    <>
      <h3 className="text-lg font-semibold leading-6 text-gray-900 m-4">
        {title}
      </h3>
      {data ? (
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                User ID
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                {formatData.header}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((entry) => (
              <tr key={`${entry.type_id}_${entry.user_id}`}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {formatData.formatUserId(entry.user_id)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {formatData.formatValue(entry[formatData.valueKey])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-2 text-sm text-gray-700">
          Loading {title.toLowerCase()}...
        </p>
      )}
    </>
  );
};

export default LeaderboardTable;
