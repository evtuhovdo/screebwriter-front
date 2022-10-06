import React, { FC } from 'react';
import { useInstance } from 'react-ioc';
import useSWR, { useSWRConfig } from 'swr';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { Button, Comment, Form, Icon, Header } from 'semantic-ui-react';

import ApiClient from '../../Api/ApiClient';
import 'semantic-ui-css/semantic.min.css';
import StoryComment from './StoryComment';
import { Store } from '../../Store/Store';

import './StoryCommentSection.scss';
import { observer } from 'mobx-react';
import normalizeComments from './normalizeComments';
import ClipLoader from 'react-spinners/ClipLoader';

interface IProps {
  storyId: string,
  canAddComments: boolean,
}

const StoryCommentSection: FC<IProps> = ({ storyId, canAddComments }) => {
  const { commentStore } = useInstance(Store);
  const apiClient = useInstance(ApiClient);

  const { data, error } = useSWR(`story-comments/${storyId}`, () => apiClient.fetchCommentsByStory(storyId));
  const { mutate } = useSWRConfig();
  const isLoading = !error && !data;

  const onAddComment = async (text: string, replyTo?: string) => {
    await apiClient.addCommentToStory(storyId, text, replyTo);
    if (replyTo) {
      commentStore.setReplyText('');
      commentStore.setReplyTo(null);
    } else {
      commentStore.setMainText('');
    }
    mutate(`story-comments/${storyId}`);
  };

  const onAddReply = (text: string, replyTo: string) => {
    onAddComment(text, replyTo);
  };

  const norm = normalizeComments(data);

  return (
    <div className="StoryCommentSection">
      {isLoading && (
        <div className="Loading">
          <ClipLoader
            color="#00AFB9"
            size={20}
          />
          {'\u00A0'}
          Loading comments...
        </div>
      )}
      {!isLoading && (
        <React.Fragment>
          <Header as='h3' dividing>
            Comments
          </Header>
          <Comment.Group threaded>
            {norm && map(filter(norm, item => !item.parentComment), comment => (
              <StoryComment
                canAddComments={canAddComments}
                onAddReply={onAddReply}
                key={comment.id}
                comment={comment}
              />
            ))}
          </Comment.Group>
          {canAddComments && (
            <Form reply>
              <Form.TextArea
                value={commentStore.mainText}
                onChange={(event) => commentStore.setMainText(event.target.value)}
              />
              <Button
                type="button"
                basic
                color="teal"
                disabled={commentStore.mainText.length === 0}
                onClick={() => {
                  onAddComment(commentStore.mainText);
                }}
              >
                <Icon name="comment"/> Add Comment
              </Button>
            </Form>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default observer(StoryCommentSection);
