import React from "react";
import Link from "next/link";
import Login from "./auth/Login";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <nav>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            justifyContent: "center",
          }}
        >
          <li style={{ marginRight: "1rem" }}>
            <Link href="/">Home</Link>
          </li>
          <li style={{ marginRight: "1rem" }}>
            <Link href="/leaderboard">Leaderboard</Link>
          </li>
          <li style={{ marginRight: "1rem" }}>
            <Link href="/profile">Profile</Link>
          </li>
          <li>
            <Link href="/admin">Admin</Link>
          </li>
          <li>
            <Login />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
