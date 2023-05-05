import React, { useState } from "react";
import { PrivateKeyProps } from "@/types";

const PrivateKey: React.FC<PrivateKeyProps> = ({ session }) => {
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmExport, setConfirmExport] = useState<boolean>(false);

  const fetchPrivateKey = async () => {
    try {
      const response = await fetch("/api/private-key", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPrivateKey(data.privateKey);
      } else {
        setError(data.error || "Error fetching private key");
      }
    } catch (error) {
      console.error("Error in fetchPrivateKey:", error);
      setError("Error fetching private key");
    }
  };

  const handleClick = () => {
    if (privateKey) {
      setPrivateKey(null);
      setConfirmExport(false);
    } else if (confirmExport) {
      fetchPrivateKey();
    } else {
      setConfirmExport(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 ">
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="bg-gray-100 m-2 w-30 mx-auto p-2 rounded-lg mx-auto hover:bg-gray-200 cursor-pointer transition-all duration-3000 "
        onClick={handleClick}
      >
        {privateKey
          ? "Hide Private Key"
          : confirmExport
          ? "Confirm"
          : "Show Private Key"}
      </button>
      {confirmExport && !privateKey && (
        <p className="text-xs flex text-red-400">
          Warning: Never disclose this key. Anyone with your private
          keys can steal any assets held in your account.
        </p>
      )}
      {privateKey && (
        <p className="text-xs flex">
          <span className="text-center break-words w-full">
            {privateKey}
          </span>
        </p>
      )}
    </div>
  );
};

export default PrivateKey;
