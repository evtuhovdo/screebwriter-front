import {
  Instance, SnapshotIn, SnapshotOut, types as t,
} from 'mobx-state-tree';

export const CommentStore = t
  .model({
    replyText: t.optional(t.string, ''),
    mainText: t.optional(t.string, ''),
    replyTo: t.maybeNull(t.string),
  })
  .actions(((self) => ({
    setReplyText(value: string): void {
      self.replyText = value;
    },
    setMainText(value: string): void {
      self.mainText = value;
    },
    setReplyTo(commentId: string | null): void {
      self.replyTo = commentId;
    },
  })));


export interface ICommentStoreModel extends Instance<typeof CommentStore> {}
export interface ICommentStoreModelSnapshotIn extends SnapshotIn<typeof CommentStore> {}
export interface ICommentStoreModelSnapshotOut extends SnapshotOut<typeof CommentStore> {}
