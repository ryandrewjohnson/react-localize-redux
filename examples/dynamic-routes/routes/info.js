import { localize } from 'react-localize-redux';
import { addTranslation } from 'react-localize-redux';
import InfoView from '../components/InfoView';

export default (store) => {
  return {
    path: 'info',
    getComponent: (nextState, next) => {
      const json = require('../assets/info.locale.json');
      store.dispatch(addTranslation(json));
      next(null, localize(InfoView, 'locale'));
    }
  }
};