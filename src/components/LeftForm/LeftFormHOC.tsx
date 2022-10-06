import React, { FC, useContext } from 'react';
import { useFormikContext } from 'formik';
import { Values } from '../MainForm/interfaces';
import LeftForm from './LeftForm';
import useIsDisabledFieldByTemplate from '../../hooks/useIsDisabledFieldByTemplate';
import { StoryContext } from '../../context/StoryContext';

interface IProps {
  isDisabled: boolean,
}

const LeftFormHOC: FC<IProps> = ({ isDisabled }) => {
  const { values, setFieldValue } = useFormikContext<Values>();

  const { mainCharacter, npc } = values;
  const npcCount = npc.length;

  const story = useContext(StoryContext);
  const { isDisabledFieldByTemplate, template } = useIsDisabledFieldByTemplate(story, values.template?.value);

  const hasTemplate = !!template;

  return (
    <LeftForm
      hasTemplate={hasTemplate}
      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
      setFieldValue={setFieldValue}
      mainCharacter={mainCharacter}
      npcCount={npcCount}
      isDisabled={isDisabled}
    />
  );
};

export default React.memo(LeftFormHOC);
