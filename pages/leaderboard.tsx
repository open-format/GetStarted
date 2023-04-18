// pages/leaderboard.tsx
import { useState } from "react";
import TimeRangeDropdown from "../components/leaderboard/TimeRangeDropdown";
import ActionsLeaderboard from "../components/leaderboard/ActionsLeaderboard";
import MissionsLeaderboard from "../components/leaderboard/MissionsLeaderboard";
import styles from "../styles/Leaderboard.module.css";
import { getTimeRange } from "../utils/getTimeRange";

// Define the Leaderboard component
export default function Leaderboard() {
  // update timerange dropdown
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  // set default timerange
  const defaultTimeRange = getTimeRange("week");
  // Add state for createdAt_gte and createdAt_lte
  const [createdAtGte, setCreatedAtGte] = useState(defaultTimeRange.gte);
  const [createdAtLte, setCreatedAtLte] = useState(defaultTimeRange.lte);

  // Define a function to format user IDs for display
  function formatUserId(id: string) {
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  }

  return (
    <div className={styles.leaderboard}>
      <div className={styles.description}>
        <p>
          <code className={styles.code}>LEADERBOARD</code>
        </p>
      </div>
      <main className={styles.timerange}>
        <TimeRangeDropdown
          onChange={(value) => {
            const timeRange = getTimeRange(value);
            setCreatedAtGte(timeRange.gte);
            setCreatedAtLte(timeRange.lte);
            setSelectedTimeRange(value);
          }}
        />
        <br />
        <div className={styles.leaderboard__container}>
          <div className={styles.leaderboard__column}>
            <ActionsLeaderboard
              appId={process.env.NEXT_PUBLIC_APP_ID || ""}
              createdAtGte={createdAtGte}
              createdAtLte={createdAtLte}
              formatUserId={formatUserId}
            />
          </div>
          <div className={styles.leaderboard__column}>
            <MissionsLeaderboard
              appId={process.env.NEXT_PUBLIC_APP_ID || ""}
              createdAtGte={createdAtGte}
              createdAtLte={createdAtLte}
              formatUserId={formatUserId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
