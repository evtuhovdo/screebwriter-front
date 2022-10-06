import {
  EnumNPCType,
  IJSON,
  IJSONChange,
  IJSONCondition,
  IJSONConditionNPCModeDoesNotExist,
  IJSONConditionNPCModeExist,
  IJSONMainCharacterChanges,
  IJSONNPCChanges,
  IMainCharacter,
  IMinMaxValueMulti,
  IMultiMinMAxJSONValue,
  INPCChanges,
  INPCModeDoesNotExist,
  INPCModeExist,
  IOptionValue,
  Values,
} from '../components/MainForm/interfaces';
import map from 'lodash/map';
import each from 'lodash/each';

// -4 = ValueRef:3:-
// -3 = ValueRef:2:-
// -2 = ValueRef:1:-
// -1 = ValueRef:0:-
// 0 = нет ключа
// 1 = ValueRef:0:+
// 2 = ValueRef:1:+
// 3 = ValueRef:2:+
// 4 = ValueRef:3:+

const toString = (value: number = 0): string => {
  if (!value) {
    return '';
  }

  return String(value);
};

const stringValueOrEmptyString = (value: string | number | null | undefined) => {
  if (!value) {
    return '';
  }

  return String(value);
};

const getMainCharacterChanges = (option: IOptionValue): IJSONMainCharacterChanges => {
  return ({
    'Health': `${toString(option.mainCharacterChanges.health)}`,
    'Happiness': `${toString(option.mainCharacterChanges.happiness)}`,
    'Intelligence': `${toString(option.mainCharacterChanges.intelligence)}`,
    'Stress': `${toString(option.mainCharacterChanges.stress)}`,
    'Productivity': `${toString(option.mainCharacterChanges.productivity)}`,
    'Appearance': `${toString(option.mainCharacterChanges.appearance)}`,
    'Popularity': `${toString(option.mainCharacterChanges.popularity)}`,
    'Wealth': String(option.mainCharacterChanges.wealth),
    'FlagChange': stringValueOrEmptyString(option.mainCharacterChanges.flagChange?.value),
  });
};

const getNPCChanges = (npcChanges: INPCChanges): IJSONNPCChanges => ({
  'Relationship': `${toString(npcChanges.relationship)}`,
  'Sympathy': `${toString(npcChanges.passion)}`,
  'Happiness': `${toString(npcChanges.happiness)}`,
  'Health': `${toString(npcChanges.health)}`,
  'Productivity': `${toString(npcChanges.productivity)}`,
  'Craziness': `${toString(npcChanges.craziness)}`,
  'Wealth': npcChanges.wealth ? String(npcChanges.wealth) : '',
  'FlagChange': stringValueOrEmptyString(npcChanges.flagChange?.value),
});

const getChange = (values: Values): IJSONChange[] => map(values.options, (option) => ({
  Character: [
    getMainCharacterChanges(option),
  ],
  NPC: map(option.npcChanges, (npcChanges) => getNPCChanges(npcChanges)),
}));

const getMainCharacterOccupation = (mainCharacter: IMainCharacter): string => {
  const items: string[] = [];

  if (mainCharacter.occupation.primarySchool) {
    items.push('PrimarySchool');
  }

  if (mainCharacter.occupation.middleSchool) {
    items.push('MiddleSchool');
  }

  if (mainCharacter.occupation.highSchool) {
    items.push('HighSchool');
  }

  if (mainCharacter.occupation.college) {
    items.push('College');
  }

  if (mainCharacter.occupation.partTimeJob) {
    items.push('PartTimeJob');
  }

  if (mainCharacter.occupation.fullTimeJob) {
    items.push('FullTimeJob');
  }

  if (mainCharacter.occupation.retirement) {
    items.push('Retirement');
  }

  if (mainCharacter.occupation.jobless) {
    items.push('Jobless');
  }

  return items.join(':');
};

const getMainCharacterSexualPreferences = (mainCharacter?: IMainCharacter): string => {
  if (!mainCharacter) {
    return '';
  }

  const items: string[] = [];

  if (mainCharacter.params.social.sexualPreferences.straight) {
    items.push('Straight');
  }

  if (mainCharacter.params.social.sexualPreferences.bisexual) {
    items.push('Bisexual');
  }

  if (mainCharacter.params.social.sexualPreferences.gay) {
    items.push('Gay');
  }

  return items.join(':');
};

