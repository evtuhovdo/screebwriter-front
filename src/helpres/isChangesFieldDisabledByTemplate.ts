import { ITemplate } from '../Api/ApiClient';
import get from 'lodash/get';

const isChangesFieldDisabledByTemplate = (fieldName: string, template?: ITemplate) => {
  if (!template) {
    return false;
  }

  const value = get(template.formData, fieldName);

  return Boolean(value);
}

export default isChangesFieldDisabledByTemplate;
