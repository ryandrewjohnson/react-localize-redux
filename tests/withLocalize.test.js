import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const defaultContext = {
  translate: jest.fn(),
  languages: [],
  defaultLanguage: 'en',
  activeLanguage: { code: 'en', active: true },
  initialize: jest.fn(),
  addTranslation: jest.fn(),
  addTranslationForLanguage: jest.fn(),
  setActiveLanguage: jest.fn()
};

const getWithLocalizeWithContext = () => {
  jest.doMock('../src/LocalizeContext', () => {
    return {
      LocalizeContext: {
        Consumer: (props) => props.children(defaultContext)
      }
    }
  });
  
  return require('withLocalize').withLocalize;
};

describe('withLocalize', () => {
  it('should add LocalizeContext as props to WrappedComponent', () => {
    const withLocalize = getWithLocalizeWithContext();
    const WrapperComponent = props => <h1>Hello You!</h1>;
    const Wrapped = withLocalize(WrapperComponent);

    const result = shallow(<Wrapped />);
    const wrapper = result.dive();

    Object.keys(defaultContext).forEach(key => {
      expect(wrapper.props()[key]).toBeDefined();
    });
  });

  it('should include any existing props on WrappedComponent', () => {
    const withLocalize = getWithLocalizeWithContext();
    const WrapperComponent = props => <h1>Hello You!</h1>;
    const Wrapped = withLocalize(WrapperComponent);

    const result = shallow(<Wrapped name="Testy McTest" />);
    const wrapper = result.dive();
    expect(wrapper.props().name).toEqual('Testy McTest');
  });
});