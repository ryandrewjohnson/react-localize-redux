// @flow
import React from 'react';
import { connect } from 'react-redux';
import { getActiveLanguage, getTranslate } from './locale';
import type { ComponentType } from 'react';
import type { MapStateToProps } from 'react-redux';
import type { LocaleState, Language, TranslateFunction } from './locale';

export type LocalizeStateProps = {
  currentLanguage?: string,
  translate: TranslateFunction
};

export type GetSliceStateFn = (state: Object|LocaleState) => LocaleState;

const mapStateToProps = (slice: ?string, getStateSlice: ?GetSliceStateFn): MapStateToProps<LocaleState, {}, LocalizeStateProps> => (state: Object|LocaleState): LocalizeStateProps => {
  const scopedState: LocaleState = getStateSlice
    ? getStateSlice(state)
    : (slice && state[slice]) || state;

  const language = getActiveLanguage(scopedState);
  const currentLanguage = language ? language.code : undefined;
  const translate = getTranslate(scopedState);

  return {
    currentLanguage,
    translate
  };
};

export const localize = (Component: ComponentType<any>, slice: ?string = null, getStateSlice: ?GetSliceStateFn = null) => connect(mapStateToProps(slice, getStateSlice))(Component);
