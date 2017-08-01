import { combineReducers } from 'redux';
import { flatten } from 'flat';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { isDefinedNested, getLocalizedElement, getIndexForLanguageCode } from '../utils';

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
    case SET_LANGUAGES:
      const languageCodes = action.payload.languageCodes;
      const activeLanguage = action.payload.activeLanguage || languageCodes[0];
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

const initialState = {
  languages: [],
  translations: {}
};

export const localeReducer = (state = initialState, action) => {
  const languageCodes = state.languages.map(language => language.code);
  return {
    languages: languages(state.languages, action),
    translations: translations(state.translations, { ...action, languageCodes })
  };
};

/**
 * ACTION CREATORS
 */
export const addTranslation = (translation) => {
  return {
    type: ADD_TRANSLATION,
    payload: { translation }
  };
};

export const addTranslationForLanguage = (translation, language) => {
  return {
    type: ADD_TRANSLATION_FOR_LANGUGE,
    payload: { translation, language }
  }
};

export const setLanguages = (languageCodes, activeLanguage = null) => {
  return {
    type: SET_LANGUAGES,
    payload: { languageCodes, activeLanguage }
  };
};

export const setActiveLanguage = (languageCode) => {
  return {
    type: SET_ACTIVE_LANGUAGE,
    payload: { languageCode }
  };
};

/**
 * SELECTORS
 */
export const getTranslations = state => state.translations;
export const getLanguages = state => state.languages;
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
      
      const prevValues = Object.keys(prev).map(key => prev[key].toString()).toString();
      const curValues = Object.keys(cur).map(key => cur[key].toString()).toString();

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
  (translations) => {
    return (value, data) => { 
      if (typeof value === 'string') {
        return getLocalizedElement(value, translations, data);
      } else if (Array.isArray(value)) {
        return value.reduce((prev, cur) => {
          return {
            ...prev,
            [cur]: getLocalizedElement(cur, translations, data)
          };
        }, {});
      } else {
        throw new Error('react-localize-redux: Invalid key passed to getTranslate.');
      }
    }
  }
);
