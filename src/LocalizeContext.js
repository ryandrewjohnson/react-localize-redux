// @flow
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
  getOptions
} from './localize';

// export type LocalizeContextProps = {
//   translate: TranslateFunction,
//   languages: Language[],
//   activeLanguage: Language,
//   defaultLanguage: string,
//   initialize: (payload: InitializePayload) => void,
//   addTranslation: (translation: MultipleLanguageTranslation) => void,
//   addTranslationForLanguage: (
//     translation: SingleLanguageTranslation,
//     language: string
//   ) => void,
//   setActiveLanguage: (languageCode: string) => void,
//   renderToStaticMarkup: renderToStaticMarkupFunction | false,
//   ignoreTranslateChildren: boolean
// };

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

export const LocalizeContext = createContext(defaultContext);
