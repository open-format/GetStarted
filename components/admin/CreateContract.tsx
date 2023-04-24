import { AppData } from "@/types";
import {
  useOpenFormat,
  useRawRequest,
  useWallet,
} from "@openformat/react";
import { toWei } from "@openformat/sdk";
import { ethers } from "ethers";
import { gql } from "graphql-request";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// CreateContract component
const CreateContract: React.FC = () => {
  // Use raw request to fetch app data
  const { data } = useRawRequest<AppData, unknown>({
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
      const ownerId = data?.app?.owner?.id;
      if (ownerId) {
        setIsOwner(address.toLowerCase() === ownerId.toLowerCase());
      }
    }
  }, [address, data]);

  // Initialize form and state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [tokenType, setTokenType] = useState("BADGE");

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
      supply: toWei(formData.supply.toString()), // Convert supply to Wei
    };

    const token = await sdk.Reward.createRewardToken(params);
    const maxUint256 = ethers.constants.MaxUint256;
    token.approve({ spender: token.appId, amount: maxUint256 });
    // You can perform further operations, e.g., transfer, etc.
  };

  // Handle form submission
  const onSubmit = (formData: any) => {
    if (tokenType === "BADGE") {
      createERC721(formData);
    } else {
      createERC20(formData);
    }
  };

  // Render form
  return (
    <form className="m-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <label
          className="text-sm font-semibold text-gray-700"
          htmlFor="tokenType"
        >
          Token Type:
        </label>
        <select
          className="mt-1 p-2 border border-gray-300 rounded-md"
          id="tokenType"
          onChange={(e) => setTokenType(e.target.value)}
          value={tokenType}
        >
          <option value="BADGE">Badge</option>
          <option value="REWARD">Token</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label
          className="text-sm font-semibold text-gray-700"
          htmlFor="name"
        >
          Name:
        </label>
        <input
          className="mt-1 p-2 border border-gray-300 rounded-md"
          id="name"
          type="text"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">
            {(errors.name.message as string) || ""}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <label
          className="text-sm font-semibold text-gray-700"
          htmlFor="symbol"
        >
          Symbol:
        </label>
        <input
          className="mt-1 p-2 border border-gray-300 rounded-md"
          id="symbol"
          type="text"
          {...register("symbol", { required: "Symbol is required" })}
        />
        {errors.symbol && (
          <p className="mt-1 text-xs text-red-500">
            {(errors.symbol.message as string) || ""}
          </p>
        )}
      </div>

      {tokenType === "BADGE" && (
        <div className="flex flex-col">
          <label
            className="text-sm font-semibold text-gray-700"
            htmlFor="tokenURI"
          >
            TokenURI:
          </label>
          <input
            className="mt-1 p-2 border border-gray-300 rounded-md"
            id="tokenURI"
            type="text"
            {...register("tokenURI", {
              required: "tokenURI is required",
              min: 1,
            })}
          />
          {errors.supply && (
            <p className="mt-1 text-xs text-red-500">
              {(errors.supply.message as string) || ""}
            </p>
          )}
        </div>
      )}

      {tokenType === "REWARD" && (
        <div className="flex flex-col">
          <label
            className="text-sm font-semibold text-gray-700"
            htmlFor="supply"
          >
            Supply:
          </label>
          <input
            className="mt-1 p-2 border border-gray-300 rounded-md"
            id="supply"
            type="number"
            {...register("supply", {
              required: "Supply is required",
              min: 1,
            })}
          />
          {errors.supply && (
            <p className="mt-1 text-xs text-red-500">
              {(errors.supply.message as string) || ""}
            </p>
          )}
        </div>
      )}

      <div className="relative group">
        <button
          className={`w-full py-2 px-4 text-sm font-semibold text-white bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
            !isOwner ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={!isOwner} // Disable button if the user is not the owner
        >
          {!isOwner && "Only the app owner can create contracts"}
          {isOwner && "Create Contract"}
        </button>
      </div>
    </form>
  );
};

export default CreateContract;
