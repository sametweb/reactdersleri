import Header from "components/Header";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";

interface Props {
  title?: string;
  description?: string;
}

const Layout: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {
    children,
    title = "React Dersleri",
    description = "Ucretsiz React dersleri izle",
  } = props;

  const { data: session } = useSession();

  const isLoggedIn = Boolean(session && session.user);
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header isLoggedIn={isLoggedIn} />
      {children}
    </div>
  );
};

export default Layout;
