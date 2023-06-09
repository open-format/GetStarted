// Function to get the time range (gte and lte values) based on a given range value (day, week, or month)
export function getTimeRange(value: string): { gte: string; lte: string } {
  const now = new Date();
  const lte = Math.floor(now.getTime() / 1000);

  let gte;
  // Determine the "gte" value based on the provided range value
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

  // Return an object with "gte" and "lte" values as strings
  return {
    gte: String(gte),
    lte: String(lte),
  };
}
