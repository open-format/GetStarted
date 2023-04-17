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
            margin: "10px",
          }}
        >
          <li style={{ margin: "1rem" }}>
            <Link href="/">Home</Link>
          </li>
          <li style={{ margin: "1rem" }}>
            <Link href="/profile">Profile</Link>
          </li>
          <li style={{ margin: "1rem" }}>
            <Link href="/admin">Admin</Link>
          </li>
          <li style={{ margin: "1rem" }}>
            <Link href="/leaderboard">Leaderboard</Link>
          </li>
          <li style={{ margin: "0.5rem" }}>
            <Login />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
