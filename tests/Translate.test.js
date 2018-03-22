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

  const getComponent = (Component, state = initialState, render = shallow) => {
    store = getStore(state);
    return render(Component, { context: { store }});
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

  it('should render HTML in translations', () => {
    const wrapper = getComponent(
      <Translate id="hi" options={{defaultLanguage: 'fr'}}>Hey <a href="http://google.com">google</a></Translate>,
      {
        ...initialState,
        translations: {'hi': [undefined, '<a>Test</a>']}
      },
      mount
    );
    expect(wrapper.html()).toContain('<a>');
  });

  it('should convert <Translate>\'s children to a string when multi-line HTML markup is provided', () => {
    const wrapper = getComponent(
      <Translate id="hi">
        <h1>Heading</h1>
        <ul>
          <li>Item #1</li>
        </ul>
      </Translate>
    );
    expect(store.getState().locale.translations).toEqual({
      'hi': ['<h1>Heading</h1><ul><li>Item #1</li></ul>', undefined]
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

  it('should override renderInnerHtml option for <Translate/>', () => {
    const wrapper = getComponent(
      <Translate id="hi" options={{renderInnerHtml: false}}>Hi <strong>Ted</strong>!</Translate>
    );

    expect(() => wrapper.html()).toThrow();
    expect(wrapper.text()).toEqual('Hi <strong>Ted</strong>!');
  });

  it('should override defaultLanguage option for <Translate/>', () => {
    const wrapper = getComponent(
      <Translate id="hi" options={{defaultLanguage: 'fr'}}>Hey</Translate>, 
      {
        ...initialState,
        translations: {'hi': [undefined, 'Hey FR']}
      }
    );
    expect(store.getState().locale.translations).toEqual({
      'hi': ['Hey', 'Hey FR']
    });
  });

  it('should override missingTranslationMsg option for <Translate/>', () => {
    const options = {
      defaultLanguage: 'fr',
      missingTranslationMsg: 'Nope!'
    };
    const wrapper = getComponent(
      <Translate id="nope" options={options}>Hey</Translate>
    );
    expect(wrapper.text()).toEqual('Nope!');
  });

  it('should override missingTranslationCallback option for <Translate/>', () => {
    const callback = jest.fn();
    const options = {
      defaultLanguage: 'fr',
      missingTranslationCallback: callback
    };
    const wrapper = getComponent(
      <Translate id="nope" options={options}>Hey</Translate>
    );
    expect(callback).toHaveBeenCalled();
  });
});