import { makeObservable, observable, action } from "mobx";

class MainStore {
  constructor() {
    makeObservable(this, {});
  }
}

export default MainStore;
