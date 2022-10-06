import React, { FC, PropsWithChildren, useCallback } from 'react';
import { Field, FieldArray } from 'formik';
import isEqual from 'lodash/isEqual';

import nameOfValues from '../../helpres/nameOfValues';
import nameOf from '../../helpres/nameOf';
import getOptionTitle from '../../helpres/getOptionTitle';
import TextareaInput from '../TextareaInput';
import { IOptionValue } from '../MainForm/interfaces';
import AddOptionButton from './AddOptionButton';
import RemoveOptionButton from './RemoveOptionButton';
import { ITemplate } from '../../Api/ApiClient';

interface IProps {
  canDoTwoOptions: boolean,
  isDisabled: boolean,
  hasTemplate: boolean,
  template: ITemplate | undefined,
  options: Omit<IOptionValue, 'npcChanges' | 'mainCharacterChanges'>[],
}

const Options: FC<IProps> = (
  {
    canDoTwoOptions,
    isDisabled,
    hasTemplate,
    options,
    template,
  },
) => {
  const render = useCallback(() => (options.map((option, i) => (
    <React.Fragment key={i}>
      <div className="column">
        {!hasTemplate && !isDisabled && options.length === i + 1 && (canDoTwoOptions ? i > 1 : i > 2) && (
          <RemoveOptionButton/>
        )}
        <Field
          autoComplete="off"
          name={nameOfValues(nameOf(() => options[i].option), i)}
          label={getOptionTitle(i)}
          component={TextareaInput}
          placeholder={template ? template?.formData?.options[i]?.option : ''}
          disabled={isDisabled}
          symbolLimit={70}
          className="optionsOptionTextarea"
        />
        <Field
          autoComplete="off"
          name={nameOfValues(nameOf(() => options[i].result), i)}
          component={TextareaInput}
          disabled={isDisabled}
          placeholder={template ? template?.formData?.options[i]?.result : ''}
          symbolLimit={300}
          className="optionsResultTextarea"
        />
        <Field
          autoComplete="off"
          name={nameOfValues(nameOf(() => options[i].diaryEntry), i)}
          component={TextareaInput}
          disabled={isDisabled}
          placeholder={template ? template?.formData?.options[i]?.diaryEntry : ''}
          symbolLimit={400}
          className="optionsDiaryEntryTextarea"
        />
      </div>
      {!hasTemplate && !isDisabled && options.length === i + 1 && i < 3 && (
        <AddOptionButton/>
      )}
    </React.Fragment>
  ))), [ options, canDoTwoOptions, isDisabled, template, hasTemplate ]);

  return (
    <FieldArray
      key={`${template?.id}`}
      name="options"
      render={render}
    />
  );
};

const areEqual = (prevProps: Readonly<PropsWithChildren<IProps>>, nextProps: Readonly<PropsWithChildren<IProps>>) => {
  if (nextProps.canDoTwoOptions !== prevProps.canDoTwoOptions) {
    return false;
  }

  if (nextProps.isDisabled !== prevProps.isDisabled) {
    return false;
  }

  if (nextProps.hasTemplate !== prevProps.hasTemplate) {
    return false;
  }

  if (nextProps.options.length !== prevProps.options.length) {
    return false;
  }

  if (!isEqual(nextProps.options, prevProps.options)) {
    return false;
  }

  return isEqual(nextProps.template, prevProps.template);
};

export default React.memo(Options, areEqual);
