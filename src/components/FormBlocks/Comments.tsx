import React, { FC, useEffect, useState } from 'react';
import StoryCommentSection from '../StoryCommentSection/StoryCommentSection';
import { ADMIN, AUTHOR, EDITOR } from '../../helpres/roles';
import { StoryStatus } from '../../Api/ApiClient';

interface IProps {
  storyId: string,
  storyStatus: StoryStatus,
  role: string,
}

const Comments: FC<IProps> = ({ storyId, role, storyStatus}) => {
  const [ canAddComments, setCanAddComments ] = useState(false);

  useEffect(() => {
    if (role === ADMIN) {
      setCanAddComments(true);
      return;
    }

    if (storyStatus) {
      if (role === AUTHOR) {
        if ([
          StoryStatus.DRAFT,
          StoryStatus.REJECTED,
          StoryStatus.WAIT_FOR_APPROVE,
        ].includes(storyStatus)) {
          setCanAddComments(true);
          return;
        }

        setCanAddComments(false);
        return;
      }

      if (role === EDITOR) {
        if ([
          StoryStatus.WAIT_FOR_APPROVE,
          StoryStatus.REJECTED,
          StoryStatus.WAIT_PROOFREADING_OF_PAID,
          StoryStatus.IN_PROOFREADING_OF_PAID,
          StoryStatus.PROOFREADING_OF_PAID_DONE,
        ].includes(storyStatus)) {
          setCanAddComments(true);
          return;
        }

        setCanAddComments(false);
        return;
      }
    }
  }, [ storyStatus, role, setCanAddComments ]);

  return (
    <div>
        <StoryCommentSection
          storyId={storyId}
          canAddComments={canAddComments}
        />
    </div>
  );
};

export default React.memo(Comments);
