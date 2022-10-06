import React, { FC, useEffect, useState } from 'react';
import { message } from 'antd';
import omit from 'lodash/omit';
import { useFormikContext } from 'formik';
import { Values } from './interfaces';
import useHasChanged from '../../hooks/useHasChanged';

const MessageThatYouHaveFormError: FC = () => {
  const { submitCount, errors } = useFormikContext<Values>();

  const [ haveErrors, setHaveErrors ] = useState<boolean>(false);

  const submitCountChanged = useHasChanged(submitCount)

  useEffect(() => {
  const _errors = omit(errors, ['langErrorsCount', 'commonErrorsCount']);
   if (_errors && Object.keys(_errors).length > 0) {
     setHaveErrors(true);
   } else {
     setHaveErrors(false);
   }
  }, [errors]);

  useEffect(() => {
    if (!submitCountChanged || !haveErrors) {
      return;
    }

    message.error('To send the history for approve, you need to fix the errors.');
  }, [ submitCountChanged, haveErrors]);

  return null;
};

export default React.memo(MessageThatYouHaveFormError);
