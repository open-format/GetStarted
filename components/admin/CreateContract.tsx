// components/admin/CreateContract.tsx
import { useOpenFormat } from "@openformat/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import styles from "../../styles/Contracts.module.css";

const CreateContract: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [tokenType, setTokenType] = useState("ERC721");

  const { sdk } = useOpenFormat();

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

  const onSubmit = (formData: any) => {
    if (tokenType === "ERC721") {
      createERC721(formData);
    } else {
      createERC20(formData);
    }
  };

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

      <button className={styles.button} type="submit">
        Create Contract
      </button>
    </form>
  );
};

export default CreateContract;
