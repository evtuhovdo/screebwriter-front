import React, { FC } from 'react';
import Header from '../components/Header/Header';
import MainForm from '../components/MainForm/MainForm';
import { useCookies } from 'react-cookie';

const StoryCreatePage: FC = () => {
  const [ cookies ] = useCookies([ 'canDoTwoOptions' ]);

  return (
    <div className="PageWrapper">
      <Header/>
      <MainForm
        canDoTwoOptions={!!cookies.canDoTwoOptions}
      />
    </div>
  );
};

export default StoryCreatePage;
