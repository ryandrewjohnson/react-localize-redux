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
type TranslateWithContextProps = TranslateProps & {
  context: LocalizeContextProps
};

export type TranslateChildFunction = (context: LocalizeContextProps) => any;

class WrappedTranslate extends React.Component<
  TranslateWithContextProps
> {
  unsubscribeFromStore: any;

  componentDidMount() {
    this.addDefaultTranslation();
  }

  componentDidUpdate(prevProps: TranslateWithContextProps) {
    if (this.props.id && prevProps.id !== this.props.id) {
      this.addDefaultTranslation();
    }
  }

  addDefaultTranslation() {
    const { context, id, children, options = {} } = this.props;
    const defaultLanguage = options.language || context.defaultLanguage;
    const fallbackRenderToStaticMarkup = value => value;
    const renderToStaticMarkup =
      context.renderToStaticMarkup || fallbackRenderToStaticMarkup;

    if (children === undefined || typeof children === 'function') {
      return;
    }

    const propIgnore = options.ignoreTranslateChildren;

    // Exit only if:
    // 1. ignoreTranslateChildren is true from Translate props OR;
    // 2. ignoreTranslateChildren is undefined from Translate props AND is true from context.
    // i.e. only look to context if ignoreTranslateChildren as a Translate props is undefined
    // to ensure that the Translate prop setting always overrides the context setting (even if it's `false`).
    const fallbackToContextIgnore =
      options.ignoreTranslateChildren == null &&
      context.ignoreTranslateChildren;
    
    if (propIgnore || fallbackToContextIgnore) {
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

  renderChildren() {
    const { context, id = '', options, data } = this.props;

    return typeof this.props.children === 'function'
      ? this.props.children(context)
      : context.translate && (context.translate(id, data, options): any);
  }

  render() {
    return this.renderChildren();
  }
}

export const Translate = (props: TranslateProps) => (
  <LocalizeContext.Consumer>
    {context => <WrappedTranslate {...props} context={context} />}
  </LocalizeContext.Consumer>
);
