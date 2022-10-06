import React, { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { Field } from 'formik';
import isEqual from 'lodash/isEqual';

import getNpcTitle from '../../../helpres/getNpcTitle';
import { IGeneratedNPC } from '../../MainForm/interfaces';
import CheckboxInput from '../../CheckboxInput/CheckboxInput';
import SelectInput from '../../SelectInput/SelectInput';
import map from 'lodash/map';
import { useInstance } from 'react-ioc';
import ApiClient from '../../../Api/ApiClient';
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
  generatedNPCSexualPreferences, generatedNPCages,
} from '../../../data/data';
import RemoveNpcButton from './RemoveNpcButton';
import CopyNpcButton from "./CopyNpcButton";

interface IProps {
  i: number,
  npcCount: number,
  optionsCount: number,
  isDisabled: boolean,
  hasTemplate: boolean,
  setPopupVisible: (value: boolean) => void,
  generatedNpc: IGeneratedNPC,
  isDisabledFieldByTemplate: (fieldName: string) => boolean,
}

const ConditionGeneratedNPC: FC<IProps> = (
  {
    npcCount,
    optionsCount,
    i,
    isDisabled,
    setPopupVisible,
    generatedNpc,
    hasTemplate,
    isDisabledFieldByTemplate,
  },
) => {
  const apiClient = useInstance(ApiClient);

  const [ isEnemySelected, setIsEnemySelected ] = useState<boolean>(false);

  const [ shouldDisableRightColumnFields, setShouldDisableRightColumnFields ] = useState<boolean>(false);
  const [ isExFieldSelected, setIsExFieldSelected ] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Выбор Enemy запрещает выбор всего в блоке Relationship
     */
    if (generatedNpc.basic.relationship.enemy) {
      setIsEnemySelected(true);
    } else {
      setIsEnemySelected(false);
    }

    /**
     * Выбор любого из Ex блокирует все, кроме самого себя в блоке Relationship
     */
    if (generatedNpc.basic.relationship.exFriend
      || generatedNpc.basic.relationship.exBetrothed
      || generatedNpc.basic.relationship.exLovers
      || generatedNpc.basic.relationship.exSignificantOther
      || generatedNpc.basic.relationship.exSpouse
    ) {
      setIsExFieldSelected(true);
    } else {
      setIsExFieldSelected(false);
    }

    /**
     * Выбор любого из левой колонки блокирует все поля справа в разделе Relationship
     */
    if (generatedNpc.basic.relationship.friend
      || generatedNpc.basic.relationship.significantOther
      || generatedNpc.basic.relationship.lovers
      || generatedNpc.basic.relationship.betrothed
      || generatedNpc.basic.relationship.spouse
        || generatedNpc.basic.relationship.crush
    ) {
      setShouldDisableRightColumnFields(true);
    } else {
      setShouldDisableRightColumnFields(false);
    }
  }, [ i, generatedNpc ]);

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
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.friend), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || isEnemySelected || isExFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Friend"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.significantOther), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || isEnemySelected || isExFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="SignificantOther"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.betrothed), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || isEnemySelected || isExFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Engaged"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.spouse), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || isEnemySelected || isExFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Wife\Husband"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.lovers), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || isEnemySelected || isExFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Lovers"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.crush), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || isEnemySelected || isExFieldSelected}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Crush"
          />
        </div>
        <div className="right">
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.exFriend), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || isEnemySelected || shouldDisableRightColumnFields
                  || (isExFieldSelected && !generatedNpc.basic.relationship.exFriend)}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Ex Friend"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.exSignificantOther), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || isEnemySelected || shouldDisableRightColumnFields
                  || (isExFieldSelected && !generatedNpc.basic.relationship.exSignificantOther)}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Ex SignificantOther"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.exBetrothed), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || isEnemySelected || shouldDisableRightColumnFields
                  || (isExFieldSelected && !generatedNpc.basic.relationship.exBetrothed)}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Ex Engaged"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.exSpouse), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || isEnemySelected || shouldDisableRightColumnFields
                  || (isExFieldSelected && !generatedNpc.basic.relationship.exSpouse)}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Ex Wife\Husband"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.exLovers), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || isEnemySelected || shouldDisableRightColumnFields
                  || (isExFieldSelected && !generatedNpc.basic.relationship.exLovers)}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Ex Lovers"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.relationship.enemy), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled || shouldDisableRightColumnFields || isExFieldSelected}
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
              name={nameOfNPC(nameOf(() => generatedNpc.basic.gender.male), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Male"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.gender.female), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Female"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.gender.else), i, 'generatedNpc')}
              type="checkbox"
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={CheckboxInput}
              label="Else"
          />
          <Field
              name={nameOfNPC(nameOf(() => generatedNpc.basic.gender.same), i, 'generatedNpc')}
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
        <div className="radio-label">Option change number</div>
        <div className="radios">
          <div className="left">
            <Field
                name={nameOfNPC(nameOf(() => generatedNpc.basic.changeNumber[0]), i, 'generatedNpc')}
                type="checkbox"
                disabled={isDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="1st option"
            />
            <Field
                name={nameOfNPC(nameOf(() => generatedNpc.basic.changeNumber[1]), i, 'generatedNpc')}
                type="checkbox"
                disabled={isDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="2nd option"
            />
          </div>
          <div className="right">
            {optionsCount >= 3 && (
                <Field
                    name={nameOfNPC(nameOf(() => generatedNpc.basic.changeNumber[2]), i, 'generatedNpc')}
                    type="checkbox"
                    disabled={isDisabled}
                    isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                    component={CheckboxInput}
                    label="3rd option"
                />
            )}
            {optionsCount === 4 && (
                <Field
                    name={nameOfNPC(nameOf(() => generatedNpc.basic.changeNumber[3]), i, 'generatedNpc')}
                    type="checkbox"
                    disabled={isDisabled}
                    isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                    component={CheckboxInput}
                    label="4th option"
                />
            )}
          </div>
        </div>
      </div>
      <Tabs>
        <TabList>
          <Tab>Basic</Tab>
          <Tab>Advanced</Tab>
        </TabList>
        <TabPanel>
          <RelationshipBlock />
          <div className="radio-label">Relative occupation</div>
          <div className="radios">
            <div className="left">
              <Field
                name={nameOfNPC(nameOf(() => generatedNpc.basic.relativeOccupation.classmate), i, 'generatedNpc')}
                type="checkbox"
                disabled={isDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Classmate"
              />
              <Field
                name={nameOfNPC(nameOf(() => generatedNpc.basic.relativeOccupation.higherInPosition), i, 'generatedNpc')}
                type="checkbox"
                disabled={isDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Higher in position"
              />
            </div>
            <div className="right">
              <Field
                name={nameOfNPC(nameOf(() => generatedNpc.basic.relativeOccupation.colleague), i, 'generatedNpc')}
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
            name={nameOfNPC(nameOf(() => generatedNpc.basic.absoluteOccupation), i, 'generatedNpc')}
            disabled={isDisabled}
          />
          <Field
            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            component={SelectInput}
            isClearable={true}
            label="Age"
            isMulti={true}
            options={generatedNPCages}
            name={nameOfNPC(nameOf(() => generatedNpc.basic.age), i, 'generatedNpc')}
            disabled={isDisabled}
          />
          <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Sexual Preferences"
              options={generatedNPCSexualPreferences}
              name={nameOfNPC(nameOf(() => generatedNpc.basic.sexualPreferences), i, 'generatedNpc')}
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
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.relationship), i, 'generatedNpc')}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Passion"
              options={advancedNPCConditionsSympathy}
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.passion), i, 'generatedNpc')}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Happiness"
              options={advancedNPCConditionsHappiness}
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.happiness), i, 'generatedNpc')}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Intelligence"
              options={advancedNPCConditionsIntelligence}
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.intelligence), i, 'generatedNpc')}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Health"
              options={advancedNPCConditionsHealth}
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.health), i, 'generatedNpc')}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Looks"
              options={advancedNPCConditionsLooks}
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.appearance), i, 'generatedNpc')}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Productivity"
              options={advancedNPCConditionsProductivity}
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.productivity), i, 'generatedNpc')}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Willpower"
              options={advancedNPCConditionsWillpower}
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.willpower), i, 'generatedNpc')}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Religiosity"
              options={advancedNPCConditionsReligiosity}
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.religiosity), i, 'generatedNpc')}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Generosity"
              options={advancedNPCConditionsGenerosity}
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.generosity), i, 'generatedNpc')}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Craziness"
              options={craziness}
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.craziness), i, 'generatedNpc')}
              disabled={isDisabled}
            />
            <Field
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              component={SelectInput}
              isClearable={true}
              label="Money, $"
              options={advancedNPCConditionsMoney}
              name={nameOfNPC(nameOf(() => generatedNpc.advanced.money), i, 'generatedNpc')}
              disabled={isDisabled}
            />
          </div>
        </TabPanel>
      </Tabs>
      {!hasTemplate && !isDisabled && (
        <RemoveNpcButton disabled={npcCount !== i + 1}/>
      )}
      {!hasTemplate && !isDisabled && (
        <CopyNpcButton npcNumber={i} disabled={npcCount === 3} />
      )}
    </div>
  );
};

const areEqual = (prevProps: Readonly<PropsWithChildren<IProps>>, nextProps: Readonly<PropsWithChildren<IProps>>) => {
  if(prevProps.optionsCount !== nextProps.optionsCount) {
    return false;
  }

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

  if (prevProps.isDisabledFieldByTemplate !== nextProps.isDisabledFieldByTemplate) {
    return false;
  }

  if (prevProps.hasTemplate !== nextProps.hasTemplate) {
    return false;
  }

  return isEqual(prevProps.generatedNpc, nextProps.generatedNpc);
};

export default React.memo(ConditionGeneratedNPC, areEqual);
