import '../app/globals.css'
import { AppProps } from "next/app";
import Head from "next/head";

import { TurnkeyProvider } from "@turnkey/sdk-react";
import Navbar from '@/components/navbar';
import TurnkeyContextProvider from '@/context/turnkeyContext';
import Script from 'next/script';

const turnkeyConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!,
  defaultOrganizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!,
  rpId: process.env.NEXT_PUBLIC_RPID!,
  serverSignUrl: process.env.NEXT_PUBLIC_SERVER_SIGN_URL!,
  iframeUrl: process.env.NEXT_PUBLIC_IFRAME_URL ?? "https://auth.turnkey.com",
};

function DemoEthersPasskeys({ Component, pageProps }: AppProps) {
  return (
    <div>
      <TurnkeyProvider config={turnkeyConfig}>
        <TurnkeyContextProvider>
          <Head>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <title>Thetre | A Decentralized Movie Experience</title>
            <link href="https://vjs.zencdn.net/7.15.4/video-js.css" rel="stylesheet" />
            <Script src='https://vjs.zencdn.net/7.15.4/video.js'></Script>
            <Script src="https://cdn.jsdelivr.net/npm/hls.js@0.12.4"></Script>
            <Script src="https://d1ktbyo67sh8fw.cloudfront.net/js/theta.umd.min.js"></Script>
            <Script src="https://d1ktbyo67sh8fw.cloudfront.net/js/theta-hls-plugin.umd.min.js"></Script>
            <Script src="https://d1ktbyo67sh8fw.cloudfront.net/js/videojs-theta-plugin.min.js"></Script>
          </Head>
          <Navbar/>
          <Component {...pageProps} />
        </TurnkeyContextProvider>
      </TurnkeyProvider>
    </div>
  );
}

export default DemoEthersPasskeys;
