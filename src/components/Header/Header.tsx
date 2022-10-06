/* eslint-disable  jsx-a11y/anchor-is-valid */

import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink, Link } from 'react-router-dom';

import './Header.scss';
import { ADMIN, AUTHOR, GUEST } from '../../helpres/roles';
import { useInstance } from 'react-ioc';
import ApiClient from '../../Api/ApiClient';
import useSWR from 'swr';

const Header = () => {
  const x = useCookies([ 'jwt', 'isAdmin', 'user', 'canDoTwoOptions' ]);

  const cookies = x[0];
  const removeCookie = x[2];

  const role = cookies.user?.role?.name || GUEST;

  const apiClient = useInstance(ApiClient);
  const { data } = useSWR('AuthorCanCreateStory', apiClient.fetchAuthorCanCreateStory);

  const [canAuthorCreate, setAuthorCanCreate] = useState(false);

  useEffect(() => {
    if (data) {
      setAuthorCanCreate(true);
    } else {
      setAuthorCanCreate(false);
    }
  }, [data]);

  const onLogoutClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    removeCookie('jwt');
    removeCookie('isAdmin');
    removeCookie('user');
    removeCookie('canDoTwoOptions');

    event.preventDefault();
    event.stopPropagation();

    return false;
  };

  return (
    <div className="Header">
      <div className="Header__content">
        <Link className="Header__left" to={'/'}>
          <div className="Header__logo"/>
          <div className="Header__title">Screenwriter workplace</div>
        </Link>

        <div className="Header__right">
          <div className="Header__userName">
            {cookies.user?.username} ({role})
          </div>
          {role === AUTHOR && canAuthorCreate && (
            <NavLink exact className="Header__link" to={'/new-story'} activeClassName="Header__link--active">
              New Story
            </NavLink>
          )}
          {role === ADMIN && (
            <NavLink exact className="Header__link" to={'/new-story'} activeClassName="Header__link--active">
              New Story
            </NavLink>
          )}
          <NavLink exact className="Header__link" to={'/'} activeClassName="Header__link--active">
            My Stories
          </NavLink>
          <a
            href="https://vivid-chameleon-0ac.notion.site/The-completed-age-story-form-manual-506f29aa9b744b13a6fa3352975eaf94"
            className="Header__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Manual
          </a>
          <a className="Header__link" href="#" onClick={onLogoutClick}>
            Log out
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
