import "@/styles/globals.css";
import { Chains, OpenFormatProvider } from "@openformat/react";
import type { AppProps } from "next/app";
import Header from "../components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <OpenFormatProvider
        config={{
          networks: [Chains.polygonMumbai],
          appId: process.env.NEXT_PUBLIC_APP_ID,
        }}
      >
        <Header />
        <Component {...pageProps} />
      </OpenFormatProvider>
    </>
  );
}
