// components/leaderboard/TimeRangeDropdown.tsx
import { useState } from "react";
import { TimeRangeDropdownProps } from "@/types";

export default function TimeRangeDropdown({
  onChange,
}: TimeRangeDropdownProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");

  function handleDropdownChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedTimeRange(e.target.value);
    onChange(e.target.value);
  }

  return (
    <>
      <label htmlFor="timeRange">Select time range: </label>
      <select
        id="timeRange"
        onChange={handleDropdownChange}
        value={selectedTimeRange}
      >
        <option value="">--Choose a range--</option>
        <option value="day">Last 24 hours</option>
        <option value="week">Last 7 days</option>
        <option value="month">Last 30 days</option>
      </select>
    </>
  );
}
