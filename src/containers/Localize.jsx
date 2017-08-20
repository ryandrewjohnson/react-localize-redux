import React from 'react';
import { connect } from 'react-redux';
import { getActiveLanguage, getTranslate } from '../modules/locale';

const mapStateToProps = slice => state => {
  const scopedState = slice ? state[slice] : state;
  return {
    currentLanguage: getActiveLanguage(scopedState).code,
    translate: getTranslate(scopedState)
  };
};

export const localize = (Component, slice = null) => connect(mapStateToProps(slice), null)(Component);
