import React, { FC, useMemo } from 'react';

import getStatusColor from '../../helpres/getStatusColor';
import { StoryStatus } from '../../Api/ApiClient';

import './StatusCircle.scss';

interface IProps {
  status: StoryStatus;
}

const StatusCircle: FC<IProps> = ({ status }) => {
  const statusColor = useMemo(() => getStatusColor(status), [ status ]);
  const statusStyle = useMemo(() => ({ background: statusColor }), [ statusColor ]);

  return (
    <div
      className="StatusCircle"
      style={statusStyle}
    />
  );
};

export default StatusCircle;
