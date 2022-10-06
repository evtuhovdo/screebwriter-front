import React, {FC, useEffect} from 'react';
import each from 'lodash/each';
import ConditionGeneratedNPC from './ConditionGeneratedNPC';
import { useFormikContext } from 'formik';
import { Values } from '../../MainForm/interfaces';
import isEqual from "lodash/isEqual";

interface IProps {
  i: number,
  isDisabled: boolean,
  hasTemplate: boolean,
  setPopupVisible: (value: boolean) => void,
  isDisabledFieldByTemplate: (fieldName: string) => boolean,
}


const ConditionGeneratedNPCHOC: FC<IProps> = (
  {
    i,
    isDisabled,
    setPopupVisible,
    isDisabledFieldByTemplate,
    hasTemplate,
  },
) => {
  const { values, setValues } = useFormikContext<Values>();

  const npc = values.generatedNpc && values.generatedNpc[i];
  const optionsCount = values.options.length;

  useEffect(() => {
    if (!values.generatedNpc) {
        return;
    }

    const generatedNpc = [ ...values.generatedNpc ];

    each(
        generatedNpc,
        (npc) => {
            // если добавили новые опции, то нужно инциировать в массиве для них значения false
            for(let i = 0; i <= optionsCount - 1; i++) {
                if (npc.basic.changeNumber[i] === undefined) {
                    npc.basic.changeNumber[i] = false;
                }
            }

            // если убрали опцию, то нужно удалить лишние значения (удаляют всегда с конца)
            if (optionsCount !== npc.basic.changeNumber.length) {
                npc.basic.changeNumber.pop();
            }
        }
    );

    if (!isEqual(values.generatedNpc, generatedNpc)) {
        const newValues = { ...values, generatedNpc };
        setValues(newValues);
    }
  }, [optionsCount]);

  const npcCount = (values.generatedNpc && values.generatedNpc.length) || 0;

  if (!npc) {
      return null;
  }

  return (
    <ConditionGeneratedNPC
      hasTemplate={hasTemplate}
      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
      npcCount={npcCount}
      optionsCount={optionsCount}
      i={i}
      isDisabled={isDisabled}
      setPopupVisible={setPopupVisible}
      generatedNpc={npc}
    />
  );
};

export default React.memo(ConditionGeneratedNPCHOC);
