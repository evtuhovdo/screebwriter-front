import { Form } from 'formik';
import React, { FC } from 'react';

import MessageThatYouHaveFormError from '../MainForm/MessageThatYouHaveFormError';
import { Values } from '../MainForm/interfaces';
import { IStory, StoryStatus } from '../../Api/ApiClient';
import BeforeLeave from '../FormBlocks/BeforeLeave';
import CenterForm from '../FormBlocks/CenterForm';
import RightFormHOC from '../RightForm/RightFormHOC';
import LeftFormHOC from '../LeftForm/LeftFormHOC';
import GenerateNPCFormHOC from "../GenerateNPCForm/GenerateNPCFormHOC";

interface IProps {
  story?: IStory,
  canDoTwoOptions: boolean,
  sendWithErrors: (values: Values, resetForm: () => void, status: StoryStatus, storyId?: string) => void,
  onSaveWithoutValidation: (values: Values, resetForm: any, status: StoryStatus, name?: string, available?: boolean) => Promise<false | IStory>,
  role: string,
  isDisabled: boolean,
}

const FormContent: FC<IProps> = (
  {
    isDisabled,
    onSaveWithoutValidation,
    story,
    canDoTwoOptions,
    sendWithErrors,
    role,
  },
) => (
  <Form autoComplete="off">
    <MessageThatYouHaveFormError/>
    <BeforeLeave/>
      <GenerateNPCFormHOC
          isDisabled={isDisabled}
      />
    <LeftFormHOC
      isDisabled={isDisabled}
    />

    <RightFormHOC
      story={story}
      isDisabled={isDisabled}
    />
    <CenterForm
      story={story}
      isDisabled={isDisabled}
      canDoTwoOptions={canDoTwoOptions}
      role={role}
      sendWithErrors={sendWithErrors}
      onSaveWithoutValidation={onSaveWithoutValidation}
    />
  </Form>
);

export default React.memo(FormContent);
