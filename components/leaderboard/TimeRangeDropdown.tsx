// components/leaderboard/TimeRangeDropdown.tsx

// Import necessary dependencies
import { useState } from "react";
import { TimeRangeDropdownProps } from "@/types";
import styles from "../../styles/Dropdown.module.css";

// TimeRangeDropdown component to allow users to select a time range for the leaderboard
export default function TimeRangeDropdown({
  onChange,
}: TimeRangeDropdownProps) {
  // State to store the selected time range
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");

  // Function to handle changes in the dropdown selection
  function handleDropdownChange(e: React.ChangeEvent<HTMLSelectElement>) {
    // Update the state with the new time range value
    setSelectedTimeRange(e.target.value);
    // Call the onChange prop function to inform the parent component about the change
    onChange(e.target.value);
  }

  // Render the TimeRangeDropdown component
  return (
    <>
      <label htmlFor="timeRange">Select time range: </label>
      <select
        className={styles.input}
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
