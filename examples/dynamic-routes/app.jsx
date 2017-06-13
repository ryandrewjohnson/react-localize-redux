import React from 'react';
import { Store, applyMiddleware, compose, createStore, combineReducers } from 'redux';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import rootRoute from './routes';
import { localeReducer } from 'react-localize-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const ROOT_NODE = document.getElementById('root');

const store = createStore(localeReducer, composeWithDevTools());

const App = props => {
  return (
    <Provider store={ store }>
      <Router history={ hashHistory } routes={ rootRoute(store) } />
    </Provider>
  );
};

ReactDOM.render(<App />, ROOT_NODE);

