// @flow
import { combineReducers } from 'redux';
import { flatten } from 'flat';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { getLocalizedElement, getIndexForLanguageCode, objectValuesToString, validateOptions } from '../utils';
import type { Selector, SelectorCreator } from 'reselect';
import type {
  Language,
  NamedLanguage,
  Translations,
  TransFormFunction,
  MissingTranslationCallback,
  Options,
  LocaleState,
  TranslatedLanguage,
  LocalizedElement,
  LocalizedElementMap,
  TranslatePlaceholderData,
  TranslateValue,
  Translate,
  SingleLanguageTranslation,
  MultipleLanguageTranslation,
  InitializePayload,
  AddTranslationPayload,
  AddTranslationForLanguagePayload,
  SetLanguagesPayload,
  SetActiveLanguagePayload,
  BaseAction,
  InitializeAction,
  AddTranslationAction,
  AddTranslationForLanguageAction,
  SetActiveLanguageAction,
  SetLanguagesAction,
  Action,
  ActionDetailed
} from '../index';

/**
 * ACTIONS
 */
export const INITIALIZE                   = '@@localize/INITIALIZE';
export const ADD_TRANSLATION              = '@@localize/ADD_TRANSLATION';
export const ADD_TRANSLATION_FOR_LANGUGE  = '@@localize/ADD_TRANSLATION_FOR_LANGUGE';
export const SET_LANGUAGES                = '@@localize/SET_LANGUAGES';
export const SET_ACTIVE_LANGUAGE          = '@@localize/SET_ACTIVE_LANGUAGE';
export const TRANSLATE                    = '@@localize/TRANSLATE';

/**
 * REDUCERS
 */
export function languages(state: Language[] = [], action: Action): Language[] {
  switch (action.type) {
    case INITIALIZE:
    case SET_LANGUAGES:
      const options = action.payload.options || {};
      const activeLanguage = action.payload.activeLanguage || options.defaultLanguage;
      return action.payload.languages.map((language, index) => {
        const isActive = (code) => {
          return activeLanguage !== undefined
            ? code === activeLanguage
            : index === 0;
        };
        // check if it's using array of Language objects, or array of languge codes
        return typeof language === 'string'
          ? { code: language, active: isActive(language) }    // language codes
          : { ...language, active: isActive(language.code) }; // language objects
      });
    case SET_ACTIVE_LANGUAGE:
      return state.map(language => {
        return language.code === action.payload.languageCode
          ? { ...language, active: true }
          : { ...language, active: false };
      });
    default:
      return state;
  }
}

export function translations(state: Translations = {}, action: ActionDetailed): Translations {
  switch(action.type) {
    case ADD_TRANSLATION:
    // apply transformation if set in options
    const translations = action.translationTransform !== undefined
      ? action.translationTransform(action.payload.translation, action.languageCodes)
      : action.payload.translation;
      return {
        ...state,
        ...flatten(translations, { safe: true })
      };
    case ADD_TRANSLATION_FOR_LANGUGE:
    const languageIndex = action.languageCodes.indexOf(action.payload.language);
    const flattenedTranslations = languageIndex >= 0 ? flatten(action.payload.translation) : {};
      // convert single translation data into multiple
      const languageTranslations = Object.keys(flattenedTranslations).reduce((prev, cur: string) => {
        // loop through each language, and for languages that don't match active language 
        // keep existing translation data, and for active language store new translation data
        const translationValues = action.languageCodes.map((code, index) => {
          const existingValues = state[cur] || [];
          return index === languageIndex
            ? flattenedTranslations[cur]
            : existingValues[index]
        });
        return {
          ...prev,
          [cur]: translationValues
        };
      }, {});

      return {
        ...state,
        ...languageTranslations
      };
    default:
      return state;
  }
}

export function options(state: Options = defaultTranslateOptions, action: Action): Options {
  switch(action.type) {
    case INITIALIZE:
      const options = action.payload.options || {};
      return {
        ...state,
        ...validateOptions(options)
      };
    default:
      return state;
  }
};

export const defaultTranslateOptions: Options = {
  renderInnerHtml: true,
  showMissingTranslationMsg: true
};

