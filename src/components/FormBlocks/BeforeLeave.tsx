import React, { FC } from 'react';
import { Beforeunload, UseBeforeunloadHandler } from 'react-beforeunload';
import { Prompt } from 'react-router-dom';
import { useFormikContext } from 'formik';
import { Values } from '../MainForm/interfaces';

const onBeforeunload: UseBeforeunloadHandler = (event) => event.preventDefault();

const BeforeLeave: FC = () => {
  const { dirty } = useFormikContext<Values>();

  return (
    <>
      {dirty && (
        <Beforeunload onBeforeunload={onBeforeunload}/>
      )}
      <Prompt
        when={dirty}
        message="You have unsaved changes, are you sure you want to leave the page?"
      />
    </>
  );
};

export default React.memo(BeforeLeave);
