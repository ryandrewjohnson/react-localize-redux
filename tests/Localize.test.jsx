import React from 'react';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { localize } from 'containers/Localize';

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
    MockPageComponent = React.createElement('div', testProps);
    WrappedComponent = localize('test')(MockPageComponent);
    wrapper = shallow(<WrappedComponent />, { context: { store }});
    
  });

  it('should return Localize component', () => {
    expect(wrapper.first().name()).toBe('Localize');
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
});