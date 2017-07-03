import React from 'react';
import { connect } from 'react-redux';
import { getActiveLanguage, getTranslate } from '../modules/locale';

const mapStateToProps = state => ({
  currentLanguage: getActiveLanguage(state).code,
  translate: getTranslate(state)
});

export const localize = Component => connect(mapStateToProps, null)(Component);
