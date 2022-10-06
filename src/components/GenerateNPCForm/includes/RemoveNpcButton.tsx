import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { Values } from '../../MainForm/interfaces';
import { useFormikContext } from 'formik';

interface IProps {
  disabled?: boolean;
}

const RemoveNpcButton: FC<IProps> = ({ disabled }) => {
  const { values, setValues } = useFormikContext<Values>();

  const _onRemoveNPC = useCallback(() => {
    if (disabled) {
      return;
    }

    if (!values.generatedNpc) {
      return;
    }

    const generatedNpc = [ ...values.generatedNpc ];
    generatedNpc.pop();

    const newValues = { ...values, generatedNpc };

    setValues(newValues);
  }, [values, setValues, disabled]);

  return (
    <button
      type="button"
      className={cn('remove', disabled && 'disabled')}
      onClick={_onRemoveNPC}
    />
  );
};

export default React.memo(RemoveNpcButton);
