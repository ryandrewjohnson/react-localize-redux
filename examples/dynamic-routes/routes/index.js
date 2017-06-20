import { routeError, loadMultipleRoutes } from '../utils/routes';
import { addTranslation, setLanguages, setActiveLanguage } from 'react-localize-redux';
import CoreLayout from '../components/CoreLayout';

export const PATH = '/(:lang)';

const mainRoute = (store) => {

  const routes = {
    path: PATH,
    component: CoreLayout,
    
    onEnter (nextState) {
      const language = nextState.params.lang || 'en';
      const json = require('../assets/global.locale.json');
      store.dispatch(setLanguages(['en', 'fr', 'es']));
      store.dispatch(setActiveLanguage(language));
      store.dispatch(addTranslation(json));
    },

    indexRoute: {
      onEnter: (nextState, replace) => {
        const language = nextState.params.lang || 'en';
        replace(`/${language}/welcome`);
      }
    },

    getChildRoutes (partialNextState, next) {
      Promise.all([
        System.import('./welcome'),
        System.import('./info')
      ])
      .then(loadMultipleRoutes(next, store))
      .catch(routeError);
    }

  };

  return routes;
};

export default mainRoute;