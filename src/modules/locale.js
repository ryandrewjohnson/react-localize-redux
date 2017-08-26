import { combineReducers } from 'redux';
import { flatten } from 'flat';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { isDefinedNested, getLocalizedElement, getIndexForLanguageCode, objectValuesToString } from '../utils';

export const INITIALIZE                   = '@@localize/INITIALIZE';
export const ADD_TRANSLATION              = '@@localize/ADD_TRANSLATION';
export const ADD_TRANSLATION_FOR_LANGUGE  = '@@localize/ADD_TRANSLATION_FOR_LANGUGE';
export const SET_LANGUAGES                = '@@localize/SET_LANGUAGES';
export const SET_ACTIVE_LANGUAGE          = '@@localize/SET_ACTIVE_LANGUAGE';
export const TRANSLATE                    = '@@localize/TRANSLATE';

/**
 * REDUCERS
 */
export function languages(state = [], action) {
  switch (action.type) {
    case INITIALIZE:
    case SET_LANGUAGES:
      const languageCodes = action.payload.languageCodes;
      const options = action.payload.options || {};
      const activeLanguage = action.payload.activeLanguage || options.defaultLanguage || languageCodes[0];
      const activeIndex = languageCodes.indexOf(activeLanguage);
      return languageCodes.map((code, index) => {
        const isActive = index === activeIndex;
        return { code, active: isActive };
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

export function translations(state = {}, action) {
  switch(action.type) {
    case ADD_TRANSLATION:
      return {
        ...state,
        ...flatten(action.payload.translation, { safe: true })
      };
    case ADD_TRANSLATION_FOR_LANGUGE:
      const languageIndex = action.languageCodes.indexOf(action.payload.language);
      const flattenedTranslations = languageIndex >= 0 ? flatten(action.payload.translation) : {};
      const languageTranslations = Object.keys(flattenedTranslations).reduce((prev, cur) => {
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

export function options(state = defaultTranslateOptions, action) {
  switch(action.type) {
    case INITIALIZE:
      return {
        ...state,
        ...action.payload.options
      };
    default:
      return state;
  }
}

export const defaultTranslateOptions = {
  renderInnerHtml: true
};

const initialState = {
  languages: [],
  translations: {},
  options: defaultTranslateOptions
};

export const localeReducer = (state = initialState, action) => {
  const languageCodes = state.languages.map(language => language.code);
  return {
    languages: languages(state.languages, action),
    translations: translations(state.translations, { ...action, languageCodes }),
    options: options(state.options, action)
  };
};

/**
 * ACTION CREATORS
 */
export const initialize = (languageCodes, options = defaultTranslateOptions) => ({
  type: INITIALIZE,
  payload: { languageCodes, options }
});

export const addTranslation = (translation) => ({
  type: ADD_TRANSLATION,
  payload: { translation }
});

export const addTranslationForLanguage = (translation, language) => ({
  type: ADD_TRANSLATION_FOR_LANGUGE,
  payload: { translation, language }
});

export const setLanguages = (languageCodes, activeLanguage = null) => ({
  type: SET_LANGUAGES,
  payload: { languageCodes, activeLanguage }
});

export const setActiveLanguage = (languageCode) => ({
  type: SET_ACTIVE_LANGUAGE,
  payload: { languageCode }
});

/**
 * SELECTORS
 */
export const getTranslations = state => state.translations;
export const getLanguages = state => state.languages;
export const getOptions = state => state.options;
export const getActiveLanguage = state => {
  const languages = getLanguages(state);
  const activeLanguageIndex = languages.map(language => language.active).indexOf(true);
  return languages[activeLanguageIndex];
};


export const customeEqualSelector = createSelectorCreator(
  defaultMemoize,
  (cur, prev) => {
    const isTranslationsData = !(Array.isArray(cur) || Object.keys(cur).toString() === 'code,active');

    // for translations data use a combination of keys and values for comparison
    if (isTranslationsData) {
      const prevKeys = Object.keys(prev).toString();
      const curKeys = Object.keys(cur).toString();

      const prevValues = objectValuesToString(prev);
      const curValues = objectValuesToString(cur);

      prev = `${ prevKeys } - ${ prevValues }`;
      cur  = `${ curKeys } - ${ curValues }`;
    }
    
    return prev === cur;
  }
)

export const getTranslationsForActiveLanguage = customeEqualSelector(
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

export const getTranslate = createSelector(
  getTranslationsForActiveLanguage,
  getOptions,
  (translations, options) => {
    return (value, data, optionsOverride = {}) => {
      const translateOptions = {...options, ...optionsOverride};
      if (typeof value === 'string') {
        return getLocalizedElement(value, translations, data, translateOptions);
      } else if (Array.isArray(value)) {
        return value.reduce((prev, cur) => {
          return {
            ...prev,
            [cur]: getLocalizedElement(cur, translations, data, translateOptions)
          };
        }, {});
      } else {
        throw new Error('react-localize-redux: Invalid key passed to getTranslate.');
      }
    }
  }
);
