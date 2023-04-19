import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { Chains, OpenFormatProvider } from "@openformat/react";
import { Toaster } from "react-hot-toast";
import { Roboto } from "next/font/google";

// Load the Roboto font with specified weight and subset
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

// Main App component for the Next.js application
export default function App({ Component, pageProps }: AppProps) {
  return (
    // Apply the Roboto font to the main container
    <main className={roboto.className}>
      <OpenFormatProvider
        config={{
          networks: [Chains.polygonMumbai],
          appId: process.env.NEXT_PUBLIC_APP_ID || "",
        }}
      >
        <Header />
        <Component {...pageProps} />
        <Toaster />
      </OpenFormatProvider>
    </main>
  );
}
