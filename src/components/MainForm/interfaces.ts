import { ISelectOption } from '../SelectInput/AsyncSelectInput';
import { StoryStatus } from '../../Api/ApiClient';

export interface IOptionValue {
  option: string;
  result: string;
  diaryEntry: string;
  npcChanges: INPCChanges[],
  mainCharacterChanges: IMainCharacterChanges,
}

export interface IMinMaxValueMulti {
  label: string;
  value: {
    min?: string | number;
    max?: string | number;
    title?: string;
    sign?: string;
  }
}

export interface IMinMaxValue {
  min?: string | number;
  max?: string | number;
  title?: string;
}

export interface IMainCharacterMentalParams {
  happiness?: IMinMaxValue,
  intelligence?: IMinMaxValue,
  stress?: IMinMaxValue,
  productivity?: IMinMaxValue,
}

export interface IMainCharacterSexualPreferences {
  straight: boolean;
  bisexual: boolean;
  gay: boolean;
}

export interface IMainCharacterSocialParams {
  attractiveness?: IMinMaxValue,
  popularity?: IMinMaxValue,
  sexualPreferences: IMainCharacterSexualPreferences,
  money?: IMinMaxValue,
  wealth?: IMinMaxValue,
  assets?: string[],
}

export enum EnumNPCType {
  EXIST = 'EXIST',
  DOES_NOT_EXIST = 'DOES_NOT_EXIST',
}

interface INPCBase {
  relative: {
    parent: boolean,
    stepParent: boolean,
    sibling: boolean,
    stepSibling: boolean,
    kid: boolean,
    adoptedKid: boolean,
  },
  relationship: {
    friend: boolean,
    enemy: boolean,
    crush: boolean,
    significantOther: boolean,

    lovers: boolean,
    betrothed: boolean,
    spouse: boolean,
    exFriend: boolean,
    exSignificantOther: boolean,
    exBetrothed: boolean,
    exSpouse: boolean,
    exLovers: boolean,
    /**
     * deprecated
     */
    ex?: boolean,
  },
  gender: INpcGender,
}

interface IGeneratedNPCBase {
  /**
   * Та опция, где может появиться сгенеренный NPC
   */
  changeNumber: boolean[],
  relationship: {
    friend: boolean,
    enemy: boolean,
    crush: boolean,
    significantOther: boolean,

    lovers: boolean,
    betrothed: boolean,
    spouse: boolean,
    exFriend: boolean,
    exSignificantOther: boolean,
    exBetrothed: boolean,
    exSpouse: boolean,
    exLovers: boolean,

    /**
     * deprecated
     */
    ex?: boolean,
  },
  sexualPreferences?: string,
  gender: INpcGender,
  relativeOccupation: {
    classmate: boolean,
    colleague: boolean,
    higherInPosition: boolean,
  }
  absoluteOccupation?: string[],
  age: IMinMaxValueMulti[],
}

export interface IGeneratedNPC {
  basic: IGeneratedNPCBase,
  advanced: {
    relationship?: IMinMaxValue,
    passion?: IMinMaxValue,
    happiness?: IMinMaxValue,
    intelligence?: IMinMaxValue,
    health?: IMinMaxValue,
    appearance?: IMinMaxValue,
    productivity?: IMinMaxValue,
    willpower?: IMinMaxValue,
    religiosity?: IMinMaxValue,
    generosity?: IMinMaxValue,
    money?: IMinMaxValue,
    craziness?: IMinMaxValue,
  }
}

interface INpcGender extends IGender {
  same: boolean,
}

interface INPCModeExistBasic extends INPCBase {
  relativeOccupation: {
    classmate: boolean,
    colleague: boolean,
    higherInPosition: boolean,
  }
  absoluteOccupation?: string[],
  age: IMinMaxValueMulti[],
}

export interface INPCModeExist {
  type: EnumNPCType.EXIST,
  basic: INPCModeExistBasic,
  advanced: {
    relationship?: IMinMaxValue,
    passion?: IMinMaxValue,
    happiness?: IMinMaxValue,
    intelligence?: IMinMaxValue,
    health?: IMinMaxValue,
    appearance?: IMinMaxValue,
    productivity?: IMinMaxValue,
    willpower?: IMinMaxValue,
    religiosity?: IMinMaxValue,
    generosity?: IMinMaxValue,
    money?: IMinMaxValue,
    craziness?: IMinMaxValue,
  }
}

export interface INPCModeDoesNotExist {
  type: EnumNPCType.DOES_NOT_EXIST,
  basic: INPCBase,
}

export interface IGender {
  male: boolean,
  female: boolean,
  else: boolean,
}

export interface INPCChanges {
  relationship: number,
  passion: number,
  happiness: number,
  health: number,
  productivity: number,
  craziness: number,
  wealth: string,
  flagChange?: ISelectOption,
}

