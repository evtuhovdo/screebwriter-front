import { useInstance } from 'react-ioc';
import useSWR, { useSWRConfig } from 'swr';
import { message, Rate } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import ApiClient from '../Api/ApiClient';

export enum scoreTypeEnum {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
}

interface IProps {
  storyId: string,
  authorId: string,
  type: scoreTypeEnum,
}

const StoryRate: FC<IProps> = ({ storyId, authorId, type }) => {
  const apiClient = useInstance(ApiClient);

  const key = type === scoreTypeEnum.FIRST ? 'story-rating' : 'story-rating-2';
  const methodGet = type === scoreTypeEnum.FIRST ? apiClient.fetchRatingRecord : apiClient.fetchRating2Record;
  const methodPost = type === scoreTypeEnum.FIRST ? apiClient.upsertRatingRecord : apiClient.upsertRating2Record;

  const { data } = useSWR(`${key}/${storyId}`, () => methodGet({ storyId, authorId }));
  const { mutate } = useSWRConfig();

  const [ value, setValue ] = useState<number>(0);

  useEffect(() => {
    if (data) {
      setValue(data.score);
    }
  }, [ data, setValue ]);

  const [ savePending, setSavePending ] = useState<boolean>(false);

  const onChange = async (newValue: number) => {
    setSavePending(true);
    setValue(newValue);
    try {
      await methodPost({
        storyId: storyId,
        authorId: authorId,
        score: newValue,
        ratingId: data ? data.id : undefined,
      });
      message.success('Rate saved');
      await mutate(`${key}/${storyId}`);
    } catch (error) {
      console.error(error);
      message.error('Rate not saved');
    } finally {
      setSavePending(false);
    }
  };

  return (
    <div className="StoryRate">
      {type === scoreTypeEnum.FIRST && <div>Rate story interesting</div>}
      {type === scoreTypeEnum.SECOND && <div>Rate story settings & grammar</div>}
      <Rate
        disabled={savePending}
        allowClear={false}
        count={10}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default React.memo(StoryRate);
