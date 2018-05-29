import React, { Component, type ComponentType } from 'react';
import { LocalizeContext, type LocalizeContextProps } from './LocalizeContext';

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

  return LocalizedComponent;
}
