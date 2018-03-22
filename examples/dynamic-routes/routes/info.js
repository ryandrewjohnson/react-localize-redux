// @flow
import { addTranslation } from 'react-localize-redux';
import InfoView from '../components/InfoView';

export default (store: any) => {
  return {
    path: 'info',
    getComponent: (nextState: any, next: any) => {
      const json = require('../assets/info.locale.json');
      store.dispatch(addTranslation(json));
      next(null, InfoView);
    }
  }
};