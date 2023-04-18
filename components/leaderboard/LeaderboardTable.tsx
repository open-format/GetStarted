import React from "react";

const LeaderboardTable = ({ title, data, formatData }) => {
  return (
    <>
      <h3>{title}</h3>
      {data ? (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>{formatData.header}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={`${entry.type_id}_${entry.user_id}`}>
                <td>{formatData.formatUserId(entry.user_id)}</td>
                <td>{formatData.formatValue(entry[formatData.valueKey])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading {title.toLowerCase()}...</p>
      )}
    </>
  );
};

export default LeaderboardTable;
