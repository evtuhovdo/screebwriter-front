import React, { FC } from 'react';
import cn from 'classnames';
import { Checkbox } from 'antd';

import './StoryListItem.scss';

interface IProps {
  withBulk: boolean,
  allSelected: boolean,
  indeterminate: boolean,
  onCheckboxClick: () => void,
}

const StoryListItemHeader: FC<IProps> = ({ withBulk, indeterminate, allSelected, onCheckboxClick }) => {
  return (
    <div className={cn(['StoryListItem StoryListItem--header', withBulk && 'StoryListItem--withBulk'])}>
      {withBulk && (
        <div className="StoryListItem--header__text">
          <Checkbox
            indeterminate={indeterminate}
            checked={allSelected}
            onClick={onCheckboxClick}
          />
        </div>
      )}
      <div className="StoryListItem--header__text">Story text</div>
      <div className="StoryListItem--header__text">Status</div>
      <div className="StoryListItem--header__text">Creator</div>
      <div className="StoryListItem--header__text">Editor</div>
      <div className="StoryListItem--header__text">Last comment</div>
      <div className="StoryListItem--header__text">Ratings</div>
    </div>
  );
};

export default StoryListItemHeader;
