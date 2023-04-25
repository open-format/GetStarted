import React from "react";
import Head from "next/head";
import { useRawRequest, useWallet } from "@openformat/react";
import { gql } from "graphql-request";
import { ProfileResponseData, Mission, Action } from "@/types";

// Profile component
const Profile: React.FC = () => {
  // Use the useWallet hook to get the wallet address
  const { address = null } = useWallet();

  // Use the useRawRequest hook to fetch actions and missions data for the user
  const { actions = [], missions = [] }: ProfileResponseData =
    useRawRequest({
      query: gql`
        query MyQuery($userId: String!, $appId: String!) {
          actions(where: { user: $userId, app: $appId }) {
            type_id
            amount
          }
          missions(where: { user: $userId, app: $appId }) {
            type_id
          }
        }
      `,
      variables: {
        userId: address?.toLocaleLowerCase(),
        appId: process.env.NEXT_PUBLIC_APP_ID,
      },
    }).data || {};

  // Calculate the action counts and tokens earned by the user
  const calculateActionCountsAndTokens = (actions: Action[]) => {
    const actionTypes: Record<string, number> = {};
    let totalTokens = 0;
    actions.forEach((action) => {
      actionTypes[action.type_id] = (actionTypes[action.type_id] || 0) + 1;
      totalTokens += Number(action.amount);
    });
    return { actionTypes, totalTokens };
  };

  // Calculate the number of completed missions
  const { actionTypes, totalTokens } = calculateActionCountsAndTokens(actions);
  const missionsCompleted = missions.length;

  return (
    <>
      {/* Set the page title */}
      <Head>
        <title>Profile</title>
      </Head>
      {/* Main content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center m-4">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Profile
            </h1>
            <a className="text-gray-500">{address?.toLocaleLowerCase()}</a>
          </div>
        </div>
        <div className="m-4 sm:flex sm:flex-wrap sm:-mx-6 lg:-mx-8">
          {address ? (
            <>
              <div className="overflow-hidden mt-4 sm:mt-0  sm:w-1/2 sm:px-6 lg:px-8">
                <div className="p-4 bg-gray-100 mb-2 rounded-lg ">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Tokens Earned
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {totalTokens} xp tokens
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
                      ([type_id, count]: [string, number]) => (
                        <li key={type_id} className="py-2">
                          {type_id}, Completed: {count}
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
                    {missions.map((mission: Mission, index: number) => (
                      <li key={index} className="py-2">
                        {mission.type_id}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div>
              <p>Please connect your wallet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
