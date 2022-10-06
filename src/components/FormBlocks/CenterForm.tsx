import React, { FC } from 'react';
import StoryHeader from './StoryHeader';
import FormErrorsSpecBlock from './FormErrorsSpecBlock';
import CommonFormFields from './CommonFormFields';
import { ADMIN, EDITOR } from '../../helpres/roles';
import Rates from './Rates';
import { IStory, StoryStatus } from '../../Api/ApiClient';
import { Values } from '../MainForm/interfaces';
import TagsHOC from './TagsHOC';
import OptionsHOC from './OptionsHOC';
import ActionsHOC from './ActionsHOC';

interface IProps {
  story?: IStory;
  isDisabled: boolean,
  canDoTwoOptions: boolean,
  role: string,
  sendWithErrors: (values: Values, resetForm: () => void, status: StoryStatus, storyId?: string) => void,
  onSaveWithoutValidation: (values: Values, resetForm: any, status: StoryStatus, name?: string, available?: boolean) => Promise<false | IStory>,
}

const CenterForm: FC<IProps> = (
  {
    story,
    isDisabled,
    canDoTwoOptions,
    role,
    sendWithErrors,
    onSaveWithoutValidation,
  },
) => {
  return (
    <div className="centerForm">
      <div className="topRow">
        <div className="left">
          {story && <StoryHeader story={story}/>}
          <FormErrorsSpecBlock/>
          <CommonFormFields
            story={story}
            isDisabled={isDisabled}
            onSaveWithoutValidation={onSaveWithoutValidation}
          />
        </div>
        <TagsHOC/>
      </div>
      <div className="columns">
        <div className="column-labels">
          <div className="label">Options</div>
          <div className="label">Result</div>
          <div className="label">Diary Entry</div>
        </div>
        <OptionsHOC
          isDisabled={isDisabled}
          canDoTwoOptions={canDoTwoOptions}
        />
      </div>

      {story && (role === EDITOR || role === ADMIN) && (
        <Rates storyId={story.id} storyAuthorId={story.author.id}/>
      )}

      <ActionsHOC
        storyStatus={story?.status}
        storyId={story?.id}
        templateName={story?.templateName}
        templateAvailable={story?.available}
        isDisabled={isDisabled}
        role={role}
        onSaveWithoutValidation={onSaveWithoutValidation}
        sendWithErrors={sendWithErrors}
      />
    </div>
  );
};

export default React.memo(CenterForm);
