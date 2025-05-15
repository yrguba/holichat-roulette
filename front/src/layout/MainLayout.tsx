import React, { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";

import Header from "components/header";

const MainLayout = ({}: PropsWithChildren) => {
  return (
    <div className="main-layout">
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