const getMainCharacterGender = (mainCharacter?: IMainCharacter): string => {
  if (!mainCharacter) {
    return '';
  }

  const items: string[] = [];

  if (mainCharacter.params.physical.gender.male) {
    items.push('Male');
  }

  if (mainCharacter.params.physical.gender.female) {
    items.push('Female');
  }

  if (mainCharacter.params.physical.gender.else) {
    items.push('Else');
  }

  return items.join(':');
};

const getNPCRelatives = (npc: INPCModeExist | INPCModeDoesNotExist): string => {
  const items: string[] = [];

  const relative = npc.basic.relative;

  if (relative.parent) {
    items.push('Parent');
  }

  if (relative.stepParent) {
    items.push('StepParent');
  }

  if (relative.sibling) {
    items.push('Sibling');
  }

  if (relative.stepSibling) {
    items.push('StepSibling');
  }

  if (relative.kid) {
    items.push('Kid');
  }

  if (relative.adoptedKid) {
    items.push('AdoptedKid');
  }

  return items.join(':');
};

export const getNPCHaveRelatives = (npc: INPCModeExist | INPCModeDoesNotExist) => getNPCRelatives(npc) !== '';

const getNPCRelationship = (npc: INPCModeExist | INPCModeDoesNotExist): string => {
  const items: string[] = [];

  const relationship = npc.basic.relationship;

  if (relationship.friend) {
    items.push('Friend');
  }

  if (relationship.enemy) {
    items.push('Enemy');
  }

  if (relationship.crush) {
    items.push('Crush');
  }

  if (relationship.significantOther) {
    items.push('SignificantOther');
  }

  if (relationship.betrothed) {
    items.push('Engaged');
  }

  if (relationship.lovers) {
    items.push('Lovers');
  }

  if (relationship.exFriend) {
    items.push('ExFriend');
  }

  if (relationship.exSignificantOther) {
    items.push('ExSignificantOther');
  }

  if (relationship.exBetrothed) {
    items.push('ExEngaged');
  }

  if (relationship.exSpouse) {
    items.push('ExSpouse');
  }

  if (relationship.exLovers) {
    items.push('ExLovers');
  }

  if (relationship.spouse) {
    items.push('Spouse');
  }

  return items.join(':');
};

const getNPCOccupation = (npc: INPCModeExist | INPCModeDoesNotExist): string => {
  const items: string[] = [];

  if (npc.type === EnumNPCType.EXIST) {
    if (npc.basic.relativeOccupation.classmate) {
      items.push('Classmate');
    }

    if (npc.basic.relativeOccupation.colleague) {
      items.push('Colleague');
    }

    if (npc.basic.relativeOccupation.higherInPosition) {
      items.push('HigherInPosition');
    }
  }

  return items.join(':');
};

const getNPCGender = (npc: INPCModeExist | INPCModeDoesNotExist): string => {
  const items: string[] = [];

  if (npc.type === EnumNPCType.EXIST) {
    if (npc.basic.gender.male) {
      items.push('Male');
    }

    if (npc.basic.gender.female) {
      items.push('Female');
    }

    if (npc.basic.gender.else) {
      items.push('Else');
    }

    if (npc.basic.gender.same) {
      items.push('Same');
    }
  }

  return items.join(':');
};

const getPerks = (mainCharacter: IMainCharacter) => {
  if (!mainCharacter.perks || mainCharacter.perks.length === 0) {
    return '';
  }

  return map(mainCharacter.perks, (perk) => perk.label).join(':');
};

const getAge = (ages: IMinMaxValueMulti[]) => {
  return map(ages, ({ value: item }) => {
    const result: IMultiMinMAxJSONValue = {};

    if (item.title) {
      result.title = item.title;
    }

    if (typeof item.min !== 'undefined') {
      result.min = String(item.min);
    }

    if (typeof item.max !== 'undefined') {
      result.max = String(item.max);
    }

    return result;
  });
};

