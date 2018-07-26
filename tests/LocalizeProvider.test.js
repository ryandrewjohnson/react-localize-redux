import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore, combineReducers } from 'redux';
import Adapter from 'enzyme-adapter-react-16';
import { Map } from 'immutable'
import { LocalizeProvider } from '../src/LocalizeProvider';
import { localizeReducer } from '../src/localize';
import { getTranslate, getLanguages, initialize } from '../src';
import { defaultTranslateOptions } from '../src/localize';

Enzyme.configure({ adapter: new Adapter() });


describe('<LocalizeProvider />', () => {
  const initialState = {
    languages: [
      { code: 'en', active: true },
      { code: 'fr', active: false }
    ],
    translations: {
      hello: ['Hello', 'Hello FR'],
      bye: ['Goodbye', 'Goodbye FR'],
      multiline: [null, ''],
      placeholder: ['Hey ${name}!', '']
    },
    options: defaultTranslateOptions
  };

  const getMockStore = () => {
    return createStore(combineReducers({ 
      localize: localizeReducer
    }));
  };
  const getImmutableStore = () => {
    const reducer = (s, a) => Map({localize: localizeReducer(s, a)});
    return createStore(reducer, Map({localize: initialState}));
  }

  it('should set default values for localize state', () => {
    const wrapper = shallow(
      <LocalizeProvider>
        <div>Hello</div>
      </LocalizeProvider>
    );

    expect(wrapper.state().localize).toEqual(localizeReducer(undefined, {}));
  });

  it('should set default context props', () => {
    const wrapper = shallow(
      <LocalizeProvider>
        <div>Hello</div>
      </LocalizeProvider>
    );

    wrapper.setState({ localize: initialState });

    expect(wrapper.instance().contextProps).toMatchObject({
      translate: getTranslate(initialState),
      languages: getLanguages(initialState),
      defaultLanguage: 'en',
      activeLanguage: initialState.languages[0]
    })
  });

  it('should not throw error when store prop when passed', () => {
    const store = getMockStore();
    const wrapper = 

    expect(() => {
      shallow(
        <LocalizeProvider store={store}>
          <div>Hello</div>
        </LocalizeProvider>
      )
    }).not.toThrow();
  });

  it('should allow passing a custom function to access state', () => {
    const store = getImmutableStore();
    expect(() => {
      shallow(
        <LocalizeProvider store={store} getState={state => state.get('localize')}>
        <div>Hello</div>
        </LocalizeProvider>
      )
    }).not.toThrow();
  });
});