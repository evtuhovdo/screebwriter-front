import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Actions from './Actions';
import { IStory, StoryStatus } from '../../Api/ApiClient';
import { Values } from '../MainForm/interfaces';
import { useFormikContext } from 'formik';
import { IButtonVariant } from '../Button/Button';

interface IProps {
  role: string,
  storyId?: string,
  storyStatus?: StoryStatus,
  isDisabled: boolean,
  templateName?: string,
  templateAvailable?: boolean,

  sendWithErrors: (values: Values, resetForm: () => void, status: StoryStatus, storyId?: string) => void,
  onSaveWithoutValidation: (values: Values, resetForm: any, status: StoryStatus, name?: string, available?: boolean) => Promise<false | IStory>,
}

export interface IEditorStatusActionItem {
  status: StoryStatus,
  label: string,
  buttonVariant: IButtonVariant,
  useValidation: boolean,
  saveWithErrors: boolean,
}

export interface IEditorStatusActions {
  [key: string]: IEditorStatusActionItem[];
}

const ActionsHOC: FC<IProps> = (
  {
    storyStatus,
    storyId,
    isDisabled,
    role,
    onSaveWithoutValidation,
    sendWithErrors,
    templateName,
    templateAvailable,
  },
) => {
  const {
    isSubmitting,
    values,
    handleSubmit,
    resetForm,
    setSubmitting,
    errors,
    setFieldValue,
  } = useFormikContext<Values>();

  // @ts-ignore
  const { errors: { langErrorsCount = 0, commonErrorsCount = 0 } } = useFormikContext<Values>();

  const [ canSaveWithErrors, setCanSaveWithErrors ] = useState<boolean>(false);

  useEffect(() => {
    if (langErrorsCount > 0 && commonErrorsCount === 0) {
      setCanSaveWithErrors(true);
      return;
    }

    setCanSaveWithErrors(false);
  }, [ setCanSaveWithErrors, langErrorsCount, commonErrorsCount ]);

  const onSave = useCallback((status: StoryStatus = StoryStatus.DRAFT, name?: string, available?: boolean) => async () => {
    console.log('onSave on ActionsHOC call');
    setSubmitting(true);
    try {
      await onSaveWithoutValidation(values, resetForm, status, name, available);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }

    return false;
  }, [ onSaveWithoutValidation, setSubmitting, values, resetForm ]);

  const onSend = useCallback((status: StoryStatus = StoryStatus.DRAFT) => () => {
    setFieldValue('statusToSave', status);
    if (errors && Object.keys(errors).length > 0 && canSaveWithErrors) {
      // Сохраняем с ошибками
      sendWithErrors(values, resetForm, status, storyId);
      return;
    }

    handleSubmit();

    return;
  }, [ setFieldValue, canSaveWithErrors, errors, values, resetForm, storyId, handleSubmit, sendWithErrors ]);

  const editorStatusActions: IEditorStatusActions = useMemo(() => {
    return {
      [StoryStatus.WAIT_FOR_APPROVE]: [
        {
          status: StoryStatus.APPROVED,
          label: `Approve`,
          buttonVariant: IButtonVariant.PRIMARY,
          useValidation: true,
          saveWithErrors: canSaveWithErrors,
        },
        {
          status: StoryStatus.REJECTED,
          label: `Reject`,
          buttonVariant: IButtonVariant.OUTLINE,
          useValidation: false,
          saveWithErrors: false,
        },
      ],
      [StoryStatus.REJECTED]: [
        {
          status: StoryStatus.WAIT_FOR_APPROVE,
          label: `To ${StoryStatus.WAIT_FOR_APPROVE}`,
          buttonVariant: IButtonVariant.OUTLINE,
          useValidation: false,
          saveWithErrors: false,
        },
        {
          status: StoryStatus.APPROVED,
          label: `${StoryStatus.APPROVED}`,
          buttonVariant: IButtonVariant.PRIMARY,
          useValidation: true,
          saveWithErrors: canSaveWithErrors,
        },
      ],
      [StoryStatus.APPROVED]: [
        {
          status: StoryStatus.WAIT_FOR_APPROVE,
          label: `Back to ${StoryStatus.WAIT_FOR_APPROVE}`,
          buttonVariant: IButtonVariant.OUTLINE,
          useValidation: false,
          saveWithErrors: false,
        },
      ],
      [StoryStatus.WAIT_PROOFREADING_OF_PAID]: [
        {
          status: StoryStatus.IN_PROOFREADING_OF_PAID,
          label: `Start proofreading`,
          buttonVariant: IButtonVariant.OUTLINE,
          useValidation: false,
          saveWithErrors: false,
        },
        {
          status: StoryStatus.TRASH,
          label: `Trash`,
          buttonVariant: IButtonVariant.OUTLINE,
          useValidation: false,
          saveWithErrors: false,
        },
      ],
      [StoryStatus.IN_PROOFREADING_OF_PAID]: [
        {
          status: StoryStatus.PROOFREADING_OF_PAID_DONE,
          label: `Save and proofreading done`,
          buttonVariant: IButtonVariant.PRIMARY,
          useValidation: true,
          saveWithErrors: canSaveWithErrors,
        },
        {
          status: StoryStatus.REJECTED,
          label: `Reject`,
          buttonVariant: IButtonVariant.OUTLINE,
          useValidation: false,
          saveWithErrors: false,
        },
        {
          status: StoryStatus.TRASH,
          label: `Trash`,
          buttonVariant: IButtonVariant.OUTLINE,
          useValidation: false,
          saveWithErrors: false,
        },
      ],
      [StoryStatus.PROOFREADING_OF_PAID_DONE]: [
        {
          status: StoryStatus.WAIT_PROOFREADING_OF_PAID,
          label: `Back to proofreading`,
          buttonVariant: IButtonVariant.OUTLINE,
          useValidation: false,
          saveWithErrors: false,
        },
        {
          status: StoryStatus.TRASH,
          label: `Trash`,
          buttonVariant: IButtonVariant.OUTLINE,
          useValidation: false,
          saveWithErrors: false,
        },
      ],
      [StoryStatus.TRASH]: [
        {
          status: StoryStatus.WAIT_PROOFREADING_OF_PAID,
          label: `Back to proofreading`,
          buttonVariant: IButtonVariant.OUTLINE,
          useValidation: false,
          saveWithErrors: false,
        },
        {
          status: StoryStatus.FOR_DELETION,
          label: `For deletion`,
          buttonVariant: IButtonVariant.OUTLINE,
          useValidation: false,
          saveWithErrors: false,
        },
      ]
    };
  }, [ canSaveWithErrors ]);

  return (
    <Actions
      isSubmitting={isSubmitting}
      onSend={onSend}
      onSave={onSave}
      langErrorsCount={langErrorsCount}
      editorStatusActions={editorStatusActions}
      storyStatus={storyStatus}
      isDisabled={isDisabled}
      role={role}
      canSaveWithErrors={canSaveWithErrors}
      templateName={templateName}
      templateAvailable={templateAvailable}
    />
  );
};

export default ActionsHOC;
