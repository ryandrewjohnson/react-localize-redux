import React, { useState, useEffect } from 'react';
import {
  localizeReducer,
  getActiveLanguage,
  getOptions,
  getTranslationsForActiveLanguage,
  initialize as initializeAC,
  INITIALIZE
} from './localize';
import { LocalizeContext, getContextPropsFromState } from './LocalizeContext';
import { storeDidChange } from './utils';

export const LocalizeProvider = props => {
  const initExternalStore = () => {
    const { store, initialize } = props;
    if (store && initialize) {
      store.dispatch(initializeAC(initialize));
    }
  };

  const initialState =
    props.initialize !== undefined
      ? localizeReducer(undefined, {
          type: INITIALIZE,
          payload: props.initialize
        })
      : localizeReducer(undefined, {});

  const [localize, setLocalize] = useState(localizeReducer(initialState, {}));

  const onStateDidChange = prevState => {
    if (!props.store) {
      return;
    }
    const getState = props.getState || (state => state.localize);

    const prevLocalizeState = prevState && getState(prevState);
    const curLocalizeState = getState(props.store.getState());

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
      setLocalize(curLocalizeState);
    }
  };

  useEffect(() => {
    initExternalStore();
    const unsubscribeFromStore = subscribeToExternalStore();
    return () => unsubscribeFromStore && unsubscribeFromStore();
  }, []);

  const subscribeToExternalStore = () => {
    if (props.store) {
      return storeDidChange(props.store, onStateDidChange);
    }
  };

  const dispatch = props.store
    ? props.store.dispatch
    : action => setLocalize(prevState => localizeReducer(prevState, action));

  const getContextPropsSelector = getContextPropsFromState(dispatch);
  const contextProps = getContextPropsSelector(localize);

  return (
    <LocalizeContext.Provider value={contextProps}>
      {props.children}
    </LocalizeContext.Provider>
  );
};
