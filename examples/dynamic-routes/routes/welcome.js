// @flow
import { addTranslation } from 'react-localize-redux';
import WelcomeView from '../components/WelcomeView';

export default (store: any) => {
  return {
    path: 'welcome',
    getComponent: (nextState: any, next: any) => {
      const json = require('../assets/welcome.locale.json');
      store.dispatch(addTranslation(json));
      next(null, WelcomeView);
    }
  }
};