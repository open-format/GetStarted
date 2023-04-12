import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { OpenFormatProvider } from "@openformat/react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <>
      <OpenFormatProvider
        config={{
          network: process.env.NEXT_PUBLIC_NETWORK,
          appId: process.env.NEXT_PUBLIC_APP_ID,
        }}
      >
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <Header />
          <Component {...pageProps} />
        </SessionContextProvider>
      </OpenFormatProvider>
    </>
  );
}
