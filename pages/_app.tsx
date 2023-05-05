import "@/styles/globals.css";
import { Chains, OpenFormatProvider } from "@openformat/react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { LoggedInAddressProvider } from "../contexts/LoggedInAddressContext";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import { Header } from "../components";
import { checkEnvVariables } from "../env-config";

// This is due to Wagmi and SSR. We hope to fix this within the Open Format SDK soon.
// https://github.com/wagmi-dev/wagmi/issues/542#issuecomment-1144178142
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

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
  const isMounted = useIsMounted();
  if (!isMounted) return;
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
