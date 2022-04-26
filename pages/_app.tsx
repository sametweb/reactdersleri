import "styles/globals.css";
import type { AppProps } from "next/app";
import { getSession, SessionProvider } from "next-auth/react";
import { GetServerSideProps } from "next";

function MyApp({ Component, pageProps }: AppProps) {
  const { session, ...props } = pageProps;

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

export default MyApp;
