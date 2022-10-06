import React, { ButtonHTMLAttributes, FC } from 'react';
import cn from 'classnames';

import './Button.scss';

export enum IButtonVariant {
  PRIMARY = 'PRIMARY',
  OUTLINE = 'OUTLINE',
}

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean,
  type?: 'submit' | 'reset' | 'button',
  variant?: IButtonVariant
}

const Button: FC<IProps> = (
  {
    disabled = false,
    type = 'button',
    children,
    variant = IButtonVariant.PRIMARY,
    ...props
  },
) => {
  return (
    <button
      className={cn([
        'Button',
        variant === IButtonVariant.OUTLINE && 'Button--outline'
      ])}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
