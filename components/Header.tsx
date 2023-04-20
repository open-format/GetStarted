import { useWallet } from "@openformat/react";
import Link from "next/link";
import React from "react";
import styles from "../styles/Header.module.css";
import Login from "./auth/Login";

// Header component to display the site navigation bar
export default function Header() {
  const { isConnected } = useWallet();
  return (
    <header>
      <nav>
        <ul className={styles.header__list}>
          <li className={styles.header__item}>
            <Link className={styles.header__link} href="/">
              Home
            </Link>
          </li>
          <li className={styles.header__item}>
            <Link className={styles.header__link} href="/profile">
              Profile
            </Link>
          </li>
          <li className={styles.header__item}>
            <Link className={styles.header__link} href="/admin">
              Admin
            </Link>
          </li>
          <li className={styles.header__item}>
            <Link className={styles.header__link} href="/leaderboard">
              Leaderboard
            </Link>
          </li>
          <li className={styles.login__item}>
            {isConnected && <Login />}
          </li>
        </ul>
      </nav>
    </header>
  );
}
