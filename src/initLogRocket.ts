import LogRocket from 'logrocket';

const initLogRocket = () => {
  if (process.env.NODE_ENV !== 'development') {
    LogRocket.init('maxfungames/screenwriter');
  }
};

export default initLogRocket;
