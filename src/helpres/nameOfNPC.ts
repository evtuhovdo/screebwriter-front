const nameOfNPC = (name: string, i: number, searchValue?: string): string => {
  if (searchValue?.length) {
    return name.replace(`${searchValue}.`, `${searchValue}[${i}].`);
  }

  return name.replace('npc.', `npc[${i}].`);
};

export default nameOfNPC;
