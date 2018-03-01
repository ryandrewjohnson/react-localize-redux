// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { getActiveLanguage, getTranslate } from './locale';
import type { ComponentType } from 'react';
import type { MapStateToProps } from 'react-redux';
import type { LocaleState, Language, Translate } from './locale';

export type LocalizeStateProps = {
  currentLanguage?: string,
  translate: Translate
};

const mapStateToProps = (slice: ?string): MapStateToProps<LocaleState, {}, LocalizeStateProps> => (state: Object|LocaleState): LocalizeStateProps => {
  const scopedState: LocaleState = slice
    ? Map.isMap(state) ? state.toJS()[slice] : state[slice]
    : state;
  const language = getActiveLanguage(scopedState);
  const currentLanguage = language ? language.code : undefined;
  const translate = getTranslate(scopedState);

  return {
    currentLanguage,
    translate
  };
};

export const localize = (Component: ComponentType<any>, slice: ?string = null) => connect(mapStateToProps(slice))(Component);
