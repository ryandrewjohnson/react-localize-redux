import React from 'react';

export const getLocalizedElement = (key, translations, data) => {
  const localizedString = translations[key] || `Missing localized key: ${key}`;
  const translatedValue = templater(localizedString, data)
  return hasHtmlTags(translatedValue) 
    ? React.createElement('span', { dangerouslySetInnerHTML: { __html: translatedValue }})
    : translatedValue;
};

export const hasHtmlTags = (value) => {
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
export const templater = (strings, data = {}) => {
  for(let prop in data) {
    const pattern = '\\${\\s*'+ prop +'\\s*}';
    const regex = new RegExp(pattern, 'gmi');
	strings = strings.replace(regex, data[prop]);  	 	
  }
  return strings;
}
``
export const getIndexForLanguageCode = (code, languages) => {
  return languages.map(language => language.code).indexOf(code);
}