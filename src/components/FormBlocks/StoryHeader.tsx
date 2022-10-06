import React, { FC, useMemo } from 'react';
import StatusCircle from '../StatusCircle/StatusCircle';
import formatDate from '../../helpres/formatDate';
import { IStory, StoryStatus } from '../../Api/ApiClient';

interface IProps {
  story: IStory;
}

const StoryHeader: FC<IProps> = ({ story }) => {
  const storyCreatedAt = useMemo(() => {
    if (!story) {
      return '';
    }

    return formatDate(story.createdAt);
  }, [ story ]);

  return (
    <React.Fragment>
      <div className="storyInfo">
        <div className="storyInfo__item">
          <div className="label">
            ID
          </div>
          <div className="value">
            {story.id}
          </div>
        </div>
        <div className="storyInfo__item">
          <div className="label">
            Status
          </div>
          <div className="value">
            <StatusCircle status={story.status}/>{story.status}
          </div>
        </div>

        <div className="storyInfo__item">
          <div className="label">
            Author
          </div>
          <div className="value">
            {story.author.username}
          </div>
        </div>

        {!story.authorFinishDate && (
          <div className="storyInfo__item">
            <div className="label">
              CreatedAt
            </div>
            <div className="value">
              {storyCreatedAt}
            </div>
          </div>
        )}
        {story.authorFinishDate && (
          <div className="storyInfo__item">
            <div className="label">
              Author finish at
            </div>
            <div className="value">
              {formatDate(story.authorFinishDate)}
            </div>
          </div>
        )}
      </div>
      {![ StoryStatus.TEMPLATE, StoryStatus.DRAFT, StoryStatus.WAIT_FOR_APPROVE, StoryStatus.REJECTED ].includes(story.status) && (
        <div className="storyInfo">
          {story.editor && (
            <div className="storyInfo__item">
              <div className="label">
                Editor
              </div>
              <div className="value">
                {story.editor.username}
              </div>
            </div>
          )}
          {story.proofreadingFinishDate && (
            <div className="storyInfo__item">
              <div className="label">
                Proofreading finish at
              </div>
              <div className="value">
                {formatDate(story.proofreadingFinishDate)}
              </div>
            </div>
          )}


          <div className="storyInfo__item">
            <div className="label">
              Fixed
            </div>
            <div className="value">
              {story.fixed ? 'yes' : 'no'}
            </div>
          </div>
        </div>
      )}
      {StoryStatus.TEMPLATE === story.status && (
        <div className="storyInfo">
          <div className="storyInfo__item">
            <div className="label">
              Template name
            </div>
            <div className="value">
              {story.templateName}
            </div>
          </div>

          <div className="storyInfo__item">
            <div className="label">
              Available
            </div>
            <div className="value">
              {story.available ? 'true' : 'false'}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default React.memo(StoryHeader);
