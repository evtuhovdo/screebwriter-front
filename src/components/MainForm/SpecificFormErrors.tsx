import { FC, useEffect, useState } from 'react';
import { message } from 'antd';
import { useFormikContext } from 'formik';
import { Values } from './interfaces';
import get from 'lodash/get';
import useHasChanged from '../../hooks/useHasChanged';

interface IProps {
  name: string,
}

const SpecificFormErrors: FC<IProps> = ({ name }) => {
  const { values, submitCount, errors } = useFormikContext<Values>();

  const [ errorMessage, setErrorMessage ] = useState<string>('');

  useEffect(() => {
    const errorMessage = get(errors, name);

    if (errorMessage) {
      setErrorMessage(errorMessage);
    } else {
      setErrorMessage('');
    }
  }, [values, errors, setErrorMessage, name]);

  const submitCountChanged = useHasChanged(submitCount)

  useEffect(() => {
    if (!submitCountChanged || !errorMessage) {
      return;
    }

    message.error(errorMessage);
  }, [ submitCountChanged, errorMessage]);

  return null;
};

export default SpecificFormErrors;
