// @flow
import React from 'react';
import createReactContext, { type Context } from 'create-react-context';
import { createSelector, type Selector } from 'reselect';
import {
  type TranslateFunction,
  type Language,
  type MultipleLanguageTranslation,
  type SingleLanguageTranslation,
  type InitializePayload,
  type LocalizeState,
  type renderToStaticMarkupFunction
} from './localize';
import {
  localizeReducer,
  getTranslate,
  initialize,
  addTranslation,
  addTranslationForLanguage,
  setActiveLanguage,
  getLanguages,
  getActiveLanguage,
  getOptions
} from './localize';

export type LocalizeContextProps = {
  translate: TranslateFunction,
  languages: Language[],
  activeLanguage: Language,
  defaultLanguage: string,
  initialize: (payload: InitializePayload) => void,
  addTranslation: (translation: MultipleLanguageTranslation) => void,
  addTranslationForLanguage: (
    translation: SingleLanguageTranslation,
    language: string
  ) => void,
  setActiveLanguage: (languageCode: string) => void,
  renderToStaticMarkup: renderToStaticMarkupFunction | false
};

const dispatchInitialize = (dispatch: Function) => (
  payload: InitializePayload
) => {
  return dispatch(initialize(payload));
};

const dispatchAddTranslation = (dispatch: Function) => (
  translation: MultipleLanguageTranslation
) => {
  return dispatch(addTranslation(translation));
};

const dispatchAddTranslationForLanguage = (dispatch: Function) => (
  translation: SingleLanguageTranslation,
  language: string
) => {
  return dispatch(addTranslationForLanguage(translation, language));
};

const dispatchSetActiveLanguage = (dispatch: Function) => (
  languageCode: string
) => {
  return dispatch(setActiveLanguage(languageCode));
};

export const getContextPropsFromState = (
  dispatch: Function
): Selector<LocalizeState, void, LocalizeContextProps> =>
  createSelector(
    getTranslate,
    getLanguages,
    getActiveLanguage,
    getOptions,
    (translate, languages, activeLanguage, options) => {
      const defaultLanguage =
        options.defaultLanguage || (languages[0] && languages[0].code);
      const renderToStaticMarkup = options.renderToStaticMarkup;
      return {
        translate,
        languages,
        defaultLanguage,
        activeLanguage,
        initialize: dispatchInitialize(dispatch),
        addTranslation: dispatchAddTranslation(dispatch),
        addTranslationForLanguage: dispatchAddTranslationForLanguage(dispatch),
        setActiveLanguage: dispatchSetActiveLanguage(dispatch),
        renderToStaticMarkup
      };
    }
  );

const defaultLocalizeState = localizeReducer(undefined, ({}: any));
const defaultContext = getContextPropsFromState(() => {})(defaultLocalizeState);

export const LocalizeContext: Context<
  LocalizeContextProps
> = createReactContext(defaultContext);
