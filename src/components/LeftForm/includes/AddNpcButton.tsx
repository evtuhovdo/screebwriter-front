import React, { FC, useCallback } from 'react';
import { Values } from '../../MainForm/interfaces';
import { useFormikContext } from 'formik';
import cloneDeep from 'lodash/cloneDeep';
import { initialNPCChanges, initialNPCModeExist } from '../../../helpres/initialValues';

interface IProps {

}

const AddNpcButton: FC<IProps> = () => {
  const { values, setValues } = useFormikContext<Values>();

  const _onAddNPC = useCallback(() => {
    const npc = [ ...values.npc ];
    npc.push(cloneDeep(initialNPCModeExist));
    const newValues = { ...values, npc };
    for (let i = 0; i < newValues.options.length; i++) {
      newValues.options[i].npcChanges.push(cloneDeep(initialNPCChanges));
    }

    setValues(newValues);
  }, [values, setValues]);

  return (
    <div className="column column--add">
      <div className="button" role="button" onClick={_onAddNPC}/>
      <div className="add-npc-title">Add NPC</div>
    </div>
  );
};

export default React.memo(AddNpcButton);
