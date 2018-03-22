import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { Translate } from 'Translate';
import { createStore, combineReducers } from '../../../Library/Caches/typescript/2.7/node_modules/redux';
import { localeReducer } from '../src';
import { defaultTranslateOptions } from '../src/locale';

Enzyme.configure({ adapter: new Adapter() });

describe('<Translate />', () => {
  let store;
  const mockStore = configureStore();
  const initialState = {
    languages: [
      { code: 'en', active: true },
      { code: 'fr', active: false }
    ],
    translations: {},
    options: defaultTranslateOptions
  };

  const getStore = (initialState) => {
    return createStore(combineReducers({
      locale: localeReducer
    }), {locale: initialState});
  };

  const getComponent = (Component, state = initialState) => {
    store = getStore(state);
    return shallow(Component, { context: { store }});
  };
  
  it('should throw an error if redux store not found', () => {
    expect(
      () => shallow(<Translate id="hi">Hi</Translate>)
    ).toThrowError();
  });

  it('should throw an error if locale slice is not found in state', () => {
    expect(
      () => getComponent(<Translate id="hi">Hi</Translate>, {})
    ).toThrowError();
  });

  it('should convert <Translate>\'s children to a string when HTML markup is provided', () => {
    const wrapper = getComponent(<Translate id="hi">Hey <a href="http://google.com">google</a></Translate>);
    expect(store.getState().locale.translations).toEqual({
      'hi': ['Hey <a href="http://google.com">google</a>', undefined]
    });
  });

  it('should add <Translate>\'s children to translations under languages[0].code for id', () => {
    const wrapper = getComponent(<Translate id="hi">Hey</Translate>);
    expect(store.getState().locale.translations).toEqual({
      'hi': ['Hey', undefined]
    });
  });

  it('should add <Translate>\'s children to translations under options.defaultLanguage for id', () => {
    const wrapper = getComponent(<Translate id="hi">Hey</Translate>, {
      ...initialState,
      options: {
        ...defaultTranslateOptions,
        defaultLanguage: 'fr'
      }
    });
    expect(store.getState().locale.translations).toEqual({
      'hi': [undefined, 'Hey']
    });
  });

  it('should override existing translation for id with <Translate>\'s children', () => {
    const wrapper = getComponent(<Translate id="hi">Hey</Translate>, {
      ...initialState,
      translations: {'hi': ['Hi Ho']}
    });
    expect(store.getState().locale.translations).toEqual({
      'hi': ['Hey', undefined]
    });
  });

  it('should NOT override existing translations for id other than default language', () => {
    const wrapper = getComponent(<Translate id="hi">Hey</Translate>, {
      ...initialState,
      translations: {'hi': ['Hi Ho', 'Hey FR']}
    });
    expect(store.getState().locale.translations).toEqual({
      'hi': ['Hey', 'Hey FR']
    });
  });
  
  it('should insert data into translation placeholders when data attribute is provided', () => {
    const wrapper = getComponent(
      <Translate id="hi" data={{name: 'Ted'}}>{'Hey ${name}!'}</Translate>
    );
    expect(store.getState().locale.translations).toEqual({
      'hi': ['Hey ${name}!', undefined]
    });
    expect(wrapper.text()).toEqual('Hey Ted!');
  });
});