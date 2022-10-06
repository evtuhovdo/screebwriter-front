import React, { FC, useCallback } from 'react';
import { Values } from '../../MainForm/interfaces';
import { useFormikContext } from 'formik';

interface IProps {

}

const RemoveNpcButton: FC<IProps> = () => {
  const { values, setValues } = useFormikContext<Values>();

  const _onRemoveNPC = useCallback(() => {
    const npc = [ ...values.npc ];
    npc.pop();

    const newValues = { ...values, npc };

    for (let i = 0; i < newValues.options.length; i++) {
      newValues.options[i].npcChanges.pop();
    }

    setValues(newValues);
  }, [values, setValues]);

  return (
    <button
      type="button"
      className="remove"
      onClick={_onRemoveNPC}
    />
  );
};

export default React.memo(RemoveNpcButton);
