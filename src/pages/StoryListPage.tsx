import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Header from '../components/Header/Header';
import StoryList from '../components/StoryList/StoryList';

interface IProps extends RouteComponentProps {
  search: string;
}

const StoryListPage: FC<IProps> = ({ location }) => {
  const { search } = location;

  return (
    <div className="PageWrapper">
      <Header/>
      <StoryList search={search}/>
    </div>
  );
};

export default StoryListPage;
