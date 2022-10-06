import React, { FC } from 'react';
import { FieldProps } from 'formik';
import cn from 'classnames';

import './CheckboxInput.scss';

interface IProps extends FieldProps {
  label?: string,
  disabled?: boolean,
  className?: string,
  isDisabledFieldByTemplate?: (fieldName: string) => boolean,
}

const CheckboxInput: FC<IProps> = (
  {
    label = '',
    form: { values, touched, errors },
    field,
    disabled: _disabled = false,
    className,
    isDisabledFieldByTemplate
  },
) => {
  const disabled = _disabled || (!!isDisabledFieldByTemplate && isDisabledFieldByTemplate(field.name));

  return (
    <div className={cn(['CheckboxInput', disabled && 'CheckboxInput--disabled', className])}>
      <input
        {...field}
        type="checkbox"
        id={field.name}
        disabled={disabled}
      />
      <label htmlFor={field.name}>
        {label}
      </label>
    </div>
  );
};

export default CheckboxInput;
