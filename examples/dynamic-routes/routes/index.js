// @flow
import { routeError, loadMultipleRoutes } from '../utils/routes';
import { addTranslation, addTranslationForLanguage, initialize, setActiveLanguage } from 'react-localize-redux';
import CoreLayout from '../components/CoreLayout';

export const PATH = '/(:lang)';

const mainRoute = (store: any) => {

  const routes = {
    path: PATH,
    component: CoreLayout,
    
    onEnter (nextState: any) {
      const language = nextState.params.lang || 'en';
      const json = require('../assets/global.locale.json');
      store.dispatch(initialize([
        { name: 'English', code: 'en' }, 
        { name: 'French', code: 'fr' }, 
        { name: 'Spanish', code: 'es' }
      ]));
      store.dispatch(setActiveLanguage(language));
      store.dispatch(addTranslation(json));

      // add language specific json depending on current language
      const articleJson = require(`../assets/${ language }.article.json`);
      store.dispatch(addTranslationForLanguage(articleJson, language));
    },

    indexRoute: {
      onEnter: (nextState: any, replace: any) => {
        const language = nextState.params.lang || 'en';
        replace(`/${language}/welcome`);
      }
    },

    getChildRoutes (partialNextState: any, next: any) {
      Promise.all([
        import('./welcome'),
        import('./info')
      ])
      .then(loadMultipleRoutes(next, store))
      .catch(routeError);
    }

  };

  return routes;
};

export default mainRoute;