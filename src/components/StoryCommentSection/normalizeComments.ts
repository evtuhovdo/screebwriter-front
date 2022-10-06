import { IComment } from '../../Api/ApiClient';

import { normalize, schema, denormalize } from 'normalizr';

const author = new schema.Entity('authors');
const story = new schema.Entity('stories');

const comment = new schema.Entity('comments', {
  author,
  story,
});

const answers = new schema.Array(comment);
comment.define({
  answers,
  parentComment: comment,
});

const commentsSchema = new schema.Array(comment);

const normalizeComments = (comments: IComment[] | undefined) => {
  if (!comments) {
    return;
  }

  const norm = normalize(comments, commentsSchema);

  return denormalize(norm.result, commentsSchema, norm.entities);
}

export default normalizeComments;
