import React, { useState } from "react";
import Head from "next/head";
import CreateContract from "../components/admin/CreateContract";
import Contracts from "../components/admin/Contracts";
import { useLoggedInAddress } from "@/contexts/LoggedInAddressContext";
import { Button } from "@/components";

// Admin page component
const Admin: React.FC = () => {
  // Use the useWallet hook to get the user's wallet address
  const { loggedInAddress } = useLoggedInAddress();

  // Create a state to toggle the visibility of the Contracts component
  const [showContracts, setShowContracts] = useState(false);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Head>
        <title>Admin - OpenFormat Hello World Template</title>

        <meta
          property="og:url"
          content="https://github.com/open-format/hello-world"
        />
        <meta property="og:title" content="Open Format Template" />
        <meta
          property="og:description"
          content="An open-source template built using Next.js and the Open Format SDK. Check out the repository on GitHub for more information and to contribute."
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@openformat_tech" />
        <meta
          name="twitter:title"
          content="OpenFormat Hello World Template"
        />
        <meta
          name="twitter:description"
          content="An open-source template built using Next.js and the Open Format SDK. Check out the repository on GitHub for more information and to contribute."
        />
        {/* Image needs to be updated to direct link */}
        <meta name="twitter:image" content="/openformat.png" />
      </Head>

      <div className="sm:flex sm:items-center m-4">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Admin
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and view Tokens and Badges in your application.
          </p>
        </div>
        <Button
          disabled={false}
          onClick={() => setShowContracts(!showContracts)}
        >
          Create Contracts
        </Button>
      </div>
      {/* Check if the user's wallet is connected */}
      {loggedInAddress ? (
        // If the wallet is connected, display the CreateContract and Contracts components
        <div className="mx-auto sm:px-6 lg:px-8">
          {showContracts && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold leading-6 text-gray-900 m-4">
                Create Tokens and Badges
              </h2>
              <CreateContract />
            </div>
          )}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold leading-6 text-gray-900 m-4">
              Available Tokens and Badges
            </h2>
          </div>

          <div className="mt-8">
            <Contracts />
          </div>
        </div>
      ) : (
        // If the wallet is not connected, prompt the user to connect their wallet
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl text-gray-700">
            Please connect your wallet
          </p>
        </div>
      )}
    </div>
  );
};

// Export the Admin component as the default export
export default Admin;
