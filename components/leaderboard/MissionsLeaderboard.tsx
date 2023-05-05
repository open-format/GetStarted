import { MissionsLeaderboardProps, QueryResult } from "@/types";
import { useEffect } from "react";
import { useRawRequest } from "@openformat/react";
import LeaderboardTable from "./LeaderboardTable";
import { getMissionsForLeaderboard } from "../../queries/mission";

// Process the missions leaderboard data and create a leaderboard object
function processMissionsLeaderboard(data: QueryResult) {
  const leaderboard: Record<string, any> = {};

  // Loop through the missions and update the leaderboard object
  data.missions.forEach((mission) => {
    if (mission.user && mission.user.id) {
      const key = mission.user.id;

      if (!leaderboard[key]) {
        leaderboard[key] = {
          user_id: mission.user.id,
          completedMissions: 0,
          uniqueTypes: new Set(),
        };
      }
      // Add the mission mission_id to the uniqueTypes Set and increment the completedMissions count
      leaderboard[key].uniqueTypes.add(mission.mission_id);
      leaderboard[key].completedMissions++;
    }
  });

  // Convert uniqueTypes Set to its size (count of unique type_ids)
  Object.values(leaderboard).forEach((entry) => {
    entry.uniqueTypes = entry.uniqueTypes.size;
  });

  // Return an array of the leaderboard values
  return Object.values(leaderboard);
}

// MissionsLeaderboard component definition
export default function MissionsLeaderboard({
  appId,
  createdAtGte,
  createdAtLte,
  formatUserId,
}: MissionsLeaderboardProps) {
  // Fetch the raw missions data using the provided query and variables
  const { data: missionsData, refetch: refetchMissionsData } =
    useRawRequest<QueryResult, any>({
      query: getMissionsForLeaderboard,
      variables: {
        appId,
        createdAt_gte: createdAtGte,
        createdAt_lte: createdAtLte,
      },
    });
  // Refetch the missions data whenever the date range changes
  useEffect(() => {
    refetchMissionsData();
  }, [createdAtGte, createdAtLte, refetchMissionsData]);

  // Process the missions data and generate the leaderboard data
  const missionsLeaderboardData = missionsData
    ? processMissionsLeaderboard(missionsData)
    : null;

  // Sort the leaderboard data by completed missions in descending order
  const sortedMissionsLeaderboardData = missionsLeaderboardData
    ? missionsLeaderboardData.sort(
        (a, b) => b.completedMissions - a.completedMissions
      )
    : null;

  // Define the format for the missions data to be displayed in the table
  const formatMissionsData = {
    header: "Completed Missions",
    formatUserId,
    valueKey: "completedMissions",
    formatValue: (value: number) => value,
  };

  // Render the LeaderboardTable component with the sorted leaderboard data and formatting options
  return (
    <LeaderboardTable
      title="Missions Leaderboard"
      data={sortedMissionsLeaderboardData}
      formatData={formatMissionsData}
    />
  );
}
