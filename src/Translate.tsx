import React, { useContext, useEffect } from 'react';
import { LocalizeContext, TranslateOptions } from './LocalizeContext';
import { isEmpty } from './utils';

type Props = {
  id?: string;
  data?: { [key: string]: string | React.ReactNode };
  options?: TranslateOptions;
  children?: React.ReactNode;
};

export const Translate: React.FC<Props> = props => {
  const context = useContext(LocalizeContext);
  const { id = '', options, data } = props;
  const defaultLanguage =
    options !== undefined ? options.language : context.defaultLanguage;
  const hasFunctionAsChild = typeof props.children === 'function';
  const ignoreTranslateChildren =
    options !== undefined && !isEmpty(options.ignoreTranslateChildren)
      ? options.ignoreTranslateChildren
      : context.ignoreTranslateChildren;
  const isValidDefaultTranslation =
    !isEmpty(props.children) && !isEmpty(id) && !isEmpty(defaultLanguage);

  useEffect(() => {
    const shouldAddDefaultTranslation =
      isValidDefaultTranslation &&
      !hasFunctionAsChild &&
      !ignoreTranslateChildren;

    if (shouldAddDefaultTranslation) {
      const translation =
        typeof context.renderToStaticMarkup === 'boolean'
          ? props.children
          : context.renderToStaticMarkup(props.children);
      context.addTranslationForLanguage &&
        context.addTranslationForLanguage(
          {
            [id]: translation
          },
          defaultLanguage
        );
    }
  }, [id, defaultLanguage]);

  return typeof props.children === 'function'
    ? props.children(context)
    : context.translate && context.translate(id, data, options);
};
