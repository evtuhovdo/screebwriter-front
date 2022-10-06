import React, { FC } from 'react';
import map from 'lodash/map';
import { useFormikContext } from 'formik';
import { INPCModeDoesNotExist, INPCModeExist, Values } from '../MainForm/interfaces';
import Tags from './Tags';

interface IProps {

}

const mapNpcToTags = (npcs: (INPCModeExist | INPCModeDoesNotExist)[]) => map(npcs, (npc) => ({ type: npc.type }));

const TagsHOC: FC<IProps> = () => {
  const { values: { npc } } = useFormikContext<Values>();

  const npcTags = mapNpcToTags(npc);

  return (
    <Tags npcTags={npcTags}/>
  );
};

export default React.memo(TagsHOC);
