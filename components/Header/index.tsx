import React from "react";
import * as nextAuth from "next-auth/react";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "assets/logo.png";
import Link from "next/link";

const { signIn, signOut } = nextAuth;

interface Props {
  isLoggedIn: Boolean;
}

function Header(props: Props) {
  const { isLoggedIn } = props;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" passHref>
          <div className={styles.logo}>
            <div className={styles.image}>
              <Image src={logo} alt="React Dersleri" />
            </div>
            React Dersleri
          </div>
        </Link>
        <a className={styles.authLink} href="#" onClick={() => (isLoggedIn ? signOut() : signIn())}>
          Sign {isLoggedIn ? "out" : "in"}
        </a>
      </div>
    </header>
  );
}

export default Header;
