import React from "react";

import MainStore from "stores/MainStore";
import CatalogStore from "stores/CatalogStore";

export const stores = Object.freeze({
  mainStore: new MainStore(),
  catalogStore: new CatalogStore(),
});

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;
