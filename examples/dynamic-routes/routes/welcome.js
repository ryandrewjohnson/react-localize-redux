import { addTranslation } from 'react-localize-redux';
import WelcomeView from '../components/WelcomeView';

export default (store) => {
  return {
    path: 'welcome',
    getComponent: (nextState, next) => {
      const json = require('../assets/welcome.locale.json');
      store.dispatch(addTranslation(json));
      next(null, WelcomeView);
    }
  }
};