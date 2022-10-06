import React, { FC, useCallback } from 'react';
import isNumber from 'lodash/isNumber';
import find from 'lodash/find';
import { FieldProps } from 'formik';
import { OnChangeValue } from 'react-select/dist/declarations/src/types';
import get from 'lodash/get';

import './SelectInput.scss';
import PureAsyncSelect from './PureAsyncSelect';

export interface ISelectOption {
  value: string,
  label: string,
}

interface IProps extends FieldProps {
  label?: string,
  placeholder?: string,
  disabled?: boolean,
  isClearable?: boolean,
  promiseOptions: () => Promise<ISelectOption[]>,
  options: any,
  isDisabledFieldByTemplate?: (fieldName: string) => boolean,
  onChangeCallback?: (newValue: any) => void,
}

const AsyncSelectInput: FC<IProps> = (
  {
    field,
    form,
    placeholder = 'Select...',
    label = '',
    disabled: _disabled = false,
    promiseOptions,
    isClearable = false,
    options,
    isDisabledFieldByTemplate,
    onChangeCallback,
    ...props
  },
) => {
  const disabled = _disabled || (!!isDisabledFieldByTemplate && isDisabledFieldByTemplate(field.name));

  const { setFieldTouched, setFieldValue } = form;

  const fieldName = field.name;

  const onChange = useCallback((newValue: OnChangeValue<ISelectOption, false>) => {
    setFieldTouched(fieldName, true);
    if (!newValue) {
      setFieldValue(fieldName, '');
      if (onChangeCallback) {
        onChangeCallback('');
      }
    } else {
      setFieldValue(fieldName, newValue);
      if (onChangeCallback) {
        onChangeCallback(newValue);
      }
    }
  }, [ setFieldTouched, setFieldValue, fieldName, onChangeCallback ]);

  const isTouched = form.submitCount > 0 || Boolean(get(form.touched, fieldName));
  const errorMessage = get(form.errors, fieldName) || '';
  const hasError = isTouched && errorMessage;

  let selectedValue = field.value;

  if (isNumber(field.value) && options) {
    selectedValue = find(options, { value: selectedValue });
  }

  return (
    <div className="SelectInput">
      {label.length > 0 && (
        <div className="SelectInput__label">{label}</div>
      )}
      <PureAsyncSelect
        {...props}
        isClearable={isClearable}
        fieldName={fieldName}
        placeholder={placeholder}
        promiseOptions={promiseOptions}
        onBlur={field.onBlur}
        onChange={onChange}
        value={selectedValue}
        disabled={disabled}
      />
      {hasError && (
        <div className="SelectInput__error">
          <div className="SelectInput__error__message">{errorMessage}</div>
        </div>
      )}
    </div>
  );
};

export default AsyncSelectInput;
