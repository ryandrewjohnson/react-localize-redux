import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { Map } from 'immutable';
import { Translate } from 'Translate';
import { createStore, combineReducers } from 'redux';
import { localeReducer } from '../src';
import { defaultTranslateOptions } from '../src/locale';

Enzyme.configure({ adapter: new Adapter() });

describe('<Translate />', () => {
  let store;

  const initialState = {
    languages: [
      { code: 'en', active: true },
      { code: 'fr', active: false }
    ],
    translations: {},
    options: defaultTranslateOptions
  };

  const mockStore = configureStore();

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

  it('should throw an error if locale state not found in store', () => {
    expect(
      () => getComponent(<Translate id="hi">Hi</Translate>, {})
    ).toThrowError();
  });

  it('should use DEFAULT_LOCALE_STATE_NAME', () => {
    expect(
      () => getComponent(<Translate id="nope">Hey</Translate>)
    ).not.toThrowError();
  });

  it('should use context.getLocaleState to get locale state from store', () => {
    const store = createStore(combineReducers({
      customSliceName: localeReducer
    }), {customSliceName: initialState});

    expect(
      () => shallow(
        <Translate id="nope">Hey</Translate>,
        { context: { store, getLocaleState: (state) => state.customSliceName }}
      )
    ).not.toThrowError();
  });

  it('should throw error if context.getLocaleState is invalid', () => {
    expect(
      () => shallow(
        <Translate id="nope">Hey</Translate>,
        { context: { store: getStore(initialState), getLocaleState: (state) => state.nope }}
      )
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

  it('should NOT override existing translation for id with <Translate>\'s children when option.ignoreTranslateChildren = true', () => {
    const wrapper = getComponent(<Translate id="hi">Hey</Translate>, {
      ...initialState,
      options: {
        ignoreTranslateChildren: true
      },
      translations: {'hi': ['Hi Ho']}
    });
    expect(store.getState().locale.translations).toEqual({
      'hi': ['Hi Ho']
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

  it('should not override default language translation if no children provided', () => {
    const wrapper = getComponent(<Translate id="hi" />, {
      ...initialState,
      translations: {'hi': ['Hi Ho']}
    });
    expect(wrapper.text()).toEqual('Hi Ho');
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

  it('should allow for passing a custom function to return state slice', () => {
    const immutableStore = mockStore(Map({
      locale: {
        ...initialState,
        translations: {
          hi: ['hello']
        }
      }
    }));

    const getLocaleState = (state) => state.toJS()['locale'];

    expect(
      () => shallow(
        <Translate id="hi">Hey</Translate>,
        { context: { store: immutableStore, getLocaleState }}
      )
    ).not.toThrowError();
  });

  it('should accept function as child, and pass translate, activeLanguage, and languages as params', () => {
    const wrapper = getComponent(
      <Translate>{(translate, activeLanguage, languages) => 
        <h1>
          {translate('hi')} 
          {activeLanguage.code} 
          {languages.map(lang => lang.code).toString()}
        </h1>
      }</Translate>, 
      {
        ...initialState,
        translations: {'hi': ['Hi Ho']}
      }
    );

    expect(wrapper.text()).toEqual('Hi Hoenen,fr');
  });
});