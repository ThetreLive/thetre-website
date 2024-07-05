import '../app/globals.css'
import { AppProps } from "next/app";
import Head from "next/head";

import { TurnkeyProvider } from "@turnkey/sdk-react";
import Navbar from '@/components/navbar';
import TurnkeyContextProvider from '@/context/turnkeyContext';

const turnkeyConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!,
  defaultOrganizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!,
  rpId: process.env.NEXT_PUBLIC_RPID!,
  serverSignUrl: process.env.NEXT_PUBLIC_SERVER_SIGN_URL!,
  iframeUrl: process.env.NEXT_PUBLIC_IFRAME_URL ?? "https://auth.turnkey.com", // not necessary for this example
};

function DemoEthersPasskeys({ Component, pageProps }: AppProps) {
  return (
    <div>
      <TurnkeyProvider config={turnkeyConfig}>
        <TurnkeyContextProvider>
          <Head>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          </Head>
          <Navbar/>
          <Component {...pageProps} />
        </TurnkeyContextProvider>
      </TurnkeyProvider>
    </div>
  );
}

export default DemoEthersPasskeys;
