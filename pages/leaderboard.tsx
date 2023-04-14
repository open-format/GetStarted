import Head from "next/head";
import React from "react";
import { useRawRequest } from "@openformat/react";
import {
  getActionsForLeaderboard,
  getMissionsForLeaderboard,
} from "../queries";

interface QueryResult {
  actions: { user: { id: string }; amount: string; type_id: string }[];
  missions: { user: { id: string }; type_id: string }[];
}

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

export default function Leaderboard() {
  const { data: actionsData } = useRawRequest<QueryResult, any>({
    query: getActionsForLeaderboard,
    variables: { appId: process.env.NEXT_PUBLIC_APP_ID },
  });

  const { data: missionsData } = useRawRequest<QueryResult, any>({
    query: getMissionsForLeaderboard,
    variables: { appId: process.env.NEXT_PUBLIC_APP_ID },
  });

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

  const actionsLeaderboardData = actionsData
    ? processActionsLeaderboard(actionsData)
    : null;
  const missionsLeaderboardData = missionsData
    ? processMissionsLeaderboard(missionsData)
    : null;

  function formatUserId(id: string) {
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  }

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
                  {actionsLeaderboardData.map((entry) => (
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
                  {missionsLeaderboardData.map((entry) => (
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
