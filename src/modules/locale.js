import { combineReducers } from 'redux';
import { flatten } from 'flat';
import { createSelector, Selector } from 'reselect';
import { isDefinedNested, getLocalizedElement, getIndexForLanguageCode } from '../utils';

export const ADD_TRANSLATION      = '@@localize/ADD_TRANSLATION';
export const SET_LANGUAGES        = '@@localize/SET_LANGUAGES';
export const SET_ACTIVE_LANGUAGE  = '@@localize/SET_ACTIVE_LANGUAGE';
export const TRANSLATE            = '@@localize/TRANSLATE';

/**
 * REDUCERS
 */
export function languages(state = [], action) {
  switch (action.type) {
    case SET_LANGUAGES:
      const languageCodes = action.payload.languageCodes;
      return languageCodes.map(code => {
        return { code, active: false };
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
      }
    default:
      return state;
  }
}

export const localeReducer = combineReducers({ languages, translations });

/**
 * ACTION CREATORS
 */
export const addTranslation = (translation) => {
  return {
    type: ADD_TRANSLATION,
    payload: { translation }
  };
};

export const setLanguages = (languageCodes) => {
  return {
    type: SET_LANGUAGES,
    payload: { languageCodes }
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
export const getTranslations = state => state.locale.translations;
export const getLanguages = state => state.locale.languages;
export const getActiveLanguage = state => getLanguages(state).find(language => language.active === true);

export const getTranslationsForActiveLanguage = state => {
  const { code: activeLanguageCode } = getActiveLanguage(state);
  const translations = getTranslations(state);
  const languages = getLanguages(state);
  const activeLanguageIndex = getIndexForLanguageCode(activeLanguageCode, languages);
  return Object.keys(translations).reduce((prev, key) => {
    return {
      ...prev,
      [key]: translations[key][activeLanguageIndex]
    }
  }, {});
};


export const getTranslate = (state) => {
  const translations = getTranslationsForActiveLanguage(state);
  return (key, data) => getLocalizedElement(key, translations, data);
};



// export const getTranslationsForKey = (key) => {
//   return createSelector(
//     getCurrentLanguage, 
//     getTranslations,
//     (currentLanguage, translations) => {
//       let globalTranslations = {};
//       let localTranslations = {};

//       if (translations && isDefinedNested(translations, GLOBAL_TRANSLATIONS_KEY)) {
//         globalTranslations = translations.global[currentLanguage] || {};
//       }

//       if (translations && isDefinedNested(translations, key, currentLanguage)) {
//         localTranslations = translations[key][currentLanguage];
//       }

//       return {
//         ...globalTranslations,
//         ...localTranslations
//       };
//     }
//   );
// };
