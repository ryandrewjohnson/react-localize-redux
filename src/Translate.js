import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { getTranslate, addTranslationForLanguage } from './locale';

// TODO: 
//- do we create an option to override whether copy in Translate overrides copy in translations if it already exists
// - make sure works with ImmutableJS same interface used for Localize
// - need a way to globally pass slice if possible (maybe?)


export class Translate extends Component {

  static defaultProps = {
    storeKey: 'store',
    slice: 'locale'
  };
  
  translateFn;

  constructor(props, context) {
    super(props, context);

    const { storeKey, slice } = this.props;

    if (!context[storeKey]) {
      throw new Error(`react-localize-redux: Unable to locate ${storeKey} prop in context. Ensure your app is wrapped with <Provider />.`);
    }

    if (!this.getStateSlice().languages) {
      throw new Error(`react-localize-redux: cannot find state for slice: ${slice}`);
    }

    this.addDefaultTranslation();
  }

  addDefaultTranslation() {
    const { id, children, storeKey } = this.props;
    const store = this.context[storeKey];
    const translation = ReactDOMServer.renderToStaticMarkup(children);
    const locale = this.getStateSlice();
    const defaultLanguage = locale.options.defaultLanguage || locale.languages[0].code;
    store.dispatch(addTranslationForLanguage({[id]: translation}, defaultLanguage));
  }

  getStateSlice() {
    const { storeKey, slice } = this.props;
    const state = this.context[storeKey].getState();
    return state[slice] || state;
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
  })
};

