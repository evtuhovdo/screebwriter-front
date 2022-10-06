import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ADMIN, AUTHOR, EDITOR } from '../../helpres/roles';
import { StoryStatus } from '../../Api/ApiClient';
import Button from '../Button';
import { IButtonVariant } from '../Button/Button';
import ClipLoader from 'react-spinners/ClipLoader';
import { message, Popconfirm } from 'antd';
import map from 'lodash/map';
import { Field, Formik, useFormikContext } from 'formik';
import TextareaInput from '../TextareaInput';
import CheckboxInput from '../CheckboxInput/CheckboxInput';

interface ITemplateFormValues {
  name: string,
  available: boolean,
}

interface ITemplateSaveFormProps {
  name: string,
  setName: (name: ITemplateSaveFormProps['name']) => void,
  available: boolean,
  setAvailable: (value: ITemplateSaveFormProps['available']) => void,
}

const TemplateSaveFomikForm: FC<ITemplateSaveFormProps> = (
  {
    setName,
    setAvailable,
  },
) => {
  const { values } = useFormikContext<ITemplateFormValues>();

  useEffect(() => {
    setAvailable(values.available);
    setName(values.name);
  }, [values, setAvailable, setName]);

  return (
    <div>
      <div>Save template?</div>
      <Field
        name="available"
        type="checkbox"
        component={CheckboxInput}
        label="Available"
      />
      <Field
        autoComplete="off"
        name="name"
        label="Template name (*)"
        component={TextareaInput}
        symbolLimit={200}
        className="storyTextTextarea"
      />
    </div>
  );
};

const TemplateSaveForm: FC<ITemplateSaveFormProps> = (
  {
    name,
    setName,
    available,
    setAvailable,
  },
) => {
  const initialValues: ITemplateFormValues = useMemo(() => {
    return {
      name,
      available,
    };
  }, [ name, available ]);

  const onSubmit = useCallback(() => {
  }, []);

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        <TemplateSaveFomikForm
          name={name}
          setName={setName}
          available={available}
          setAvailable={setAvailable}
        />
      </Formik>
    </div>
  );
};

interface IProps {
  role: string,
  storyId?: string,
  storyStatus?: StoryStatus,
  isDisabled: boolean,

  langErrorsCount: number,

  onSave: (status: StoryStatus, name?: string, available?: boolean) => any,
  onSend: (status: StoryStatus) => any,

  editorStatusActions: IEditorStatusActions,
  canSaveWithErrors: boolean,
  isSubmitting: boolean,
  templateName?: string,
  templateAvailable?: boolean,
}

interface IEditorStatusActionItem {
  status: StoryStatus,
  label: string,
  buttonVariant: IButtonVariant,
  useValidation: boolean,
  saveWithErrors: boolean,
}

interface IEditorStatusActions {
  [key: string]: IEditorStatusActionItem[];
}

