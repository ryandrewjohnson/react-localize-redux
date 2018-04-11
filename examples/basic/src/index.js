import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { LocalizeProvider, localizeReducer } from 'react-localize-redux';
import Main from './Main';

const USING_REDUX_KEY = 'redux';

class App extends React.Component<any, any> {
  
  constructor(props) {
    super(props);

    this.onToggleReduxClick = this.onToggleReduxClick.bind(this);

    const isUsingReduxFromLocalStorage = window.localStorage.getItem(USING_REDUX_KEY)
      ? window.localStorage.getItem(USING_REDUX_KEY) === 'true'
      : false;
    
    const store = isUsingReduxFromLocalStorage === false
      ? undefined
      : this.getReduxStore();

    this.state = {
      isUsingRedux: isUsingReduxFromLocalStorage,
      store
    };
  }

  getReduxStore() {
    return createStore(combineReducers({ 
      localize: localizeReducer
    }), composeWithDevTools());
  }

  onToggleReduxClick() {
    const nextIsUsingRedux = !this.state.isUsingRedux;

    window.localStorage.setItem(USING_REDUX_KEY, nextIsUsingRedux);
    window.location.reload();
  }

  render() {
    console.log(this.state.store);
    return (
      <LocalizeProvider store={this.state.store}>
        <Router> 
          <Route path="/" component={props => 
            <Main 
              onToggleClick={this.onToggleReduxClick} 
              toggleValue={this.state.isUsingRedux} 
            />
          } />
        </Router>
      </LocalizeProvider>
    );
  }
}

render(<App />, document.getElementById('root'));
