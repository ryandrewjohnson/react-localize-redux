import React, { createContext } from 'react';
import { createSelector } from 'reselect';
import {
  localizeReducer,
  getTranslate,
  initialize,
  addTranslation,
  addTranslationForLanguage,
  setActiveLanguage,
  getLanguages,
  getActiveLanguage,
  getOptions,
  defaultTranslateOptions,
  InitializeAction,
  AddTranslationAction,
  AddTranslationForLanguageAction,
  SetActiveLanguageAction,
  Language,
  onMissingTranslationFunction,
  InitializePayload,
  MultiLanguageTranslationData,
  SingleLanguageTranslationData,
  renderToStaticMarkupFunction
} from './localize';

export interface TranslateOptions {
  language?: string;
  renderInnerHtml?: boolean;
  onMissingTranslation?: onMissingTranslationFunction;
  ignoreTranslateChildren?: boolean;
}

type LocalizedElement =
  | string
  | React.DetailedReactHTMLElement<any, HTMLElement>;

type LocalizedElementMap = {
  [key: string]: LocalizedElement;
};

export type TranslateResult = LocalizedElement | LocalizedElementMap;

export type TranslateFunction = (
  value: string | string[],
  data?: { [key: string]: string | React.ReactNode },
  options?: TranslateOptions
) => TranslateResult;

export type LocalizeContextType = {
  initialize: (payload: InitializePayload) => void;
  addTranslation: (payload: MultiLanguageTranslationData) => void;
  addTranslationForLanguage: (
    translation: SingleLanguageTranslationData,
    language: string
  ) => void;
  setActiveLanguage: (languageCode: string) => void;
  translate: TranslateFunction;
  languages: Language[];
  activeLanguage: Language;
  defaultLanguage: string;
  renderToStaticMarkup: renderToStaticMarkupFunction | boolean;
  ignoreTranslateChildren: boolean;
};

const dispatchInitialize = dispatch => payload => {
  return dispatch(initialize(payload));
};

const dispatchAddTranslation = dispatch => translation => {
  return dispatch(addTranslation(translation));
};

const dispatchAddTranslationForLanguage = dispatch => (
  translation,
  language
) => {
  return dispatch(addTranslationForLanguage(translation, language));
};

const dispatchSetActiveLanguage = dispatch => languageCode => {
  return dispatch(setActiveLanguage(languageCode));
};

export const getContextPropsFromState = dispatch =>
  createSelector(
    getTranslate,
    getLanguages,
    getActiveLanguage,
    getOptions,
    (translate, languages, activeLanguage, options) => {
      const defaultLanguage =
        options.defaultLanguage || (languages[0] && languages[0].code);
      const renderToStaticMarkup = options.renderToStaticMarkup;
      const ignoreTranslateChildren =
        options.ignoreTranslateChildren !== undefined
          ? options.ignoreTranslateChildren
          : defaultTranslateOptions.ignoreTranslateChildren;

      return {
        translate,
        languages,
        defaultLanguage,
        activeLanguage,
        initialize: dispatchInitialize(dispatch),
        addTranslation: dispatchAddTranslation(dispatch),
        addTranslationForLanguage: dispatchAddTranslationForLanguage(dispatch),
        setActiveLanguage: dispatchSetActiveLanguage(dispatch),
        renderToStaticMarkup,
        ignoreTranslateChildren
      };
    }
  );

const defaultLocalizeState = localizeReducer(undefined, {});
const defaultContext = getContextPropsFromState(() => {})(defaultLocalizeState);

export const LocalizeContext = createContext<LocalizeContextType>(
  defaultContext
);
