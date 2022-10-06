import React, { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { Field } from 'formik';
import nameOfValues from '../../../helpres/nameOfValues';
import nameOf from '../../../helpres/nameOf';
import CheckboxInput from '../../CheckboxInput/CheckboxInput';
import AsyncCascaderInput, { ICascaderOption } from '../../CascaderInput/AsyncCascaderInput';
import AsyncSelectInput from '../../SelectInput/AsyncSelectInput';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import SelectInput, { ISelectOption } from '../../SelectInput/SelectInput';
import {
  ages,
  attractiveness,
  happiness,
  healths,
  intelligence, money,
  popularity,
  productivity,
  stress, wealth,
} from '../../../data/data';
import { Values } from '../../MainForm/interfaces';
import map from 'lodash/map';
import { useInstance } from 'react-ioc';
import ApiClient from '../../../Api/ApiClient';
import isEqual from 'lodash/isEqual';


interface IBlockedOccupation {
  primarySchool: boolean,
  highSchool: boolean,
  partTimeJob: boolean,
  retirement: boolean,
  middleSchool: boolean,
  college: boolean,
  fullTimeJob: boolean,
  jobless: boolean,
}

const fullOccupationDisabled: IBlockedOccupation = {
  primarySchool: true,
  highSchool: true,
  partTimeJob: true,
  retirement: true,
  middleSchool: true,
  college: true,
  fullTimeJob: true,
  jobless: true,
};

const fullOccupationEnabled: IBlockedOccupation = {
  primarySchool: false,
  highSchool: false,
  middleSchool: false,
  partTimeJob: false,
  retirement: false,
  college: false,
  fullTimeJob: false,
  jobless: false,
};


interface IProps {
  isDisabled: boolean,
  mainCharacter: Values['mainCharacter'],
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  setPopupVisible: (value: boolean) => void;
  isDisabledFieldByTemplate: (fieldName: string) => boolean,
}

const GGLeftForm: FC<IProps> = (
  {
    isDisabled,
    mainCharacter,
    setFieldValue,
    setPopupVisible,
    isDisabledFieldByTemplate,
  },
) => {
  const apiClient = useInstance(ApiClient);

  const [ occupationDisabled, setOccupationDisabled ] = useState<IBlockedOccupation>(fullOccupationEnabled);

  useEffect(() => {
    if (occupationDisabled.primarySchool) {
      setFieldValue(nameOfValues(nameOf(() => mainCharacter.occupation.primarySchool)), false);
    }
    if (occupationDisabled.highSchool) {
      setFieldValue(nameOfValues(nameOf(() => mainCharacter.occupation.highSchool)), false);
    }
    if (occupationDisabled.middleSchool) {
      setFieldValue(nameOfValues(nameOf(() => mainCharacter.occupation.middleSchool)), false);
    }
    if (occupationDisabled.partTimeJob) {
      setFieldValue(nameOfValues(nameOf(() => mainCharacter.occupation.partTimeJob)), false);
    }
    if (occupationDisabled.retirement) {
      setFieldValue(nameOfValues(nameOf(() => mainCharacter.occupation.retirement)), false);
    }
    if (occupationDisabled.college) {
      setFieldValue(nameOfValues(nameOf(() => mainCharacter.occupation.college)), false);
    }
    if (occupationDisabled.fullTimeJob) {
      setFieldValue(nameOfValues(nameOf(() => mainCharacter.occupation.fullTimeJob)), false);
    }
    if (occupationDisabled.jobless) {
      setFieldValue(nameOfValues(nameOf(() => mainCharacter.occupation.jobless)), false);
    }
  }, [ occupationDisabled, setFieldValue, mainCharacter.occupation ]);

  useEffect(() => {
    const o = mainCharacter.occupation;

    // При выделении фулл тайм джоб, блокируется все кроме парт тайм джоб.
    if (o.fullTimeJob) {
      setOccupationDisabled({
        ...fullOccupationDisabled,
        partTimeJob: false,
        fullTimeJob: false,
      });

      return;
    }

    // при выделении парт тайм, блокируется примари и мидл скул а так же безработный.
    if (o.partTimeJob) {
      setOccupationDisabled({
        ...fullOccupationEnabled,
        primarySchool: true,
        middleSchool: true,
        jobless: true,
      });

      return;
    }

    // одновременно может быть выделена вся учеба.
    if (o.primarySchool || o.highSchool || o.middleSchool || o.college) {
      setOccupationDisabled({
        ...fullOccupationDisabled,
        primarySchool: false,
        middleSchool: false,
        highSchool: false,
        college: false,
      });

      return;
    }

    // выбор пенсии блокирует все
    if (o.retirement) {
      setOccupationDisabled({
        ...fullOccupationDisabled,
        retirement: false,
      });

      return;
    }

    // выбор безработного блокирует все
    if (o.jobless) {
      setOccupationDisabled({
        ...fullOccupationDisabled,
        jobless: false,
      });

      return;
    }

    setOccupationDisabled(fullOccupationEnabled);
  }, [ mainCharacter.occupation ]);

  const perksRequestOptions = useCallback(async (filterValue?: string | undefined): Promise<ISelectOption[]> => {
    const data = await apiClient.fetchPerks(filterValue);

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.id,
      label: item.title,
    }));
  }, [ apiClient ]);

  const flagsRequestOptions = useCallback(async (filterValue?: string | undefined): Promise<ISelectOption[]> => {
    const data = await apiClient.fetchStoryFlags(filterValue);

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.id,
      label: item.title,
    }));
  }, [ apiClient ]);

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

  const assetTypesRequestOptions = useCallback(async (): Promise<ICascaderOption[]> => {
    const data = await apiClient.fetchAssetTypes();

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.title,
      label: item.title,
      children: map(item.assets, asset => ({
        value: asset.title,
        label: asset.title,
      })),
    }));
  }, [ apiClient ]);

  const skillGroupsRequestOptions = useCallback(async (): Promise<ICascaderOption[]> => {
    const data = await apiClient.fetchSkillGroups();

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.title,
      label: item.title,
      children: map(item.skills, skill => ({
        value: skill.title,
        label: skill.title,
        children: map(skill.skill_levels, level => ({
          value: level.title,
          label: level.title,
        })),
      })),
    }));
  }, [ apiClient ]);

  const actionReferencesRequestOptions = useCallback(async (filterValue?: string | undefined): Promise<ISelectOption[]> => {
    const data = await apiClient.fetchActionReferences(filterValue);

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.id,
      label: item.title,
    }));
  }, [ apiClient ]);

  const chainStoriesRequestOptions = useCallback(async (filterValue?: string | undefined): Promise<ISelectOption[]> => {
    const data = await apiClient.fetchChainStories(filterValue);

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.id,
      label: item.title,
    }));
  }, [ apiClient ]);

  return (
    <div className="column column--big">
      <h2>Main Character</h2>
      <div className="radio-label">Occupation</div>
      <div className="radios">
        <div className="left">
          <Field
            name={nameOfValues(nameOf(() => mainCharacter.occupation.primarySchool))}
            type="checkbox"
            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            disabled={isDisabled || occupationDisabled.primarySchool}
            component={CheckboxInput}
            label="Primary School"
          />
          <Field
            name={nameOfValues(nameOf(() => mainCharacter.occupation.highSchool))}
            type="checkbox"
            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            disabled={isDisabled || occupationDisabled.highSchool}
            component={CheckboxInput}
            label="High School"
          />
          <Field
            name={nameOfValues(nameOf(() => mainCharacter.occupation.partTimeJob))}
            type="checkbox"
            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            disabled={isDisabled || occupationDisabled.partTimeJob}
            component={CheckboxInput}
            label="Part Time Job"
          />
          <Field
            name={nameOfValues(nameOf(() => mainCharacter.occupation.retirement))}
            type="checkbox"
            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            disabled={isDisabled || occupationDisabled.retirement}
            component={CheckboxInput}
            label="Retirement"
          />
        </div>
        <div className="right">
          <Field
            name={nameOfValues(nameOf(() => mainCharacter.occupation.middleSchool))}
            type="checkbox"
            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            disabled={isDisabled || occupationDisabled.middleSchool}
            component={CheckboxInput}
            label="Middle School"
          />
          <Field
            name={nameOfValues(nameOf(() => mainCharacter.occupation.college))}
            type="checkbox"
            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            disabled={isDisabled || occupationDisabled.college}
            component={CheckboxInput}
            label="College"
          />
          <Field
            name={nameOfValues(nameOf(() => mainCharacter.occupation.fullTimeJob))}
            type="checkbox"
            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            disabled={isDisabled || occupationDisabled.fullTimeJob}
            component={CheckboxInput}
            label="Full Time Job"
          />
          <Field
            name={nameOfValues(nameOf(() => mainCharacter.occupation.jobless))}
            type="checkbox"
            isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            disabled={isDisabled || occupationDisabled.jobless}
            component={CheckboxInput}
            label="Jobless"
          />
        </div>
      </div>
      <Field
        component={AsyncCascaderInput}
        isClearable={true}
        isDisabledFieldByTemplate={isDisabledFieldByTemplate}
        onPopupVisibleChange={setPopupVisible}
        label="Absolute Occupation"
        promiseOptions={absoluteOccupationsGroupsRequestOptions}
        name={nameOfValues(nameOf(() => mainCharacter.absoluteOccupation))}
        disabled={isDisabled}
      />
      <Field
        component={AsyncCascaderInput}
        isClearable={true}
        isDisabledFieldByTemplate={isDisabledFieldByTemplate}
        onPopupVisibleChange={setPopupVisible}
        label="Skill"
        promiseOptions={skillGroupsRequestOptions}
        name={nameOfValues(nameOf(() => mainCharacter.skill))}
        disabled={isDisabled}
      />
      <Field
        component={AsyncSelectInput}
        isClearable={true}
        isDisabledFieldByTemplate={isDisabledFieldByTemplate}
        label="Action reference"
        promiseOptions={actionReferencesRequestOptions}
        name={nameOfValues(nameOf(() => mainCharacter.actionReference))}
        disabled={isDisabled}
      />
      <Field
        component={AsyncSelectInput}
        isClearable={true}
        isDisabledFieldByTemplate={isDisabledFieldByTemplate}
        isMulti={true}
        label="Perks"
        promiseOptions={perksRequestOptions}
        name={nameOfValues(nameOf(() => mainCharacter.perks))}
        disabled={isDisabled}
      />
      <Field
        component={AsyncSelectInput}
        isClearable={true}
        isDisabledFieldByTemplate={isDisabledFieldByTemplate}
        label="Flags"
        promiseOptions={flagsRequestOptions}
        name={nameOfValues(nameOf(() => mainCharacter.flag))}
        disabled={isDisabled}
      />
      <Field
        component={AsyncSelectInput}
        isClearable={true}
        isDisabledFieldByTemplate={isDisabledFieldByTemplate}
        label="Chain Story"
        promiseOptions={chainStoriesRequestOptions}
        name={nameOfValues(nameOf(() => mainCharacter.chainStory))}
        disabled={isDisabled}
      />
      <Tabs className="tabs-gg">
        <TabList>
          <Tab>Physical</Tab>
          <Tab>Mental</Tab>
          <Tab>Social</Tab>
        </TabList>
        <TabPanel>
          <div>
            <Field
              component={SelectInput}
              isClearable={true}
              label="Age"
              isMulti={true}
              options={ages}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              name={nameOfValues(nameOf(() => mainCharacter.params.physical.age))}
              disabled={isDisabled}
            />
          </div>
          <div>
            <Field
              component={SelectInput}
              isClearable={true}
              label="Health"
              options={healths}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              name={nameOfValues(nameOf(() => mainCharacter.params.physical.health))}
              disabled={isDisabled}
            />
          </div>
          <div className="tab-2">
            <div className="label label--bold">Gender</div>
            <div className="radio-in-one-column">
              <Field
                name={nameOfValues(nameOf(() => mainCharacter.params.physical.gender.male))}
                type="checkbox"
                disabled={isDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Male"
              />
              <Field
                name={nameOfValues(nameOf(() => mainCharacter.params.physical.gender.female))}
                type="checkbox"
                disabled={isDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Female"
              />
              <Field
                name={nameOfValues(nameOf(() => mainCharacter.params.physical.gender.else))}
                type="checkbox"
                disabled={isDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Else"
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <Field
              component={SelectInput}
              isClearable={true}
              label="Happiness"
              options={happiness}
              name={nameOfValues(nameOf(() => mainCharacter.params.mental.happiness))}
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            />
          </div>
          <div>
            <Field
              component={SelectInput}
              isClearable={true}
              label="Intelligence"
              options={intelligence}
              name={nameOfValues(nameOf(() => mainCharacter.params.mental.intelligence))}
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            />
          </div>
          <div>
            <Field
              component={SelectInput}
              isClearable={true}
              label="Stress"
              options={stress}
              name={nameOfValues(nameOf(() => mainCharacter.params.mental.stress))}
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            />
          </div>
          <div>
            <Field
              component={SelectInput}
              isClearable={true}
              label="Productivity"
              options={productivity}
              name={nameOfValues(nameOf(() => mainCharacter.params.mental.productivity))}
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <Field
              component={SelectInput}
              isClearable={true}
              label="Looks"
              options={attractiveness}
              name={nameOfValues(nameOf(() => mainCharacter.params.social.attractiveness))}
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            />
          </div>
          <div>
            <Field
              component={SelectInput}
              isClearable={true}
              label="Popularity"
              options={popularity}
              name={nameOfValues(nameOf(() => mainCharacter.params.social.popularity))}
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            />
          </div>
          <div>
            <Field
              component={SelectInput}
              isClearable={true}
              label="Money, $"
              options={money}
              name={nameOfValues(nameOf(() => mainCharacter.params.social.money))}
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            />
          </div>
          <div>
            <Field
              component={SelectInput}
              isClearable={true}
              label="Wealth"
              options={wealth}
              name={nameOfValues(nameOf(() => mainCharacter.params.social.wealth))}
              disabled={isDisabled}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
            />
          </div>
          <Field
              component={AsyncCascaderInput}
              isClearable={true}
              isDisabledFieldByTemplate={isDisabledFieldByTemplate}
              onPopupVisibleChange={setPopupVisible}
              label="Assets"
              promiseOptions={assetTypesRequestOptions}
              name={nameOfValues(nameOf(() => mainCharacter.params.social.assets))}
              disabled={isDisabled}
          />
          <div className="tab-2">
            <div className="label label--bold">Sexual Preferences</div>
            <div>
              <Field
                name={nameOfValues(nameOf(() => mainCharacter.params.social.sexualPreferences.straight))}
                type="checkbox"
                disabled={isDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Straight"
              />
              <Field
                name={nameOfValues(nameOf(() => mainCharacter.params.social.sexualPreferences.bisexual))}
                type="checkbox"
                disabled={isDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Bisexual"
              />
              <Field
                name={nameOfValues(nameOf(() => mainCharacter.params.social.sexualPreferences.gay))}
                type="checkbox"
                disabled={isDisabled}
                isDisabledFieldByTemplate={isDisabledFieldByTemplate}
                component={CheckboxInput}
                label="Gay"
              />
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

const areEqual = (prevProps: Readonly<PropsWithChildren<IProps>>, nextProps: Readonly<PropsWithChildren<IProps>>) => {
  if (prevProps.isDisabled !== nextProps.isDisabled) {
    return false;
  }

  if (prevProps.setPopupVisible !== nextProps.setPopupVisible) {
    return false;
  }

  if (prevProps.setFieldValue !== nextProps.setFieldValue) {
    return false;
  }

  if (prevProps.isDisabledFieldByTemplate !== nextProps.isDisabledFieldByTemplate) {
    return false;
  }

  return isEqual(prevProps.mainCharacter, nextProps.mainCharacter);
};

export default React.memo(GGLeftForm, areEqual);
