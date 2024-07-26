import '../app/globals.css'
import { AppProps } from "next/app";
import Head from "next/head";

import { TurnkeyProvider } from "@turnkey/sdk-react";
import TurnkeyContextProvider from '@/context/turnkeyContext';
import nexaHeavy from '@/utils/font';
import ThetreContextProvider from '@/context/thetreContext';
import WalletContextProvider from '@/context/walletContext';
import Navbar from '@/components/navbar';

const turnkeyConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!,
  defaultOrganizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!,
  rpId: process.env.NEXT_PUBLIC_RPID!,
  serverSignUrl: process.env.NEXT_PUBLIC_SERVER_SIGN_URL!,
  iframeUrl: process.env.NEXT_PUBLIC_IFRAME_URL ?? "https://auth.turnkey.com",
};

function Thetre({ Component, pageProps }: AppProps) {

  return (
    <div className={nexaHeavy.variable}>
      <WalletContextProvider>
        <TurnkeyProvider config={turnkeyConfig}>
          <TurnkeyContextProvider>
            <ThetreContextProvider>
              <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <title>Thetre | A Decentralized Movie Experience</title>
              </Head>
              <Navbar/>
              <Component {...pageProps} />
            </ThetreContextProvider>
          </TurnkeyContextProvider>
        </TurnkeyProvider>
      </WalletContextProvider>
    </div>
  );
}

export default Thetre;
