import React, { FC, HTMLInputTypeAttribute } from 'react';
import { FieldProps } from 'formik';
import cn from 'classnames';
import get from 'lodash/get';
// import isEqual from 'lodash/isEqual';

import './TextareaInput.scss';

interface IProps extends FieldProps {
  label?: string,
  placeholder?: string,
  disabled?: boolean,
  autoComplete?: string,
  type?: HTMLInputTypeAttribute,
  className?: string,
  symbolLimit?: number,
}

const TextareaInput: FC<IProps> = (
  {
    label = '',
    form: { touched, errors, submitCount },
    field,
    placeholder = '',
    disabled = false,
    autoComplete = '',
    className,
    symbolLimit,
  },
) => {
  const isTouched = submitCount > 0 || get(touched, field.name);
  const errorMessage = get(errors, field.name);
  const hasError = isTouched && errorMessage;

  return (
    <div
      className={cn([
        'TextareaInput',
        hasError && 'TextareaInput--withError',
        className,
      ])}
    >
      {label.length > 0 && (
        <div className="TextareaInput__label">{label}</div>
      )}
      <textarea
        autoComplete={autoComplete}
        className="TextareaInput__input"
        placeholder={placeholder}
        disabled={disabled}
        {...field}
      />
      {(hasError || Boolean(symbolLimit)) && (
        <div className="TextareaInput__error">
          <div className="TextareaInput__error__message">{hasError && errorMessage}</div>
          {symbolLimit && (
            <div
              className={cn([ 'TextareaInput__symbolCount', field.value.length > symbolLimit && 'TextareaInput__symbolCount__limit' ])}>
              {`${field.value.length}/${symbolLimit}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(TextareaInput);
