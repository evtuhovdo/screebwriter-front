import React from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { observer } from 'mobx-react';
import { useCookies } from 'react-cookie';
import ClipLoader from 'react-spinners/ClipLoader';
import { useInstance } from 'react-ioc';

import ApiClient from '../../Api/ApiClient';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';

import './LoginPage.scss';

interface Values {
  login: string;
  password: string;
}

const validateLoginForm = (values: Values) => {
  const errors: any = {};

  if (!values.login) {
    errors.login = 'Enter email';
  }

  if (!values.password) {
    errors.password = 'Enter password';
  }

  return errors;
};

interface IJWTData {
  exp: number,
  iat: number,
  id: string,
}

const LoginPage = () => {
  const x = useCookies([ 'jwt', 'isAdmin', 'user', 'canDoTwoOptions' ]);

  const apiClient = useInstance(ApiClient);

  const setCookie = x[1];
  const removeCookie = x[2];

  const initialValues = {
    login: '',
    password: '',
  };

  const onSubmit = async (
    values: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>,
  ) => {
    try {
      const result = await apiClient.login({ login: values.login, password: values.password });

      if (!result) {
        setErrors({
          login: 'Wrong login\\email or password',
        });
        setSubmitting(false);
        return;
      }

      const { jwt, isAdmin, user, canDoTwoOptions } = result;

      if (!jwt) {
        setErrors({
          login: 'Wrong login\\email or password',
        });
        setSubmitting(false);
        return;
      }

      try {
        const jwtData: IJWTData = JSON.parse(atob(jwt.split('.')[1]));

        if (!jwtData.exp || !jwtData.iat || !jwtData.id) {
          console.error('Invalid jwt data');
          setErrors({
            login: 'Error. Try again later',
          });
          setSubmitting(false);
          return;
        }

        const expires = new Date();
        expires.setTime(jwtData.exp * 1000);

        setCookie('user', user, { expires });
        if (isAdmin) {
          setCookie('isAdmin', '1', { expires });
        } else {
          removeCookie('isAdmin');
        }

        if (canDoTwoOptions) {
          setCookie('canDoTwoOptions', '1', { expires });
        } else {
          removeCookie('canDoTwoOptions');
        }
        setCookie('jwt', jwt, { expires });
      } catch (e) {
        setErrors({
          login: 'Error. Try again later',
        });
        setSubmitting(false);
      }
    } catch (e) {
      console.error(e);
      setErrors({
        login: 'Error. Try again later',
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="LoginPage">
      <div className="big-logo"/>
      <div className="title">Screenwriter workspace</div>

      <Formik
        validate={validateLoginForm}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off" className="loginForm">
            <Field autoComplete="off" name="login" label="Login/email" component={TextInput} disabled={isSubmitting}/>
            <Field autoComplete="off" name="password" label="Password" type="password" component={TextInput} disabled={isSubmitting}/>
            <Button type="submit" disabled={isSubmitting}>
              {!isSubmitting && 'Login'}
              {isSubmitting && <ClipLoader color="#fff" size={20} />}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default observer(LoginPage);
