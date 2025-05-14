import React from "react";
import { Input } from "antd";

import LogoIcon from "components/icons/LogoIcon";

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
