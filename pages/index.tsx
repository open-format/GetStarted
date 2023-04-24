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
        <title>Hello World Starter</title>
        <meta
          name="description"
          content="This starter is an introduction into a new decentralised world and what we believe to be the starting point for 90% of all future applications. It's a front-end application that's built using NextJS and the Open Format SDK."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex justify-center items-center mx-auto">
        <GettingStarted tokenSystem={tokenSystem} />
      </main>
    </>
  );
}
