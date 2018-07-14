// @flow
import * as React from 'react';
import { combineReducers } from 'redux';
import { flatten } from 'flat';
import {
  createSelector,
  createSelectorCreator,
  defaultMemoize
} from 'reselect';
import {
  getLocalizedElement,
  getIndexForLanguageCode,
  objectValuesToString,
  validateOptions,
  getTranslationsForLanguage,
  warning,
  getSingleToMultilanguageTranslation
} from './utils';
import type { Selector, SelectorCreator } from 'reselect';
import type { Element } from 'react';

/**
 * TYPES
 */
export type Language = {
  name?: string,
  code: string,
  active: boolean
};

export type NamedLanguage = {
  name: string,
  code: string
};

export type Translations = {
  [key: string]: string[]
};

export type TransFormFunction = (
  data: Object,
  languageCodes: string[]
) => Translations;

export type renderToStaticMarkupFunction = (element: any) => string;

export type InitializeOptions = {
  renderToStaticMarkup: renderToStaticMarkupFunction | false,
  renderInnerHtml?: boolean,
  onMissingTranslation?: onMissingTranslationFunction,
  defaultLanguage?: string,
  ignoreTranslateChildren?: boolean
};

// This is to get around the whole default options issue with Flow
// I tried using the $Diff approach, but with no luck so for now stuck with this terd.
// Because sometimes you just want flow to shut up!
type InitializeOptionsRequired = {
  renderToStaticMarkup: renderToStaticMarkupFunction | false,
  renderInnerHtml: boolean,
  onMissingTranslation: onMissingTranslationFunction,
  defaultLanguage: string,
  ignoreTranslateChildren: boolean
};

export type TranslateOptions = {
  language?: string,
  renderInnerHtml?: boolean,
  onMissingTranslation?: onMissingTranslationFunction,
  defaultLanguage?: string,
  ignoreTranslateChildren?: boolean
};

export type AddTranslationOptions = {
  translationTransform?: TransFormFunction
};

export type LocalizeState = {
  +languages: Language[],
  +translations: Translations,
  +options: InitializeOptionsRequired
};

export type TranslatedLanguage = {
  [string]: string
};

export type LocalizedElement = Element<'span'> | string;

export type LocalizedElementMap = {
  [string]: LocalizedElement
};

export type TranslatePlaceholderData = {
  [string]: string | number | React.Node
};

export type TranslateValue = string | string[];

export type TranslateFunction = (
  value: TranslateValue,
  data?: TranslatePlaceholderData,
  options?: TranslateOptions
) => LocalizedElement | LocalizedElementMap;

export type SingleLanguageTranslation = {
  [key: string]: Object | string
};

export type MultipleLanguageTranslation = {
  [key: string]: Object | string[]
};

type MissingTranslationOptions = {
  translationId: string,
  languageCode: string,
  defaultTranslation: LocalizedElement
};

export type onMissingTranslationFunction = (
  options: MissingTranslationOptions
) => string;

export type InitializePayload = {
  languages: Array<string | NamedLanguage>,
  translation?: Object,
  options?: InitializeOptions
};

type AddTranslationPayload = {
  translation: Object,
  translationOptions?: AddTranslationOptions
};

type AddTranslationForLanguagePayload = {
  translation: Object,
  language: string
};

type SetActiveLanguagePayload = {
  languageCode: string
};

type BaseAction<T, P> = {
  type: T,
  payload: P
};

export type InitializeAction = BaseAction<
  '@@localize/INITIALIZE',
  InitializePayload
>;
export type AddTranslationAction = BaseAction<
  '@@localize/ADD_TRANSLATION',
  AddTranslationPayload
>;
export type AddTranslationForLanguageAction = BaseAction<
  '@@localize/ADD_TRANSLATION_FOR_LANGUAGE',
  AddTranslationForLanguagePayload
>;
export type SetActiveLanguageAction = BaseAction<
  '@@localize/SET_ACTIVE_LANGUAGE',
  SetActiveLanguagePayload
>;

