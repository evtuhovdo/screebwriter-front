import React, { FC, PropsWithChildren, useCallback, useRef, useState } from 'react';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import cn from 'classnames';

import useClickOutside from '../../hooks/useClickOutside';
import { Values } from '../MainForm/interfaces';

import './LeftForm.scss';
import ConditionNPCHOC from './includes/ConditionNPCHOC';
import GGLeftForm from './includes/GGLeftForm';
import AddNpcButton from './includes/AddNpcButton';

interface IProps {
  isDisabled: boolean,
  hasTemplate: boolean,
  npcCount: number,
  mainCharacter: Values['mainCharacter'],
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  isDisabledFieldByTemplate: (fieldName: string) => boolean,
}

const LeftForm: FC<IProps> = (
  {
    isDisabled,
    npcCount,
    mainCharacter,
    setFieldValue,
    isDisabledFieldByTemplate,
    hasTemplate
  },
) => {
  const [ visible, setVisible ] = useState<boolean>(false);

  const ref = useRef(null);

  const [ popupVisible, setPopupVisible ] = useState<boolean>(false);

  const hide = useCallback(() => {
    if (!popupVisible) {
      setVisible(false);
    }
  }, [ popupVisible, setVisible ]);

  useClickOutside(ref, hide);

  const toggle = useCallback(() => {
    setVisible(!visible);
  }, [ setVisible, visible ]);

  return (
    <div ref={ref} className={cn([ 'LeftForm', !visible && 'LeftForm--hidden' ])}>
      <h1>Condition</h1>
      <div className="LeftForm__toggle" role="button" onClick={toggle}/>
      <div className="columns">
        <GGLeftForm
          isDisabled={isDisabled}
          mainCharacter={mainCharacter}
          setFieldValue={setFieldValue}
          setPopupVisible={setPopupVisible}
          isDisabledFieldByTemplate={isDisabledFieldByTemplate}
        />
        {map(Array(npcCount), (npc, i) => (
          <ConditionNPCHOC
            key={i}
            i={i}
            isDisabled={isDisabled}
            hasTemplate={hasTemplate}
            setPopupVisible={setPopupVisible}
            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
          />
        ))}
        {!hasTemplate && !isDisabled && npcCount < 3 && (
          <AddNpcButton/>
        )}
      </div>
    </div>
  );
};

const areEqual = (prevProps: Readonly<PropsWithChildren<IProps>>, nextProps: Readonly<PropsWithChildren<IProps>>) => {
  if (prevProps.isDisabled !== nextProps.isDisabled) {
    return false;
  }

  if (prevProps.npcCount !== nextProps.npcCount) {
    return false;
  }

  if (prevProps.setFieldValue !== nextProps.setFieldValue) {
    return false;
  }

  if (prevProps.isDisabledFieldByTemplate !== nextProps.isDisabledFieldByTemplate) {
    return false;
  }

  if (prevProps.hasTemplate !== nextProps.hasTemplate) {
    return false;
  }

  return isEqual(prevProps.mainCharacter, nextProps.mainCharacter);
};

export default React.memo(LeftForm, areEqual);
