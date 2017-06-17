import React from 'react';
import { connect } from 'react-redux';
import { getActiveLanguage, getTranslate } from '../modules/locale';

export const localize = (Component) => {

  const mapStateToProps = state => {
    return {
      currentLanguage: getActiveLanguage(state).code,
      translate: getTranslate(state)
    };
  };

  return connect(mapStateToProps, null)(Component);
};
