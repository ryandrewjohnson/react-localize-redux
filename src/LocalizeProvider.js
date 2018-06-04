// @flow
import React, { Component } from 'react';
import { type Store } from 'redux';
import {
  localizeReducer,
  getActiveLanguage,
  getOptions,
  getTranslationsForActiveLanguage,
  type LocalizeState,
  type Action
} from './localize';
import {
  LocalizeContext,
  type LocalizeContextProps,
  getContextPropsFromState
} from './LocalizeContext';
import { storeDidChange } from './utils';

type LocalizeProviderState = {
  localize: LocalizeState
};

export type LocalizeProviderProps = {
  store?: Store<any, any>,
  children: any
};

export class LocalizeProvider extends Component<
  LocalizeProviderProps,
  LocalizeProviderState
> {
  unsubscribeFromStore: Function;
  getContextPropsSelector: any;
  contextProps: LocalizeContextProps;

  constructor(props: LocalizeProviderProps) {
    super(props);

    const dispatch = this.props.store
      ? this.props.store.dispatch
      : this.dispatch.bind(this);

    this.getContextPropsSelector = getContextPropsFromState(dispatch);

    this.state = {
      localize: localizeReducer(undefined, ({}: any))
    };
  }

  static getDerivedStateFromProps(nextProps: any, nextState: any) {
    return null;
  }

  componentDidMount() {
    if (this.props.store) {
      this.unsubscribeFromStore = storeDidChange(
        this.props.store,
        this.onStateDidChange.bind(this)
      );
    }
  }

  componentWillUnmount() {
    this.unsubscribeFromStore && this.unsubscribeFromStore();
  }

  onStateDidChange(prevState: LocalizeProviderState) {
    if (!this.props.store) {
      return;
    }

    const prevLocalizeState = prevState && prevState.localize;
    const curLocalizeState = this.props.store.getState().localize;

    const prevActiveLanguage =
      prevState && getActiveLanguage(prevLocalizeState);
    const curActiveLanguage = getActiveLanguage(curLocalizeState);

    const prevOptions = prevState && getOptions(prevLocalizeState);
    const curOptions = getOptions(curLocalizeState);

    const prevTranslations =
      prevState && getTranslationsForActiveLanguage(prevLocalizeState);
    const curTranslations = getTranslationsForActiveLanguage(curLocalizeState);

    const hasActiveLangaugeChanged =
      (prevActiveLanguage && prevActiveLanguage.code) !==
      (curActiveLanguage && curActiveLanguage.code);
    const hasOptionsChanged = prevOptions !== curOptions;
    const hasTranslationsChanged = prevTranslations !== curTranslations;

    if (
      hasActiveLangaugeChanged ||
      hasOptionsChanged ||
      hasTranslationsChanged
    ) {
      this.setState({ localize: curLocalizeState });
    }
  }

  dispatch(action: any) {
    console.log('action', action);

    this.setState(prevState => {
      return {
        localize: localizeReducer(prevState.localize, action)
      };
    });
  }

  render() {
    this.contextProps = this.getContextPropsSelector(this.state.localize);

    return (
      <LocalizeContext.Provider value={this.contextProps}>
        {this.props.children}
      </LocalizeContext.Provider>
    );
  }
}
