import React from "react";
import Auth from "./auth/Login";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <h1>Header</h1>
      <Auth />
    </header>
  );
};

export default Header;
