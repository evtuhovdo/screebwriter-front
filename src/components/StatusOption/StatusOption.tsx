import React, { FC, useMemo } from 'react';

import './StatusOption.scss';
import { StoryStatus } from '../../Api/ApiClient';
import getStatusColor from '../../helpres/getStatusColor';

interface IProps {
  status: StoryStatus,
}

const StatusOption: FC<IProps> = React.memo(({ status }) => {
  const backgroundStyle = useMemo(() => ({ background: getStatusColor(status) }), [ status ]);

  return (
    <div className="StatusOption">
      <div className="StatusOption__dot" style={backgroundStyle}/>
      <div className="StatusOption__label">{status}</div>
    </div>
  );
});

export const formatStatusOptionLabel = ({ value }: { value: StoryStatus}) => (<StatusOption status={value} />);

export default StatusOption;
