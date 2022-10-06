import React, { FC, PropsWithChildren, useCallback, useRef, useState } from 'react';
import { Field } from 'formik';
import cn from 'classnames';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { EnumNPCType, IOptionValue } from '../MainForm/interfaces';
import useClickOutside from '../../hooks/useClickOutside';
import getNpcTitle from '../../helpres/getNpcTitle';
import TextInput from '../TextInput';

import './RightForm.scss';
import nameOf from '../../helpres/nameOf';
import nameOfValues from '../../helpres/nameOfValues';
import { ISelectOption } from '../SelectInput/SelectInput';
import {
  changesAppearance,
  changesCraziness,
  changesHappiness,
  changesHealth,
  changesIntelligence,
  changesKarma,
  changesProductivity,
  changesStress,
  npcChangesPassion,
  npcChangesRelationship,
  popularityChanges,
} from '../../data/data';
import { useInstance } from 'react-ioc';
import ApiClient, { IStory } from '../../Api/ApiClient';
import AsyncSelectInput from '../SelectInput/AsyncSelectInput';
import isChangesFieldDisabledByTemplate from '../../helpres/isChangesFieldDisabledByTemplate';

const getOptionTitle = (i: number): string => {
  switch (i) {
    case 0:
      return '1st option';
    case 1:
      return '2nd option';
    case 2:
      return '3rd option';
    case 3:
      return '4th option';
    default:
      return '';
  }
};

interface IProps {
  isDisabled: boolean,
  options: Omit<IOptionValue, 'option' | 'result' | 'diaryEntry'>[],
  npcs: { type: EnumNPCType }[],
  isDisabledFieldByTemplate: (fieldName: string) => boolean,
  story?: IStory,
}

const fakePromise = (data: any) => () => new Promise(function (resolve) {
  setTimeout(resolve, 0);
}).then(() => data);


