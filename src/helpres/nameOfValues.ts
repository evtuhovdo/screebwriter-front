const nameOfValues = (name: string, i?: number, j?: number): string => {
  let result = name.replace('values.', '');

  if (typeof i !== 'undefined') {
    result = result.replace('[i]', `[${i}]`);
  }

  if (typeof j !== 'undefined') {
    result = result.replace('[j]', `[${j}]`);
  }

  return result;
};

export default nameOfValues;
