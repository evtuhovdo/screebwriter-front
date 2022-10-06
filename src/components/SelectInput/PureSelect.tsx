import React, { FC } from 'react';
import Select from 'react-select';

interface IProps {
  isClearable: boolean,
  isMulti: boolean,
  name: string,
  placeholder: string,
  options: any,
  onBlur: any,
  onChange: any,
  value: any,
  isDisabled: boolean,
}

const PureSelect: FC<IProps> = (
  {
    isClearable,
    isMulti,
    name,
    placeholder,
    options,
    onBlur,
    onChange,
    value,
    isDisabled,
  },
) => {
  return (
    <Select
      isClearable={isClearable}
      isMulti={isMulti}
      name={name}
      placeholder={placeholder}
      options={options}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      isDisabled={isDisabled}
    />
  );
};

export default React.memo(PureSelect);
