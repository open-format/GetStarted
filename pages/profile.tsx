import { RefreshButton, Tooltip } from "@/components";
import { Action, Mission, ProfileResponseData } from "@/types";
import { fromWei, useRawRequest, useWallet } from "@openformat/react";
import { gql } from "graphql-request";
import Head from "next/head";
import React from "react";

// Profile component
const Profile: React.FC = () => {
  // Use the useWallet hook to get the wallet address
  const { address = null } = useWallet();

  // Use the useRawRequest hook to fetch actions and missions data for the user
  const { data, refetch, isRefetching } = useRawRequest<
    ProfileResponseData,
    any
  >({
    query: gql`
      query MyQuery($userId: String!, $appId: String!) {
        actions(where: { user: $userId, app: $appId }) {
          action_id
          amount
        }
        missions(where: { user: $userId, app: $appId }) {
          mission_id
        }
      }
    `,
    variables: {
      userId: address?.toLocaleLowerCase(),
      appId: process.env.NEXT_PUBLIC_APP_ID,
    },
  });

  // Calculate the action counts and tokens earned by the user
  const calculateActionCountsAndTokens = (actions: Action[]) => {
    const actionTypes: Record<string, number> = {};
    let totalTokens = 0;
    actions.forEach((action) => {
      if (action.action_id) {
        actionTypes[action.action_id] =
          (actionTypes[action.action_id] || 0) + 1;
        totalTokens += Number(action.amount);
      }
    });
    return { actionTypes, totalTokens };
  };

  // Calculate the number of completed missions
  const { actionTypes, totalTokens } = calculateActionCountsAndTokens(
    data?.actions ?? []
  );
  const missionsCompleted = data?.missions ? data.missions.length : 0;

  const weitotaltokens = fromWei(totalTokens.toString());

  return (
    <>
      {/* Set the page title and meta description */}
      <Head>
        <title>User Profile - OpenFormat Hello World Template</title>
        <meta
          name="description"
          content="View user profile details, including tokens earned, badges earned, actions completed, and missions completed."
        />
        <meta
          property="og:url"
          content="https://github.com/open-format/hello-world"
        />
        <meta
          property="og:title"
          content="OpenFormat Hello World Template - User Profile"
        />
        <meta
          property="og:description"
          content="View user profile details, including tokens earned, badges earned, actions completed, and missions completed in this OpenFormat Hello World Template."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/openformat.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@openformat_tech" />
        <meta
          name="twitter:title"
          content="OpenFormat Hello World Template - User Profile"
        />
        <meta
          name="twitter:description"
          content="View user profile details, including tokens earned, badges earned, actions completed, and missions completed in this OpenFormat Hello World Template."
        />
        {/* Image needs to be updated to direct link */}
        <meta name="twitter:image" content="/openformat.png" />
      </Head>
      {/* Main content */}
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <header className="sm:flex sm:items-center m-4">
          <div className="sm:flex-auto group relative">
            <div className="flex items-center space-x-2">
              <RefreshButton
                onClick={refetch}
                isFetching={isRefetching}
              />
              <Tooltip>
                Depending on network conditions, it may take a couple
                minutes for the latest tokens and badges to appear on
                chain.
              </Tooltip>
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Profile
              </h1>
            </div>
            <a className="text-gray-500">
              {address?.toLocaleLowerCase()}
            </a>
          </div>
        </header>
        <section className="m-4 sm:flex sm:flex-wrap sm:-mx-6 lg:-mx-8">
          {address ? (
            <>
              <div className="overflow-hidden mt-4 sm:mt-0  sm:w-1/2 sm:px-6 lg:px-8">
                <div className="p-4 bg-gray-100 mb-2 rounded-lg ">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Tokens Earned
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {weitotaltokens} Action Tokens
                  </p>
                </div>
              </div>
              <div className="overflow-hidden mt-4 sm:mt-0 sm:w-1/2 sm:px-6 lg:px-8">
                <div className="p-4 bg-gray-100 mb-2 rounded-lg ">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Badges Earned
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {missionsCompleted}
                  </p>
                </div>
              </div>
              <div className="overflow-hidden  sm:w-1/2 sm:px-6 lg:px-8">
                <div className="p-4 border-t border-gray-200 ">
                  <h3 className="text-lg font-medium b leading-6 text-gray-900">
                    Actions Completed
                  </h3>
                  <ul className="mt-2 text-sm text-gray-600">
                    {Object.entries(actionTypes).map(
                      ([action_id, count]: [string, number]) => (
                        <li key={action_id} className="py-2">
                          {action_id}, Completed: {count}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div className="overflow-hidden mt-4 sm:mt-0 sm:w-1/2 sm:px-6 lg:px-8">
                <div className="p-4 border-t border-gray-200 ">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Missions Completed
                  </h3>
                  <ul className="mt-2 text-sm text-gray-600">
                    {data?.missions &&
                      data.missions.length &&
                      data.missions.map(
                        (mission: Mission, index: number) => (
                          <li key={index} className="py-2">
                            {mission.mission_id}
                          </li>
                        )
                      )}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div>
              <p>Please connect your wallet</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Profile;
