// @flow
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { getTranslate, addTranslationForLanguage, getLanguages } from './locale';
import { getActiveLanguage } from '.';
import type { Options, TranslatePlaceholderData, Translate as TranslateFunction, Language} from './locale';

export type TranslateProps = {
  id?: string,
  options?: Options,
  data?: TranslatePlaceholderData,
  children: React.Node|TranslateChildFunction
};

export type TranslateChildFunction = (
  translate: TranslateFunction, 
  activeLanguage: Language, 
  languages: Language[]) => React.Node;

const DEFAULT_LOCALE_STATE_NAME = 'locale';
const DEFAULT_REDUX_STORE_KEY = 'store';

export class Translate extends React.Component<TranslateProps> {

  unsubscribeFromStore;

  constructor(props: TranslateProps, context: any) {
    super(props, context);

    if (!this.getStore()) {
      throw new Error(`react-localize-redux: Unable to locate redux store in context. Ensure your app is wrapped with <Provider />.`);
    }

    if (!this.getStateSlice().languages) {
      throw new Error(`react-localize-redux: cannot find languages ensure you have correctly dispatched initialize action.`);
    }

    this.state = {
      hasUpdated: false
    };

    this.addDefaultTranslation();
  }

  componentDidMount() {
    const prevActiveLanguage = getActiveLanguage(this.getStateSlice());
    this.unsubscribeFromStore = this.getStore().subscribe(() => {
      const curActiveLanguage = getActiveLanguage(this.getStateSlice());

      console.log(prevActiveLanguage.code, curActiveLanguage.code);

      if (prevActiveLanguage !== curActiveLanguage) {
        this.setState({ hasUpdated: true });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromStore();
  }

  subscribe() {
    // this returns 
    this.getStore().subscribe(() => {
      console.log('***: store changed');
    })
  }

  addDefaultTranslation() {
    const locale = this.getStateSlice();
    const { id, children } = this.props;

    if (typeof children === 'function') {
      return;
    }

    if (locale.options.ignoreTranslateChildren) {
      return;
    }
    
    if (id !== undefined) {
      const store = this.getStore();
      const translation = ReactDOMServer.renderToStaticMarkup(children);
      const defaultLanguage = locale.options.defaultLanguage || locale.languages[0].code;
      store.dispatch(addTranslationForLanguage({[id]: translation}, defaultLanguage));
    }
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
    const translateFn = getTranslate(this.getStateSlice());
    const activeLanguage = getActiveLanguage(this.getStateSlice());
    const languages = getLanguages(this.getStateSlice());
    const { id = '', data, options } = this.props;
    return typeof this.props.children === 'function'
      ? this.props.children(translateFn, activeLanguage, languages)
      : (translateFn(id, data, options): any);
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

