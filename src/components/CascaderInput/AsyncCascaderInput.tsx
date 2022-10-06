import React, { FC, useCallback } from 'react';
import { FieldProps } from 'formik';
import get from 'lodash/get';

import './CascaderInput.scss';
import useSWR from 'swr';
import PureCascaderInput from './PureCascaderInput';

export interface ICascaderOption {
  value: string,
  label: string,
  children?: ICascaderOption[],
}

interface IProps extends FieldProps {
  label?: string,
  placeholder?: string,
  disabled?: boolean,
  promiseOptions: () => Promise<ICascaderOption[]>,
  onPopupVisibleChange?: (popupVisible: boolean) => void,
  isDisabledFieldByTemplate?: (fieldName: string) => boolean,
}

const AsyncCascaderInput: FC<IProps> = (
  {
    field,
    form,
    placeholder = 'Select...',
    label = '',
    disabled: _disabled = false,
    promiseOptions,
    onPopupVisibleChange,
    isDisabledFieldByTemplate
  },
) => {
  const disabled = _disabled || (!!isDisabledFieldByTemplate && isDisabledFieldByTemplate(field.name));

  const fieldName = field.name;

  const { data, error } = useSWR(fieldName, promiseOptions, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const isLoading = !error && !data;

  const { setFieldTouched, setFieldValue } = form;

  const onChange = useCallback((newValue: any) => {
    setFieldTouched(fieldName, true);
    if (!newValue) {
      setFieldValue(fieldName, '');
    } else {
      setFieldValue(fieldName, newValue);
    }
  }, [ setFieldValue, setFieldTouched, fieldName ]);

  const isTouched = form.submitCount > 0 || Boolean(get(form.touched, fieldName));
  const errorMessage = get(form.errors, fieldName) || '';
  const hasError = isTouched && errorMessage;

  return (
    <div className="CascaderInput">
      {label.length > 0 && (
        <div className="CascaderInput__label">{label}</div>
      )}
       <PureCascaderInput
        onPopupVisibleChange={onPopupVisibleChange}
        placeholder={placeholder}
        onChange={onChange}
        value={field.value}
        disabled={disabled || isLoading}
        options={data || []}
      />
      {hasError && (
        <div className="CascaderInput__error">
          <div className="CascaderInput__error__message">{errorMessage}</div>
        </div>
      )}
    </div>
  );
};

export default AsyncCascaderInput;
