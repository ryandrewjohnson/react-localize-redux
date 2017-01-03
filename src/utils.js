import React from 'react';

export const getLocalizedElement = (key, translations) => {
  const localizedString = translations[key] || `Missing locaized: ${key}`;
  return React.createElement('span', { 
    dangerouslySetInnerHTML: { __html: localizedString }
  }); 
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