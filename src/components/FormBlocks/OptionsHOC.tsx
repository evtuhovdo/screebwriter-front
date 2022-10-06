import React, { FC, useContext, useMemo } from 'react';
import { useFormikContext } from 'formik';
import omit from 'lodash/omit';
import map from 'lodash/map';

import { Values } from '../MainForm/interfaces';
import Options from './Options';
import useIsDisabledFieldByTemplate from '../../hooks/useIsDisabledFieldByTemplate';
import { StoryContext } from '../../context/StoryContext';

interface IProps {
  canDoTwoOptions: boolean,
  isDisabled: boolean,
}

const OptionsHOC: FC<IProps> = (
  {
    isDisabled,
    canDoTwoOptions,
  },
) => {
  const { values } = useFormikContext<Values>();

  const { options } = values;
  const story = useContext(StoryContext);
  const { template } = useIsDisabledFieldByTemplate(story, values?.template?.value);

  const omittedOptions = useMemo(() => map(options, (option) => omit(option, [ 'npcChanges', 'mainCharacterChanges' ])), [ options ]);

  const hasTemplate = !!template;

  return (
    <Options
      template={template}
      hasTemplate={hasTemplate}
      options={omittedOptions}
      canDoTwoOptions={canDoTwoOptions}
      isDisabled={isDisabled}
    />
  );
};

export default React.memo(OptionsHOC);
