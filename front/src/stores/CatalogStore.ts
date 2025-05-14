import { makeObservable, observable, action } from "mobx";

import { API_URL } from "constants/api";
import http from "service/axios";

class CatalogStore {
  constructor() {
    makeObservable(this, {
      getList: action,
      getFilterList: action,
      products: observable,
      product: observable,
      filters: observable,
    });
  }

  products: ICatalogProduct[] = [];
  product: ICatalogProduct | null = null;
  filters: ICatalogFilter | null = null;

  getFilterList() {
    return http.get(`${API_URL}/catalog/wine/filters`).then((response: any) => {
      this.filters = response.data;

      return this.filters;
    });
  }

  getList(searchParams: string) {
    return http
      .get(`${API_URL}/catalog/wine?${searchParams}`)
      .then((response: any) => {
        this.products = response.data.data;

        return this.products;
      });
  }

  getProduct(key: string) {
    return http
      .get(`${API_URL}/catalog/wine/product/${key}`)
      .then((response: any) => {
        this.product = response.data.data;

        return this.product;
      });
  }
}

export interface ICatalogFilter {
  [key: string]:
    | {
        min?: number;
        max?: number;
        filters: any;
      }
    | { key: string; name_ru: string; name_en: string; count: string }[];
}

export interface ICatalogProduct {
  image?: string;
  key: string;
  name_ru: string;
  name_en: string;
  style_ru: string;
  style_en: string | null;
  terroir_ru: string | null;
  terroir_en: string | null;
  vinification_ru: string | null;
  vinification_en: string | null;
  color: {
    key: string;
    rgb: string;
    name_ru: string;
    name_en: string;
    description_ru: string;
    description_en: string;
  };
  alcohol: { strength: number; key: string };
  volume: {
    key: string;
    volume: number;
    name_ru: string;
    name_en: string;
    description_ru: string;
    description_en: string;
  };
  cultivation: string | null;
  year: { key: string; year: number };
  sugar: {
    sugar_min_gl: string | null;
    sugar_max_gl: string | null;
    key: string;
    name_ru: string;
    name_en: string;
    description_ru: string;
    description_en: string;
  };
  variety: [{ key: string; name_ru: string; name_en: string; share: number }];
  winery: {
    key: string;
    name_ru: string;
    name_en: string;
    description_ru: string | null;
    description_en: string | null;
    country: {
      phone_code: number;
      latitude: number;
      longitude: number;
      area: number;
      independent: boolean;
      landlocked: boolean;
      native_common_name: string;
      native_official_name: string;
      cca2: string;
      ccn3: number;
      cca3: string;
      cioc: string;
      status: string;
      capital: string;
      region: string;
      subregion: string;
      common_name_en: string;
      official_name_en: string;
      common_name_ru: string;
      official_name_ru: string;
      common_name_kz: string | null;
      official_name_kz: string | null;
      demonym: string;
      flag: any;
    };
  };
  region: {
    key: string;
    name_ru: string;
    name_en: string;
    description_ru: string | null;
    description_en: string | null;
    parent: {
      key: string;
      name_ru: string;
      name_en: string;
      description_ru: string | null;
      description_en: string | null;
      parent: string | null;
    };
  };
  country: {
    phone_code: number;
    latitude: number;
    longitude: number;
    area: number;
    independent: boolean;
    landlocked: boolean;
    native_common_name: string;
    native_official_name: string;
    cca2: string;
    ccn3: number;
    cca3: string;
    cioc: string;
    status: string;
    capital: string;
    region: string;
    subregion: string;
    common_name_en: string;
    official_name_en: string;
    common_name_ru: string;
    official_name_ru: string;
    common_name_kz: string | null;
    official_name_kz: string | null;
    demonym: string;
    flag: any;
  };
  category: {
    key: string;
    name_ru: string;
    name_en: string | null;
    parent: {
      key: string;
      name_ru: string;
      name_en: string | null;
      parent: string | null;
    };
  };
  total_quantity: number;
  stockable: {
    uuid: string;
    sku: string;
    quantity: string;
    quantity_type: string;
    is_stop: boolean;
    prices: {
      type: string;
      price: string;
      discount: number;
      vat: string;
      currency: string;
      price_relevant_to: string | null;
      discount_relevant_to: string | null;
    }[];
  }[];
}

export default CatalogStore;
