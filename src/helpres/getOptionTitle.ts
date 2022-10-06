const getOptionTitle = (i: number): string => {
  switch (i) {
    case 0:
      return '1st';
    case 1:
      return '2nd';
    case 2:
      return '3rd';
    case 3:
      return '4th';
    default:
      return '';
  }
};

export default getOptionTitle;
