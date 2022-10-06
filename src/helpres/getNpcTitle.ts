const getNpcTitle = (i: number): string => {
  switch (i) {
    case 0:
      return '1st NPC';
    case 1:
      return '2nd NPC';
    case 2:
      return '3rd NPC';
    case 3:
      return '4th NPC';
    default:
      return '';
  }
};

export default getNpcTitle;
