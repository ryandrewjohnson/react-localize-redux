import React from 'react';
import { connect } from 'react-redux';
import { getActiveLanguage, getTranslate } from '../modules/locale';

export const localize = (localeKey) => (Component) => {

  const Localize = props => {
    return (
      <Component { ...props } />
    );
  };

  const mapStateToProps = state => {
    return {
      currentLanguage: getActiveLanguage(state).code,
      translate: getTranslate(state)
    };
  };

  return connect(mapStateToProps, null)(Localize);
};
