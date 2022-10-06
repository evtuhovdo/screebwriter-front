import React, { FC } from 'react';
import AsyncSelect from 'react-select/async';

interface IProps {
  isClearable?: boolean,
  fieldName: string,
  placeholder?: string,
  promiseOptions: any,
  onBlur: any,
  onChange: any,
  value: any,
  disabled: boolean,
}

const PureAsyncSelect: FC<IProps> = (
  {
    isClearable = false,
    placeholder,
    fieldName,
    promiseOptions,
    onBlur,
    value,
    onChange,
    disabled,
    ...props
  },
) => {
  return (
    <AsyncSelect
      key={`${value}`}
      {...props}
      isClearable={isClearable}
      cacheOptions={true}
      defaultOptions={true}
      name={fieldName}
      placeholder={placeholder}
      loadOptions={promiseOptions}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      isDisabled={disabled}
    />
  );
};

export default React.memo(PureAsyncSelect);
