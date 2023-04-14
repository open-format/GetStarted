import Head from "next/head";
import { useState, useEffect } from "react";
import { useRawRequest } from "@openformat/react";
import {
  getActionsForLeaderboard,
  getMissionsForLeaderboard,
} from "../queries";

// Define the structure of the query result from the server
interface QueryResult {
  actions: { user: { id: string }; amount: string; type_id: string }[];
  missions: { user: { id: string }; type_id: string }[];
}

// Define styles for the components
const containerStyle: React.CSSProperties = {
  display: "flex",
  textAlign: "center",
  flexDirection: "row" as const,
};

const columnStyle: React.CSSProperties = {
  flex: 1,
  marginRight: "20px",
  minWidth: "400px",
  textAlign: "left",
  display: "flex",
  flexDirection: "column" as const,
};

// Process the actions query result to create a leaderboard of total amounts for each user
function processActionsLeaderboard(data: QueryResult) {
  const leaderboard: Record<string, any> = {};

  data.actions.forEach((action) => {
    const key = action.user.id;

    if (!leaderboard[key]) {
      leaderboard[key] = {
        user_id: action.user.id,
        totalAmount: 0,
      };
    }

    leaderboard[key].totalAmount += parseInt(action.amount);
  });

  return Object.values(leaderboard);
}

// Process the missions query result to create a leaderboard of completed missions and unique types for each user
function processMissionsLeaderboard(data: QueryResult) {
  const leaderboard: Record<string, any> = {};

  data.missions.forEach((mission) => {
    const key = mission.user.id;

    if (!leaderboard[key]) {
      leaderboard[key] = {
        user_id: mission.user.id,
        completedMissions: 0,
        uniqueTypes: new Set(),
      };
    }
    leaderboard[key].uniqueTypes.add(mission.type_id);

    leaderboard[key].completedMissions++;
  });

  // Convert uniqueTypes Set to its size (count of unique type_ids)
  Object.values(leaderboard).forEach((entry) => {
    entry.uniqueTypes = entry.uniqueTypes.size;
  });

  return Object.values(leaderboard);
}

// Get the time range for the createdAt field based on the selected dropdown value
function getTimeRange(value: string): { gte: string; lte: string } {
  const now = new Date();
  const lte = Math.floor(now.getTime() / 1000);

  let gte;
  switch (value) {
    case "day":
      gte = Math.floor(now.setDate(now.getDate() - 1) / 1000);
      break;
    case "week":
      gte = Math.floor(now.setDate(now.getDate() - 7) / 1000);
      break;
    case "month":
      gte = Math.floor(now.setMonth(now.getMonth() - 1) / 1000);
      break;
    default:
      gte = "";
      break;
  }

  return {
    gte: String(gte),
    lte: String(lte),
  };
}

// Define the Leaderboard component
export default function Leaderboard() {
  // Add state for createdAt_gte and createdAt_lte
  const [createdAtGte, setCreatedAtGte] = useState("");
  const [createdAtLte, setCreatedAtLte] = useState("");

  // Define the handleDropdownChange function, which sets the createdAtGte and createdAtLte states based on the selected dropdown value
  function handleDropdownChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const timeRange = getTimeRange(e.target.value);
    setCreatedAtGte(timeRange.gte);
    setCreatedAtLte(timeRange.lte);
  }

  // Use graphql-hooks to fetch data for actions and missions based on the createdAtGte and createdAtLte states
  const { data: actionsData, refetch: refetchActionsData } = useRawRequest<
    QueryResult,
    any
  >({
    query: getActionsForLeaderboard,
    variables: {
      appId: process.env.NEXT_PUBLIC_APP_ID,
      createdAt_gte: createdAtGte,
      createdAt_lte: createdAtLte,
    },
  });

  const { data: missionsData, refetch: refetchMissionsData } = useRawRequest<
    QueryResult,
    any
  >({
    query: getMissionsForLeaderboard,
    variables: {
      appId: process.env.NEXT_PUBLIC_APP_ID,
      createdAt_gte: createdAtGte,
      createdAt_lte: createdAtLte,
    },
  });

  // Use useEffect to refetch the data whenever the createdAtGte and createdAtLte states change
  useEffect(() => {
    if (createdAtGte && createdAtLte) {
      refetchActionsData();
      refetchMissionsData();
    }
  }, [createdAtGte, createdAtLte]);

  // Process the data into the desired format for display
  const actionsLeaderboardData = actionsData
    ? processActionsLeaderboard(actionsData)
    : null;
  const missionsLeaderboardData = missionsData
    ? processMissionsLeaderboard(missionsData)
    : null;

  // Define a function to format user IDs for display
  function formatUserId(id: string) {
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  }

  // Sort the data in descending order based on the totalAmount or completedMissions property
  const sortedActionsLeaderboardData = actionsLeaderboardData
    ? actionsLeaderboardData.sort((a, b) => b.totalAmount - a.totalAmount)
    : null;

  const sortedMissionsLeaderboardData = missionsLeaderboardData
    ? missionsLeaderboardData.sort(
        (a, b) => b.completedMissions - a.completedMissions
      )
    : null;

  // Render the leaderboard component with appropriate props and child components

  return (
    <>
      <Head>
        <title>Dapp Template</title>
        <meta name="description" content="OPENFORMAT - Dapp Template" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Leaderboard</h1>
      <main>
        <label htmlFor="timeRange">Select time range: </label>
        <select id="timeRange" onChange={handleDropdownChange}>
          <option value="">--Choose a range--</option>
          <option value="day">Last 24 hours</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
        <br />
        <div style={containerStyle}>
          <div style={columnStyle}>
            <h3>Actions Leaderboard</h3>
            {actionsLeaderboardData ? (
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedActionsLeaderboardData.map((entry) => (
                    <tr key={`${entry.type_id}_${entry.user_id}`}>
                      <td>{formatUserId(entry.user_id)}</td>
                      <td>{entry.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Loading actions leaderboard...</p>
            )}
          </div>
          <div style={columnStyle}>
            <h3>Missions Leaderboard</h3>
            {missionsLeaderboardData ? (
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Completed Missions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMissionsLeaderboardData.map((entry) => (
                    <tr key={`${entry.type_id}_${entry.user_id}`}>
                      <td>{formatUserId(entry.user_id)}</td>
                      <td>{entry.completedMissions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Loading missions leaderboard...</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
