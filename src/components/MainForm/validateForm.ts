import { EnumNPCType, Values } from './interfaces';
import each from 'lodash/each';
import map from 'lodash/map';
import shallowequal from 'shallowequal';
import { initialNPCModeDoesNotExist, initialNPCModeExist } from '../../helpres/initialValues';
import getNpcTitle from '../../helpres/getNpcTitle';
import nameOfValues from '../../helpres/nameOfValues';
import nameOf from '../../helpres/nameOf';
import getOptionTitle from '../../helpres/getOptionTitle';
import ApiClient, { ICheckMatch } from '../../Api/ApiClient';

// const validateMinMax = (
//   name: string,
//   values: Values,
//   errors: any,
//   minLimit: number = 0,
//   maxLimit: number = 100,
// ) => {
//   const min = String(get(values, `${name}.min`, ''));
//   const max = String(get(values, `${name}.max`, ''));
//
//   const hasMin = min.length > 0;
//   const hasMax = max.length > 0;
//
//   if (hasMin) {
//     const minValue = parseFloat(min);
//
//     if (!isNaN(minValue) && minValue < minLimit) {
//       errors[`${name}.min`] = `Error`;
//     }
//
//     if (!isNaN(minValue) && minValue > maxLimit) {
//       errors[`${name}.min`] = `Error`;
//     }
//   }
//
//   if (hasMax) {
//     const maxValue = parseFloat(max);
//
//     if (!isNaN(maxValue) && maxValue < minLimit) {
//       errors[`${name}.max`] = `Error`;
//     }
//
//     if (!isNaN(maxValue) && maxValue > maxLimit) {
//       errors[`${name}.max`] = `Error`;
//     }
//   }
//
//   if (hasMin && hasMax) {
//     const minValue = parseFloat(min);
//     const maxValue = parseFloat(max);
//
//     if (isNaN(minValue) || isNaN(maxValue)) {
//       if (isNaN(minValue)) {
//         errors[`${name}.min`] = 'Error';
//       }
//       if (isNaN(maxValue)) {
//         errors[`${name}.max`] = 'Error';
//       }
//     } else if (minValue > maxValue) {
//       errors[`${name}.min`] = 'Error';
//     }
//
//     if (String(minValue) !== min) {
//       errors[`${name}.min`] = 'Error';
//     }
//
//     if (String(maxValue) !== max) {
//       errors[`${name}.max`] = 'Error';
//     }
//   } else if (hasMin) {
//     // только минимум
//     const minValue = parseFloat(min);
//     if (isNaN(minValue)) {
//       errors[`${name}.min`] = 'Error';
//     }
//     if (String(minValue) !== min) {
//       errors[`${name}.min`] = 'Error';
//     }
//   } else if (hasMax) {
//     // только максимум
//     const maxValue = parseFloat(max);
//     if (isNaN(maxValue)) {
//       errors[`${name}.max`] = 'Error';
//     }
//     if (String(maxValue) !== max) {
//       errors[`${name}.max`] = 'Error';
//     }
//   }
//
//   return errors;
// };

const formatCheckMatchMessages = (matches: ICheckMatch[]) => {
  return matches.map(item => {
    const { message, context, rule: { description } } = item;

    const textPart = context.text.substr(context.offset, context.length);

    return `${description} [${textPart}] ${message}`;
  }).join('\n');
};

export const validateFormBeforeSaveFinal = (apiClient: ApiClient) => async (values: Values) => {
  let errors = await validateMainForm(apiClient)(values);

  let langErrorsCount = errors.langErrorsCount ? errors.langErrorsCount : 0;

  const storyTextErrors = [];
  const questionErrors = [];

  if (values.storyText.trim().length > 0) {
    const matches = await apiClient.premiumCheckText(values.storyText);
    if (matches && matches.length) {
      langErrorsCount++;
      storyTextErrors.push(formatCheckMatchMessages(matches));
    }
  }

  if (values.question.trim().length > 0) {
    const matches = await apiClient.premiumCheckText(values.question);
    if (matches && matches.length) {
      langErrorsCount++;
      questionErrors.push(formatCheckMatchMessages(matches));
    }
  }

  if (storyTextErrors.length) {
    if (errors.storyText) {
      storyTextErrors.push(errors.storyText);
    }

    errors.storyText = storyTextErrors.join("\n");
  }

  if (questionErrors.length) {
    if (errors.question) {
      questionErrors.push(errors.question);
    }

    errors.question = storyTextErrors.join("\n");
  }

  for (let i = 0; i < values.options.length; i++) {
    const option = values.options[i];
    const optionErrors = [];
    const resultErrors = [];
    const diaryEntryErrors = [];

    if (option.option.length > 0) {
      const langErrors = await premiumLangValidate(apiClient, option.option);
      if (langErrors) {
        langErrorsCount++;
        optionErrors.push(langErrors);
      }
    }

    if (option.result.length > 0) {
      const langErrors = await premiumLangValidate(apiClient, option.result);
      if (langErrors) {
        langErrorsCount++;
        resultErrors.push(langErrors);
      }
    }

    if (option.diaryEntry.length > 0) {
      const langErrors = await premiumLangValidate(apiClient, option.diaryEntry);
      if (langErrors) {
        langErrorsCount++;
        diaryEntryErrors.push(langErrors);
      }
    }

    if (optionErrors.length) {
      if (errors[nameOfValues(nameOf(() => values.options[i].option), i)]) {
        optionErrors.push(errors.storyText);
      }

      errors[nameOfValues(nameOf(() => values.options[i].option), i)] = optionErrors.join('\n');
    }

    if (resultErrors.length) {
      if (errors[nameOfValues(nameOf(() => values.options[i].result), i)]) {
        resultErrors.push(errors.storyText);
      }

      errors[nameOfValues(nameOf(() => values.options[i].result), i)] = resultErrors.join('\n');
    }

    if (diaryEntryErrors.length) {
      if (errors[nameOfValues(nameOf(() => values.options[i].diaryEntry), i)]) {
        diaryEntryErrors.push(errors.storyText);
      }

      errors[nameOfValues(nameOf(() => values.options[i].diaryEntry), i)] = diaryEntryErrors.join('\n');
    }
  }

  if (langErrorsCount > 0) {
    errors.langErrorsCount = langErrorsCount;
  }

  return errors;
};

