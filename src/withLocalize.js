import React, { Component, type ComponentType } from 'react';
import { LocalizeContext, type LocalizeContextProps } from './LocalizeContext';
import hoistNonReactStatics from 'hoist-non-react-statics';

export function withLocalize<Props: {}>(
  WrappedComponent: ComponentType<Props>
): ComponentType<$Diff<Props, { ...LocalizeContextProps }>> {
  const LocalizedComponent = (props: Props) => {
    return (
      <LocalizeContext.Consumer>
        {context => <WrappedComponent {...context} {...props} />}
      </LocalizeContext.Consumer>
    );
  };

  // Automatically copy over static variables
  hoistNonReactStatics(LocalizedComponent, WrappedComponent);

  return LocalizedComponent;
}
