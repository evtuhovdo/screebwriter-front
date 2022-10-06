import {
  Instance, SnapshotIn, SnapshotOut, types as t,
} from 'mobx-state-tree';
import { CommentStore } from './CommentStore';

export const RootStore = t
  .model({
    commentStore: t.optional(CommentStore, {}),
  });


export interface IRootStoreModel extends Instance<typeof RootStore> {}
export interface IRootStoreModelSnapshotIn extends SnapshotIn<typeof RootStore> {}
export interface IRootStoreModelSnapshotOut extends SnapshotOut<typeof RootStore> {}
