// @flow
import React from 'react';
import { type Store } from 'redux';
import { flatten } from 'flat';
import {
  defaultTranslateOptions,
  type MultipleLanguageTranslation
} from './localize';
import type {
  TranslatePlaceholderData,
  TranslatedLanguage,
  Translations,
  InitializeOptions,
  LocalizedElement,
  Language
} from './localize';

type LocalizedElementOptions = {
  translation: string,
  data: TranslatePlaceholderData,
  renderInnerHtml: boolean
};

export const getLocalizedElement = (
  options: LocalizedElementOptions
): LocalizedElement => {
  const { translation, data, renderInnerHtml } = options;

  const translatedValueOrArray = templater(translation, data);

  // if result of templater is string, do the usual stuff
  if (typeof translatedValueOrArray === 'string') {
    return renderInnerHtml === true && hasHtmlTags(translatedValueOrArray)
      ? React.createElement('span', {
          dangerouslySetInnerHTML: { __html: translatedValueOrArray }
        })
      : translatedValueOrArray;
  }

  // at this point we know we have react components;
  // check if there are HTMLTags in the translation (not allowed)
  for (let portion of translatedValueOrArray) {
    if (typeof portion === 'string' && hasHtmlTags(portion)) {
      warning(
        'HTML tags in the translation string are not supported when passing React components as arguments to the translation.'
      );
      return '';
    }
  }

  // return as Element
  return React.createElement('span', null, ...translatedValueOrArray);
};

export const hasHtmlTags = (value: string): boolean => {
  const pattern = /(&[^\s]*;|<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)\/?>)/;
  return value.search(pattern) >= 0;
};

/**
 * @func templater
 * @desc A poor mans template parser
 * @param {string} strings The template string
 * @param {object} data The data that should be inserted in template
 * @return {string} The template string with the data merged in
 */
export const templater = (
  strings: string,
  data: Object = {}
): string | string[] => {
  if (!strings) return '';

  // ${**}
  // brackets to include it in the result of .split()
  const genericPlaceholderPattern = '(\\${\\s*[^\\s}]+\\s*})';

  // split: from 'Hey ${name}' -> ['Hey', '${name}']
  // filter: clean empty strings
  // map: replace ${prop} with data[prop]
  let splitStrings = strings
    .split(new RegExp(genericPlaceholderPattern, 'gmi'))
    .filter(str => !!str)
    .map(templatePortion => {
      let matched;
      for (let prop in data) {
        if (matched) break;
        const pattern = '\\${\\s*' + prop + '\\s*}';
        const regex = new RegExp(pattern, 'gmi');
        if (regex.test(templatePortion)) matched = data[prop];
      }
      if (typeof matched === 'undefined') return templatePortion;
      return matched;
    });

  // if there is a React element, return as array
  if (splitStrings.some(portion => React.isValidElement(portion))) {
    return splitStrings;
  }

  // otherwise concatenate all portions into the translated value
  return splitStrings.reduce((translated, portion) => {
    return translated + `${portion}`;
  }, '');
};

export const getIndexForLanguageCode = (
  code: string,
  languages: Language[]
): number => {
  return languages.map(language => language.code).indexOf(code);
};

export const objectValuesToString = (data: Object): string => {
  return !Object.values
    ? Object.keys(data)
        .map(key => data[key].toString())
        .toString()
    : Object.values(data).toString();
};

export const validateOptions = (
  options: InitializeOptions
): InitializeOptions => {
  if (
    options.onMissingTranslation !== undefined &&
    typeof options.onMissingTranslation !== 'function'
  ) {
    throw new Error(
      'react-localize-redux: an invalid onMissingTranslation function was provided.'
    );
  }

  if (
    options.renderToStaticMarkup !== false &&
    typeof options.renderToStaticMarkup !== 'function'
  ) {
    throw new Error(`
      react-localize-redux: initialize option renderToStaticMarkup is invalid.
      Please see https://ryandrewjohnson.github.io/react-localize-docs/#initialize.
    `);
  }

  return options;
};

export const getTranslationsForLanguage = (
  language: Language,
  languages: Language[],
  translations: Translations
): TranslatedLanguage => {
  // no language! return no translations
  if (!language) {
    return {};
  }

  const { code: languageCode } = language;
  const languageIndex = getIndexForLanguageCode(languageCode, languages);
  const keys = Object.keys(translations);
  const totalKeys = keys.length;
  const translationsForLanguage = {};

  for (let i = 0; i < totalKeys; i++) {
    const key = keys[i];
    translationsForLanguage[key] = translations[key][languageIndex];
  }

  return translationsForLanguage;
};

export const storeDidChange = (
  store: Store<any, any>,
  onChange: (prevState: any) => void
) => {
  let currentState;

  function handleChange() {
    const nextState = store.getState();
    if (nextState !== currentState) {
      onChange(currentState);
      currentState = nextState;
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};

export const getSingleToMultilanguageTranslation = (
  language: string,
  languageCodes: string[],
  flattenedTranslations: Object,
  existingTranslations: Object
): Translations => {
  const languageIndex = languageCodes.indexOf(language);
  const translations = languageIndex >= 0 ? flattenedTranslations : {};
  const keys = Object.keys(translations);
  const totalKeys = keys.length;
  const singleLanguageTranslations = {};

  for (let i = 0; i < totalKeys; i++) {
    const key = keys[i];
    // loop through each language, and for languages that don't match languageIndex
    // keep existing translation data, and for languageIndex store new translation data
    const translationValues = languageCodes.map((code, index) => {
      const existingValues = existingTranslations[key] || [];

      return index === languageIndex
        ? flattenedTranslations[key]
        : existingValues[index];
    });

    singleLanguageTranslations[key] = translationValues;
  }

  return singleLanguageTranslations;
};

export const get = (
  obj: Object,
  path: string,
  defaultValue: any = undefined
) => {
  const pathArr = path.split('.').filter(Boolean);
  return pathArr.reduce((ret, key) => {
    return ret && ret[key] ? ret[key] : defaultValue;
  }, obj);
};

// Thanks react-redux for utility function
// https://github.com/reactjs/react-redux/blob/master/src/utils/warning.js
export const warning = (message: string) => {
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }

  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {}
};
