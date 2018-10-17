import React, { Component, type ComponentType } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { LocalizeContext, type LocalizeContextProps } from './LocalizeContext';

export function withLocalize<Props: {}>(
  WrappedComponent: ComponentType<Props>
): ComponentType<$Diff<Props, { ...LocalizeContextProps }>> {
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
