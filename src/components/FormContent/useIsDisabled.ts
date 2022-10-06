import { useEffect, useState } from 'react';
import { ADMIN, AUTHOR, EDITOR } from '../../helpres/roles';
import { StoryStatus } from '../../Api/ApiClient';
import { useFormikContext } from 'formik';
import { Values } from '../MainForm/interfaces';

const useIsDisabled = (role: string, storyStatus?: StoryStatus) => {
  const { isSubmitting } = useFormikContext<Values>();

  const [ isDisabled, setIsDisabled ] = useState<boolean>(false);

  useEffect(() => {
    if (role === ADMIN) {
      setIsDisabled(false);
      return;
    }

    if (storyStatus) {
      if (role === AUTHOR
        && ![ StoryStatus.DRAFT, StoryStatus.REJECTED ].includes(storyStatus)
      ) {
        setIsDisabled(true);
        return;
      }

      if (role === EDITOR
        && ![
          StoryStatus.WAIT_FOR_APPROVE,
          StoryStatus.REJECTED,
          StoryStatus.IN_PROOFREADING_OF_PAID,
        ].includes(storyStatus)
      ) {
        setIsDisabled(true);
        return;
      }
    }

    if (isSubmitting) {
      setIsDisabled(true);
      return;
    }

    setIsDisabled(false);
  }, [ setIsDisabled, isSubmitting, storyStatus, role ]);

  return isDisabled;
}

export default useIsDisabled;