// const langValidate = async (apiClient: ApiClient, text: string) => {
//   const matches = await apiClient.checkText(text);
//   if (matches && matches.length) {
//     return formatCheckMatchMessages(matches);
//   }
//
//   return null;
// };

const premiumLangValidate = async (apiClient: ApiClient, text: string) => {
  const matches = await apiClient.premiumCheckText(text);
  if (matches && matches.length) {
    return formatCheckMatchMessages(matches);
  }

  return null;
};

const validateMainForm = (apiClient: ApiClient) => async (values: Values) => {
  let langErrorsCount = 0;
  let errors: any = {};
  let commonErrorsCount = 0;

  const storyTextErrors = [];
  const questionErrors = [];

  if (!values.storyText.trim()) {
    commonErrorsCount++;
    storyTextErrors.push('Field required');
  }

  if (!values.question.trim()) {
    commonErrorsCount++;
    questionErrors.push('Field required');
  }

  if (!values.category || (Array.isArray(values.category) && values.category.length === 0)) {
    commonErrorsCount++;
    errors.category = 'Field required';
  }

  if (!values.headerColor) {
    commonErrorsCount++;
    errors.headerColor = 'Field required';
  }

  if (values.storyText.trim().length > 200) {
    commonErrorsCount++;
    storyTextErrors.push('Exceeded maximum text length');
  }

  // if (values.storyText.trim().length > 0) {
  //   const langErrors = await langValidate(apiClient, values.storyText);
  //   if (langErrors) {
  //     langErrorsCount++;
  //     storyTextErrors.push(langErrors);
  //   }
  // }
  //
  // if (values.question.trim().length > 0) {
  //   const langErrors = await langValidate(apiClient, values.question);
  //   if (langErrors) {
  //     langErrorsCount++;
  //     questionErrors.push(langErrors);
  //   }
  // }

  if (values.question.trim().length > 100) {
    commonErrorsCount++;
    questionErrors.push('Exceeded maximum text length');
  }

  if (storyTextErrors.length) {
    errors.storyText = storyTextErrors.join('\n');
  }

  if (questionErrors.length) {
    errors.question = questionErrors.join('\n');
  }

  for (let i = 0; i < values.options.length; i++) {
    const option = values.options[i];
    const optionErrors = [];
    const resultErrors = [];
    const diaryEntryErrors = [];

    if (option.option.length > 70) {
      commonErrorsCount++;
      optionErrors.push('Exceeded maximum text length');
    }

    if (option.result.length > 300) {
      commonErrorsCount++;
      resultErrors.push('Exceeded maximum text length');
    }

    if (option.diaryEntry.length > 400) {
      commonErrorsCount++;
      diaryEntryErrors.push('Exceeded maximum text length');
    }

    if (option.option.trim().length === 0) {
      commonErrorsCount++;
      optionErrors.push('Field required');
    }

    if (option.result.trim().length === 0) {
      commonErrorsCount++;
      resultErrors.push('Field required');
    }

    if (option.diaryEntry.trim().length === 0) {
      commonErrorsCount++;
      diaryEntryErrors.push('Field required');
    }

    // if (option.option.length > 0) {
    //   const langErrors = await langValidate(apiClient, option.option);
    //   if (langErrors) {
    //     langErrorsCount++;
    //     optionErrors.push(langErrors);
    //   }
    // }
    //
    // if (option.result.length > 0) {
    //   const langErrors = await langValidate(apiClient, option.result);
    //   if (langErrors) {
    //     langErrorsCount++;
    //     resultErrors.push(langErrors);
    //   }
    // }
    //
    // if (option.diaryEntry.length > 0) {
    //   const langErrors = await langValidate(apiClient, option.diaryEntry);
    //   if (langErrors) {
    //     langErrorsCount++;
    //     diaryEntryErrors.push(langErrors);
    //   }
    // }

    if (optionErrors.length) {
      errors[nameOfValues(nameOf(() => values.options[i].option), i)] = optionErrors.join('\n');
    }

    if (resultErrors.length) {
      errors[nameOfValues(nameOf(() => values.options[i].result), i)] = resultErrors.join('\n');
    }

    if (diaryEntryErrors.length) {
      errors[nameOfValues(nameOf(() => values.options[i].diaryEntry), i)] = diaryEntryErrors.join('\n');
    }
  }

  // Значение max любого параметра, принимающего в себя min и max, отлично от пустого и меньше, чем отличное от пустого значение min связанное с ним.
  // if (values.mainCharacter) {
  //   errors = validateMinMax(nameOfValues(nameOf(() => values.mainCharacter.params.physical.age)), values, errors);
  //   errors = validateMinMax(nameOfValues(nameOf(() => values.mainCharacter.params.physical.health)), values, errors);
  //
  //   errors = validateMinMax(nameOfValues(nameOf(() => values.mainCharacter.params.mental.happiness)), values, errors);
  //   errors = validateMinMax(nameOfValues(nameOf(() => values.mainCharacter.params.mental.intelligence)), values, errors);
  //   errors = validateMinMax(nameOfValues(nameOf(() => values.mainCharacter.params.mental.stress)), values, errors);
  //   errors = validateMinMax(nameOfValues(nameOf(() => values.mainCharacter.params.mental.productivity)), values, errors);
  //
  //   errors = validateMinMax(nameOfValues(nameOf(() => values.mainCharacter.params.social.attractiveness)), values, errors);
  //   errors = validateMinMax(nameOfValues(nameOf(() => values.mainCharacter.params.social.money)), values, errors, 0, 1e12);
  // }

  // if (values.npc.length > 0) {
  //   each(values.npc, (npc, i) => {
  //     if (npc.type === EnumNPCType.DOES_NOT_EXIST) {
  //       return;
  //     }
  //
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.basic.age), i), values, errors);
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.advanced.relationship), i), values, errors, -100, 100);
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.advanced.passion), i), values, errors);
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.advanced.happiness), i), values, errors);
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.advanced.intelligence), i), values, errors);
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.advanced.health), i), values, errors);
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.advanced.productivity), i), values, errors);
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.advanced.appearance), i), values, errors);
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.advanced.willpower), i), values, errors);
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.advanced.religiosity), i), values, errors);
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.advanced.generosity), i), values, errors);
  //     errors = validateMinMax(nameOfNPC(nameOf(() => npc.advanced.money), i), values, errors, 0, 1e12);
  //   });
  // }

  // Если добавлен НПС, то хотя бы одно поле в разделе его кондишенов должно быть заполнено. Кондишены на ГГ считаются необязательными.
  if (values.npc.length > 0) {
    each(values.npc, (npc, i) => {
      if (npc.type === EnumNPCType.DOES_NOT_EXIST) {
        if (shallowequal(npc.basic, initialNPCModeDoesNotExist.basic)) {
          commonErrorsCount++;
          errors[`npc[${i}].emptyConditions`] = `You must specify at least one condition for ${getNpcTitle(i)}`;
        }
      }

      if (npc.type === EnumNPCType.EXIST) {
        if (
          shallowequal(npc.advanced, initialNPCModeExist.advanced)
          && shallowequal(npc.basic, initialNPCModeExist.basic)
        ) {
          commonErrorsCount++;
          errors[`npc[${i}].emptyConditions`] = `You must specify at least one condition for ${getNpcTitle(i)}`;
        }
      }
    });
  }

  // Если не добавлен ни один НПС, то хотя бы одно поле в разделе Changes для каждой из четырех опции должно быть заполнено,
  // Иначе или поле в разделе Changes любого из НПС, или поле в разделе Changes ГГ, но хотя бы одно на каждую из четырех опций.

  if (values.npc.length === 0) {
    const unFilledMainCharacterChanges: boolean[] = map(values.options, () => {
      return false;
    });

    each(values.options, (option, i) => {
      let unfilledCount = 0;
      const fieldsCount = Object.keys(option.mainCharacterChanges).length;

      each(option.mainCharacterChanges, value => {
        const stringValue = String(value);

        if (stringValue === '0' || stringValue === '') {
          unfilledCount = unfilledCount + 1;
        }
      });

      if (unfilledCount === fieldsCount) {
        unFilledMainCharacterChanges[i] = true;
      }

    });

    each(unFilledMainCharacterChanges, (value, i) => {
      if (value) {
        errors[`option[${i}].mainCharacterChanges.dontHaveChanges`] = `You must specify at least one Main Character change for ${getOptionTitle(i)} option OR add NPC with conditions`;
      }
    });
  }

  if (langErrorsCount > 0) {
    errors.langErrorsCount = langErrorsCount;
  }

  if (commonErrorsCount > 0) {
    errors.commonErrorsCount = commonErrorsCount;
  }

  return errors;
};

export default validateMainForm;