const Actions: FC<IProps> = (
  {
    role,
    storyStatus,
    isDisabled,
    langErrorsCount,
    editorStatusActions,
    canSaveWithErrors,
    onSave,
    onSend,
    isSubmitting,
    templateName = '',
    templateAvailable = false,
  },
) => {
  const [ name, setName ] = useState(templateName);
  const [ available, setAvailable ] = useState(templateAvailable);

  useEffect(() => {
    setName(templateName);
  }, [ templateName ]);

  useEffect(() => {
    setAvailable(templateAvailable);
  }, [ templateAvailable ]);

  const onTemplateSave = () => {
    if (!name) {
      message.error('Template save error. Template name required.');
      return;
    }

    onSave(StoryStatus.TEMPLATE, name, available)();
  };

  return (
    <div className="Button-wrapper">
      {role === ADMIN && storyStatus && storyStatus !== StoryStatus.TEMPLATE && (
        <Button
          type="button"
          onClick={onSave(storyStatus, name, available)}
          variant={IButtonVariant.OUTLINE}
          disabled={isSubmitting}
        >
          {!isSubmitting && 'Save'}
          {isSubmitting && (
            <ClipLoader
              color="#00AFB9"
              size={20}
            />
          )}
        </Button>
      )}

      {role === ADMIN && storyStatus && storyStatus === StoryStatus.TEMPLATE && (
        <Popconfirm
          title={<TemplateSaveForm available={available} setAvailable={setAvailable} name={name} setName={setName}/>}
          onConfirm={onTemplateSave}
          okText="Yes"
          cancelText="No"
          okButtonProps={{
            disabled: !name || !name.trim(),
          }}
        >
          <div>
            <Button
              type="button"
              variant={IButtonVariant.OUTLINE}
              disabled={isSubmitting}
            >
              {!isSubmitting && 'Save template'}
              {isSubmitting && (
                <ClipLoader
                  color="#00AFB9"
                  size={20}
                />
              )}
            </Button>
          </div>
        </Popconfirm>
      )}
      {role === ADMIN && !storyStatus && (
        <Popconfirm
          title={<TemplateSaveForm available={available} setAvailable={setAvailable} name={name} setName={setName}/>}
          onConfirm={onTemplateSave}
          okText="Yes"
          cancelText="No"
          okButtonProps={{
            disabled: !name || !name.trim(),
          }}
        >
          <div>
            <Button
              type="button"
              variant={IButtonVariant.OUTLINE}
              disabled={isSubmitting}
            >
              {!isSubmitting && 'Save as template'}
              {isSubmitting && (
                <ClipLoader
                  color="#00AFB9"
                  size={20}
                />
              )}
            </Button>
          </div>
        </Popconfirm>
      )}
      {role === AUTHOR && (!storyStatus || storyStatus !== StoryStatus.WAIT_FOR_APPROVE) && (
        <React.Fragment>
          <Button
            type="button"
            onClick={onSave(!storyStatus ? StoryStatus.DRAFT : storyStatus)}
            variant={IButtonVariant.OUTLINE}
            disabled={isSubmitting}
          >
            {!isSubmitting && 'Save'}
            {isSubmitting && (
              <ClipLoader
                color="#00AFB9"
                size={20}
              />
            )}
          </Button>

          <Popconfirm
            title={
              canSaveWithErrors ?
                <span>{`Are you sure you want to send story to Approve`}<br/><b>{`with ${langErrorsCount} language validation errors?`}</b><br/>After
                  that, the story will not be available for making changes.</span>
                : `Are you sure you want to send story to Approve?`
            }
            onConfirm={onSend(StoryStatus.WAIT_FOR_APPROVE)}
            okText="Yes"
            cancelText="No"
          >
            <div className="ml-20">
              <Button
                type="button"
                disabled={isSubmitting}
              >
                {!isSubmitting && 'Send Story'}
                {isSubmitting && (
                  <ClipLoader
                    color="#fff"
                    size={20}
                  />
                )}
              </Button>
            </div>
          </Popconfirm>
        </React.Fragment>
      )}

      {role === EDITOR && storyStatus && (
        <React.Fragment>
          {!isDisabled && (
            <React.Fragment>
              <Button
                type="button"
                onClick={onSave(storyStatus)}
                variant={IButtonVariant.OUTLINE}
                disabled={isSubmitting}
              >
                {!isSubmitting && 'Save'}
                {isSubmitting && (
                  <ClipLoader
                    color="#00AFB9"
                    size={20}
                  />
                )}
              </Button>
            </React.Fragment>
          )}

          {map(editorStatusActions[storyStatus], (item) => {
            if (item.status === StoryStatus.TRASH) {
              return (
                <Popconfirm
                  key={item.status}
                  title={
                    <span>{`Are you sure you want to send story to ${item.status}`}<br/><b>{`this action will not be reversible!`}</b></span>}
                  onConfirm={onSend(item.status)}
                  okText="Yes"
                  cancelText="No"
                >
                  <div className="ml-20 mr-20">
                    <Button
                      type="button"
                      variant={item.buttonVariant}
                      disabled={isSubmitting}
                    >
                      {!isSubmitting && item.label}
                      {isSubmitting && (
                        <ClipLoader
                          color="#00AFB9"
                          size={20}
                        />
                      )}
                    </Button>
                  </div>
                </Popconfirm>
              );
            }

            if (item.saveWithErrors) {
              return (
                <Popconfirm
                  key={item.status}
                  title={
                    <span>{`Are you sure you want to send story to ${item.status}`}<br/><b>{`with ${langErrorsCount} language validation errors?`}</b></span>}
                  onConfirm={onSend(item.status)}
                  okText="Yes"
                  cancelText="No"
                >
                  <div className="ml-20 mr-20">
                    <Button
                      type="button"
                      variant={item.buttonVariant}
                      disabled={isSubmitting}
                    >
                      {!isSubmitting && item.label}
                      {isSubmitting && (
                        <ClipLoader
                          color="#00AFB9"
                          size={20}
                        />
                      )}
                    </Button>
                  </div>
                </Popconfirm>
              );
            }

            return (
              <Button
                key={item.status}
                type="button"
                onClick={item.useValidation ? onSend(item.status) : onSave(item.status)}
                variant={item.buttonVariant}
                disabled={isSubmitting}
              >
                {!isSubmitting && item.label}
                {isSubmitting && (
                  <ClipLoader
                    color="#00AFB9"
                    size={20}
                  />
                )}
              </Button>
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
};

export default React.memo(Actions);
