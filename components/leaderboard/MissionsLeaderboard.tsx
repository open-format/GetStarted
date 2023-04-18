// components/leaderboard/MissionsLeaderboard.tsx
import { MissionsLeaderboardProps, QueryResult } from "@/types";
import { useEffect } from "react";
import { useRawRequest } from "@openformat/react";
import LeaderboardTable from "./LeaderboardTable";
import { getMissionsForLeaderboard } from "../../queries/mission";

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

export default function MissionsLeaderboard({
  appId,
  createdAtGte,
  createdAtLte,
  formatUserId,
}: MissionsLeaderboardProps) {
  const { data: missionsData, refetch: refetchMissionsData } = useRawRequest<
    QueryResult,
    any
  >({
    query: getMissionsForLeaderboard,
    variables: {
      appId,
      createdAt_gte: createdAtGte,
      createdAt_lte: createdAtLte,
    },
  });
  useEffect(() => {
    refetchMissionsData();
  }, [createdAtGte, createdAtLte, refetchMissionsData]);

  const missionsLeaderboardData = missionsData
    ? processMissionsLeaderboard(missionsData)
    : null;

  const sortedMissionsLeaderboardData = missionsLeaderboardData
    ? missionsLeaderboardData.sort(
        (a, b) => b.completedMissions - a.completedMissions
      )
    : null;

  const formatMissionsData = {
    header: "Completed Missions",
    formatUserId,
    valueKey: "completedMissions",
    formatValue: (value: number) => value,
  };

  return (
    <LeaderboardTable
      title="Missions Leaderboard"
      data={sortedMissionsLeaderboardData}
      formatData={formatMissionsData}
    />
  );
}
