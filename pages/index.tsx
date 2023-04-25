import { GettingStarted } from "@/components";
import TokenSystem from "@/utils/TokenSystem";
import { useOpenFormat } from "@openformat/react";
import Head from "next/head";
import React from "react";

// Home page component
export default function Home() {
  // Use the useWallet and useOpenFormat hooks
  const { sdk } = useOpenFormat();

  // Initialize the TokenSystem with the OpenFormat SDK
  const tokenSystem = new TokenSystem(sdk);

  return (
    <>
      <Head>
        <title>Hello World Starter - OpenFormat Template</title>
        <meta
          name="description"
          content="This starter is an introduction into a new decentralized world and what we believe to be the starting point for 90% of all future applications. It's a front-end application that's built using Next.js and the Open Format SDK."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />

        <meta
          property="og:url"
          content="https://github.com/open-format/hello-world"
        />
        <meta
          property="og:title"
          content="OpenFormat Hello World Template"
        />
        <meta
          property="og:description"
          content="An open-source template built using Next.js and the Open Format SDK. Check out the repository on GitHub for more information and to contribute."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/openformat.png" />

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
      <main className="container flex justify-center items-center mx-auto">
        <GettingStarted tokenSystem={tokenSystem} />
      </main>
    </>
  );
}
