import React, { FC } from 'react';
import { Cascader } from 'antd';
import { CascaderProps } from 'antd/lib/cascader';
  
 interface IProps extends CascaderProps {
 }

/**CORRECT TS declaration for latest version of antd*/
// export type  IProps = CascaderProps  & {
//   onPopupVisibleChange?:any,
//   placeholder?:any,
//   onChange?:any,
//   value?:any,
//   disabled?:any,
//   options?:any,
// }

const PureCascaderInput: FC<IProps> = (
  {
    onPopupVisibleChange,
    placeholder,
    onChange,
    value,
    disabled,
    options,
  },
) => {
  return (
    <Cascader
      onPopupVisibleChange={onPopupVisibleChange}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      disabled={disabled}
      options={options}
      showSearch={true}
    />
  );
};

export default React.memo(PureCascaderInput);
