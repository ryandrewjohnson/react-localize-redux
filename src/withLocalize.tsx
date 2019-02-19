import React, { Component } from 'react';
import { LocalizeContext } from './LocalizeContext';
// const hoistNonReactStatic = require('hoist-non-react-statics');
import hoistNonReactStatic from 'hoist-non-react-statics';

export function withLocalize(WrappedComponent) {
  class LocalizedComponent extends Component {
    render() {
      return (
        <LocalizeContext.Consumer>
          {context => <WrappedComponent {...context} {...this.props} />}
        </LocalizeContext.Consumer>
      );
    }
  }
  hoistNonReactStatic(LocalizedComponent, WrappedComponent);
  return LocalizedComponent;
}
