import React, { FC, PropsWithChildren, useMemo } from 'react';
import { Table } from 'antd';
import isEqual from 'lodash/isEqual';
import tagsDataSource from '../tagsDataSource';
import Tag from '../Tag/Tag';
import { EnumNPCType } from '../MainForm/interfaces';

const renderCell = (value: string | null) => {
  if (!value) {
    return <span>&mdash;</span>;
  }

  return (
    <Tag value={value}/>
  );
};

interface INpcTag {
  type: EnumNPCType,
}

interface IProps {
  npcTags: INpcTag[];
}

const Tags: FC<IProps> = ({ npcTags }) => {
  const tagsColumns = useMemo(() => {
    const columns = [
      {
        title: '',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Main Character',
        dataIndex: 'gg',
        key: 'gg',
        render: renderCell,
      },
    ];

    if (typeof npcTags[0] !== 'undefined' && npcTags[0].type !== EnumNPCType.DOES_NOT_EXIST) {
      columns.push({
        title: '1st NPC',
        dataIndex: 'npc0',
        key: 'npc0',
        render: renderCell,
      });
    }

    if (typeof npcTags[1] !== 'undefined' && npcTags[1].type !== EnumNPCType.DOES_NOT_EXIST) {
      columns.push({
        title: '2st NPC',
        dataIndex: 'npc1',
        key: 'npc1',
        render: renderCell,
      });
    }

    if (typeof npcTags[2] !== 'undefined' && npcTags[2].type !== EnumNPCType.DOES_NOT_EXIST) {
      columns.push({
        title: '3rd NPC',
        dataIndex: 'npc2',
        key: 'npc2',
        render: renderCell,
      });
    }

    return columns;
  }, [ npcTags ]);

  return (
    <div className="right">
      <div className="tags">
        <div className="label">Tags</div>
        <Table
          size="small"
          dataSource={tagsDataSource}
          columns={tagsColumns}
          pagination={false}
        />
      </div>
    </div>
  );
};

const areEqual = (prevProps: Readonly<PropsWithChildren<IProps>>, nextProps: Readonly<PropsWithChildren<IProps>>) => isEqual(prevProps.npcTags, nextProps.npcTags)

export default React.memo(Tags, areEqual);
