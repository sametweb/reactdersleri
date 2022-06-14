import Header from "components/Header";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect } from "react";

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
    <div className="h-full bg-slate-50 dark:bg-gray-900">
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
