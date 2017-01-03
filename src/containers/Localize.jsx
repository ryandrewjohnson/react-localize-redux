import React from 'react';
import { connect } from 'react-redux';
import { getTranslationsForKey } from '../modules/locale';
import { getLocalizedElement } from '../utils';

export const localize = (localeKey) => (Component) => {

  const Localize = props => {
    return (
      <Component { ...props } />
    );
  };

  const mapStateToProps = state => {
    const translations = getTranslationsForKey(localeKey)(state);
    return {
      currentLanugage: state.locale.currentLanguage,
      translate: (key) => getLocalizedElement(key, translations)
    };
  };

  return connect(mapStateToProps, null)(Localize);
};
