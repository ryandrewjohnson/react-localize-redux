import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Map } from 'immutable';
import {
  localizeReducer,
  getTranslate,
  getLanguages,
  getActiveLanguage
} from '../src';
import { defaultTranslateOptions } from '../src/localize';
import { renderToStaticMarkup } from 'react-dom/server';

Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {
  jest.resetModules();
});

describe('<Translate />', () => {
  const initialState = {
    languages: [{ code: 'en', active: true }, { code: 'fr', active: false }],
    translations: {
      hello: ['Hello', 'Hello FR'],
      bye: ['Goodbye', 'Goodbye FR'],
      missing: ['Missing'],
      html: ['Hey <a href="http://google.com">google</a>', ''],
      htmlPlaceholder: ['Translation with <strong>html</strong> and placeholder: ${ comp }.'],
      multiline: [null, ''],
      placeholder: ['Hey ${name}!', '']
    },
    options: defaultTranslateOptions
  };

  let defaultContext = {};

  const getTranslateWithContext = (state = initialState) => {
    const localizeState = localizeReducer(state, {});

    defaultContext = {
      translate: getTranslate(localizeState),
      languages: getLanguages(localizeState),
      defaultLanguage:
        state.options.defaultLanguage || (getLanguages(localizeState)[0] && getLanguages(localizeState)[0].code),
      activeLanguage: getActiveLanguage(localizeState),
      initialize: jest.fn(),
      addTranslation: jest.fn(),
      addTranslationForLanguage: jest.fn(),
      setActiveLanguage: jest.fn(),
      renderToStaticMarkup,
      ignoreTranslateChildren: localizeState.options.ignoreTranslateChildren
    };

    jest.doMock('../src/LocalizeContext', () => {
      return {
        LocalizeContext: {
          Consumer: props => props.children(defaultContext)
        }
      };
    });

    return require('Translate').Translate;
  };

  it('should render HTML in translations when renderInnerHtml = true', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="html" options={{ renderInnerHtml: true }}>
        Hey <a href="http://google.com">google</a>
      </Translate>
    );

    expect(wrapper.html()).toEqual(
      '<span>Hey <a href="http://google.com">google</a></span>'
    );
  });

  it('should render HTML text in translations when renderInnerHtml = false', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="html" options={{ renderInnerHtml: false }}>
        Hey <a href="http://google.com">google</a>
      </Translate>
    );

    expect(() => wrapper.html()).toThrowError();
    expect(wrapper.text()).toEqual(
      'Hey <a href="http://google.com">google</a>'
    );
  });

  it("should convert <Translate>'s children to a string when multi-line HTML markup is provided, and renderToStaticMarkup was set", () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="multiline">
        <h1>Heading</h1>
        <ul>
          <li>Item #1</li>
        </ul>
      </Translate>
    );

    expect(defaultContext.addTranslationForLanguage).toHaveBeenLastCalledWith(
      { multiline: '<h1>Heading</h1><ul><li>Item #1</li></ul>' },
      'en'
    );
  });

  it('should render React', () => {
    const Comp = ({name}) => <strong>{name}</strong>;
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id='placeholder' data={{ name: <Comp name='ReactJS' /> }} />
    );

    expect(wrapper.find(Comp).length).toBe(1);
    expect(wrapper.text()).toContain('ReactJS');
  })

  it('should render empty string if passing React placeholder data to translation with html', () => {
    const Comp = ({name}) => <strong>{name}</strong>;
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id='htmlPlaceholder' data={{comp: <Comp name='ReactJS' />}} />
    );

    expect(wrapper.text()).toBe('');
  })

  it('should just pass through string when renderToStaticMarkup not set', () => {
    const Translate = getTranslateWithContext({
      ...initialState,
      options: {
        ...initialState.options,
        renderToStaticMarkup: false
      }
    });

    const wrapper = mount(<Translate id="test">Hello</Translate>);

    expect(defaultContext.addTranslationForLanguage).toHaveBeenLastCalledWith(
      { test: 'Hello' },
      'en'
    );
  });

  it("should add <Translate>'s children to translations under languages[0].code for id", () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(<Translate id="hello">Hey</Translate>);

    expect(defaultContext.addTranslationForLanguage).toHaveBeenLastCalledWith(
      { hello: 'Hey' },
      'en'
    );
  });

  it("should add <Translate>'s children to translations when id changes", () => {
    const Translate = getTranslateWithContext();
    const Parent = ({ condition }) =>
      condition ? (
        <Translate id="hello">Hello</Translate>
      ) : (
        <Translate id="world">World</Translate>
      );

    const wrapper = mount(<Parent condition />);

    expect(defaultContext.addTranslationForLanguage).toHaveBeenLastCalledWith(
      { hello: 'Hello' },
      'en'
    );

    wrapper.setProps({ condition: false });

    expect(defaultContext.addTranslationForLanguage).toHaveBeenLastCalledWith(
      { world: 'World' },
      'en'
    );
  });

  it("should add <Translate>'s children to translations when default language is set", () => {
    const Translate = getTranslateWithContext({...initialState, languages: [] });
    const wrapper = mount(
      <Translate id='no_translation'>
        Default Translation
      </Translate>
    );

    wrapper.setProps({options: {language: 'en'}});

    expect(defaultContext.addTranslationForLanguage).toHaveBeenLastCalledWith(
      { 'no_translation': 'Default Translation' },
      'en'
    );
  });

  it("should add <Translate>'s children to translations under options.defaultLanguage for id", () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="hello" options={{ language: 'fr' }}>
        Hey
      </Translate>
    );

    expect(defaultContext.addTranslationForLanguage).toHaveBeenLastCalledWith(
      { hello: 'Hey' },
      'fr'
    );
  });

  it('should not override default language translation if no children provided', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(<Translate id="hi" />);
    expect(defaultContext.addTranslationForLanguage).not.toHaveBeenCalled();
  });

  it('should not add default language translation if ignoreTranslateChildren = true', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="hello" options={{ ignoreTranslateChildren: true }}>
        Hey
      </Translate>
    );
    expect(defaultContext.addTranslationForLanguage).not.toHaveBeenCalled();
  });

  it('should not add default language translation if ignoreTranslateChildren = true in context', () => {
    const Translate = getTranslateWithContext({
      ...initialState,
      options: {
        ...initialState.options,
        ignoreTranslateChildren: true
      }
    });
    const wrapper = mount(<Translate id="hello">Hey</Translate>);
    expect(defaultContext.addTranslationForLanguage).not.toHaveBeenCalled();
  });

  it('should override context ignoreTranslateChildren from props', () => {
    const Translate = getTranslateWithContext({
      ...initialState,
      options: {
        ...initialState.options,
        ignoreTranslateChildren: true
      }
    });
    const wrapper = mount(
      <Translate id="hello" options={{ ignoreTranslateChildren: false }}>
        Override
      </Translate>
    );
    expect(defaultContext.addTranslationForLanguage).toHaveBeenLastCalledWith(
      { hello: 'Override' },
      'en'
    );
  });

  it('should insert data into translation placeholders when data attribute is provided', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="placeholder" data={{ name: 'Ted' }}>
        {'Hey ${name}!'}
      </Translate>
    );

    expect(wrapper.text()).toEqual('Hey Ted!');
  });

  it('should override avtiveLanguage when language prop provided for <Translate/>', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="hello" options={{ language: 'fr' }}>
        Hey
      </Translate>
    );
    expect(wrapper.text()).toEqual('Hello FR');
  });

  it('should use default onMissingTranslation option for <Translate/>', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(<Translate id="nope">Hey</Translate>);
    expect(wrapper.text()).toEqual(
      'Missing translationId: nope for language: en'
    );
  });

  it('should override onMissingTranslation option for <Translate/>', () => {
    const Translate = getTranslateWithContext();
    const onMissingTranslation = ({ translationId, languageCode }) =>
      '${translationId} - ${languageCode}';
    const wrapper = mount(
      <Translate id="nope" options={{ onMissingTranslation }}>
        Hey
      </Translate>
    );
    expect(wrapper.text()).toEqual('nope - en');
  });

  it('should override onMissingTranslation and provide defaultTranslation for <Translate/>', () => {
    const Translate = getTranslateWithContext({
      ...initialState,
      languages: [{ code: 'en', active: false }, { code: 'fr', active: true }],
      options: {
        ...initialState.options,
        defaultLanguage: 'en'
      }
    });

    const onMissingTranslation = ({ defaultTranslation }) => defaultTranslation;
    const wrapper = mount(
      <Translate id="missing" options={{ onMissingTranslation }}>
        Hey
      </Translate>
    );
    expect(wrapper.text()).toEqual('Missing');
  });

  it('should accept function as child, and pass context as argument', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate>
        {context => (
          <h1>
            {context.translate('hello')}
            {context.activeLanguage.code}
            {context.languages.map(lang => lang.code).toString()}
          </h1>
        )}
      </Translate>
    );

    expect(wrapper.text()).toEqual('Helloenen,fr');
  });
});
