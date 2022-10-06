import React, { FC, useMemo } from 'react';
import { Tooltip } from 'antd';

import './ColorOption.scss';

interface IProps {
  color: string,
  label: string,
  description: string,
}

const ColorOption: FC<IProps> = ({ color, label, description }) => {
  const backgroundStyle = useMemo(() => ({ background: `#${color}` }), [ color ]);

  return (
    <Tooltip title={description} placement="right">
      <div className="ColorOption">
        <div className="ColorOption__dot" style={backgroundStyle}/>
        <div className="ColorOption__label">{label}</div>
      </div>
    </Tooltip>
  );
};

export const formatColorOptionLabel = ({ label, color, description }: any) => (
  <ColorOption label={label} color={color} description={description}/>);

export default ColorOption;
