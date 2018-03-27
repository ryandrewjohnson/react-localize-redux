// @flow
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { getTranslate, addTranslationForLanguage, getLanguages, getOptions, getActiveLanguage, getTranslationsForActiveLanguage } from './locale';
import { storeDidChange } from './utils';
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

    this.onStateDidChange = this.onStateDidChange.bind(this);
    this.addDefaultTranslation();
  }

  componentDidMount() {
    this.unsubscribeFromStore = storeDidChange(this.getStore(), this.onStateDidChange);
  }

  componentWillUnmount() {
    this.unsubscribeFromStore();
  }

  onStateDidChange(prevState) {
    const prevLocaleState = this.getStateSlice(prevState);
    const curLocaleState = this.getStateSlice();

    const prevActiveLanguage = getActiveLanguage(prevLocaleState);
    const curActiveLanguage = getActiveLanguage(curLocaleState);

    const prevOptions = getOptions(prevLocaleState);
    const curOptions = getOptions(curLocaleState);

    const prevTranslations = getTranslationsForActiveLanguage(prevLocaleState);
    const curTranslations = getTranslationsForActiveLanguage(curLocaleState);

    const hasActiveLangaugeChanged = (prevActiveLanguage.code !== curActiveLanguage.code);
    const hasOptionsChanged = (prevOptions !== curOptions);
    const hasTranslationsChanged = (prevTranslations !== curTranslations);

    // TODO: add babel plugin to strip unecessary prop-types 

    if (hasActiveLangaugeChanged || hasOptionsChanged || hasTranslationsChanged) {
      this.setState({ hasUpdated: true });
    }
  }

  addDefaultTranslation() {
    const locale = this.getStateSlice();
    const { id, children } = this.props;

    if (children === undefined || typeof children === 'function') {
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

  getStateSlice(myState) {
    const { getLocaleState, storeKey } = this.context;
    const state = myState || this.getStore().getState();
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