const RightForm: FC<IProps> = (
  {
    isDisabled,
    options,
    npcs,
    story,
    isDisabledFieldByTemplate,
  },
) => {
  const [ visible, setVisible ] = useState<boolean>(false);
  const apiClient = useInstance(ApiClient);

  const ref = useRef(null);

  const hide = useCallback(() => {
    setVisible(false);
  }, [ setVisible ]);

  const toggle = useCallback(() => {
    setVisible(!visible);
  }, [ setVisible, visible ]);

  useClickOutside(ref, hide);

  const flagsRequestOptions = useCallback(async (filterValue?: string | undefined): Promise<ISelectOption[]> => {
    const data = await apiClient.fetchFlags(filterValue);

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.id,
      label: item.title,
    }));
  }, [ apiClient ]);

  const flagsNpcRequestOptions = useCallback(async (filterValue?: string | undefined): Promise<ISelectOption[]> => {
    const data = await apiClient.fetchNpcFlags(filterValue);

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.id,
      label: item.title,
    }));
  }, [ apiClient ]);

  return (
    <div ref={ref} className={cn([ 'RightForm', !visible && 'RightForm--hidden' ])}>
      <h1>Change</h1>
      <div className="RightForm__toggle" role="button" onClick={toggle}/>
      <div className="content">
        {visible && (
          <Tabs>
            <TabList>
              {map(options, (option, i) => (
                <Tab key={i}>{getOptionTitle(i)}</Tab>
              ))}
            </TabList>
            {map(options, (option, i) => (
              <TabPanel key={i}>
                <div className="columns">
                  <div className="column column--big">
                    <h2>Main Character</h2>
                    <br/>
                    <Field
                      isSearchable={false}
                      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                      component={AsyncSelectInput}
                      isClearable={true}
                      label="Health"
                      options={changesHealth}
                      promiseOptions={fakePromise(changesHealth)}
                      name={nameOfValues(nameOf(() => options[i].mainCharacterChanges.health), i)}
                      disabled={isDisabled || isChangesFieldDisabledByTemplate(nameOfValues(nameOf(() => options[i].mainCharacterChanges.health), i), story?.template)}
                    />
                    <Field
                      isSearchable={false}
                      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                      component={AsyncSelectInput}
                      isClearable={true}
                      label="Happiness"
                      options={changesHappiness}
                      promiseOptions={fakePromise(changesHappiness)}
                      name={nameOfValues(nameOf(() => options[i].mainCharacterChanges.happiness), i)}
                      disabled={isDisabled}
                    />
                    <Field
                      isSearchable={false}
                      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                      component={AsyncSelectInput}
                      isClearable={true}
                      label="Intelligence"
                      options={changesIntelligence}
                      promiseOptions={fakePromise(changesIntelligence)}
                      name={nameOfValues(nameOf(() => options[i].mainCharacterChanges.intelligence), i)}
                      disabled={isDisabled}
                    />
                    <Field
                      isSearchable={false}
                      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                      component={AsyncSelectInput}
                      isClearable={true}
                      label="Stress"
                      options={changesStress}
                      promiseOptions={fakePromise(changesStress)}
                      name={nameOfValues(nameOf(() => options[i].mainCharacterChanges.stress), i)}
                      disabled={isDisabled}
                    />
                    <Field
                      isSearchable={false}
                      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                      component={AsyncSelectInput}
                      isClearable={true}
                      label="Productivity"
                      options={changesProductivity}
                      promiseOptions={fakePromise(changesProductivity)}
                      name={nameOfValues(nameOf(() => options[i].mainCharacterChanges.productivity), i)}
                      disabled={isDisabled}
                    />
                    <Field
                      isSearchable={false}
                      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                      component={AsyncSelectInput}
                      isClearable={true}
                      label="Looks"
                      options={changesAppearance}
                      promiseOptions={fakePromise(changesAppearance)}
                      name={nameOfValues(nameOf(() => options[i].mainCharacterChanges.appearance), i)}
                      disabled={isDisabled}
                    />
                    <Field
                      isSearchable={false}
                      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                      component={AsyncSelectInput}
                      isClearable={true}
                      label="Popularity"
                      options={popularityChanges}
                      promiseOptions={fakePromise(popularityChanges)}
                      name={nameOfValues(nameOf(() => options[i].mainCharacterChanges.popularity), i)}
                      disabled={isDisabled}
                    />
                    <Field
                      isSearchable={false}
                      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                      component={AsyncSelectInput}
                      isClearable={true}
                      label="Karma"
                      options={changesKarma}
                      promiseOptions={fakePromise(changesKarma)}
                      name={nameOfValues(nameOf(() => options[i].mainCharacterChanges.karma), i)}
                      disabled={isDisabled}
                    />

                    <Field
                      isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                      component={AsyncSelectInput}
                      isClearable={true}
                      label="Flag change"
                      promiseOptions={flagsRequestOptions}
                      name={nameOfValues(nameOf(() => options[i].mainCharacterChanges.flagChange), i)}
                      disabled={isDisabled}
                    />

                    <div className="money-input-wrapper">
                      <Field
                        isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                        component={TextInput}
                        small={true}
                        type="number"
                        label="Money, $"
                        name={nameOfValues(nameOf(() => options[i].mainCharacterChanges.wealth), i)}
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                  {map(npcs, (npc, j) => {
                    if (npc.type === EnumNPCType.DOES_NOT_EXIST) {
                      return null;
                    }

                    return (
                      <div className="column column--big" key={j}>
                        <h2>{getNpcTitle(j)}</h2>
                        <br/>
                        <Field
                          isSearchable={false}
                          isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                          component={AsyncSelectInput}
                          isClearable={true}
                          label="Relationship"
                          options={npcChangesRelationship}
                          promiseOptions={fakePromise(npcChangesRelationship)}
                          name={nameOfValues(nameOf(() => options[i].npcChanges[j].relationship), i, j)}
                          disabled={isDisabled}
                        />
                        <Field
                          isSearchable={false}
                          isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                          component={AsyncSelectInput}
                          isClearable={true}
                          label="Passion"
                          options={npcChangesPassion}
                          promiseOptions={fakePromise(npcChangesPassion)}
                          name={nameOfValues(nameOf(() => options[i].npcChanges[j].passion), i, j)}
                          disabled={isDisabled}
                        />
                        <Field
                          isSearchable={false}
                          isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                          component={AsyncSelectInput}
                          isClearable={true}
                          label="Happiness"
                          options={changesHappiness}
                          promiseOptions={fakePromise(changesHappiness)}
                          name={nameOfValues(nameOf(() => options[i].npcChanges[j].happiness), i, j)}
                          disabled={isDisabled}
                        />
                        <Field
                          isSearchable={false}
                          isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                          component={AsyncSelectInput}
                          isClearable={true}
                          label="Health"
                          options={changesHealth}
                          promiseOptions={fakePromise(changesHealth)}
                          name={nameOfValues(nameOf(() => options[i].npcChanges[j].health), i, j)}
                          disabled={isDisabled}
                        />
                        <Field
                          isSearchable={false}
                          isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                          component={AsyncSelectInput}
                          isClearable={true}
                          label="Productivity"
                          options={changesProductivity}
                          promiseOptions={fakePromise(changesProductivity)}
                          name={nameOfValues(nameOf(() => options[i].npcChanges[j].productivity), i, j)}
                          disabled={isDisabled}
                        />
                        <Field
                          isSearchable={false}
                          isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                          component={AsyncSelectInput}
                          isClearable={true}
                          label="Craziness"
                          options={changesCraziness}
                          promiseOptions={fakePromise(changesCraziness)}
                          name={nameOfValues(nameOf(() => options[i].npcChanges[j].craziness), i, j)}
                          disabled={isDisabled}
                        />

                        <Field
                          isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                          component={AsyncSelectInput}
                          isClearable={true}
                          label="Flag change"
                          promiseOptions={flagsNpcRequestOptions}
                          name={nameOfValues(nameOf(() => options[i].npcChanges[j].flagChange), i, j)}
                          disabled={isDisabled}
                        />

                        <div className="money-input-wrapper">
                          <Field
                            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                            component={TextInput}
                            small={true}
                            type="number"
                            label="Money, $"
                            name={nameOfValues(nameOf(() => options[i].npcChanges[j].wealth), i, j)}
                            disabled={isDisabled}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabPanel>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

const areEqual = (prevProps: Readonly<PropsWithChildren<IProps>>, nextProps: Readonly<PropsWithChildren<IProps>>) => {
  if (prevProps.isDisabled !== nextProps.isDisabled) {
    return false;
  }

  if (!isEqual(prevProps.options, nextProps.options)) {
    return false;
  }

  if (!isEqual(prevProps.story, nextProps.story)) {
    return false;
  }

  if (!isEqual(prevProps.isDisabledFieldByTemplate, nextProps.isDisabledFieldByTemplate)) {
    return false;
  }

  return isEqual(prevProps.npcs, nextProps.npcs);
};

export default React.memo(RightForm, areEqual);
