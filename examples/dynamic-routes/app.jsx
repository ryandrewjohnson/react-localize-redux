import React from 'react';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import ReactDOM from 'react-dom';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import rootRoute from './routes';
import { localeReducer } from 'react-localize-redux';

const ROOT_NODE = document.getElementById('root');

const store = createStore(
  combineReducers({
    locale: localeReducer
  }),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const App = props => {
  return (
    <Provider store={ store }>
      <Router history={ hashHistory } routes={ rootRoute(store) } />
    </Provider>
  );
};

ReactDOM.render(<App />, ROOT_NODE);