const initialState: LocaleState = {
  languages: [],
  translations: {},
  options: defaultTranslateOptions
};

export const localeReducer = (state: LocaleState = initialState, action: Action): LocaleState => {
  const languageCodes = state.languages.map(language => language.code);
  const translationTransform = state.options.translationTransform;
  return {
    languages: languages(state.languages, action),
    translations: translations(state.translations, { ...action, languageCodes, translationTransform }),
    options: options(state.options, action)
  };
};

/**
 * ACTION CREATORS
 */
export const initialize = (languages: string[]|NamedLanguage[], options: Options = defaultTranslateOptions): InitializeAction => ({
  type: INITIALIZE,
  payload: { languages, options }
});

export const addTranslation = (translation: MultipleLanguageTranslation): AddTranslationAction => ({
  type: ADD_TRANSLATION,
  payload: { translation }
});

export const addTranslationForLanguage = (translation: SingleLanguageTranslation, language: string): AddTranslationForLanguageAction => ({
  type: ADD_TRANSLATION_FOR_LANGUGE,
  payload: { translation, language }
});

export const setLanguages = (languages: string[]|NamedLanguage[], activeLanguage: string): SetLanguagesAction => ({
  type: SET_LANGUAGES,
  payload: { languages, activeLanguage }
});

export const setActiveLanguage = (languageCode: string): SetActiveLanguageAction => ({
  type: SET_ACTIVE_LANGUAGE,
  payload: { languageCode }
});


/**
 * SELECTORS
 */
export const getTranslations = (state: LocaleState): Translations => state.translations;

export const getLanguages = (state: LocaleState): Language[] => state.languages;

export const getOptions = (state: LocaleState): Options => state.options;

export const getActiveLanguage = (state: LocaleState): Language => {
  const languages = getLanguages(state);
  return languages.filter(language => language.active === true)[0];
};

export const translationsEqualSelector = createSelectorCreator(
  defaultMemoize,
  (cur: Object, prev: Object) => {
    const isTranslationsData: boolean = !(Array.isArray(cur) || Object.keys(cur).toString() === 'code,active');

    // for translations data use a combination of keys and values for comparison
    if (isTranslationsData) {
      const prevTranslations = (prev: Translations);
      const curTranslations = (cur: Translations);
 
      const prevKeys: string = Object.keys(prevTranslations).toString();
      const curKeys: string = Object.keys(curTranslations).toString();

      const prevValues = objectValuesToString(prevTranslations);
      const curValues = objectValuesToString(curTranslations);

      const prevCacheValue = `${ prevKeys } - ${ prevValues }`;
      const curCacheValue  = `${ curKeys } - ${ curValues }`;

      return prevCacheValue === curCacheValue;
    }
    
    return prev === cur; 
  }
)

export const getTranslationsForActiveLanguage: Selector<LocaleState, void, TranslatedLanguage> = translationsEqualSelector(
  getActiveLanguage,
  getLanguages,
  getTranslations,
  (activeLanguage, languages, translations) => {
    const { code: activeLanguageCode } = activeLanguage;
    const activeLanguageIndex = getIndexForLanguageCode(activeLanguageCode, languages);
    return Object.keys(translations).reduce((prev, key) => {
      return {
        ...prev,
        [key]: translations[key][activeLanguageIndex]
      }
    }, {});
  }
);

export const getTranslate: Selector<LocaleState, void, Translate> = createSelector(
  getTranslationsForActiveLanguage,
  getActiveLanguage,
  getOptions,
  (translations, activeLanguage, options) => {
    return (value, data, optionsOverride = {}) => {
      const translateOptions: Options = {...options, ...optionsOverride};
      if (typeof value === 'string') {
        return getLocalizedElement(value, translations, data, activeLanguage, translateOptions);
      } else if (Array.isArray(value)) {
        return value.reduce((prev, cur) => {
          return {
            ...prev,
            [cur]: getLocalizedElement(cur, translations, data, activeLanguage, translateOptions)
          };
        }, {});
      } else {
        throw new Error('react-localize-redux: Invalid key passed to getTranslate.');
      }
    }
  }
);
