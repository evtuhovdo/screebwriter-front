import { toFactory } from 'react-ioc';
import { Store } from './Store';

const StoreDI = (): any => [
  Store,
  toFactory(
    () => Store.create(),
  ),
];


export default StoreDI;
