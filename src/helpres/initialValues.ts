import {
  EnumNPCType, IGeneratedNPC,
  IMainCharacter,
  INPCModeDoesNotExist,
  INPCModeExist,
  IOptionValue,
  Values,
} from '../components/MainForm/interfaces';
import cloneDeep from 'lodash/cloneDeep';

export const initialNPCModeExist: INPCModeExist = {
  type: EnumNPCType.EXIST,
  basic: {
    relative: {
      parent: false,
      stepParent: false,
      sibling: false,
      stepSibling: false,
      kid: false,
      adoptedKid: false,
    },
    relationship: {
      friend: false,
      enemy: false,
      crush: false,
      significantOther: false,
      lovers: false,
      betrothed: false,
      spouse: false,
      exFriend: false,
      exSignificantOther: false,
      exBetrothed: false,
      exSpouse: false,
      exLovers: false,
    },
    relativeOccupation: {
      classmate: false,
      colleague: false,
      higherInPosition: false,
    },
    absoluteOccupation: undefined,
    age: [],
    gender: {
      same: false,
      male: false,
      female: false,
      else: false,
    },
  },
  advanced: {},
};

export const initialGeneratedNPC: IGeneratedNPC = {
  basic: {
    changeNumber: [false, false],
    relationship: {
      friend: false,
      enemy: false,
      crush: false,
      significantOther: false,
      lovers: false,
      betrothed: false,
      spouse: false,
      exFriend: false,
      exSignificantOther: false,
      exBetrothed: false,
      exSpouse: false,
      exLovers: false,
    },
    relativeOccupation: {
      classmate: false,
      colleague: false,
      higherInPosition: false,
    },
    absoluteOccupation: undefined,
    age: [
      {
        value: {
          title: 'Same age',
          min: 0,
          max: 0,
          sign: '+',
        },
        label: 'Same age',
      },
    ],
    gender: {
      same: false,
      male: false,
      female: false,
      else: false,
    },
  },
  advanced: {},
};

export const initialNPCModeDoesNotExist: INPCModeDoesNotExist = {
  type: EnumNPCType.DOES_NOT_EXIST,
  basic: {
    relative: {
      parent: false,
      stepParent: false,
      sibling: false,
      stepSibling: false,
      kid: false,
      adoptedKid: false,
    },
    relationship: {
      friend: false,
      enemy: false,
      crush: false,
      significantOther: false,
      lovers: false,
      betrothed: false,
      spouse: false,
      exFriend: false,
      exSignificantOther: false,
      exBetrothed: false,
      exSpouse: false,
      exLovers: false,
    },
    gender: {
      same: false,
      male: false,
      female: false,
      else: false,
    },
  },
};

export const initialMainCharacter: IMainCharacter = {
  occupation: {
    primarySchool: false,
    highSchool: false,
    partTimeJob: false,
    retirement: false,
    middleSchool: false,
    college: false,
    fullTimeJob: false,
    jobless: false,
  },
  params: {
    mental: {},
    physical: {
      age: [],
      gender: {
        male: false,
        female: false,
        else: false,
      },
    },
    social: {
      sexualPreferences: {
        straight: false,
        bisexual: false,
        gay: false,
      },
    },
  },
};

export const initialNPCChanges = {
  relationship: 0,
  passion: 0,
  happiness: 0,
  health: 0,
  productivity: 0,
  craziness: 0,
  wealth: '',
};

export const initialOption: IOptionValue = {
  option: '1',
  result: '2',
  diaryEntry: '3',
  npcChanges: [],
  mainCharacterChanges: {
    health: 0,
    karma: 0,
    happiness: 0,
    intelligence: 0,
    stress: 0,
    productivity: 0,
    appearance: 0,
    popularity: 0,
    wealth: '',
  },
};

export const initialValuesEmptyForm: Values = {
  storyText: '1',
  question: '2',
  options: [
    cloneDeep(initialOption),
    cloneDeep(initialOption),
    cloneDeep(initialOption),
  ],
  mainCharacter: cloneDeep(initialMainCharacter),
  npc: [ ],
  generatedNpc: [ ],
};
