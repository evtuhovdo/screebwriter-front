const nameOfOption = (name: string, i?: number): string => {
  let result = name.replace('option.', 'option[i].');

  if (typeof i !== 'undefined') {
    result = result.replace('[i]', `[${i}]`);
  }

  return result;
};

export default nameOfOption;
