import React, { FC } from 'react';
import map from 'lodash/map';
import SpecificFormErrors from '../MainForm/SpecificFormErrors';
import { useFormikContext } from 'formik';
import { Values } from '../MainForm/interfaces';

interface IProps {

}

const FormErrorsSpecBlock: FC<IProps> = () => {
  const {
    values: { npc, options },
  } = useFormikContext<Values>();

  return (
    <>
      {map(npc, (npc, i) => (
        <SpecificFormErrors
          key={`npc[${i}].emptyConditions`}
          name={`npc[${i}].emptyConditions`}
        />
      ))}
      {map(options, (option, i) => (
        <SpecificFormErrors
          key={`option[${i}].mainCharacterChanges.dontHaveChanges`}
          name={`option[${i}].mainCharacterChanges.dontHaveChanges`}
        />
      ))}
    </>
  );
};

export default React.memo(FormErrorsSpecBlock);
