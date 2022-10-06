import React, { FC, HTMLInputTypeAttribute } from 'react';
import { FieldProps } from 'formik';
import cn from 'classnames';

import './TextInput.scss';
import get from 'lodash/get';

interface IProps extends FieldProps {
  label?: string,
  placeholder?: string,
  disabled?: boolean,
  autoComplete?: string,
  isDisabledFieldByTemplate?: (fieldName: string) => boolean,
  type?: HTMLInputTypeAttribute,
  small?: boolean,
}

const TextInput: FC<IProps> = (
  {
    label = '',
    form: { touched, errors, submitCount },
    field,
    type = 'text',
    placeholder = '',
    disabled: _disabled = false,
    autoComplete = '',
    small = false,
    isDisabledFieldByTemplate,
  },
) => {
  const isTouched = submitCount > 0 || get(touched, field.name);
  const errorMessage = get(errors, field.name);
  const hasError = isTouched && errorMessage;
  const disabled = _disabled || (!!isDisabledFieldByTemplate && isDisabledFieldByTemplate(field.name));

  return (
    <div className={cn([
      'TextInput',
      hasError && 'TextInput--withError',
      small && 'TextInput--small',
      disabled && 'TextInput--disabled',
    ])}>
      {label.length > 0 && (
        <div className="TextInput__label">{label}</div>
      )}
      <input
        autoComplete={autoComplete}
        className="TextInput__input"
        {...field}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
      />
      {hasError && (
        <div className="TextInput__error">
          <div className="TextInput__error__message">{errorMessage}</div>
        </div>
      )}
    </div>
  );
};

export default TextInput;
