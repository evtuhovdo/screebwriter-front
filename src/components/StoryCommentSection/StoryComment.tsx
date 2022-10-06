import React, { FC } from 'react';
import map from 'lodash/map';
import { Button, Comment, Form, Icon } from 'semantic-ui-react';
import { Button as AntButton } from 'antd';


import { IComment } from '../../Api/ApiClient';
import 'semantic-ui-css/semantic.min.css';
import { useInstances } from 'react-ioc';
import { Store } from '../../Store/Store';
import { observer } from 'mobx-react';

interface IProps {
  comment: IComment,
  canAddComments: boolean,
  onAddReply: (text: string, replyTo: string) => Promise<any> | any,
}

const StoryComment: FC<IProps> = ({ comment, onAddReply, canAddComments }) => {
  const [ { commentStore } ] = useInstances(Store);

  const { replyText, setReplyText, setReplyTo, replyTo } = commentStore;

  return (
    <React.Fragment>
      <Comment>
        <Comment.Avatar src={`https://eu.ui-avatars.com/api/?name=${encodeURIComponent(comment.author.username)}`}/>
        <Comment.Content>
          <Comment.Author as="span">{comment.author.username}</Comment.Author>
          <Comment.Metadata>
            <div>{comment.createdAt}</div>
          </Comment.Metadata>
          <Comment.Text>
            <p>
              {comment.text}
            </p>
          </Comment.Text>
          {canAddComments && (
            <Comment.Actions>
              <AntButton type="text" size="small" icon={<Icon disabled name="reply"/>}
                         onClick={() => setReplyTo(comment.id)}>Reply</AntButton>
            </Comment.Actions>
          )}
        </Comment.Content>
        {comment.answers.length > 0 && (
          <Comment.Group threaded>
            {map(comment.answers, (answer) => {
              return (
                <React.Fragment key={answer.id}>
                  <Comment>
                    <Comment.Avatar
                      src={`https://eu.ui-avatars.com/api/?name=${encodeURIComponent(answer.author.username)}`}/>
                    <Comment.Content>
                      <Comment.Author as="span">{answer.author.username}</Comment.Author>
                      <Comment.Metadata>
                        <div>{answer.createdAt}</div>
                      </Comment.Metadata>
                      <Comment.Text>
                        <p>
                          {answer.text}
                        </p>
                      </Comment.Text>
                      {canAddComments && (
                        <Comment.Action>
                          <AntButton type="text" size="small" icon={<Icon disabled name="reply"/>}
                                     onClick={() => setReplyTo(answer.id)}>Reply</AntButton>
                        </Comment.Action>
                      )}
                    </Comment.Content>
                    {answer.answers.length > 0 && (
                      <Comment.Group threaded>
                        {map(answer.answers, (answerSecondDeep) => (
                          <StoryComment
                            canAddComments={canAddComments}
                            onAddReply={onAddReply}
                            key={answerSecondDeep.id}
                            comment={answerSecondDeep}
                          />
                        ))}
                      </Comment.Group>
                    )}
                  </Comment>
                  {canAddComments && replyTo && replyTo.length > 0 && replyTo === answer.id && (
                    <Form reply>
                      <Form.TextArea
                        autoFocus
                        value={replyText}
                        onChange={(event) => {
                          setReplyText(event.target.value);
                        }}
                      />
                      <Button content="Add Reply" basic color="teal" type="button" icon="reply"
                              disabled={replyText.length === 0}
                              onClick={() => {
                                // @ts-ignore
                                onAddReply(replyText, replyTo);
                              }}
                      />
                    </Form>
                  )}
                </React.Fragment>
              );
            })}
          </Comment.Group>
        )}
      </Comment>
      {canAddComments && replyTo && replyTo === comment.id && (
        <Form reply>
          <Form.TextArea
            autoFocus
            value={replyText}
            onChange={(event) => {
              setReplyText(event.target.value);
            }}
          />
          <Button content="Add Reply" basic color="teal" type="button" icon="reply"
                  disabled={replyText.length === 0}
                  onClick={() => {
                    // @ts-ignore
                    onAddReply(replyText, replyTo);
                  }}
          />
        </Form>
      )}
    </React.Fragment>
  );
};

export default observer(StoryComment);
