import { combineReducers } from 'redux';
// import { LANG, DEFUALT_LANG } from 'store/constants';
import { createSelector, Selector } from 'reselect';
import { isDefinedNested } from '../utils';

export const DEFUALT_LOCALE           = 'en';
export const GLOBAL_TRANSLATIONS_KEY  = 'global';

export const FETCH_LOCALE_REQUEST     = '@@localize/FETCH_LOCALE_REQUEST';
export const FETCH_LOCALE_SUCCESS     = '@@localize/FETCH_LOCALE_SUCCESS';
export const FETCH_LOCALE_ERROR       = '@@localize/FETCH_LOCALE_ERROR';

export const SET_GLOBAL_TRANSLATIONS  = '@@localize/SET_GLOBAL_TRANSLATIONS';
export const SET_LOCAL_TRANSLATIONS   = '@@localize/SET_LOCAL_TRANSLATIONS';
export const UPDATE_LANGUAGE          = '@@localize/UPDATE_LANGUAGE';

function translations(state = null, action) { 
  switch (action.type) {
    case SET_LOCAL_TRANSLATIONS:
      return {
        ...state,
        [action.payload.key]: action.payload.json
      };
    case SET_GLOBAL_TRANSLATIONS:
      return {
        ...state,
        [GLOBAL_TRANSLATIONS_KEY]: action.payload
      };
    default:
      return state;
  }
}

function currentLanguage(state = 'en', action) {
  return action.type === UPDATE_LANGUAGE ? action.payload : state;
}

export default combineReducers({
  currentLanguage,
  translations
});

export const updateLanguage = (language) => {
  let selectedLanguage = language;
  selectedLanguage = selectedLanguage ? selectedLanguage : 'en';
  return {
    type: UPDATE_LANGUAGE,
    payload: selectedLanguage
  };
};

export const setLocalTranslations = (key, json) => {
  return {
    type: SET_LOCAL_TRANSLATIONS,
    payload: { key, json }
  };
};

export const setGlobalTranslations = (json) => {
  return {
    type: SET_GLOBAL_TRANSLATIONS,
    payload: json
  };
};

// export const fetchLocaleJson = (json, key): IApiActionType => {
//   return {
//     type: [FETCH_LOCALE_REQUEST, FETCH_LOCALE_SUCCESS, FETCH_LOCALE_ERROR],
//     shouldCallApi: (state) => true,
//     callApi: () => Promise.resolve(json),
//     payload: { key }
//   };
// };

const getCurrentLanguage = (state) => state.locale.currentLanguage;
const getTranslations = (state) => state.locale.translations;

export const getTranslationsForKey = (key) => {
  return createSelector(
    getCurrentLanguage, 
    getTranslations,
    (currentLanguage, translations) => {
      let globalTranslations = {};
      let localTranslations = {};

      if (translations && isDefinedNested(translations, GLOBAL_TRANSLATIONS_KEY)) {
        globalTranslations = translations.global[currentLanguage] || {};
      }

      if (translations && isDefinedNested(translations, key, currentLanguage)) {
        localTranslations = translations[key][currentLanguage];
      }

      return {
        ...globalTranslations,
        ...localTranslations
      };
    }
  );
};
