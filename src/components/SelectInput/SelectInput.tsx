import React, { FC, useCallback, useMemo } from 'react';
import { FieldProps } from 'formik';
import './SelectInput.scss';
import { OnChangeValue } from 'react-select/dist/declarations/src/types';
import get from 'lodash/get';
import isEqualWith from 'lodash/isEqualWith';
import isObject from 'lodash/isObject';
import filter from 'lodash/filter';
import find from 'lodash/find';
import PureSelect from './PureSelect';

export interface ISelectOption {
  // WRONG declaration 
  value: string | number | object,
  label: string,

  //TODO: CORRECT declaration 
  // value: string ,
  // label: string,
}

interface IProps extends FieldProps {
  label?: string,
  options: ISelectOption[],
  placeholder?: string,
  disabled?: boolean,
  isMulti?: boolean,
  isClearable?: boolean,
  isDisabledFieldByTemplate?: (fieldName: string) => boolean,
}

const SelectInput: FC<IProps> = (
  {
    field,
    form,
    placeholder = 'Select...',
    label = '',
    options,
    disabled: _disabled = false,
    isMulti = false,
    isClearable = false,
    isDisabledFieldByTemplate,
  },
) => {
  const value = field.value;
  const disabled = _disabled || (!!isDisabledFieldByTemplate && isDisabledFieldByTemplate(field.name));

  const selectOptions = useMemo(() => {
    if (!value) {
      return options;
    }

    if (!isMulti) {
      const notHaveSelectedOptionInOptions = !find(options, value);
      if (notHaveSelectedOptionInOptions) {
        return [
          ...options,
          value,
        ];
      }

      return options;
    }

    if (!Array.isArray(value)) {
      return options;
    }


    let result = [
      ...options,
    ];

    for (let i = 0; i < value.length; i++) {
      const notHaveSelectedOptionInOptions = !find(options, value[i]);
      if (notHaveSelectedOptionInOptions) {
        result = [
          ...result,
          value[i],
        ];
      }
    }

    return result;
  }, [ value, options, isMulti ]);

  const { setFieldTouched, setFieldValue } = form;
  const fieldName = field.name;

  const onChange = useCallback((newValue: OnChangeValue<ISelectOption, false>) => {
    setFieldTouched(fieldName);
    if (!newValue) {
      if (isMulti) {
        setFieldValue(fieldName, []);
      } else {
        setFieldValue(fieldName, '');
      }
    } else {
      if (isMulti) {
        setFieldValue(fieldName, newValue);
      } else {
        setFieldValue(fieldName, newValue.value);
      }
    }
  }, [ setFieldTouched, fieldName, setFieldValue, isMulti ]);

  const selectedOption = useMemo(() => {
    return selectOptions ? selectOptions.filter(option => {
      if (isObject(option.value)) {
        if (isMulti) {
          const matches = filter(value, item => isEqualWith(option.value, item.value));

          return matches.length > 0;
        } else {
          return isEqualWith(option.value, value);
        }
      }

      return option.value === value;
    }) : undefined;
  }, [selectOptions, value, isMulti]);

  const isTouched = form.submitCount > 0 || Boolean(get(form.touched, fieldName));
  const errorMessage = get(form.errors, fieldName) || '';
  const hasError = isTouched && errorMessage;

  return (
    <div className="SelectInput">
      {label.length > 0 && (
        <div className="SelectInput__label">{label}</div>
      )}
      <PureSelect
        isClearable={isClearable}
        isMulti={isMulti}
        name={fieldName}
        placeholder={placeholder}
        options={selectOptions}
        onBlur={field.onBlur}
        onChange={onChange}
        value={selectedOption}
        isDisabled={disabled}
      />
      {hasError && (
        <div className="SelectInput__error">
          <div className="SelectInput__error__message">{errorMessage}</div>
        </div>
      )}
    </div>
  );
};

export default SelectInput;
