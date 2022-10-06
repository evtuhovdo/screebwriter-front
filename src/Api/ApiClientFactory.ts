import ApiClient from './ApiClient';
import { toFactory } from 'react-ioc';

const ApiClientFactory = (): any => [
  ApiClient,
  toFactory(
    () => new ApiClient(),
  ),
];

export default ApiClientFactory;

