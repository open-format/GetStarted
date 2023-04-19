import { ActionsLeaderboardProps, QueryResult } from "@/types";
import { useEffect } from "react";
import { useRawRequest } from "@openformat/react";
import LeaderboardTable from "./LeaderboardTable";
import { getActionsForLeaderboard } from "../../queries/action";

// Process the actions leaderboard data and create a leaderboard object
function processActionsLeaderboard(data: QueryResult) {
  const leaderboard: Record<string, any> = {};

  // Loop through the actions and update the leaderboard object
  data.actions.forEach((action) => {
    const key = action.user.id;

    if (!leaderboard[key]) {
      leaderboard[key] = {
        user_id: action.user.id,
        totalAmount: 0,
      };
    }

    // Update the total amount for the user by adding the current action amount (converted to an integer)
    leaderboard[key].totalAmount += Math.floor(action.amount ?? 0); // Convert the action.amount to an integer
  });

  // Return an array of the leaderboard values
  return Object.values(leaderboard);
}

// ActionsLeaderboard component definition
export default function ActionsLeaderboard({
  appId,
  createdAtGte,
  createdAtLte,
  formatUserId,
}: ActionsLeaderboardProps) {
  // Fetch the raw actions data using the provided query and variables
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

  // Refetch the actions data whenever the date range changes
  useEffect(() => {
    refetchActionsData();
  }, [createdAtGte, createdAtLte, refetchActionsData]);

  // Process the actions data and generate the leaderboard data
  const actionsLeaderboardData = actionsData
    ? processActionsLeaderboard(actionsData)
    : null;

  // Sort the leaderboard data by total amount in descending order
  const sortedActionsLeaderboardData = actionsLeaderboardData
    ? actionsLeaderboardData.sort((a, b) => b.totalAmount - a.totalAmount)
    : null;

  // Define the format for the actions data to be displayed in the table
  const formatActionsData = {
    header: "Total Amount",
    formatUserId,
    valueKey: "totalAmount",
    formatValue: (value: number) => value,
  };
  // Render the LeaderboardTable component with the sorted leaderboard data and formatting options
  return (
    <LeaderboardTable
      title="Actions Leaderboard"
      data={sortedActionsLeaderboardData}
      formatData={formatActionsData}
    />
  );
}
