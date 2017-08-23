// @flow
import React from 'react';
import { defaultTranslateOptions } from './modules/locale';
import type { TranslatePlaceholderData, TranslatedLanguage, Options, LocalizedElement, Language } from './modules/locale';

export const getLocalizedElement = (key: string, translations: TranslatedLanguage, data: TranslatePlaceholderData, options: Options = defaultTranslateOptions): LocalizedElement => {
  const localizedString = translations[key] || `Missing localized key: ${key}`;
  const translatedValue = templater(localizedString, data)
  return options.renderInnerHtml && hasHtmlTags(translatedValue)
    ? React.createElement('span', { dangerouslySetInnerHTML: { __html: translatedValue }})
    : translatedValue;
};

export const hasHtmlTags = (value: string): boolean => {
  const pattern = /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)\/?>/;
  return value.search(pattern) >= 0;
};

/**
 * @func templater
 * @desc A poor mans template parser 
 * @param {string} strings The template string
 * @param {object} data The data that should be inserted in template
 * @return {string} The template string with the data merged in
 */
export const templater = (strings: string, data: Object = {}): string => {
  for(let prop in data) {
    const pattern = '\\${\\s*'+ prop +'\\s*}';
    const regex = new RegExp(pattern, 'gmi');
	  strings = strings.replace(regex, data[prop]);  	 	
  }
  return strings;
};

export const getIndexForLanguageCode = (code: string, languages: Language[]): number => {
  return languages.map(language => language.code).indexOf(code);
};

export const objectValuesToString = (data: Object): string => {
  return !Object.values
    ? Object.keys(data).map(key => data[key].toString()).toString()
    : Object.values(data).toString();
};
