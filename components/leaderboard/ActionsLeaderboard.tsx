// ActionsLeaderboard.tsx
import { useEffect } from "react";
import { useRawRequest } from "@openformat/react";
import LeaderboardTable from "./LeaderboardTable";
import { getActionsForLeaderboard } from "../../queries/action";

interface ActionsLeaderboardProps {
  appId: string;
  createdAtGte: string;
  createdAtLte: string;
  formatUserId: (id: string) => string;
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

    leaderboard[key].totalAmount += parseInt(action.amount, 10); // Convert the action.amount to an integer
  });

  return Object.values(leaderboard);
}

export default function ActionsLeaderboard({
  appId,
  createdAtGte,
  createdAtLte,
  formatUserId,
}: ActionsLeaderboardProps) {
  const { data: actionsData, refetch: refetchActionsData } = useRawRequest<
    QueryResult,
    any
  >({
    query: getActionsForLeaderboard,
    variables: {
      appId,
      createdAt_gte: createdAtGte,
      createdAt_lte: createdAtLte,
    },
  });

  useEffect(() => {
    refetchActionsData();
  }, [createdAtGte, createdAtLte, refetchActionsData]);

  const actionsLeaderboardData = actionsData
    ? processActionsLeaderboard(actionsData)
    : null;

  const sortedActionsLeaderboardData = actionsLeaderboardData
    ? actionsLeaderboardData.sort((a, b) => b.totalAmount - a.totalAmount)
    : null;

  const formatActionsData = {
    header: "Total Amount",
    formatUserId,
    valueKey: "totalAmount",
    formatValue: (value) => value,
  };

  return (
    <LeaderboardTable
      title="Actions Leaderboard"
      data={sortedActionsLeaderboardData}
      formatData={formatActionsData}
    />
  );
}
