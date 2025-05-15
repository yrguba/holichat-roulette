import { makeObservable, observable, action } from "mobx";

import http from "service/axios";
import { API_URL } from "constants/api";

class MainStore {
  constructor() {
    makeObservable(this, {
      list: observable,
    });
  }

  list: any = [];

  getConnectionList() {
    return http.get(`${API_URL}/connections/list`).then((response: any) => {
      console.log(response.data.data);
      console.log(response.data);

      this.list = response.data.data;

      return this.list;
    });
  }

  refreshConnection(uuid: string, isWaiting: boolean) {
    return http
      .post(`${API_URL}/connections/${uuid}/refresh`, { isWaiting: isWaiting })
      .then((response: any) => {
        this.list = response.data.data;

        return this.list;
      });
  }
}

export default MainStore;
