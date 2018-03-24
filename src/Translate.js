import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { getTranslate, addTranslationForLanguage } from './locale';

const DEFAULT_LOCALE_STATE_NAME = 'locale';
const DEFAULT_REDUX_STORE_KEY = 'store';

export class Translate extends Component {
  
  translateFn;

  constructor(props, context) {
    super(props, context);

    if (!this.getStore()) {
      throw new Error(`react-localize-redux: Unable to locate redux store in context. Ensure your app is wrapped with <Provider />.`);
    }

    if (!this.getStateSlice().languages) {
      throw new Error(`react-localize-redux: cannot find languages ensure you have correctly dispatched initialize action.`);
    }

    this.addDefaultTranslation();
  }

  addDefaultTranslation() {
    const locale = this.getStateSlice();

    if (locale.options.ignoreTranslateChildren) {
      return;
    }

    const store = this.getStore();
    const { id, children } = this.props;
    const translation = ReactDOMServer.renderToStaticMarkup(children);
    const defaultLanguage = locale.options.defaultLanguage || locale.languages[0].code;
    store.dispatch(addTranslationForLanguage({[id]: translation}, defaultLanguage));
  }

  getStore() {
    const { storeKey } = this.context;
    return this.context[storeKey || DEFAULT_REDUX_STORE_KEY];
  }

  getStateSlice() {
    const { getLocaleState, storeKey } = this.context;
    const state = this.getStore().getState();
    return getLocaleState !== undefined
      ? getLocaleState(state)
      : state[DEFAULT_LOCALE_STATE_NAME] || state;
  }

  render() {
    this.translateFn = getTranslate(this.getStateSlice());
    return this.translateFn(this.props.id, this.props.data, this.props.options);
  }
}

Translate.contextTypes = {
  store:  PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
  }),
  getLocaleState: PropTypes.func,
  storeKey: PropTypes.string
};

