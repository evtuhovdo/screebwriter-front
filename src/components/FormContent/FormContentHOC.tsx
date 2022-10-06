import React, { FC } from 'react';
import { IStory, StoryStatus } from '../../Api/ApiClient';
import { Values } from '../MainForm/interfaces';
import useIsDisabled from './useIsDisabled';
import useValidateFormOnMount from './useValidateFormOnMount';
import FormContent from './FormContent';
import { StoryContext } from '../../context/StoryContext';

interface IProps {
  story?: IStory,
  canDoTwoOptions: boolean,
  sendWithErrors: (values: Values, resetForm: () => void, status: StoryStatus, storyId?: string) => void,
  onSaveWithoutValidation: (values: Values, resetForm: any, status: StoryStatus, name?: string, available?: boolean) => Promise<false | IStory>,
  role: string,
}

const FormContentHOC: FC<IProps> = (
  {
    onSaveWithoutValidation,
    story,
    canDoTwoOptions,
    sendWithErrors,
    role,
  },
) => {
  const isDisabled = useIsDisabled(role, story?.status);

  useValidateFormOnMount(story?.id);

  return (
    <StoryContext.Provider value={story}>
      <FormContent
        story={story}
        isDisabled={isDisabled}
        canDoTwoOptions={canDoTwoOptions}
        sendWithErrors={sendWithErrors}
        onSaveWithoutValidation={onSaveWithoutValidation}
        role={role}
      />
    </StoryContext.Provider>
  );
};

export default React.memo(FormContentHOC);
