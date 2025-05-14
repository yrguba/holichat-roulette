import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";

import PrivateRouteWithLayout from "routes/PrivateRouteWithLayout";
import Main from "pages/main";

import "./styles/main.less";

const App = observer(() => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRouteWithLayout />}>
          <Route path="/" element={<Main key="main" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
});

export default App;
