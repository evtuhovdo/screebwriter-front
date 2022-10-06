import React, { FC, PropsWithChildren, useCallback, useRef, useState } from 'react';
import map from 'lodash/map';
import cn from 'classnames';

import useClickOutside from '../../hooks/useClickOutside';

import './GenerateNPCForm.scss';
import ConditionGeneratedNPCHOC from './includes/ConditionGeneratedNPCHOC';
import AddNpcButton from './includes/AddNpcButton';

interface IProps {
  isDisabled: boolean,
  hasTemplate: boolean,
  generatedNpcCount: number,
  isDisabledFieldByTemplate: (fieldName: string) => boolean,
}

const GenerateNPCForm: FC<IProps> = (
  {
    isDisabled,
    generatedNpcCount,
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
    <div ref={ref} className={cn([ 'GenerateNPCForm', !visible && 'GenerateNPCForm--hidden' ])}>
      <h1>Npc generator</h1>
      <div className="GenerateNPCForm__toggle" role="button" onClick={toggle}/>
      <div className="columns">
        {map(Array(generatedNpcCount), (npc, i) => (
          <ConditionGeneratedNPCHOC
            key={i}
            i={i}
            isDisabled={isDisabled}
            hasTemplate={hasTemplate}
            setPopupVisible={setPopupVisible}
            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
          />
        ))}
        {!hasTemplate && !isDisabled && generatedNpcCount < 3 && (
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

  if (prevProps.generatedNpcCount !== nextProps.generatedNpcCount) {
    return false;
  }

  if (prevProps.isDisabledFieldByTemplate !== nextProps.isDisabledFieldByTemplate) {
    return false;
  }

  if (prevProps.hasTemplate !== nextProps.hasTemplate) {
    return false;
  }

  return true;
};

export default React.memo(GenerateNPCForm, areEqual);
