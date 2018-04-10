import * as React from 'react';
import { render } from 'react-dom';
import { Translate, localeReducer, addTranslation, initialize } from 'react-localize-redux';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(combineReducers({
  locale: localeReducer
}));

store.dispatch(initialize([
  { name: 'English', code: 'en' },
  { name: 'French', code: 'fr' }
]));

const translations = {
  'welcome-page': [
    'Welcome Page',
    'Page d’accueil',
    'Página de bienvenida'
  ],
  'info-page': [
    'Info Page',
    'Page d’informations',
    'Página de información'
  ]
};

store.dispatch(addTranslation(translations));

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center'
};

const App = () => (
  <Provider store={store}>
    <div style={styles}>
      <h2>Start editing to see some magic happen {'\u2728'}</h2>

      <Translate id="welcome-page" />
    </div>
  </Provider>
);

render(<App />, document.getElementById('root'));
