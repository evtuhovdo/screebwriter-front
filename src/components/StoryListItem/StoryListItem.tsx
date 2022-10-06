import React, { FC, useMemo } from 'react';
import dateAndTime from 'date-and-time';
import { Checkbox, Tooltip } from 'antd';

import { useHistory } from 'react-router-dom';

import { IStory, StoryStatus } from '../../Api/ApiClient';
import StatusCircle from '../StatusCircle/StatusCircle';

import './StoryListItem.scss';
import cn from 'classnames';

interface IProps {
  story: IStory,
  withBulk: boolean;
  selected: boolean;
  onCheckboxClick: React.MouseEventHandler<HTMLElement>,
}

const StoryListItem: FC<IProps> = (
  {
    story,
    withBulk,
    selected,
    onCheckboxClick,
  },
) => {
  const history = useHistory();
  const onClick = () => {
    history.push(`story/${story.id}`);
  };

  const createdAt = useMemo(() => {
    const date = dateAndTime.parse(story.createdAt, 'YYYY-MM-DD[T]HH:mm:ss[.]SSS[Z]', true);

    return dateAndTime.format(date, 'DD.MM.YYYY HH:mm:ss');
  }, [ story.createdAt ]);

  const authorFinishDate = useMemo(() => {
    if (!story.authorFinishDate) {
      return '';
    }

    const date = dateAndTime.parse(story.authorFinishDate, 'YYYY-MM-DD[T]HH:mm:ss[.]SSS[Z]', true);

    return dateAndTime.format(date, 'DD.MM.YYYY HH:mm:ss');
  }, [ story.authorFinishDate ]);

  const proofreadingFinishDate = useMemo(() => {
    if (!story.proofreadingFinishDate) {
      return '';
    }

    const date = dateAndTime.parse(story.proofreadingFinishDate, 'YYYY-MM-DD[T]HH:mm:ss[.]SSS[Z]', true);

    return dateAndTime.format(date, 'DD.MM.YYYY HH:mm:ss');
  }, [ story.proofreadingFinishDate ]);

  const lastComment = (story.story_comments.length > 0 && story.story_comments[story.story_comments.length - 1].text) || '';

  return (
    <div className={cn([ 'StoryListItem', withBulk && 'StoryListItem--withBulk' ])} onClick={onClick}>
      {withBulk && (
        <div className="StoryListItem__text" onClick={onCheckboxClick}>
          <Checkbox
            checked={selected}
            onClick={onCheckboxClick}
          />
        </div>
      )}
      <div className="StoryListItem__text">
        {story.formData.storyText && (
          <Tooltip title={story.formData.storyText}>
            <div className="StoryListItem__storyText">
              {story.formData.storyText}
            </div>
          </Tooltip>
        )}
      </div>

      <div className="StoryListItem__text">
        <div className="StoryListItem__statusCell">
          {story.status === StoryStatus.TEMPLATE && (
            <div>
              <span>{story.templateName}</span><br/>
              <span>available: {story.available ? 'true' : 'false'}</span>
              <br/>
              <br/>
            </div>
          )}
          {story.template && (
            <div>
              {story.template.templateName}<br/><br/>
            </div>
          )}
          <StatusCircle status={story.status}/>{story.status}
        </div>
      </div>
      <div className="StoryListItem__text">
        <div className="many">
          <div>{story.author.username}</div>
          <div>createdAt<br/>{createdAt}</div>
          {authorFinishDate && (
            <div>finishedAt<br/>{authorFinishDate}</div>
          )}
        </div>
      </div>
      <div className="StoryListItem__text">
        <div className="many">
          {story.editor && (
            <div>{story.editor.username}</div>
          )}
          {proofreadingFinishDate && (
            <div>proofreadingFinishedAt:<br/>{proofreadingFinishDate}</div>
          )}
        </div>
      </div>
      <div className="StoryListItem__text">
        {lastComment && (
          <Tooltip title={lastComment}>
            <p className="StoryListItem__commentCell">
              {lastComment}
            </p>
          </Tooltip>
        )}
      </div>
      <div className="StoryListItem__text">
        <div>
          <span className="tiny-text">interesting</span><br/>{story.calculatedRatingOne}/10<br/><br/>
          <span className="tiny-text">settings & grammar</span> {story.calculatedRatingTwo}/10
        </div>
      </div>
    </div>
  );
};

export default StoryListItem;
