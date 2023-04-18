// pages/profile.tsx
import React from "react";
import Head from "next/head";
import { useRawRequest, useWallet } from "@openformat/react";
import { gql } from "graphql-request";
import { ProfileResponseData, Mission, Action } from "@/types";
import styles from "../styles/Profile.module.css";

const Profile: React.FC = () => {
  const { address = null } = useWallet();

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

  const calculateActionCountsAndTokens = (actions: Action[]) => {
    const actionTypes: Record<string, number> = {};
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
      <div className={styles.profile}>
        <div className={styles.description}>
          <p>
            <code className={styles.code}>PROFILE</code>
          </p>
          <a className={styles.code}>{address?.toLocaleLowerCase()}</a>
        </div>

        {address ? (
          <div className={styles.main}>
            <div className={styles.container}>
              <h3 className={styles.h3}>Actions Completed:</h3>
              <ul className={styles.actionList}>
                {Object.entries(actionTypes).map(
                  ([type_id, count]: [string, number]) => (
                    <div key={type_id} className={styles.actionItem}>
                      {type_id}, Completed: {count}
                    </div>
                  )
                )}
              </ul>
              <h3 className={styles.h3}>Missions Completed:</h3>
              <ul className={styles.missionList}>
                {missions.map((mission: Mission, index: number) => (
                  <div key={index} className={styles.missionItem}>
                    {mission.type_id}
                  </div>
                ))}
              </ul>
              <h3 className={styles.h3}>
                Tokens Earned: {totalTokens} xp tokens
              </h3>
              <h3 className={styles.h3}>Badges Earned: {missionsCompleted}</h3>
            </div>
          </div>
        ) : (
          <div>
            <p>Please connect your wallet</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
