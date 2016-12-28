import React from 'react';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import ReactDOM from 'react-dom';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import localeReducer from 'modules/locale';

const ROOT_NODE = document.getElementById('root');

const store = createStore(
  combineReducers({
    localeReducer
  }),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const App = props => {
  return (
    <Provider store={ store }>
      <Router history={ history } routes={ createRoutes(store) } />
    </Provider>
  );
};

