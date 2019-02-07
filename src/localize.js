import { flatten } from 'flat';
import {
  createSelector,
  createSelectorCreator,
  defaultMemoize
} from 'reselect';
import {
  getLocalizedElement,
  objectValuesToString,
  validateOptions,
  getTranslationsForLanguage,
  getSingleToMultilanguageTranslation
} from './utils';

/**
 * ACTIONS
 */
export const INITIALIZE = '@@localize/INITIALIZE';
export const ADD_TRANSLATION = '@@localize/ADD_TRANSLATION';
export const ADD_TRANSLATION_FOR_LANGUAGE =
  '@@localize/ADD_TRANSLATION_FOR_LANGUAGE';
export const SET_ACTIVE_LANGUAGE = '@@localize/SET_ACTIVE_LANGUAGE';
export const TRANSLATE = '@@localize/TRANSLATE';

/**
 * REDUCERS
 */
export function languages(state = [], action) {
  switch (action.type) {
    case INITIALIZE:
      const options = action.payload.options || {};
      return action.payload.languages.map((language, index) => {
        const isActive = code => {
          return options.defaultLanguage !== undefined
            ? code === options.defaultLanguage
            : index === 0;
        };
        // check if it's using array of Language objects, or array of language codes
        return typeof language === 'string'
          ? { code: language, active: isActive(language) } // language codes
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

export function translations(state = {}, action) {
  let flattenedTranslations;
  let translationWithTransform;

  switch (action.type) {
    case INITIALIZE:
      if (!action.payload.translation) {
        return state;
      }

      flattenedTranslations = flatten(action.payload.translation, {
        safe: true
      });
      const options = action.payload.options || {};
      const firstLanguage =
        typeof action.payload.languages[0] === 'string'
          ? action.payload.languages[0]
          : action.payload.languages[0].code;
      const defaultLanguage = options.defaultLanguage || firstLanguage;
      const isMultiLanguageTranslation = Object.keys(
        flattenedTranslations
      ).some(item => Array.isArray(flattenedTranslations[item]));

      // add translation based on whether it is single vs multi language translation data
      const newTranslation = isMultiLanguageTranslation
        ? flattenedTranslations
        : getSingleToMultilanguageTranslation(
            defaultLanguage,
            action.languageCodes,
            flattenedTranslations,
            state
          );

      return {
        ...state,
        ...newTranslation
      };
    case ADD_TRANSLATION:
      translationWithTransform =
        action.payload.translationOptions &&
        action.payload.translationOptions.translationTransform !== undefined
          ? action.payload.translationOptions.translationTransform(
              action.payload.translation || {},
              action.languageCodes
            )
          : action.payload.translation;
      return {
        ...state,
        ...flatten(translationWithTransform, { safe: true })
      };
    case ADD_TRANSLATION_FOR_LANGUAGE:
      flattenedTranslations = flatten(action.payload.translation, {
        safe: true
      });
      return {
        ...state,
        ...getSingleToMultilanguageTranslation(
          action.payload.language,
          action.languageCodes,
          flattenedTranslations,
          state
        )
      };
    default:
      return state;
  }
}

export function options(state = defaultTranslateOptions, action) {
  switch (action.type) {
    case INITIALIZE:
      const options = action.payload.options || {};
      const defaultLanguage =
        options.defaultLanguage || action.languageCodes[0];
      return { ...state, ...validateOptions(options), defaultLanguage };
    default:
      return state;
  }
}

export const defaultTranslateOptions = {
  renderToStaticMarkup: false,
  renderInnerHtml: false,
  ignoreTranslateChildren: false,
  defaultLanguage: '',
  onMissingTranslation: ({ translationId, languageCode }) =>
    'Missing translationId: ${ translationId } for language: ${ languageCode }'
};

const initialState = {
  languages: [],
  translations: {},
  options: defaultTranslateOptions
};

export const localizeReducer = (state = initialState, action) => {
  // execute the languages reducer first as we need access to those values for other reducers
  const languagesState = languages(state.languages, action);
  const languageCodes = languagesState.map(language => language.code);

  return {
    languages: languagesState,
    translations: translations(state.translations, {
      ...action,
      languageCodes
    }),
    options: options(state.options, { ...action, languageCodes })
  };
};

/**
 * ACTION CREATORS
 */
export const initialize = payload => ({
  type: INITIALIZE,
  payload
});

export const addTranslation = (translation, options) => ({
  type: ADD_TRANSLATION,
  payload: {
    translation,
    translationOptions: options
  }
});

export const addTranslationForLanguage = (translation, language) => ({
  type: ADD_TRANSLATION_FOR_LANGUAGE,
  payload: { translation, language }
});

export const setActiveLanguage = languageCode => ({
  type: SET_ACTIVE_LANGUAGE,
  payload: { languageCode }
});

/**
 * SELECTORS
 */
export const getTranslations = state => {
  return state.translations;
};

export const getLanguages = state => state.languages;

export const getOptions = state => {
  return state.options;
};

export const getActiveLanguage = state => {
  const languages = getLanguages(state);
  return languages.filter(language => language.active === true)[0];
};

/**
 * A custom equality checker that checker that compares an objects keys and values instead of === comparison
 * e.g. {name: 'Ted', sport: 'hockey'} would result in 'name,sport - Ted,hocker' which would be used for comparison
 *
 * NOTE: This works with activeLanguage, languages, and translations data types.
 * If a new data type is added to selector this would need to be updated to accomodate
 */
export const translationsEqualSelector = createSelectorCreator(
  defaultMemoize,
  (prev, cur) => {
    const prevKeys =
      typeof prev === 'object' ? Object.keys(prev).toString() : undefined;
    const curKeys =
      typeof cur === 'object' ? Object.keys(cur).toString() : undefined;

    const prevValues =
      typeof prev === 'object' ? objectValuesToString(prev) : undefined;
    const curValues =
      typeof cur === 'object' ? objectValuesToString(cur) : undefined;

    const prevCacheValue =
      prevKeys !== undefined && prevValues !== undefined
        ? `${prevKeys} - ${prevValues}`
        : prev;

    const curCacheValue =
      curKeys !== undefined && curValues !== undefined
        ? `${curKeys} - ${curValues}`
        : cur;

    return prevCacheValue === curCacheValue;
  }
);

export const getTranslationsForActiveLanguage = translationsEqualSelector(
  getActiveLanguage,
  getLanguages,
  getTranslations,
  getTranslationsForLanguage
);

export const getTranslationsForSpecificLanguage = translationsEqualSelector(
  getLanguages,
  getTranslations,
  (languages, translations) =>
    defaultMemoize(languageCode =>
      getTranslationsForLanguage(
        { code: languageCode, active: false },
        languages,
        translations
      )
    )
);

export const getTranslate = createSelector(
  getTranslationsForActiveLanguage,
  getTranslationsForSpecificLanguage,
  getActiveLanguage,
  getOptions,
  (
    translationsForActiveLanguage,
    getTranslationsForLanguage,
    activeLanguage,
    initializeOptions
  ) => {
    return (value, data = {}, translateOptions = {}) => {
      const { defaultLanguage, ...defaultOptions } = initializeOptions;
      const overrideLanguage = translateOptions.language;

      const translations =
        overrideLanguage !== undefined
          ? getTranslationsForLanguage(overrideLanguage)
          : translationsForActiveLanguage;

      const defaultTranslations =
        activeLanguage && activeLanguage.code === defaultLanguage
          ? translationsForActiveLanguage
          : getTranslationsForLanguage(defaultLanguage);

      const languageCode =
        overrideLanguage !== undefined
          ? overrideLanguage
          : activeLanguage && activeLanguage.code;

      const mergedOptions = { ...defaultOptions, ...translateOptions };

      const getTranslation = translationId => {
        const hasValidTranslation = translations[translationId] !== undefined;
        const hasValidDefaultTranslation =
          defaultTranslations[translationId] !== undefined;

        const defaultTranslation = hasValidDefaultTranslation
          ? getLocalizedElement({
              translation: defaultTranslations[translationId],
              data,
              renderInnerHtml: mergedOptions.renderInnerHtml
            })
          : "No default translation found! Ensure you've added translations for your default langauge.";

        // if translation is not valid then generate the on missing translation message in it's place
        const translation = hasValidTranslation
          ? translations[translationId]
          : mergedOptions.onMissingTranslation({
              translationId,
              languageCode,
              defaultTranslation
            });

        // if translations are missing than ovrride data to include translationId, languageCode
        // as these will be needed to render missing translations message
        const translationData = hasValidTranslation
          ? data
          : { translationId, languageCode };

        return getLocalizedElement({
          translation,
          data: translationData,
          languageCode,
          renderInnerHtml: mergedOptions.renderInnerHtml
        });
      };

      if (typeof value === 'string') {
        return getTranslation(value);
      } else if (Array.isArray(value)) {
        return value.reduce((prev, cur) => {
          return {
            ...prev,
            [cur]: getTranslation(cur)
          };
        }, {});
      } else {
        throw new Error(
          'react-localize-redux: Invalid key passed to getTranslate.'
        );
      }
    };
  }
);