export type Action = BaseAction<
  string,
  InitializePayload &
    AddTranslationPayload &
    AddTranslationForLanguagePayload &
    SetActiveLanguagePayload
>;

export type ActionDetailed = Action & {
  languageCodes: string[]
};

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
export function languages(state: Language[] = [], action: Action): Language[] {
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

export function translations(
  state: Translations = {},
  action: ActionDetailed
): Translations {
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

export function options(
  state: InitializeOptionsRequired = defaultTranslateOptions,
  action: ActionDetailed
): InitializeOptionsRequired {
  switch (action.type) {
    case INITIALIZE:
      const options: any = action.payload.options || {};
      const defaultLanguage =
        options.defaultLanguage || action.languageCodes[0];
      return { ...state, ...validateOptions(options), defaultLanguage };
    default:
      return state;
  }
}

export const defaultTranslateOptions: InitializeOptionsRequired = {
  renderToStaticMarkup: false,
  renderInnerHtml: false,
  ignoreTranslateChildren: false,
  defaultLanguage: '',
  onMissingTranslation: ({ translationId, languageCode }) =>
    'Missing translationId: ${ translationId } for language: ${ languageCode }'
};

const initialState: LocalizeState = {
  languages: [],
  translations: {},
  options: defaultTranslateOptions
};

export const localizeReducer = (
  state: LocalizeState = initialState,
  action: Action
): LocalizeState => {
  const languageCodes = state.languages.map(language => language.code);
  return {
    languages: languages(state.languages, action),
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
export const initialize = (payload: InitializePayload): InitializeAction => ({
  type: INITIALIZE,
  payload
});

export const addTranslation = (
  translation: MultipleLanguageTranslation,
  options?: AddTranslationOptions
): AddTranslationAction => ({
  type: ADD_TRANSLATION,
  payload: {
    translation,
    translationOptions: options
  }
});

export const addTranslationForLanguage = (
  translation: SingleLanguageTranslation,
  language: string
): AddTranslationForLanguageAction => ({
  type: ADD_TRANSLATION_FOR_LANGUAGE,
  payload: { translation, language }
});

export const setActiveLanguage = (
  languageCode: string
): SetActiveLanguageAction => ({
  type: SET_ACTIVE_LANGUAGE,
  payload: { languageCode }
});

/**
 * SELECTORS
 */
export const getTranslations = (state: LocalizeState): Translations => {
  return state.translations;
};

export const getLanguages = (state: LocalizeState): Language[] =>
  state.languages;

export const getOptions = (state: LocalizeState): InitializeOptionsRequired => {
  const options = Object.assign({}, state.options);
  let languages;

  // If there isn't a default language, grab the first languages from the
  // available languages as default

  if (!options.defaultLanguage) {
    languages = getLanguages(state) || [];
    options.defaultLanguage = languages[0] ? languages[0].code : '';
  }

  return options;
};

export const getActiveLanguage = (state: LocalizeState): Language => {
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
    const prevKeys: any =
      typeof prev === 'object' ? Object.keys(prev).toString() : undefined;
    const curKeys: any =
      typeof cur === 'object' ? Object.keys(cur).toString() : undefined;

    const prevValues: any =
      typeof prev === 'object' ? objectValuesToString(prev) : undefined;
    const curValues: any =
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

export const getTranslationsForActiveLanguage: Selector<
  LocalizeState,
  void,
  TranslatedLanguage
> = translationsEqualSelector(
  getActiveLanguage,
  getLanguages,
  getTranslations,
  getTranslationsForLanguage
);

export const getTranslationsForSpecificLanguage = translationsEqualSelector(
  getLanguages,
  getTranslations,
  (languages, translations) =>
    defaultMemoize((languageCode: string) =>
      getTranslationsForLanguage(
        { code: languageCode, active: false },
        languages,
        translations
      )
    )
);

export const getTranslate: Selector<
  LocalizeState,
  void,
  TranslateFunction
> = createSelector(
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

      const getTranslation = (translationId: string) => {
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
