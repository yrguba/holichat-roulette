import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { _isAuthenticated } from "service";
import MainLayout from "layout/MainLayout";

const PrivateRouteWithLayout = observer(() => {
  return _isAuthenticated() ? (
    <>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  ) : (
    <Navigate to="/authorization" />
  );
});

export default PrivateRouteWithLayout;
