import React from 'react';

export const getLocalizedElement = (key, translations, data) => {
  const localizedString = translations[key] || `Missing locaized: ${key}`;
  const translatedValue = templater(localizedString, data)
  return hasHtmlTags(translatedValue) 
    ? React.createElement('span', { dangerouslySetInnerHTML: { __html: translatedValue }})
    : <span>{ translatedValue }</span>;
};

export const hasHtmlTags = (value) => {
  const pattern = /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)\/?>/;
  return value.search(pattern) >= 0;
};

/**
 * @func isDefinedNested
 * @desc Check if a nested property exists on an object.
 * @param {Object} target The object that you want to test against
 * @param {string} props The nested props you want verify are defined on target
 * @example 
 *  // checks if theObject.prop1.prop2.prop3 is defined
 *  isDefinedNested(theObject, 'prop1', 'prop2', 'prop3') 
 */
export const isDefinedNested = (target, ...props) => {
  const firstProp = props.shift();

  if (target[firstProp] === undefined) {
    return false;
  }

  return props.reduce((prev, cur, index) => {
    if (index === (props.length - 1)) {
      return prev[cur] !== undefined;
    } else {
      return prev === undefined ? {} : prev[cur];
    }
  }, target[firstProp]);
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
