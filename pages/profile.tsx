import React from "react";
import Head from "next/head";
import { useRawRequest } from "@openformat/react";
import { gql } from "graphql-request";
import { useWallet } from "@openformat/react";

const Profile: React.FC = () => {
  const { address } = useWallet();

  const { data } = useRawRequest({
    query: gql`
      query MyQuery($userId: String!) {
        actions(where: { user: $userId }) {
          type_id
        }
        missions(where: { user: $userId }) {
          type_id
        }
      }
    `,
    variables: { userId: address?.toLocaleLowerCase() },
  });

  const countActionTypes = (actions) => {
    return actions.reduce((acc, action) => {
      acc[action.type_id] = (acc[action.type_id] || 0) + 1;
      return acc;
    }, {});
  };

  const actionsCount = data?.actions ? countActionTypes(data.actions) : {};

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      {address ? (
        <div>
          <h1>Profile</h1>
          <h2>Wallet Address:{address.toLocaleLowerCase()}</h2>
          <h3>Actions Completed:</h3>
          <ul>
            {Object.entries(actionsCount).map(([type_id, count]) => (
              <li key={type_id}>
                {type_id}, Completed: {count}
              </li>
            ))}
          </ul>
          <h3>Missions Completed:</h3>
          <ul>
            {data?.missions?.map((mission, index) => (
              <li key={index}>{mission.type_id}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1>You need to login first</h1>
        </div>
      )}
    </>
  );
};

export default Profile;
