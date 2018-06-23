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
import { get, storeDidChange } from './utils';
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

class WrappedTranslate extends React.Component<TranslateWithContextProps> {
  unsubscribeFromStore: any;

  componentDidMount() {
    this.addDefaultTranslation();
  }

  componentDidUpdate(prevProps: TranslateWithContextProps) {
    const idChanged = this.props.id && prevProps.id !== this.props.id;

    const noDefaultLanguage =
      !get(prevProps, 'context.defaultLanguage') &&
      !get(prevProps, 'options.language');
    const incomingLanguage =
      get(this.props, 'context.defaultLanguage') ||
      get(this.props, 'options.language');

    const defaultLanguageSet = noDefaultLanguage && incomingLanguage;

    if (idChanged || defaultLanguageSet) {
      this.addDefaultTranslation();
    }
  }

  addDefaultTranslation() {
    const { context, id, children, options = {} } = this.props;
    const defaultLanguage = options.language || context.defaultLanguage;
    const fallbackRenderToStaticMarkup = value => value;
    const renderToStaticMarkup =
      context.renderToStaticMarkup || fallbackRenderToStaticMarkup;
    const hasId = id !== undefined;
    const hasDefaultLanguage = defaultLanguage !== undefined;
    const hasChildren = children !== undefined;
    const hasFunctionAsChild = typeof children === 'function';

    const ignoreTranslateChildren =
      options.ignoreTranslateChildren !== undefined
        ? options.ignoreTranslateChildren
        : context.ignoreTranslateChildren;

    const isValidDefaultTranslation =
      hasChildren && hasId && hasDefaultLanguage;

    const shouldAddDefaultTranslation =
      isValidDefaultTranslation &&
      !hasFunctionAsChild &&
      !ignoreTranslateChildren;

    if (shouldAddDefaultTranslation) {
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
