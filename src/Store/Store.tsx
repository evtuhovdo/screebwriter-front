import { Instance } from 'mobx-state-tree';
import { RootStore } from './RootStore';

export class Store {
  static create() {
    return RootStore.create();
  }
}


export interface Store extends Instance<typeof RootStore> {}
