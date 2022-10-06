import React, { DragEventHandler, FC } from 'react';

import './Tag.scss';

interface IProps {
  value: string;
}

const Tag: FC<IProps> = ({ value }) => {
  const onDragStart: DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.setData('text/plain', value);
  };

  return (
    <div
      className="Tag"
      draggable={true}
      onDragStart={onDragStart}
    >
      {value}
    </div>
  );
};

export default Tag;
