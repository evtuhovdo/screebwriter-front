import React, { FC, useCallback } from 'react';
import { Values } from '../../MainForm/interfaces';
import { useFormikContext } from 'formik';
import cloneDeep from 'lodash/cloneDeep';
import { initialGeneratedNPC } from '../../../helpres/initialValues';

interface IProps {

}

const AddNpcButton: FC<IProps> = () => {
  const { values, setValues } = useFormikContext<Values>();
  const _onAddNPC = useCallback(() => {

    const generatedNpc = (values.generatedNpc && [ ...values.generatedNpc ]) || [];
    generatedNpc.push(cloneDeep(initialGeneratedNPC));
    const newValues = { ...values, generatedNpc };


    setValues(newValues);
  }, [values, setValues]);

  return (
    <div className="column column--add">
      <div className="button-wrapper">
        <div className="button" role="button" onClick={_onAddNPC}/>
      </div>

      <div className="add-npc-title">Add NPC</div>
    </div>
  );
};

export default React.memo(AddNpcButton);
