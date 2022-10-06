import React, { FC } from 'react';
import { Formik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { useHistory } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';

import { Values } from './interfaces';
import validateMainForm, { validateFormBeforeSaveFinal } from './validateForm';

import './MainForm.scss';
import ApiClient, { IStory, StoryStatus } from '../../Api/ApiClient';
import { useInstance } from 'react-ioc';
import { initialValuesEmptyForm } from '../../helpres/initialValues';
import { useCookies } from 'react-cookie';
import { message } from 'antd';
import { getFormJSON } from '../../helpres/mapFormValuesToJson';
import { useSWRConfig } from 'swr';
import map from 'lodash/map';
import { GUEST } from '../../helpres/roles';
import Comments from '../FormBlocks/Comments';
import FormContentHOC from '../FormContent/FormContentHOC';

interface IProps {
  canDoTwoOptions: boolean,
  story?: IStory,
}

const replaceDoubleSpacesFromText = (text: string) => {
  return text.replaceAll('  ', ' ');
};

const replaceDoubleSpacesFromValues = (values: Values): Values => {
  return {
    ...values,
    storyText: replaceDoubleSpacesFromText(values.storyText),
    question: replaceDoubleSpacesFromText(values.question),
    options: map(values.options, item => ({
      ...item,
      option: replaceDoubleSpacesFromText(item.option),
      result: replaceDoubleSpacesFromText(item.result),
      diaryEntry: replaceDoubleSpacesFromText(item.diaryEntry),
    })),
  };
};

const statusesWithPremiumValidation = [
  StoryStatus.WAIT_FOR_APPROVE,
  StoryStatus.APPROVED,
  StoryStatus.PROOFREADING_OF_PAID_DONE,
];

const MainForm: FC<IProps> = (
  {
    canDoTwoOptions,
    story,
  },
) => {
  // const [ statusToSave, setStatusToSave ] = useState<StoryStatus>(StoryStatus.DRAFT);
  const apiClient = useInstance(ApiClient);
  const [ cookies ] = useCookies([ 'user' ]);
  const history = useHistory();
  const { mutate } = useSWRConfig();

  const createStory = async (values: Values, statusToSave: StoryStatus, name?: string, available: boolean = false) => {
    const { template, ...clearValues } = values;

    try {
      const filterValues = replaceDoubleSpacesFromValues(clearValues);

      if (statusToSave === StoryStatus.TEMPLATE && name) {
        const result = await apiClient.createStory(filterValues, cookies.user.id, statusToSave, name, available);
        message.success('Template created!');
        return result;
      }

      const result = await apiClient.createStory(filterValues, cookies.user.id, statusToSave, undefined, undefined, template?.value);
      message.success('Story created!');
      return result;
    } catch (error) {
      message.error('An error occurred while create history. Try again later.');
      console.error(error);
      return false;
    }
  };

  const updateStory = async (values: Values, storyId: string, statusToSave: StoryStatus, name?: string, available: boolean = false) => {
    const { template, ...clearValues } = values;

    const fixedValues = replaceDoubleSpacesFromValues(clearValues);

    try {
      const json = getFormJSON(fixedValues);

      const result = await apiClient.updateStory({
        id: storyId,
        formData: fixedValues,
        json,
        status: statusToSave,
        name,
        available,
        templateId: template?.value,
      });

      if (statusToSave === StoryStatus.TEMPLATE) {
        message.success('Template saved!');
      } else {
        message.success('Story saved!');
      }

      return result;
    } catch (error) {
      message.error('An error occurred while saving history. Try again later.');
      console.error(error);

      return false;
    }
  };

  const onSubmit = async (values: Values, formikBag: FormikHelpers<Values>) => {
    let result: IStory | false;

    const { statusToSave = StoryStatus.DRAFT, ...restValues } = values;

    //TODO: DISABLED For language check
    if (statusesWithPremiumValidation.includes(statusToSave)) {
      const errors = await validateFormBeforeSaveFinal(apiClient)(restValues);
      const errorsCount = Object.keys(errors).length;

      if (errorsCount > 0) {
        formikBag.setErrors(errors);

        return false;
      }
    }

    const { template, ...clearValues } = restValues;

    if (!story) {
      result = await createStory(clearValues, statusToSave);
      if (result) {
        formikBag.resetForm();
        history.replace(`/story/${result.id}`);
      }
      return;
    }

    result = await updateStory(values, story.id, statusToSave);
    formikBag.resetForm();
    await mutate(`story/${story.id}`);
    formikBag.resetForm();

    return result;
  };

  const sendWithErrors = async (values: Values, resetForm: () => void, status: StoryStatus, storyId?: string) => {
    if (!storyId) {
      const result = await createStory(values, status);
      if (result) {
        resetForm();
        history.replace(`/story/${result.id}`);
      }
      return;
    }

    await updateStory(values, storyId, status);
    resetForm();
    await mutate(`story/${storyId}`);
    resetForm();

    return;
  };

  const onSaveWithoutValidation = async (values: Values, resetForm: any, status: StoryStatus, name?: string, available: boolean = false) => {
    let result: IStory | false;

    if (status === StoryStatus.TEMPLATE) {
      if (!name || !name.trim()) {
        message.error('Error while save template');
        return false;
      }

      if (!story) {
        result = await createStory(values, StoryStatus.TEMPLATE, name, available);
        if (result) {
          resetForm();
          history.replace(`/story/${result.id}`);
        }
      } else {
        result = await updateStory(values, story.id, StoryStatus.TEMPLATE, name, available);
        resetForm();
        await mutate(`story/${story.id}`);
        resetForm();
      }
    } else {
      if (!story) {
        result = await createStory(values, status);
        if (result) {
          resetForm();
          history.replace(`/story/${result.id}`);
        }
      } else {
        result = await updateStory(values, story.id, status);
        resetForm();
        await mutate(`story/${story.id}`);
        resetForm();
      }
    }

    return result;
  };

  const initialValues = !story ? cloneDeep(initialValuesEmptyForm) : cloneDeep(story.formData);

  if (story && story.template && story.template.id && story.template.templateName) {
    initialValues.template = {
      value: story.template.id,
      label: story.template.templateName,
    };
  }

  const role = cookies.user?.role?.name || GUEST;

  return (
    <div className="MainForm">
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validateOnMount={true}
        validate={validateMainForm(apiClient)}
      >
        <FormContentHOC
          canDoTwoOptions={canDoTwoOptions}
          sendWithErrors={sendWithErrors}
          onSaveWithoutValidation={onSaveWithoutValidation}
          story={story}
          role={role}
        />
      </Formik>
      {story && (
        <Comments
          storyId={story.id}
          role={role}
          storyStatus={story.status}
        />
      )}
    </div>
  );
};

export default MainForm;