export interface IMainCharacterPhysicalParams {
  age: IMinMaxValueMulti[],
  health?: IMinMaxValue,
  gender: IGender,
}

export interface IMainCharacterOccupation {
  primarySchool: boolean,
  highSchool: boolean,
  partTimeJob: boolean,
  retirement: boolean,
  middleSchool: boolean,
  college: boolean,
  fullTimeJob: boolean,
  jobless: boolean,
}


export interface IMainCharacter {
  skill?: string[],
  absoluteOccupation?: string[],
  actionReference?: ISelectOption,
  chainStory?: ISelectOption,
  flag?: ISelectOption,

  perks?: ISelectOption[],
  occupation: IMainCharacterOccupation,
  params: {
    physical: IMainCharacterPhysicalParams
    mental: IMainCharacterMentalParams,
    social: IMainCharacterSocialParams,
  },
}

export interface IMainCharacterChanges {
  health: number,
  happiness: number,
  intelligence: number,
  stress: number,
  productivity: number,
  appearance: number,
  wealth: string,
  karma: number,
  popularity: number,
  flagChange?: ISelectOption,
}

interface ISelectOptionWithColor extends ISelectOption {
  color: string,
}

export interface Values {
  statusToSave?: StoryStatus,
  template?: {
    value: string,
    label: string,
  },
  comment?: string,
  storyText: string,
  question: string,
  headerColor?: ISelectOptionWithColor,
  category?: string[],
  mainCharacter: IMainCharacter,

  npc: (INPCModeExist | INPCModeDoesNotExist)[],
  generatedNpc?: IGeneratedNPC[],
  options: IOptionValue[],
}

export interface IJSONConditionNPCModeExist {
  Relationship: string;
  Relatives: string;
  Gender: string;
  MinAppearance: string;
  MinIntelligence: string;
  MinWillpower: string;
  MaxWealth: string;
  MinHealth: string;
  MaxAppearance: string;
  MaxIntelligence: string;
  MaxReligiosity: string;
  MinSympathy: string;
  MaxWillpower: string;
  MinGenerosity: string;
  MaxGenerosity: string;
  MaxHappiness: string;
  MaxSympathy: string;
  MaxHealth: string;
  MinWealth: string;
  Occupation: string;
  MinProductivity: string;
  MaxProductivity: string;
  MinReligiosity: string;
  MinRelationship: string;
  MinHappiness: string;
  MaxRelationship: string;
  AbsoluteOccupation: string;
}

export interface IMultiMinMAxJSONValue {
  title?: string,
  min?: string,
  max?: string,
}

export interface IJSONConditionNPCModeDoesNotExist {
  Relationship: string;
  Relatives: string;
  Gender: string;
  Mode: 'DoesNotExist';
}

export interface IJSONCondition {
  Character: {
    Occupation: string;
    AbsoluteOccupation: string;
    Skill: string,
    Perks: string,
    Flag: string,
    ChainStory: string,
    Age: IMultiMinMAxJSONValue[],
    Gender: string;
    SexualPreferences: string;
    MinIntelligence: string;
    MaxWealth: string;
    MaxStress: string;
    MinHealth: string;
    MinStress: string;
    MaxHappiness: string;
    MaxIntelligence: string;
    MaxHealth: string;
    MaxAttractiveness: string;
    MinWealth: string;
    MinProductivity: string;
    MaxProductivity: string;
    MinAttractiveness: string;
    MinHappiness: string;
    MinPopularity: string;
    MaxPopularity: string;
  };
  NPC: (IJSONConditionNPCModeExist | IJSONConditionNPCModeDoesNotExist)[];
}

export interface IJSONChange {
  Character: [ IJSONMainCharacterChanges ],
  NPC: IJSONNPCChanges[]
}

interface IJSONOptionResult {
  Result: string;
  DiaryEntry: string;
}

interface IJSONOptionText {
  Text: string;
}

export interface IJSONNPCChanges {
  Productivity: string;
  Craziness: string;
  Happiness: string;
  Health: string;
  Sympathy: string;
  Relationship: string;
  Wealth: string;
  FlagChange: string;
}

export interface IJSONMainCharacterChanges {
  Productivity: string;
  Happiness: string;
  Intelligence: string;
  Health: string;
  Appearance: string;
  Popularity: string;
  Stress: string;
  Wealth: string;
  FlagChange: string;
}

export interface IJSON {
  Condition: IJSONCondition;
  Change: IJSONChange[];
  OptionResult: IJSONOptionResult[],
  OptionText: IJSONOptionText[];
  // Description: IJSONDescription;
  Category: string;
  HeaderColor: string;
  StoryText: string;
  Question: string;
  ActivityCondition: string;
}
