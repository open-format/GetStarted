import Head from "next/head";
import { useState } from "react";
import ActionsLeaderboard from "../components/leaderboard/ActionsLeaderboard";
import MissionsLeaderboard from "../components/leaderboard/MissionsLeaderboard";
import TimeRangeDropdown from "../components/leaderboard/TimeRangeDropdown";
import { getTimeRange } from "../utils/getTimeRange";

// Define the Leaderboard component
export default function Leaderboard() {
  // update timerange dropdown
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  // set default timerange
  const defaultTimeRange = getTimeRange("week");
  // Add state for createdAt_gte and createdAt_lte
  const [createdAtGte, setCreatedAtGte] = useState(
    defaultTimeRange.gte
  );
  const [createdAtLte, setCreatedAtLte] = useState(
    defaultTimeRange.lte
  );

  // Define a function to format user IDs for display
  function formatUserId(id: string) {
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  }

  return (
    <>
      {/* Set the page title and meta description */}
      <Head>
        <title>Leaderboard - OpenFormat Hello World Template</title>
        <meta
          name="description"
          content="Explore the top users and their performance in Actions and Missions on the leaderboard."
        />
        <meta
          property="og:url"
          content="https://github.com/open-format/hello-world"
        />
        <meta
          property="og:title"
          content="OpenFormat Hello World Template - Leaderboard"
        />
        <meta
          property="og:description"
          content="Explore the top users and their performance in Actions and Missions on the leaderboard in this OpenFormat Hello World Template."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/openformat.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@openformat_tech" />
        <meta
          name="twitter:title"
          content="OpenFormat Hello World Template - Leaderboard"
        />
        <meta
          name="twitter:description"
          content="Explore the top users and their performance in Actions and Missions on the leaderboard in this OpenFormat Hello World Template."
        />
        {/* Image needs to be updated to direct link */}
        <meta name="twitter:image" content="/openformat.png" />
      </Head>
      {/* Main content */}
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <header className="sm:flex sm:items-center m-4">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Leaderboard
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Explore the top users and their performance in Actions
              and Missions.
            </p>
          </div>
          <div className="mt-4 sm:flex-none">
            <TimeRangeDropdown
              onChange={(value) => {
                const timeRange = getTimeRange(value);
                setCreatedAtGte(timeRange.gte);
                setCreatedAtLte(timeRange.lte);
                setSelectedTimeRange(value);
              }}
            />
          </div>
        </header>
        <section className="m-4 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <div className="sm:flex">
                  <div className="sm:w-1/2 sm:pr-4">
                    <ActionsLeaderboard
                      appId={
                        process.env.NEXT_PUBLIC_CONSTELLATION_ID || ""
                      }
                      createdAtGte={createdAtGte}
                      createdAtLte={createdAtLte}
                      formatUserId={formatUserId}
                    />
                  </div>
                  <div className="sm:w-1/2 sm:pl-4">
                    <MissionsLeaderboard
                      appId={
                        process.env.NEXT_PUBLIC_CONSTELLATION_ID || ""
                      }
                      createdAtGte={createdAtGte}
                      createdAtLte={createdAtLte}
                      formatUserId={formatUserId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
