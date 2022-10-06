import React from 'react';
import { useCookies } from 'react-cookie';
import { provider } from 'react-ioc';
import LogRocket from 'logrocket';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import StoryEditorPage from './pages/StoryEditorPage';
import ApiClientFactory from './Api/ApiClientFactory';

import 'antd/dist/antd.css';
import './index.scss';
import StoryListPage from './pages/StoryListPage';
import StoryCreatePage from './pages/StoryCreatePage';
import { ADMIN, AUTHOR, GUEST } from './helpres/roles';
import StoreDI from './Store/StoreDI';
import initLogRocket from './initLogRocket';

initLogRocket();

function App() {
  const [ cookies ] = useCookies([ 'jwt', 'isAdmin', 'user' ]);

  const loggedIn = !!cookies.jwt;

  const role = cookies.user?.role?.name || GUEST;

  if (process.env.NODE_ENV !== 'development') {
    if (cookies.user) {
      LogRocket.identify('maxfungames/screenwriter', {
        id: cookies.user.id,
        name: cookies.user.username,
        email: cookies.user.email,
        role: role,
      });
    }
  }

  return (
    <Router>
      {loggedIn && (
        <Switch>
          <Route path="/" exact component={StoryListPage}/>
          {(role === AUTHOR || role === ADMIN) && (
            <Route path="/new-story" exact component={StoryCreatePage}/>
          )}
          <Route path="/story/:id" exact component={StoryEditorPage}/>
          <Redirect to={'/'}/>
        </Switch>
      )}
      {!loggedIn && (
        <Switch>
          <Route path="/login">
            <LoginPage/>
          </Route>
          <Redirect to={'/login'}/>
        </Switch>
      )}
    </Router>
  );
}

export default provider(
  ApiClientFactory(),
  StoreDI(),
)(App);
