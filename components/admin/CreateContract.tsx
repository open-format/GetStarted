// components/admin/CreateContract.tsx
import { useOpenFormat } from "@openformat/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="tokenType">Token Type:</label>
      <select
        id="tokenType"
        onChange={(e) => setTokenType(e.target.value)}
        value={tokenType}
      >
        <option value="ERC721">Badge</option>
        <option value="ERC20">Token</option>
      </select>

      <label htmlFor="name">Name:</label>
      <input
        id="name"
        type="text"
        {...register("name", { required: "Name is required" })}
      />
      {errors.name && <p>{(errors.name.message as string) || ""}</p>}

      <label htmlFor="symbol">Symbol:</label>
      <input
        id="symbol"
        type="text"
        {...register("symbol", { required: "Symbol is required" })}
      />
      {errors.symbol && <p>{(errors.symbol.message as string) || ""}</p>}

      {tokenType === "ERC721" && (
        <>
          <label htmlFor="tokenURI">TokenURI:</label>
          <input
            id="tokenURI"
            type="text"
            {...register("tokenURI", {
              required: "tokenURI is required",
              min: 1,
            })}
          />
          {errors.supply && <p>{(errors.supply.message as string) || ""}</p>}
        </>
      )}

      {tokenType === "ERC20" && (
        <>
          <label htmlFor="supply">Supply:</label>
          <input
            id="supply"
            type="number"
            {...register("supply", {
              required: "Supply is required",
              min: 1,
            })}
          />
          {errors.supply && <p>{(errors.supply.message as string) || ""}</p>}
        </>
      )}

      <button type="submit">Create Contract</button>
    </form>
  );
};

export default CreateContract;
