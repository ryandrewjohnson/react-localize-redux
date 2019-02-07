import React, { useContext, useEffect } from 'react';
import { LocalizeContext } from './LocalizeContext';
import { isEmpty } from './utils';

const Translate = props => {
  const context = useContext(LocalizeContext);
  const { id = '', options = {}, data } = props;
  const defaultLanguage = options.language || context.defaultLanguage;
  const hasFunctionAsChild = typeof props.children === 'function';
  const ignoreTranslateChildren = isEmpty(options.ignoreTranslateChildren)
    ? context.ignoreTranslateChildren
    : options.ignoreTranslateChildren;
  const isValidDefaultTranslation =
    !isEmpty(props.children) && !isEmpty(id) && !isEmpty(defaultLanguage);

  useEffect(
    () => {
      const fallbackRenderToStaticMarkup = value => value;
      const renderToStaticMarkup =
        context.renderToStaticMarkup || fallbackRenderToStaticMarkup;

      const shouldAddDefaultTranslation =
        isValidDefaultTranslation &&
        !hasFunctionAsChild &&
        !ignoreTranslateChildren;

      if (shouldAddDefaultTranslation) {
        const translation = renderToStaticMarkup(props.children);
        context.addTranslationForLanguage &&
          context.addTranslationForLanguage(
            {
              [id]: translation
            },
            defaultLanguage
          );
      }
    },
    [id, context.defaultLanguage, options.language]
  );

  return typeof props.children === 'function'
    ? props.children(context)
    : context.translate && context.translate(id, data, options);
};

export default Translate;
