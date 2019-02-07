import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { LocalizeContext } from './LocalizeContext';

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
