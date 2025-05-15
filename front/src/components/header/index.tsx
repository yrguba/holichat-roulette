import React from "react";
import { Input } from "antd";

import LogoIcon from "components/icons/LogoIcon";
import SearchIcon from "components/icons/header/SearchIcon";
import StarIcon from "components/icons/header/StarIcon";
import FavoriteIcon from "components/icons/header/FavoriteIcon";
import CartIcon from "components/icons/header/CartIcon";
import UserIcon from "components/icons/header/UserIcon";

import "./styles.less";

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <LogoIcon />
      </div>
    </header>
  );
};

export default Header;
