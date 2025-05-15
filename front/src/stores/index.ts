import React from "react";

import MainStore from "stores/MainStore";

export const stores = Object.freeze({
  mainStore: new MainStore(),
});

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;
