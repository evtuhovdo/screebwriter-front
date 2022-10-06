import { useCallback, useEffect, useState } from 'react';
import find from 'lodash/find';
import get from 'lodash/get';
import ApiClient, { IStory, ITemplate } from '../Api/ApiClient';
import { useInstance } from 'react-ioc';
import useSWR from 'swr';
import { isEqual } from 'lodash';
import { isEmptyValue } from '../helpres/margeTemplateWithStoryValues';

const useIsDisabledFieldByTemplate = (story?: IStory, templateId?: string) => {
  const [ template, setTemplate ] = useState<ITemplate | undefined>(undefined);
  const apiClient = useInstance(ApiClient);

  const { data } = useSWR('apiClient.fetchAvailableTemplates', apiClient.fetchAvailableTemplates);

  const storyTemplate = story?.template;

  useEffect(() => {
    if (!templateId) {
      setTemplate(undefined);
      return;
    }

    let newTemplate: ITemplate | undefined;

    if (storyTemplate && storyTemplate.id === templateId) {
      newTemplate = storyTemplate;
    } else if (data) {
      newTemplate = find(data, { id: templateId });
    }

    if (newTemplate && isEqual(newTemplate, template)) {
      // Они одинаковые обновлять не надо.
      return;
    }

    setTemplate(newTemplate);
  }, [ data, storyTemplate, templateId, template ]);

  const isDisabledFieldByTemplate = useCallback((fieldName: string) => {
    if (!template) {
      return false;
    }

    return !isEmptyValue(get(template?.formData, fieldName));
  }, [ template ]);

  return {
    isDisabledFieldByTemplate,
    template,
  };
};

export default useIsDisabledFieldByTemplate;
