import React, { FC, useMemo } from 'react';
import { useFormikContext } from 'formik';
import map from 'lodash/map';
import omit from 'lodash/omit';
import { Values } from '../MainForm/interfaces';
import RightForm from './RightForm';
import { IStory } from '../../Api/ApiClient';
import useIsDisabledFieldByTemplate from '../../hooks/useIsDisabledFieldByTemplate';

interface IProps {
  isDisabled: boolean,
  story?: IStory,
}

const RightFormHOC: FC<IProps> = ({ isDisabled, story }) => {
  const { values  } = useFormikContext<Values>();

  const { options, npc } = values;

  const { isDisabledFieldByTemplate } = useIsDisabledFieldByTemplate(story, values?.template?.value);

  const npcs = useMemo(() => map(npc, (item) => ({
    type: item.type,
  })), [ npc ]);

  const optionsWithoutText = useMemo(() => map(options, (option) =>
    omit(option, [ 'option', 'result', 'diaryEntry' ]),
  ), [ options ]);

  return (
    <RightForm
      npcs={npcs}
      story={story}
      options={optionsWithoutText}
      isDisabled={isDisabled}
      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
    />
  );
};

export default React.memo(RightFormHOC);
