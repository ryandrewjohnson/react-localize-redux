import { localize } from 'react-localize-redux';
import { setLocalTranslations } from 'react-localize-redux';
import InfoView from '../components/InfoView';

export default (store) => {
  return {
    path: 'info',
    getComponent: (nextState, next) => {
      const json = require('../assets/info.locale.json');
      store.dispatch(setLocalTranslations('info', json));
      next(null, localize('info')(InfoView));
    }
  }
};