const getCondition = (values: Values): IJSONCondition => {
  const { mainCharacter } = values;

  const character: IJSONCondition['Character'] = {
    'Occupation': getMainCharacterOccupation(mainCharacter), // ok
    'AbsoluteOccupation': mainCharacter.absoluteOccupation?.length ? mainCharacter.absoluteOccupation.join(':') : '', // ok
    'Skill': mainCharacter.skill?.length ? mainCharacter.skill.join(':') : '', // ok
    'Perks': getPerks(mainCharacter), // ok
    'Flag': mainCharacter.flag ? String(mainCharacter.flag.label) : '',
    'ChainStory': mainCharacter.chainStory ? String(mainCharacter.chainStory.label) : '',
    'Age': getAge(mainCharacter.params.physical.age),
    'MinHealth': mainCharacter.params.physical.health?.min ? String(mainCharacter.params.physical.health.min) : '',
    'MaxHealth': mainCharacter.params.physical.health?.max ? String(mainCharacter.params.physical.health.max) : '',
    'Gender': getMainCharacterGender(mainCharacter),
    'SexualPreferences': getMainCharacterSexualPreferences(mainCharacter),

    'MinHappiness': mainCharacter.params.mental.happiness?.min ? String(mainCharacter.params.mental.happiness.min) : '',
    'MaxHappiness': mainCharacter.params.mental.happiness?.max ? String(mainCharacter.params.mental.happiness.max) : '',

    'MinPopularity': mainCharacter.params.social.popularity?.min ? String(mainCharacter.params.social.popularity.min) : '',
    'MaxPopularity': mainCharacter.params.social.popularity?.max ? String(mainCharacter.params.social.popularity.max) : '',

    'MinIntelligence': mainCharacter.params.mental.intelligence?.min ? String(mainCharacter.params.mental.intelligence.min) : '',
    'MaxIntelligence': mainCharacter.params.mental.intelligence?.max ? String(mainCharacter.params.mental.intelligence.max) : '',

    'MinStress': mainCharacter.params.mental.stress?.min ? String(mainCharacter.params.mental.stress.min) : '',
    'MaxStress': mainCharacter.params.mental.stress?.max ? String(mainCharacter.params.mental.stress.max) : '',

    'MinProductivity': mainCharacter.params.mental.productivity?.min ? String(mainCharacter.params.mental.productivity.min) : '',
    'MaxProductivity': mainCharacter.params.mental.productivity?.max ? String(mainCharacter.params.mental.productivity.max) : '',

    'MinAttractiveness': mainCharacter.params.social.attractiveness?.min ? String(mainCharacter.params.social.attractiveness.min) : '',
    'MaxAttractiveness': mainCharacter.params.social.attractiveness?.max ? String(mainCharacter.params.social.attractiveness.max) : '',

    'MinWealth': mainCharacter.params.social.money?.min ? String(mainCharacter.params.social.money.min) : '',
    'MaxWealth': mainCharacter.params.social.money?.max ? String(mainCharacter.params.social.money.max) : '',
  };

  const { npc: npcs } = values;

  const OptionConditionNPCs = map(npcs, (npc) => {
    if (npc.type === EnumNPCType.DOES_NOT_EXIST) {
      return {
        Relatives: getNPCRelatives(npc),
        Relationship: getNPCRelationship(npc),
        Gender: getNPCGender(npc),
        Mode: 'DoesNotExist',
      } as IJSONConditionNPCModeDoesNotExist;
    }

    return {
      Relatives: getNPCRelatives(npc),
      Relationship: getNPCRelationship(npc),
      'Age': getAge(npc.basic.age),
      'Occupation': getNPCOccupation(npc),
      'Gender': getNPCGender(npc),
      'MinRelationship': stringValueOrEmptyString(npc.advanced.relationship?.min),
      'MaxRelationship': stringValueOrEmptyString(npc.advanced.relationship?.max),
      'MinSympathy': stringValueOrEmptyString(npc.advanced.passion?.min),
      'MaxSympathy': stringValueOrEmptyString(npc.advanced.passion?.max),
      'MinHappiness': stringValueOrEmptyString(npc.advanced.happiness?.min),
      'MaxHappiness': stringValueOrEmptyString(npc.advanced.happiness?.max),
      'MinIntelligence': stringValueOrEmptyString(npc.advanced.intelligence?.min),
      'MaxIntelligence': stringValueOrEmptyString(npc.advanced.intelligence?.max),
      'MinHealth': stringValueOrEmptyString(npc.advanced.health?.min),
      'MaxHealth': stringValueOrEmptyString(npc.advanced.health?.max),
      'MinAppearance': stringValueOrEmptyString(npc.advanced.appearance?.min),
      'MaxAppearance': stringValueOrEmptyString(npc.advanced.intelligence?.max),
      'MinProductivity': stringValueOrEmptyString(npc.advanced.productivity?.min),
      'MaxProductivity': stringValueOrEmptyString(npc.advanced.productivity?.max),
      'MinWillpower': stringValueOrEmptyString(npc.advanced.willpower?.min),
      'MaxWillpower': stringValueOrEmptyString(npc.advanced.willpower?.max),
      'MinReligiosity': stringValueOrEmptyString(npc.advanced.religiosity?.min),
      'MaxReligiosity': stringValueOrEmptyString(npc.advanced.intelligence?.max),
      'MinGenerosity': stringValueOrEmptyString(npc.advanced.generosity?.min),
      'MaxGenerosity': stringValueOrEmptyString(npc.advanced.intelligence?.max),
      'MinWealth': stringValueOrEmptyString(npc.advanced.money?.min),
      'MaxWealth': stringValueOrEmptyString(npc.advanced.money?.max),
      'MinCraziness': stringValueOrEmptyString(npc.advanced.craziness?.min),
      'MaxCraziness': stringValueOrEmptyString(npc.advanced.craziness?.max),
      'AbsoluteOccupation': npc.basic.absoluteOccupation?.length ? npc.basic.absoluteOccupation.join(':') : '', // ok
    } as IJSONConditionNPCModeExist;
  });

  return {
    Character: character,
    NPC: OptionConditionNPCs,
  };
};

