import React, { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { Field } from 'formik';
import isEqual from 'lodash/isEqual';

import getNpcTitle from '../../../helpres/getNpcTitle';
import { EnumNPCType, INPCModeDoesNotExist, INPCModeExist } from '../../MainForm/interfaces';
import RadioInput from '../../RadioInput/RadioInput';
import CheckboxInput from '../../CheckboxInput/CheckboxInput';
import SelectInput from '../../SelectInput/SelectInput';
import map from 'lodash/map';
import { useInstance } from 'react-ioc';
import ApiClient from '../../../Api/ApiClient';
import { FormikHandlers } from 'formik/dist/types';
import { getNPCHaveRelatives } from '../../../helpres/mapFormValuesToJson';
import nameOf from '../../../helpres/nameOf';
import nameOfNPC from '../../../helpres/nameOfNPC';
import AsyncCascaderInput, { ICascaderOption } from '../../CascaderInput/AsyncCascaderInput';
import {
  advancedNPCConditionsGenerosity,
  advancedNPCConditionsHappiness,
  advancedNPCConditionsHealth,
  advancedNPCConditionsIntelligence,
  advancedNPCConditionsLooks, advancedNPCConditionsMoney,
  advancedNPCConditionsProductivity,
  advancedNPCConditionsRelationship, advancedNPCConditionsReligiosity,
  advancedNPCConditionsSympathy,
  advancedNPCConditionsWillpower,
  craziness,
  ages,
} from '../../../data/data';
import RemoveNpcButton from './RemoveNpcButton';

interface IProps {
  i: number,
  npcCount: number,
  isDisabled: boolean,
  hasTemplate: boolean,
  setPopupVisible: (value: boolean) => void,
  npc: INPCModeExist | INPCModeDoesNotExist,
  onChangeModeNPC: (e: React.ChangeEvent<any>, formikOnChange: FormikHandlers['handleChange']) => void,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  isDisabledFieldByTemplate: (fieldName: string) => boolean,
}

const ConditionNPC: FC<IProps> = (
  {
    npcCount,
    i,
    isDisabled,
    setPopupVisible,
    onChangeModeNPC,
    npc,
    setFieldValue,
    hasTemplate,
    isDisabledFieldByTemplate,
  },
) => {
  const apiClient = useInstance(ApiClient);
  const [ isExFieldVisible, setIsExFieldVisible ] = useState<boolean>(false);
  const [ isRelativeDisabled, setIsRelativeDisabled ] = useState<boolean>(false);

  const [ isFriendDisabled, setIsFriendDisabled ] = useState<boolean>(false);
  const [ isEnemyFieldSelected, setIsEnemyFieldSelected ] = useState<boolean>(false);

  const [ isExFriendDisabled, setIsExFriendDisabled ] = useState<boolean>(false);

  const [ isEnemyDisabled, setIsEnemyDisabled ] = useState<boolean>(false);

  const [ shouldDisableRightColumnFields, setShouldDisableRightColumnFields ] = useState<boolean>(false);
  const [ isExFieldSelected, setIsExFieldSelected ] = useState<boolean>(false);

  const [ isR1Disabled, setR1Disabled ] = useState<boolean>(false);
  const [ isR2Disabled, setR2Disabled ] = useState<boolean>(false);

  const haveRelative = getNPCHaveRelatives(npc);

  useEffect(() => {
    if (npc.basic.relationship.ex) {
      setIsExFieldVisible(true);
    }
  }, [npc.basic.relationship.ex]);

  useEffect(() => {
    /**
     * Если выбрано любое значение в разделе Relative, либо в Relationship выбрали enemy, то:
     * 1. Выбор Friend в Relationship недоступен
     * 2. Только для раздела Relative также блокируется выбор ExFriend
     */
    if (haveRelative) {
      setIsFriendDisabled(true);
      setIsExFriendDisabled(true);
    } else {
      setIsFriendDisabled(false);
      setIsExFriendDisabled(false);
    }

    /**
     * Выбор Enemy запрещает выбор всех полей в левой колонке блока relationship
     */
    if (npc.basic.relationship.enemy) {
      setIsEnemyFieldSelected(true);
    } else if (!haveRelative) {
      setIsEnemyFieldSelected(false);
    }

    /**
     * Выбор Friend запрещает выбор Enemy
     * Выбор Friend запрещает выбор любого значения в блоке Relative
     */
    if (npc.basic.relationship.friend || npc.basic.relationship.exFriend) {
      setIsRelativeDisabled(true);

      if (npc.basic.relationship.friend) {
        setIsEnemyDisabled(true);
        setFieldValue(nameOfNPC(nameOf(() => npc.basic.relative.parent), i), false);
        setFieldValue(nameOfNPC(nameOf(() => npc.basic.relative.stepParent), i), false);
        setFieldValue(nameOfNPC(nameOf(() => npc.basic.relative.sibling), i), false);
        setFieldValue(nameOfNPC(nameOf(() => npc.basic.relative.stepSibling), i), false);
        setFieldValue(nameOfNPC(nameOf(() => npc.basic.relative.kid), i), false);
        setFieldValue(nameOfNPC(nameOf(() => npc.basic.relative.adoptedKid), i), false);
      }
    } else {
      setIsRelativeDisabled(false);
      setIsEnemyDisabled(false);
    }

    /**
     * Выбор любого из Ex блокирует все, кроме самого себя в блоке Relationship
     */
    if (npc.basic.relationship.exFriend
      || npc.basic.relationship.exBetrothed
      || npc.basic.relationship.exLovers
      || npc.basic.relationship.exSignificantOther
      || npc.basic.relationship.exSpouse
    ) {
      setIsExFieldSelected(true);
    } else {
      setIsExFieldSelected(false);
    }

    /**
     * Выбор любого, кроме Enemy и Crush, блокирует все EX поля в разделе Relationship
     */
    if (npc.basic.relationship.friend
      || npc.basic.relationship.significantOther
      || npc.basic.relationship.lovers
      || npc.basic.relationship.betrothed
      || npc.basic.relationship.spouse
      || npc.basic.relationship.crush
    ) {
      setShouldDisableRightColumnFields(true);
    } else {
      setShouldDisableRightColumnFields(false);
    }

    /**
     * В Relationship:
     * чекбоксы: Crush, SignificantOther / EX, Lovers / EX, Betrothed / EX, Spouse / EX
     * не могут быть отмечены одновременно с Parent, Sibling или Kid в блоке Relation
     */
    if (
      npc.basic.relationship.crush
      || npc.basic.relationship.significantOther
      || npc.basic.relationship.lovers
      || npc.basic.relationship.betrothed
      || npc.basic.relationship.spouse
      || npc.basic.relationship.exBetrothed
      || npc.basic.relationship.exLovers
      || npc.basic.relationship.exSignificantOther
      || npc.basic.relationship.exSpouse
    ) {
      setR1Disabled(true);
    } else {
      setR1Disabled(false);
    }

    /**
     * В Relationship:
     * чекбоксы: Crush, SignificantOther / EX, Lovers / EX, Betrothed / EX, Spouse / EX
     * не могут быть отмечены одновременно с Parent, Sibling или Kid в блоке Relation
     */
    if (npc.basic.relative.parent || npc.basic.relative.sibling || npc.basic.relative.kid) {
      setR2Disabled(true);
    } else {
      setR2Disabled(false);
    }
  }, [ i, setFieldValue, npc, haveRelative ]);

  const absoluteOccupationsGroupsRequestOptions = useCallback(async (): Promise<ICascaderOption[]> => {
    const data = await apiClient.fetchAbsoluteOccupationsGroups();

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.title,
      label: item.title,
      children: map(item.absolute_occupations, ao => ({
        value: ao.title,
        label: ao.title,
      })),
    }));
  }, [ apiClient ]);

  const RelationshipBlock = () => (
    <>
      <div className="radio-label">Relationship</div>
      <div className="radios">
        <div className="left">
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.friend), i)}
              type="checkbox"
              disabled={isDisabled || isFriendDisabled || isExFieldSelected || isEnemyFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Friend"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.significantOther), i)}
              type="checkbox"
              disabled={isDisabled || isR2Disabled || isExFieldSelected || isEnemyFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="SignificantOther"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.betrothed), i)}
              type="checkbox"
              disabled={isDisabled || isR2Disabled || isExFieldSelected || isEnemyFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Engaged"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.spouse), i)}
              type="checkbox"
              disabled={isDisabled || isR2Disabled || isExFieldSelected || isEnemyFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Wife\Husband"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.lovers), i)}
              type="checkbox"
              disabled={isDisabled || isR2Disabled || isExFieldSelected || isEnemyFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Lovers"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.crush), i)}
              type="checkbox"
              disabled={isDisabled || isR2Disabled || isExFieldSelected || isEnemyFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Crush"
          />
        </div>
        <div className="right">
          {isExFieldVisible && (
              <Field
                name={nameOfNPC(nameOf(() => npc.basic.relationship.ex), i)}
                type="checkbox"
                disabled={isDisabled || isExFriendDisabled || shouldDisableRightColumnFields
                    || (isExFieldSelected && !npc.basic.relationship.ex)}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Ex"
            />
          )}
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.exFriend), i)}
              type="checkbox"
              disabled={isDisabled || isExFriendDisabled || shouldDisableRightColumnFields
                  || (isExFieldSelected && !npc.basic.relationship.exFriend)}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Ex Friend"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.exSignificantOther), i)}
              type="checkbox"
              disabled={isDisabled || isR2Disabled || shouldDisableRightColumnFields
                  || (isExFieldSelected && !npc.basic.relationship.exSignificantOther)}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Ex SignificantOther"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.exBetrothed), i)}
              type="checkbox"
              disabled={isDisabled || isR2Disabled || shouldDisableRightColumnFields
                  || (isExFieldSelected && !npc.basic.relationship.exBetrothed)}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Ex Engaged"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.exSpouse), i)}
              type="checkbox"
              disabled={isDisabled || isR2Disabled || shouldDisableRightColumnFields
                  || (isExFieldSelected && !npc.basic.relationship.exSpouse)}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Ex Wife\Husband"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.exLovers), i)}
              type="checkbox"
              disabled={isDisabled || isR2Disabled || shouldDisableRightColumnFields
                  || (isExFieldSelected && !npc.basic.relationship.exLovers)}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Ex Lovers"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.relationship.enemy), i)}
              type="checkbox"
              disabled={isDisabled || isEnemyDisabled || isExFieldSelected || shouldDisableRightColumnFields}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Enemy"
          />
        </div>
      </div>
    </>
  );

  const GenderBlock = () => (
    <>
      <div className="tab-2">
        <div className="label label--bold">Gender</div>
        <div className="radio-in-one-column">
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.gender.male), i)}
              type="checkbox"
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Male"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.gender.female), i)}
              type="checkbox"
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Female"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.gender.else), i)}
              type="checkbox"
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Else"
          />
          <Field
              name={nameOfNPC(nameOf(() => npc.basic.gender.same), i)}
              type="checkbox"
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Same"
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="column column--big" key={i}>
      <h2>{getNpcTitle(i)}</h2>
      <div>
        <div className="radio-label">Mode</div>
        <div className="radios">
          <div className="left">
            <Field
              name={nameOfNPC(nameOf(() => npc.type), i)}
              id={nameOfNPC(nameOf(() => npc.type), i) + '.1'}
              type="radio"
              onChange={onChangeModeNPC}
              value={EnumNPCType.EXIST}
              disabled={isDisabled || hasTemplate}
              component={RadioInput}
              label="Exist"
            />
          </div>
          <div className="right">
            <Field
              name={nameOfNPC(nameOf(() => npc.type), i)}
              id={nameOfNPC(nameOf(() => npc.type), i) + '.2'}
              value={EnumNPCType.DOES_NOT_EXIST}
              type="radio"
              onChange={onChangeModeNPC}
              disabled={isDisabled || hasTemplate}
              component={RadioInput}
              label="Does not exist"
            />
          </div>
        </div>
      </div>
      {npc.type === EnumNPCType.EXIST && (
        <Tabs>
          <TabList>
            <Tab>Basic</Tab>
            <Tab>Advanced</Tab>
          </TabList>
          <TabPanel>
            <div className="radio-label">Relative</div>
            <div className="radios">
              <div className="left">
                <Field
                  name={nameOfNPC(nameOf(() => npc.basic.relative.parent), i)}
                  type="checkbox"
                  disabled={isDisabled || isRelativeDisabled || isR1Disabled}
                  isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                  component={CheckboxInput}
                  label="Parent"
                />
                <Field
                  name={nameOfNPC(nameOf(() => npc.basic.relative.stepParent), i)}
                  type="checkbox"
                  disabled={isDisabled || isRelativeDisabled}
                  isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                  component={CheckboxInput}
                  label="Step-parent"
                />
                <Field
                  name={nameOfNPC(nameOf(() => npc.basic.relative.sibling), i)}
                  type="checkbox"
                  disabled={isDisabled || isRelativeDisabled || isR1Disabled}
                  isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                  component={CheckboxInput}
                  label="Sibling"
                />
              </div>
              <div className="right">
                <Field
                  name={nameOfNPC(nameOf(() => npc.basic.relative.stepSibling), i)}
                  type="checkbox"
                  disabled={isDisabled || isRelativeDisabled}
                  isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                  component={CheckboxInput}
                  label="Step-sibling"
                />
                <Field
                  name={nameOfNPC(nameOf(() => npc.basic.relative.kid), i)}
                  type="checkbox"
                  disabled={isDisabled || isRelativeDisabled || isR1Disabled}
                  isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                  component={CheckboxInput}
                  label="Kid"
                />
                <Field
                  name={nameOfNPC(nameOf(() => npc.basic.relative.adoptedKid), i)}
                  type="checkbox"
                  disabled={isDisabled || isRelativeDisabled}
                  isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                  component={CheckboxInput}
                  label="Adopted kid"
                />
              </div>
            </div>
            <RelationshipBlock />
            <div className="radio-label">Relative occupation</div>
            <div className="radios">
              <div className="left">
                <Field
                  name={nameOfNPC(nameOf(() => npc.basic.relativeOccupation.classmate), i)}
                  type="checkbox"
                  disabled={isDisabled}
                  isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                  component={CheckboxInput}
                  label="Classmate"
                />
                <Field
                  name={nameOfNPC(nameOf(() => npc.basic.relativeOccupation.higherInPosition), i)}
                  type="checkbox"
                  disabled={isDisabled}
                  isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                  component={CheckboxInput}
                  label="Higher in position"
                />
              </div>
              <div className="right">
                <Field
                  name={nameOfNPC(nameOf(() => npc.basic.relativeOccupation.colleague), i)}
                  type="checkbox"
                  disabled={isDisabled}
                  isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                  component={CheckboxInput}
                  label="Colleague"
                />
              </div>
            </div>
            <Field
              component={AsyncCascaderInput}
              isClearable={true}
              onPopupVisibleChange={setPopupVisible}
              label="Absolute Occupation"
              promiseOptions={absoluteOccupationsGroupsRequestOptions}
              name={nameOfNPC(nameOf(() => npc.basic.absoluteOccupation), i)}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Age"
              isMulti={true}
              options={ages}
              name={nameOfNPC(nameOf(() => npc.basic.age), i)}
              disabled={isDisabled}
            />
            <GenderBlock />
          </TabPanel>
          <TabPanel>
            <div>
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Relationship"
                options={advancedNPCConditionsRelationship}
                name={nameOfNPC(nameOf(() => npc.advanced.relationship), i)}
                disabled={isDisabled}
              />
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Passion"
                options={advancedNPCConditionsSympathy}
                name={nameOfNPC(nameOf(() => npc.advanced.passion), i)}
                disabled={isDisabled}
              />
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Happiness"
                options={advancedNPCConditionsHappiness}
                name={nameOfNPC(nameOf(() => npc.advanced.happiness), i)}
                disabled={isDisabled}
              />
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Intelligence"
                options={advancedNPCConditionsIntelligence}
                name={nameOfNPC(nameOf(() => npc.advanced.intelligence), i)}
                disabled={isDisabled}
              />
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Health"
                options={advancedNPCConditionsHealth}
                name={nameOfNPC(nameOf(() => npc.advanced.health), i)}
                disabled={isDisabled}
              />
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Looks"
                options={advancedNPCConditionsLooks}
                name={nameOfNPC(nameOf(() => npc.advanced.appearance), i)}
                disabled={isDisabled}
              />
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Productivity"
                options={advancedNPCConditionsProductivity}
                name={nameOfNPC(nameOf(() => npc.advanced.productivity), i)}
                disabled={isDisabled}
              />
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Willpower"
                options={advancedNPCConditionsWillpower}
                name={nameOfNPC(nameOf(() => npc.advanced.willpower), i)}
                disabled={isDisabled}
              />
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Religiosity"
                options={advancedNPCConditionsReligiosity}
                name={nameOfNPC(nameOf(() => npc.advanced.religiosity), i)}
                disabled={isDisabled}
              />
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Generosity"
                options={advancedNPCConditionsGenerosity}
                name={nameOfNPC(nameOf(() => npc.advanced.generosity), i)}
                disabled={isDisabled}
              />
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Craziness"
                options={craziness}
                name={nameOfNPC(nameOf(() => npc.advanced.craziness), i)}
                disabled={isDisabled}
              />
              <Field
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={SelectInput}
                isClearable={true}
                label="Money, $"
                options={advancedNPCConditionsMoney}
                name={nameOfNPC(nameOf(() => npc.advanced.money), i)}
                disabled={isDisabled}
              />
            </div>
          </TabPanel>
        </Tabs>
      )}
      {npc.type === EnumNPCType.DOES_NOT_EXIST && (
        <React.Fragment>
          <div className="radio-label">Relative</div>
          <div className="radios">
            <div className="left">
              <Field
                name={nameOfNPC(nameOf(() => npc.basic.relative.parent), i)}
                type="checkbox"
                disabled={isDisabled || isRelativeDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Parent"
              />
              <Field
                name={nameOfNPC(nameOf(() => npc.basic.relative.stepParent), i)}
                type="checkbox"
                disabled={isDisabled || isRelativeDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Step-parent"
              />
              <Field
                name={nameOfNPC(nameOf(() => npc.basic.relative.sibling), i)}
                type="checkbox"
                disabled={isDisabled || isRelativeDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Sibling"
              />
            </div>
            <div className="right">
              <Field
                name={nameOfNPC(nameOf(() => npc.basic.relative.stepSibling), i)}
                type="checkbox"
                disabled={isDisabled || isRelativeDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Step-sibling"
              />
              <Field
                name={nameOfNPC(nameOf(() => npc.basic.relative.kid), i)}
                type="checkbox"
                disabled={isDisabled || isRelativeDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Kid"
              />
              <Field
                name={nameOfNPC(nameOf(() => npc.basic.relative.adoptedKid), i)}
                type="checkbox"
                disabled={isDisabled || isRelativeDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Adopted kid"
              />
            </div>
          </div>
          <RelationshipBlock />
          <GenderBlock />
        </React.Fragment>
      )}
      {!hasTemplate && !isDisabled && npcCount === i + 1 && (
        <RemoveNpcButton/>
      )}
    </div>
  );
};

const areEqual = (prevProps: Readonly<PropsWithChildren<IProps>>, nextProps: Readonly<PropsWithChildren<IProps>>) => {
  if (prevProps.npcCount !== nextProps.npcCount) {
    return false;
  }
  if (prevProps.i !== nextProps.i) {
    return false;
  }

  if (prevProps.isDisabled !== nextProps.isDisabled) {
    return false;
  }

  if (prevProps.setPopupVisible !== nextProps.setPopupVisible) {
    return false;
  }

  if (prevProps.onChangeModeNPC !== nextProps.onChangeModeNPC) {
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

  return isEqual(prevProps.npc, nextProps.npc);
};

export default React.memo(ConditionNPC, areEqual);
