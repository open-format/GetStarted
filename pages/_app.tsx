import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { Chains, OpenFormatProvider } from "@openformat/react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { LoggedInAddressProvider } from "../contexts/LoggedInAddressContext";
import { Toaster } from "react-hot-toast";
import { Roboto } from "next/font/google";
import { checkEnvVariables } from "../env-config";

// Load the Roboto font with specified weight and subset
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

// Main App component for the Next.js application
export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  checkEnvVariables(); // Check for missing or empty environment variables
  return (
    // Apply the Roboto font to the main container
    <main className={roboto.className}>
      <OpenFormatProvider
        config={{
          networks: [Chains.polygonMumbai],
          appId: process.env.NEXT_PUBLIC_APP_ID || "",
        }}
      >
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <LoggedInAddressProvider>
            <Header />
            <Component {...pageProps} />
            <Toaster />
          </LoggedInAddressProvider>
        </SessionContextProvider>
      </OpenFormatProvider>
    </main>
  );
}
