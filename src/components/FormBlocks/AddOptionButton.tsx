import React, { FC, useCallback } from 'react';
import { Values } from '../MainForm/interfaces';
import cloneDeep from 'lodash/cloneDeep';
import { initialOption } from '../../helpres/initialValues';
import { useFormikContext } from 'formik';

interface IProps {

}

const AddOptionButton: FC<IProps> = () => {
  const {
    values,
    setValues,
  } = useFormikContext<Values>();

  const _onAddOption = useCallback(() => {
    const options = [ ...values.options ];
    options.push(cloneDeep(initialOption));
    setValues({ ...values, options });
  }, [values, setValues]);

  return (
    <div
      className="column column--add"
      role="button"
      onClick={_onAddOption}
    />
  );
};

export default React.memo(AddOptionButton);
