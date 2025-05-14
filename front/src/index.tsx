import React, { PropsWithChildren } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import RU from "antd/locale/ru_RU";

import { StoresProvider, stores } from "stores";
import { GENERAL_TOKEN } from "theme/antdComponentTokens";

import App from "./App";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <StoresProvider value={stores}>
      <ConfigProvider
        theme={{
          token: GENERAL_TOKEN,
          //components: COMPONENTS_TOKEN,
        }}
        locale={RU}
      >
        {children}
      </ConfigProvider>
    </StoresProvider>
  );
};

const root = createRoot(document.getElementById("root") as Element);
root.render(
  <Providers>
    <App />
  </Providers>,
);
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    root.render(
      <Providers>
        <NextApp />
      </Providers>,
    );
  });
}
