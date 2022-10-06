import React, { FC } from 'react';
import { FieldProps } from 'formik';

import StatSlider from '../StatSlider/StatSlider';

interface IProps extends FieldProps {
  disabled?: boolean,
}

const SliderInput: FC<IProps> = (
  {
    form: { setFieldValue },
    field,
    disabled = false,
  },
) => {
  const onChange = (value: number): void => {
    setFieldValue(field.name, value);
  };

  return (
    <StatSlider
      onChange={onChange}
      disabled={disabled}
      defaultValue={field.value}
    />
  );
};

export default SliderInput;
