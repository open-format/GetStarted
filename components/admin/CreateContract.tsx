import { useOpenFormat, useRawRequest, useWallet } from "@openformat/react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import styles from "../../styles/Contracts.module.css";
import { gql } from "graphql-request";

// CreateContract component
const CreateContract: React.FC = () => {
  // Use raw request to fetch app data
  const { data } = useRawRequest({
    query: gql`
      query MyQuery($appId: String!) {
        app(id: $appId) {
          owner {
            id
          }
        }
      }
    `,
    variables: { appId: process.env.NEXT_PUBLIC_APP_ID },
  });

  const { address } = useWallet();

  // New state variable to store whether the user is the owner
  const [isOwner, setIsOwner] = useState(false);

  // Compare address and owner Id and update isOwner state
  useEffect(() => {
    if (address && data) {
      const ownerId = data.app.owner.id;
      setIsOwner(address.toLowerCase() === ownerId.toLowerCase());
    }
  }, [address, data]);

  // Initialize form and state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [tokenType, setTokenType] = useState("ERC721");

  // Access OpenFormat SDK
  const { sdk } = useOpenFormat();

  // Function to create an ERC721 token
  const createERC721 = async (formData: {
    name: string;
    symbol: string;
    tokenURI: string;
  }) => {
    const params = {
      name: formData.name,
      symbol: formData.symbol,
      tokenURI: formData.tokenURI,
    };

    const NFT = await sdk.Reward.createBadge(params);
    // You can perform further operations, e.g., transfer, etc.
  };

  // Function to create an ERC20 token
  const createERC20 = async (formData: {
    name: string;
    symbol: string;
    supply: number;
  }) => {
    const params = {
      name: formData.name,
      symbol: formData.symbol,
      decimal: 18,
      supply: formData.supply,
    };

    const token = await sdk.Reward.createRewardToken(params);
    const maxUint256 = ethers.constants.MaxUint256;
    token.approve({ spender: token.appId, amount: maxUint256 });
    // You can perform further operations, e.g., transfer, etc.
  };

  // Handle form submission
  const onSubmit = (formData: any) => {
    if (tokenType === "ERC721") {
      createERC721(formData);
    } else {
      createERC20(formData);
    }
  };

  // Render form
  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="tokenType">
          Token Type:
        </label>
        <select
          className={styles.input}
          id="tokenType"
          onChange={(e) => setTokenType(e.target.value)}
          value={tokenType}
        >
          <option value="ERC721">Badge</option>
          <option value="ERC20">Token</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Name:
        </label>
        <input
          className={styles.input}
          id="name"
          type="text"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className={styles.error}>
            {(errors.name.message as string) || ""}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="symbol">
          Symbol:
        </label>
        <input
          className={styles.input}
          id="symbol"
          type="text"
          {...register("symbol", { required: "Symbol is required" })}
        />
        {errors.symbol && (
          <p className={styles.error}>
            {(errors.symbol.message as string) || ""}
          </p>
        )}
      </div>

      {tokenType === "ERC721" && (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="tokenURI">
            TokenURI:
          </label>
          <input
            className={styles.input}
            id="tokenURI"
            type="text"
            {...register("tokenURI", {
              required: "tokenURI is required",
              min: 1,
            })}
          />
          {errors.supply && (
            <p className={styles.error}>
              {(errors.supply.message as string) || ""}
            </p>
          )}
        </div>
      )}

      {tokenType === "ERC20" && (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="supply">
            Supply:
          </label>
          <input
            className={styles.input}
            id="supply"
            type="number"
            {...register("supply", {
              required: "Supply is required",
              min: 1,
            })}
          />
          {errors.supply && (
            <p className={styles.error}>
              {(errors.supply.message as string) || ""}
            </p>
          )}
        </div>
      )}

      <div className={`${styles.tooltip} `}>
        <button
          className={`${styles.button} ${
            !isOwner ? styles.buttonDisabled : ""
          }`}
          type="submit"
          disabled={!isOwner} // Disable button if the user is not the owner
        >
          Create Contract
        </button>
        {!isOwner && (
          <span className={styles.tooltiptext}>
            Only the app owner can create contracts
          </span>
        )}
      </div>
    </form>
  );
};

export default CreateContract;
