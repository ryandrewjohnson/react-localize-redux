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

export const localeReducer = (state, action) => {
  const languageCodes = state.languages.map(language => langauge.code);
  return {
    langauges: languages(state, action),
    translations: translations(state, { ...action, languageCodes })
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
export const getActiveLanguage = state => getLanguages(state).find(language => language.active === true);


export const customeEqualSelector = createSelectorCreator(
  defaultMemoize,
  (cur, prev) => {
    const isTranslationsData = !(Array.isArray(cur) || Object.keys(cur).toString() === 'code,active');

    // for translations data use keys for comparison
    if (isTranslationsData) {
      prev = Object.keys(prev).toString();
      cur  = Object.keys(cur).toString();
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
