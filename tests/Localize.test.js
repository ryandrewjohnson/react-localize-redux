import React from 'react';
import { Map } from 'immutable';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { localize } from 'Localize';

Enzyme.configure({ adapter: new Adapter() });

describe('<Localize />', () => {
  let wrapper = undefined;
  let MockPageComponent = undefined;
  let WrappedComponent = undefined;
  let testProps = { test: 'test props' };
  const mockStore = configureStore();
  let initialState = {
    languages: [
      { code: 'en', active: true },
      { code: 'fr', active: false },
      { code: 'ne', active: false }
    ],
    translations: {}
  };

  beforeEach(() => {
    const store = mockStore(initialState);
    const MockPageComponent = props => (<div { ...testProps } />);
    WrappedComponent = localize(MockPageComponent);
    wrapper = shallow(<WrappedComponent />, { context: { store }});
  });

  it('should return Localize component', () => {
    expect(wrapper.first().name()).toBe('MockPageComponent');
  });

  it('should have currentLanguage in props', () => {
    const currentLanguage = wrapper.first().props().currentLanguage;
    expect(currentLanguage).toBeDefined();
    expect(currentLanguage).toBe('en');
  });

  it('should have translate function in props', () => {
    const translateFn = wrapper.first().props().translate;
    expect(translateFn).toBeDefined();
    expect(typeof translateFn === 'function').toBe(true);
  });

  it('should use state including slice when passed', () => {
    const store = mockStore({
      locale: {
        ...initialState,
        translations: {
          hi: ['hello', '', '']
        }
      }
    });
    const MockPageComponent = props => (<div>{ translate('hi') }</div>);
    WrappedComponent = localize(MockPageComponent, 'locale');
    wrapper = shallow(<WrappedComponent />, { context: { store }});
    expect(wrapper.props().translate).toBeDefined();
    expect(wrapper.props().translate('hi')).toEqual('hello');
  });

  it('should allow for passing a custom function to return state slice', () => {
    const store = mockStore(Map({
      locale: {
        ...initialState,
        translations: {
          hi: ['hello', '', '']
        }
      }
    }));
    const MockPageComponent = props => (<div>{ translate('hi') }</div>);
    const getStateSlice = (state) => state.toJS()['locale'];
    WrappedComponent = localize(MockPageComponent, 'locale', getStateSlice);
    wrapper = shallow(<WrappedComponent />, { context: { store }});
    expect(wrapper.props().translate).toBeDefined();
    expect(wrapper.props().translate('hi')).toEqual('hello');
  });
});

describe('<Localize /> unhappy path', function() {
  const mockStore = configureStore();

  it('should return currentLanguage = undefined when no active language set', () => {
    const store = mockStore({
      locale: {
        translations: {},
        languages: []
      }
    });

    const MockPageComponent = props => (<div>Hello</div>);
    const WrappedComponent = localize(MockPageComponent, 'locale');
    const wrapper = shallow(<WrappedComponent />, { context: { store }});
    expect(wrapper.props().currentLanguage).not.toBeDefined();
  });
});
