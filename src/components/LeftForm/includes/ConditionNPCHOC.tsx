import React, { FC, useCallback } from 'react';
import ConditionNPC from './ConditionNPC';
import { useFormikContext } from 'formik';
import { EnumNPCType, Values } from '../../MainForm/interfaces';
import { FormikHandlers } from 'formik/dist/types';
import cloneDeep from 'lodash/cloneDeep';
import { initialNPCModeDoesNotExist, initialNPCModeExist } from '../../../helpres/initialValues';
import nameOfValues from '../../../helpres/nameOfValues';
import nameOf from '../../../helpres/nameOf';

interface IProps {
  i: number,
  isDisabled: boolean,
  hasTemplate: boolean,
  setPopupVisible: (value: boolean) => void,
  isDisabledFieldByTemplate: (fieldName: string) => boolean,
}


const ConditionNPCHOC: FC<IProps> = (
  {
    i,
    isDisabled,
    setPopupVisible,
    isDisabledFieldByTemplate,
    hasTemplate,
  },
) => {
  const { values, setFieldValue } = useFormikContext<Values>();

  const fieldName = nameOfValues(nameOf(() => values.npc[i]), i);

  const onChangeModeNPC = useCallback((e: React.ChangeEvent<any>, formikOnChange: FormikHandlers['handleChange']) => {
    formikOnChange(e);

    if (e.target.value === EnumNPCType.EXIST) {
      setFieldValue(fieldName, cloneDeep(initialNPCModeExist));
    } else {
      setFieldValue(fieldName, cloneDeep(initialNPCModeDoesNotExist));
    }
  }, [ setFieldValue, fieldName ]);

  const npc = values.npc[i];

  const npcCount = values.npc.length;

  return (
    <ConditionNPC
      hasTemplate={hasTemplate}
      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
      npcCount={npcCount}
      setFieldValue={setFieldValue}
      i={i}
      isDisabled={isDisabled}
      onChangeModeNPC={onChangeModeNPC}
      setPopupVisible={setPopupVisible}
      npc={npc}
    />
  );
};

export default React.memo(ConditionNPCHOC);
