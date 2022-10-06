import React, { FC } from 'react';
import { FieldProps } from 'formik';
import cn from 'classnames';
import get from 'lodash/get';

import './RadioInput.scss';
import { FormikHandlers } from 'formik/dist/types';

interface IProps extends FieldProps {
  label?: string,
  disabled?: boolean,
  className?: string,
  id: string,
  onChange?: (e: React.ChangeEvent<any>, formikOnChange: FormikHandlers['handleChange']) => void,
}

const RadioInput: FC<IProps> = (
  {
    id,
    label = '',
    form: { values, touched, errors },
    field,
    disabled = false,
    className,
    onChange,
  },
) => {
  const currentFormValue = get(values, field.name);

  const _onChange = (e: React.ChangeEvent<any>) => {
    if (onChange) {
      onChange(e, field.onChange);
      return;
    }

    return field.onChange(e);
  }

  return (
    <div className={cn(['RadioInput', className])}>
      <input
        checked={currentFormValue === field.value}
        {...field}
        onChange={_onChange}
        type="radio"
        id={id}
        disabled={disabled}
      />
      <label htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default RadioInput;
