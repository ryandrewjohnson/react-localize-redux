import React, { Component } from 'react';
import { LocalizeContext, LocalizeContextType } from './LocalizeContext';
import hoistNonReactStatic from 'hoist-non-react-statics';

export function withLocalize<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P & LocalizeContextType> {
  class LocalizedComponent extends Component<P & LocalizeContextType> {
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
