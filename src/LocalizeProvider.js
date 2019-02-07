// @flow
import React, { Component } from 'react';
import {
  localizeReducer,
  getActiveLanguage,
  getOptions,
  getTranslationsForActiveLanguage,
  initialize as initializeAC,
  INITIALIZE,
  InitializePayload
} from './localize';
import { LocalizeContext, getContextPropsFromState } from './LocalizeContext';
import { storeDidChange } from './utils';

export class LocalizeProvider extends Component {
  // unsubscribeFromStore;
  // getContextPropsSelector;
  // contextProps;

  constructor(props) {
    super(props);

    const dispatch = this.props.store
      ? this.props.store.dispatch
      : this.dispatch.bind(this);

    this.getContextPropsSelector = getContextPropsFromState(dispatch);

    const initialState =
      this.props.initialize !== undefined
        ? localizeReducer(undefined, {
            type: INITIALIZE,
            payload: this.props.initialize
          })
        : localizeReducer(undefined, {});

    this.state = {
      localize: initialState
    };
  }

  componentDidMount() {
    this.initExternalStore();
    this.subscribeToExternalStore();
  }

  componentWillUnmount() {
    this.unsubscribeFromStore && this.unsubscribeFromStore();
  }

  initExternalStore() {
    const { store, initialize } = this.props;
    if (store && initialize) {
      store.dispatch(initializeAC(initialize));
    }
  }

  subscribeToExternalStore() {
    const { store } = this.props;
    if (store) {
      this.unsubscribeFromStore = storeDidChange(
        store,
        this.onStateDidChange.bind(this)
      );
    }
  }

  onStateDidChange(prevState) {
    if (!this.props.store) {
      return;
    }
    const getState = this.props.getState || (state => state.localize);

    const prevLocalizeState = prevState && getState(prevState);
    const curLocalizeState = getState(this.props.store.getState());

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

  dispatch(action) {
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
