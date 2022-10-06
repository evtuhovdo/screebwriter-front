import React, { FC, useContext } from 'react';
import { useFormikContext } from 'formik';
import { Values } from '../MainForm/interfaces';
import GenerateNPCForm from './GenerateNPCForm';
import useIsDisabledFieldByTemplate from '../../hooks/useIsDisabledFieldByTemplate';
import { StoryContext } from '../../context/StoryContext';

interface IProps {
  isDisabled: boolean,
}

const GenerateNPCFormHOC: FC<IProps> = ({ isDisabled }) => {
  const { values } = useFormikContext<Values>();

  const { generatedNpc } = values;
  const npcCount = (generatedNpc && generatedNpc.length) || 0;

  const story = useContext(StoryContext);
  const { isDisabledFieldByTemplate, template } = useIsDisabledFieldByTemplate(story, values.template?.value);

  const hasTemplate = !!template;

  return (
    <GenerateNPCForm
      hasTemplate={hasTemplate}
      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
      generatedNpcCount={npcCount}
      isDisabled={isDisabled}
    />
  );
};

export default React.memo(GenerateNPCFormHOC);
