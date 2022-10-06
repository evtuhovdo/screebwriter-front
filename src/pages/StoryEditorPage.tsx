import React, { FC } from 'react';
import Header from '../components/Header/Header';
import MainForm from '../components/MainForm/MainForm';
import { useCookies } from 'react-cookie';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import useSWR from 'swr';
import { useInstance } from 'react-ioc';
import ApiClient from '../Api/ApiClient';
import ClipLoader from 'react-spinners/ClipLoader';

type TParams = {
  id: string;
};

interface IProps extends RouteComponentProps<TParams> {
}

const StoryEditorPage: FC<IProps> = ({ match }) => {
  const { id } = match.params;
  const [ cookies ] = useCookies([ 'canDoTwoOptions' ]);
  const apiClient = useInstance(ApiClient);
  const history = useHistory();
  const { data, error } = useSWR(`story/${id}`, () => apiClient.fetchStory(id), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const errorStatus = error?.response?.status;
  if (errorStatus === 403 || errorStatus === 404) {
    history.replace('/');
    return null;
  }

  const isLoading = !error && !data;

  return (
    <div className="PageWrapper">
      <Header/>
      {isLoading && (
        <div className="Loading">
          <ClipLoader
            color="#00AFB9"
            size={20}
          />
          {'\u00A0'}
          Loading...
        </div>
      )}
      {!isLoading && data && (
        <MainForm
          story={data}
          canDoTwoOptions={!!cookies.canDoTwoOptions}
        />
      )}
    </div>
  );
};

export default StoryEditorPage;
