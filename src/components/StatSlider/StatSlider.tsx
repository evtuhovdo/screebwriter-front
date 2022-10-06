import React, { FC, useState } from 'react';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

import './StatSlider.scss';

interface IProps {
  disabled?: boolean,
  defaultValue?: number,
  onChange: (value: number) => void,
}

const SliderWithTooltip = createSliderWithTooltip(Slider);


const tipFormatter = (value: number) => {
  if (value > 0) {
    return `+${value}`;
  }

  return value;
};

const StatSlider: FC<IProps> = (
  {
    defaultValue = 0,
    onChange,
    disabled = false,
  },
) => {
  const [ value, setValue ] = useState<number>(defaultValue);

  return (
    <SliderWithTooltip
      disabled={disabled}
      tipFormatter={tipFormatter}
      defaultValue={defaultValue}
      onChange={setValue}
      onAfterChange={onChange}
      min={-4}
      value={value}
      startPoint={0}
      step={1}
      max={4}
    />
  );
};

export default StatSlider;