const mapFormValuesToJson = (values: Values): IJSON => ({
  HeaderColor: values.headerColor?.label || '',
  Category: values.category?.length ? values.category.join(':') : '',
  StoryText: values.storyText.trim(),
  Question: values.question.trim(),
  OptionText: map(values.options, (option) => ({
    Text: option.option.trim(),
  })),
  OptionResult: map(values.options, (option) => ({
    Result: option.result.trim(),
    DiaryEntry: option.diaryEntry.trim(),
  })),
  Change: getChange(values),
  Condition: getCondition(values),
  ActivityCondition: values.mainCharacter?.actionReference?.label || '',
});

export const getFormJSON = (values: Values): string => {
  const filteredJson = mapFormValuesToJson(values);

  if (filteredJson.Change.length) {
    each(filteredJson.Change, item => {
      each(item.Character, (itemCharacter) => {
        Object.keys(itemCharacter).forEach((itemCharacterChangeKey) => {
          // @ts-ignore
          if (itemCharacter[itemCharacterChangeKey] === '') {
            // @ts-ignore
            delete itemCharacter[itemCharacterChangeKey];
          }
        });
      });

      each(item.NPC, (itemNPC, i) => {
        // @ts-ignore
        const isDoesNotExistMode = Boolean(filteredJson.Condition.NPC[i]?.Mode);
        if (isDoesNotExistMode) {
          // Удалить для mode не существует вообще все изменения
          // @ts-ignore
          item.NPC[i] = {};
        } else {
          Object.keys(itemNPC).forEach((itemNPCChangeKey) => {
            // @ts-ignore
            if (itemNPC[itemNPCChangeKey] === '') {
              // @ts-ignore
              delete itemNPC[itemNPCChangeKey];
            }
          });
        }
      });
    });
  }

  Object.keys(filteredJson.Condition.Character).forEach((key) => {
    // @ts-ignore
    if (filteredJson.Condition.Character[key] === '') {
      // @ts-ignore
      delete filteredJson.Condition.Character[key];
    }
  });

  each(filteredJson.Condition.NPC, (npcCondition) => {
    Object.keys(npcCondition).forEach((key) => {
      // @ts-ignore
      if (npcCondition[key] === '') {
        // @ts-ignore
        delete npcCondition[key];
      }
    });
  });

  return JSON.stringify(filteredJson, null, 2);
};

export default mapFormValuesToJson;
