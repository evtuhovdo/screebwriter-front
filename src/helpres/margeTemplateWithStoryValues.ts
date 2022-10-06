import {
  EnumNPCType,
  INPCModeDoesNotExist,
  INPCModeExist,
  IOptionValue,
  Values,
} from '../components/MainForm/interfaces';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import isString from 'lodash/isString';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import isFinite from 'lodash/isFinite';
import isBoolean from 'lodash/isBoolean';
import merge from 'lodash/merge';
import { forEach } from 'lodash';

export const isEmptyValue = (value: any) => {
  if (isString(value) && value.trim().length === 0) {
    return true;
  }

  if (isNumber(value) && (value === 0 || !isFinite(value))) {
    return true;
  }

  if (isUndefined(value)) {
    return true;
  }

  if (isNull(value)) {
    return true;
  }

  if (isBoolean(value) && value === false) {
    return true;
  }

  if (isArray(value) && value.length === 0) {
    return true;
  }

  return false;
};

const removeEmptyFields = <T extends Object | undefined>(obj: T) => {
  if (!obj) {
    return undefined;
  }

  return omitBy(obj, isEmptyValue);
};

const margeTemplateWithStoryValues = (t: Values, storyValues: Values) => {
  let res = cloneDeep(storyValues);

  const mainFields = removeEmptyFields(pick(t,
    [
      // 'storyText', 'question',
      'headerColor', 'category'
    ],
  ));

  res = merge(res, mainFields);

  const mainCharacterFlatOptions = removeEmptyFields(pick(t.mainCharacter,
    [ 'skill', 'absoluteOccupation', 'actionReference', 'chainStory', 'flag', 'perks' ],
  ));

  res.mainCharacter = merge(res.mainCharacter, mainCharacterFlatOptions);

  res.mainCharacter.occupation = merge(res.mainCharacter.occupation, removeEmptyFields(t.mainCharacter.occupation));


  res.mainCharacter.params.physical.gender = merge(res.mainCharacter.params.physical.gender, removeEmptyFields(t.mainCharacter.params.physical.gender));
  res.mainCharacter.params.physical.age = merge(res.mainCharacter.params.physical.age, removeEmptyFields(t.mainCharacter.params.physical.age));
  res.mainCharacter.params.physical.health = merge(res.mainCharacter.params.physical.health, removeEmptyFields(t.mainCharacter.params.physical.health));

  const mainCharacterMentalConditions = removeEmptyFields(pick(t.mainCharacter.params.mental,
    [ 'happiness', 'intelligence', 'stress', 'productivity' ],
  ));

  const mainCharacterSocialConditions = removeEmptyFields(pick(t.mainCharacter.params.social,
    [ 'attractiveness', 'popularity', 'money', 'wealth' ],
  ));

  res.mainCharacter.params.mental = merge(res.mainCharacter.params.mental, mainCharacterMentalConditions);
  res.mainCharacter.params.social = merge(res.mainCharacter.params.social, mainCharacterSocialConditions);

  res.mainCharacter.params.social.sexualPreferences = merge(res.mainCharacter.params.social.sexualPreferences, removeEmptyFields(t.mainCharacter.params.social.sexualPreferences));

  if (t.npc.length === 0) {
    res.npc = [];
  }

  if (t.npc.length > 0) {
    const npc: (INPCModeExist | INPCModeDoesNotExist)[] = [];
    t.npc.forEach((templateNPC, index) => {
      if (templateNPC.type === EnumNPCType.EXIST) {
        if ((!storyValues.npc[index]) || (storyValues.npc[index] && storyValues.npc[index].type !== EnumNPCType.EXIST)) {
          npc.push(templateNPC);
          return;
        }

        // Если типы совпали и есть такой то надо мержить
        const resultNpc = storyValues.npc[index] as INPCModeExist;

        const basicExistsRelativeOccupation = removeEmptyFields(templateNPC.basic.relativeOccupation);
        const basicExistsFlat = removeEmptyFields(pick(templateNPC.basic,
          [ 'absoluteOccupation', 'age' ],
        ));
        const advanced = removeEmptyFields(templateNPC.advanced);
        resultNpc.basic.relativeOccupation = merge(resultNpc.basic.relativeOccupation, basicExistsRelativeOccupation);
        resultNpc.advanced = merge(resultNpc.advanced, advanced);
        resultNpc.basic = merge(resultNpc.basic, basicExistsFlat);


        const basicRelative = templateNPC.basic.relative;
        resultNpc.basic.relative = merge(resultNpc.basic.relative, basicRelative);
        const basicRelationship = templateNPC.basic.relationship;
        resultNpc.basic.relationship = merge(resultNpc.basic.relationship, basicRelationship);
        const basicGender = removeEmptyFields(templateNPC.basic.gender);
        resultNpc.basic.gender = merge(resultNpc.basic.gender, basicGender);
        npc.push(resultNpc);
        return;
      } else {
        if ((!storyValues.npc[index]) || (storyValues.npc[index] && storyValues.npc[index].type !== EnumNPCType.DOES_NOT_EXIST)) {
          npc.push(templateNPC);
          return;
        }
        // Если типы совпали и есть такой то надо мержить
        const resultNpc = storyValues.npc[index] as INPCModeDoesNotExist;

        const basicRelative = templateNPC.basic.relative;
        resultNpc.basic.relative = merge(resultNpc.basic.relative, basicRelative);
        const basicRelationship = templateNPC.basic.relationship;
        resultNpc.basic.relationship = merge(resultNpc.basic.relationship, basicRelationship);
        const basicGender = removeEmptyFields(templateNPC.basic.gender);
        resultNpc.basic.gender = merge(resultNpc.basic.gender, basicGender);
        npc.push(resultNpc);
      }
    });

    res.npc = npc;
  }

  const options: IOptionValue[] = [];

  t.options.forEach((templateOption, index) => {
    if (!storyValues.options[index]) {
      options.push(templateOption);
      return;
    }

    // const optionsFlat = removeEmptyFields(pick(templateOption,
    //   [ 'option', 'result', 'diaryEntry' ],
    // ));

    const resultOption = cloneDeep(storyValues.options[index]); //merge(storyValues.options[index], optionsFlat);


    const mainCharacterChanges = removeEmptyFields(templateOption.mainCharacterChanges);
    resultOption.mainCharacterChanges = merge(resultOption.mainCharacterChanges, mainCharacterChanges);

    if (res.npc.length === 0) {
      resultOption.npcChanges = [];
    } else {
      forEach(res.npc, (npc, npcIndex) => {
        if (npc.type === EnumNPCType.DOES_NOT_EXIST) {
          // Если NPC_NOT_EXIST то изменений быть не может. мержить не надо. сразу берем из шаблона
          resultOption.npcChanges[npcIndex] = templateOption.npcChanges[npcIndex];
        } else {
           const changes = removeEmptyFields(templateOption.npcChanges[npcIndex]);
          // Надо мержить
          resultOption.npcChanges[npcIndex] = merge(resultOption.npcChanges[npcIndex], changes);
        }
      });
    }

    options.push(resultOption);
  });

  res.options = options;

  return cloneDeep(res);
};

export default margeTemplateWithStoryValues;
