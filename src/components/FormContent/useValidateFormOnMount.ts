import { useFormikContext } from 'formik';
import { useCallback, useEffect } from 'react';
import { Values } from '../MainForm/interfaces';
import validateMainForm from '../MainForm/validateForm';
import { useInstance } from 'react-ioc';
import ApiClient from '../../Api/ApiClient';

const getTouchedObj = (errors: any) => {
  const touched: any = {};
  Object.keys(errors).forEach(key => {
    if (Array.isArray(errors[key])) {
      errors[key].forEach((val: any, index: any) => {
        if (index === 0) {
          touched[key] = [];
        }
        touched[key].push(getTouchedObj(val));
      });
    } else {
      touched[key] = true;
    }
  });

  return touched;
};

// TODO: переписать на isInitialValid и initialTouched
const useValidateFormOnMount = (storyId?: string) => {
  const apiClient = useInstance(ApiClient);

  const {
    values,
    setTouched,
  } = useFormikContext<Values>();

  const simpleValidate = useCallback(async (values: Values) => {
    const errors = await validateMainForm(apiClient)(values);
    const newTouched = getTouchedObj(errors);
    setTouched(newTouched);
  }, [apiClient, setTouched]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (storyId) {
      void simpleValidate(values);
    }
  }, [storyId]);
};

export default useValidateFormOnMount;
