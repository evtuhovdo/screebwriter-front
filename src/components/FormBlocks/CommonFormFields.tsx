import React, { FC, useCallback, useMemo, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import { message, Modal } from 'antd';
import AsyncSelectInput from '../SelectInput/AsyncSelectInput';
import { formatColorOptionLabel } from '../ColorOption/ColorOption';
import nameOfValues from '../../helpres/nameOfValues';
import nameOf from '../../helpres/nameOf';
import AsyncCascaderInput, { ICascaderOption } from '../CascaderInput/AsyncCascaderInput';
import TextareaInput from '../TextareaInput';
import { Values } from '../MainForm/interfaces';
import { ISelectOption } from '../SelectInput/SelectInput';
import map from 'lodash/map';
import { useInstance } from 'react-ioc';
import ApiClient, { IStory, StoryStatus } from '../../Api/ApiClient';
import find from 'lodash/find';
import margeTemplateWithStoryValues from '../../helpres/margeTemplateWithStoryValues';
import useIsDisabledFieldByTemplate from '../../hooks/useIsDisabledFieldByTemplate';

interface IProps {
  isDisabled: boolean,
  story?: IStory,
  onSaveWithoutValidation: (values: Values, resetForm: any, status: StoryStatus, name?: string, available?: boolean) => Promise<false | IStory>,
}

const CommonFormFields: FC<IProps> = ({ isDisabled, story, onSaveWithoutValidation }) => {
  const apiClient = useInstance(ApiClient);
  const { values, setValues, setFieldValue } = useFormikContext<Values>();
  const { isDisabledFieldByTemplate, template } = useIsDisabledFieldByTemplate(story, values.template?.value);

  const [ initialTemplateId, setInitialTemplateId ] = useState<string | undefined>(values.template?.value);

  const storyHeaderColorsOptions = useMemo(() => async (filterValue?: string | undefined): Promise<ISelectOption[]> => {
    const data = await apiClient.fetchStoryHeaderColors(filterValue);

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.id,
      label: item.title,
      color: item.value,
      description: item.description,
    }));
  }, [ apiClient ]);

  const storyCategoriesGroupsRequestOptions = useCallback(async (): Promise<ICascaderOption[]> => {
    const data = await apiClient.fetchStoryCategoriesGroups();

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.title,
      label: item.title,
      children: map(item.story_categories_sub_groups, y => ({
        value: y.title,
        label: y.title,
        children: map(y.story_categories, x => ({
          value: x.title,
          label: x.title,
        })),
      })),
    }));
  }, [ apiClient ]);

  const templatesOptions = useCallback(async () => {
    const temps = await apiClient.fetchAvailableTemplates();

    return map(temps, template => {
      return {
        value: template.id,
        label: template.templateName,
      };
    });
  }, [ apiClient ]);

  const [ popupSetTemplateToStoryVisible, setPopupSetTemplateToStoryVisible ] = useState(false);
  const [ storyTemplateApplyLoading, setStoryTemplateApplyLoading ] = useState(false);

  const showModal = () => {
    setPopupSetTemplateToStoryVisible(true);
  };

  const onTemplateFieldValueChange = (newTemplate: { value: string } | '') => {
    let newTemplateId;

    if (newTemplate && newTemplate.value) {
      newTemplateId = newTemplate.value;
    }

    if (newTemplateId !== initialTemplateId) {
      showModal();
    }
  };

  const valuesTemplateId = values.template?.value;

  const handleOk = async () => {
    setStoryTemplateApplyLoading(true);

    if (valuesTemplateId) {
      try {
        const templates = await apiClient.fetchAvailableTemplates();
        const template = find(templates, { id: valuesTemplateId });
        if (!template) {
          message.error('Error while template apply');
          handleCancel();
          return;
        }

        setInitialTemplateId(template.id);
        const newValues = margeTemplateWithStoryValues(template.formData, values);
        setValues(newValues);

        setStoryTemplateApplyLoading(false);
        setPopupSetTemplateToStoryVisible(false);
      } catch (error) {
        console.error(error);
      } finally {
        setStoryTemplateApplyLoading(false);
        setPopupSetTemplateToStoryVisible(false);
      }
    } else {
      setInitialTemplateId(undefined);
      setStoryTemplateApplyLoading(false);
      setPopupSetTemplateToStoryVisible(false);
    }
  };

  const handleCancel = async () => {
    if (initialTemplateId) {
      try {
        const templates = await apiClient.fetchAvailableTemplates();
        const template = find(templates, { id: initialTemplateId });
        if (!template) {
          message.error('Error while template restore');
          handleCancel();
          return;
        }

        setInitialTemplateId(template.id);
        const newValues = margeTemplateWithStoryValues(template.formData, values);
        setValues(newValues);

        setFieldValue('template', { value: template.id, label: template.templateName });

        setStoryTemplateApplyLoading(false);
        setPopupSetTemplateToStoryVisible(false);
      } catch (error) {
        console.error(error);
      } finally {
        setStoryTemplateApplyLoading(false);
        setPopupSetTemplateToStoryVisible(false);
      }
    } else {
      // Удоляем шаблон с истории
      setFieldValue('template', undefined);
      setInitialTemplateId(undefined);
    }

    setPopupSetTemplateToStoryVisible(false);
  };

  return (
    <>
      <Modal
        title="Change story template"
        visible={popupSetTemplateToStoryVisible}
        onOk={handleOk}
        closable={false}
        confirmLoading={storyTemplateApplyLoading}
        onCancel={handleCancel}
        cancelButtonProps={{ disabled: storyTemplateApplyLoading }}
        maskClosable={false}
      >
        {values.template?.value && (
          <p>
            Template <b>{values.template?.label}</b> will be installed.
          </p>
        )}
        {!values.template?.value && (
          <p>
            The template will be removed from the history. <br/>
            All fields will retain their values.
          </p>
        )}
        {story?.template?.available === false && (
          <p>
            The previously installed template is no longer available and you cannot apply it again to this story until it is
            availability will not be restored.
          </p>
        )}
        {values.template?.value && (
          <p>
            Note that the values in the template take precedence even in the event of a conflict.
            values, the values from the templates will be used, and then from the current history.
          </p>
        )}
      </Modal>
      {story?.status !== StoryStatus.TEMPLATE && (
        <div className="selects template-selects">
          <Field
            component={AsyncSelectInput}
            onChangeCallback={onTemplateFieldValueChange}
            isClearable={true}
            label="Template"
            promiseOptions={templatesOptions}
            name="template"
            disabled={isDisabled}
          />
        </div>
      )}
      <div className="selects">
        <Field
          component={AsyncSelectInput}
          formatOptionLabel={formatColorOptionLabel}
          isClearable={true}
          label="Header color"
          promiseOptions={storyHeaderColorsOptions}
          name={nameOfValues(nameOf(() => values.headerColor))}
          disabled={isDisabled || isDisabledFieldByTemplate(nameOfValues(nameOf(() => values.headerColor)))}
        />
        <Field
          component={AsyncCascaderInput}
          label="Category"
          promiseOptions={storyCategoriesGroupsRequestOptions}
          name={nameOfValues(nameOf(() => values.category))}
          disabled={isDisabled || isDisabledFieldByTemplate(nameOfValues(nameOf(() => values.category)))}
        />
      </div>
      <Field
        autoComplete="off"
        name={nameOfValues(nameOf(() => values.storyText))}
        label="Story text"
        component={TextareaInput}
        placeholder={template?.formData.storyText}
        symbolLimit={200}
        className="storyTextTextarea"
        disabled={isDisabled}
      />
      <Field
        autoComplete="off"
        name={nameOfValues(nameOf(() => values.question))}
        label="Question"
        component={TextareaInput}
        placeholder={template?.formData.question}
        symbolLimit={100}
        className="questionTextarea"
        disabled={isDisabled}
      />
    </>
  );
};

export default React.memo(CommonFormFields);
