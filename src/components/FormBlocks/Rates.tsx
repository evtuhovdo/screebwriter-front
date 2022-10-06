import React, { FC } from 'react';
import StoryRate, { scoreTypeEnum } from '../StoryRate';

interface IProps {
  storyId: string,
  storyAuthorId: string,
}

const Rates: FC<IProps> = ({ storyId, storyAuthorId }) => {
  return (
    <>
      <div className="Button-wrapper">
        <StoryRate
          type={scoreTypeEnum.FIRST}
          storyId={storyId}
          authorId={storyAuthorId}
        />
      </div>
      <div className="Button-wrapper">
        <StoryRate
          type={scoreTypeEnum.SECOND}
          storyId={storyId}
          authorId={storyAuthorId}
        />
      </div>
    </>
  );
};

export default React.memo(Rates);
