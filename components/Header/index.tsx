import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as nextAuth from "next-auth/react";
import styles from "./Header.module.scss";
import Image from "next/image";
import logo from "assets/logo.png";
import Link from "next/link";
import classNames from "classnames";
import {
  UserCircleIcon,
  UserIcon,
  ViewGridIcon,
  LoginIcon,
  LogoutIcon,
  MoonIcon as DarkModeIcon,
} from "@heroicons/react/solid";
import { MoonIcon as LightModeIcon } from "@heroicons/react/outline";
const { signIn, signOut } = nextAuth;

interface Props {
  isLoggedIn: Boolean;
}

function Header(props: Props) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuContainerRef = useRef<HTMLDivElement | null>(null);

  const { isLoggedIn } = props;
  const { data } = nextAuth.useSession();

  const toggleUserMenu = useCallback(() => setUserMenuOpen((open) => !open), []);

  const user = useMemo(() => data?.user ?? { image: "", name: "" }, [data]);

  const userMenuStyles = classNames(styles.userMenu, {
    [styles.userMenuOpen]: userMenuOpen,
  });

  useEffect(() => {
    const containerElement = userMenuContainerRef.current;
    const handleClick = (e: MouseEvent) => {
      if (containerElement && e.target && !containerElement.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

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
        <div ref={userMenuContainerRef} className={styles.userMenuContainer}>
          {isLoggedIn ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image ?? ""}
              alt={user.name ?? ""}
              className={styles.avatar}
              onClick={toggleUserMenu}
            />
          ) : (
            <div className={styles.avatar} onClick={toggleUserMenu}>
              <UserCircleIcon className="w-7" />
            </div>
          )}
          <ul className={userMenuStyles}>
            {!isLoggedIn ? (
              <li className={styles.menuItem} onClick={() => signIn()}>
                <LoginIcon className={styles.loginIcon} />
                Login
              </li>
            ) : (
              <>
                <li className={styles.menuItem}>
                  <UserIcon className={styles.menuItemIcon} />
                  Edit Profile
                </li>
                <li className={styles.menuItem}>
                  <ViewGridIcon className={styles.menuItemIcon} />
                  Dashboard
                </li>
                <li className={styles.menuItem} onClick={() => signOut()}>
                  <LogoutIcon className={styles.menuItemIcon} />
                  Logout
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
