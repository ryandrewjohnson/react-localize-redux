// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  getTranslate,
  addTranslationForLanguage,
  getLanguages,
  getOptions,
  getActiveLanguage,
  getTranslationsForActiveLanguage
} from './localize';
import { storeDidChange } from './utils';
import { LocalizeContext, type LocalizeContextProps } from './LocalizeContext';
import { withLocalize } from './withLocalize';
import type {
  TranslateOptions,
  TranslatePlaceholderData,
  TranslateFunction,
  Language
} from './localize';

export type TranslateProps = {
  id?: string,
  options?: TranslateOptions,
  data?: TranslatePlaceholderData,
  children?: any | TranslateChildFunction
};

type TranslateState = {
  hasAddedDefaultTranslation: boolean,
  lastKnownId: string
};

export type TranslateChildFunction = (context: LocalizeContextProps) => any;

export class Translate extends React.Component<TranslateProps, TranslateState> {
  unsubscribeFromStore: any;

  constructor(props: TranslateProps) {
    super(props);

    this.state = { hasAddedDefaultTranslation: false, lastKnownId: '' };
  }

  static getDerivedStateFromProps(
    props: TranslateProps,
    prevState: TranslateState
  ) {
    if (prevState.lastKnownId === props.id)
      return { hasAddedDefaultTranslation: true };
    return { lastKnownId: props.id, hasAddedDefaultTranslation: false };
  }

  componentDidMount() {
    this.setState({ hasAddedDefaultTranslation: true });
  }

  addDefaultTranslation(context: LocalizeContextProps) {
    if (this.state.hasAddedDefaultTranslation) {
      return;
    }

    const { id, children, options = {} } = this.props;
    const defaultLanguage = options.language || context.defaultLanguage;
    const fallbackRenderToStaticMarkup = value => value;
    const renderToStaticMarkup =
      context.renderToStaticMarkup || fallbackRenderToStaticMarkup;

    if (children === undefined || typeof children === 'function') {
      return;
    }

    if (options.ignoreTranslateChildren) {
      return;
    }

    if (id !== undefined && defaultLanguage !== undefined) {
      const translation = renderToStaticMarkup(children);
      context.addTranslationForLanguage &&
        context.addTranslationForLanguage(
          { [id]: translation },
          defaultLanguage
        );
    }
  }

  renderChildren(context: LocalizeContextProps) {
    const { id = '', options, data } = this.props;

    this.addDefaultTranslation(context);

    return typeof this.props.children === 'function'
      ? this.props.children(context)
      : context.translate && (context.translate(id, data, options): any);
  }

  render() {
    return (
      <LocalizeContext.Consumer>
        {context => this.renderChildren(context)}
      </LocalizeContext.Consumer>
    );
  }
}
