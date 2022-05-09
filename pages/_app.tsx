import "styles/globals.css";
import type { AppProps } from "next/app";
import { getSession, SessionProvider } from "next-auth/react";
import { GetServerSideProps } from "next";

function MyApp({ Component, pageProps, ...theRest }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
