// components/Header.tsx

// Import necessary dependencies
import React from "react";
import Link from "next/link";
import Login from "./auth/Login";
import styles from "../styles/Header.module.css";
import { HeaderProps } from "@/types";

// Header component to display the site navigation bar
const Header: React.FC<HeaderProps> = () => {
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
            <Login />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
