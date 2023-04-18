import React from "react";
import Head from "next/head";
import { useRawRequest, useWallet } from "@openformat/react";
import { gql } from "graphql-request";

const Profile: React.FC = () => {
  const { address = null } = useWallet();

  const { actions = [], missions = [] } =
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

  const calculateActionCountsAndTokens = (actions) => {
    const actionTypes = {};
    let totalTokens = 0;
    actions.forEach((action) => {
      actionTypes[action.type_id] = (actionTypes[action.type_id] || 0) + 1;
      totalTokens += Number(action.amount);
    });
    return { actionTypes, totalTokens };
  };

  const { actionTypes, totalTokens } = calculateActionCountsAndTokens(actions);
  const missionsCompleted = missions.length;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <h1>Profile</h1>
      {address ? (
        <div>
          <h2>Wallet Address: {`${address?.toLocaleLowerCase()}`}</h2>
          <h3>Actions Completed:</h3>
          <ul>
            {Object.entries(actionTypes).map(([type_id, count]) => (
              <li key={type_id}>
                {type_id}, Completed: {count}
              </li>
            ))}
          </ul>
          <h3>Missions Completed:</h3>
          <ul>
            {missions.map((mission, index) => (
              <li key={index}>{mission.type_id}</li>
            ))}
          </ul>
          <h3>Tokens Earned: {totalTokens} xp tokens</h3>
          <h3>Badges Earned: {missionsCompleted}</h3>
        </div>
      ) : (
        <div>
          <p>Please connect your wallet</p>
        </div>
      )}
    </>
  );
};

export default Profile;
