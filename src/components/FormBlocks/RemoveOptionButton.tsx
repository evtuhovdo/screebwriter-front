import React, { FC, useCallback } from 'react';
import { Values } from '../MainForm/interfaces';
import { useFormikContext } from 'formik';

interface IProps {

}

const RemoveOptionButton: FC<IProps> = () => {
  const {
    values,
    setValues,
  } = useFormikContext<Values>();

  const _onRemoveOption = useCallback(() => {
    const options = [ ...values.options ];
    options.pop();
    setValues({ ...values, options });
  }, [ values, setValues ]);

  return (
    <button
      type="button"
      className="remove"
      onClick={_onRemoveOption}
    />
  );
};

export default React.memo(RemoveOptionButton);
