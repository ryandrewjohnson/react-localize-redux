import React, { useContext } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import {
  localizeReducer,
  getTranslate,
  getLanguages,
  getActiveLanguage
} from '../src';
import Translate from '../src/Translate';
import { defaultTranslateOptions } from '../src/localize';

jest.mock('react', () => ({
  ...require.requireActual('react'),
  useContext: jest.fn()
}));

describe('<Translate />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const INITIAL_STATE = {
    languages: [{ code: 'en', active: true }, { code: 'fr', active: false }],
    translations: {
      hello: ['Hello', 'Hello FR'],
      bye: ['Goodbye', 'Goodbye FR'],
      missing: ['Missing'],
      html: ['Hey <a href="http://google.com">google</a>', ''],
      htmlPlaceholder: [
        'Translation with <strong>html</strong> and placeholder: ${ comp }.'
      ],
      multiline: [null, ''],
      placeholder: ['Hey ${name}!', '']
    },
    options: defaultTranslateOptions
  };

  const mockFns = {
    addTranslationForLanguage: jest.fn()
  };

  const getTranslateWithContext = (state = INITIAL_STATE) => {
    const localizeState = localizeReducer(state, {});

    const defaultContext = {
      translate: getTranslate(localizeState),
      languages: getLanguages(localizeState),
      defaultLanguage:
        state.options.defaultLanguage ||
        (getLanguages(localizeState)[0] && getLanguages(localizeState)[0].code),
      activeLanguage: getActiveLanguage(localizeState),
      initialize: jest.fn(),
      addTranslation: jest.fn(),
      addTranslationForLanguage: mockFns.addTranslationForLanguage,
      setActiveLanguage: jest.fn(),
      renderToStaticMarkup,
      ignoreTranslateChildren: localizeState.options.ignoreTranslateChildren
    };

    useContext.mockImplementationOnce(() => defaultContext);

    return defaultContext;
  };

  describe('handle adding default translations', () => {
    it("should add <Translate>'s children to translation data for default language", () => {
      getTranslateWithContext();
      const getTranslate = () => (
        <Translate id="myTranslation" options={{ language: 'en' }}>
          Default Translation
        </Translate>
      );
      const { rerender } = render(getTranslate());
      const context = getTranslateWithContext();
      rerender(getTranslate());
      expect(context.addTranslationForLanguage).toHaveBeenLastCalledWith(
        { myTranslation: 'Default Translation' },
        'en'
      );
    });

    it("should add <Translate>'s children to translations under options.defaultLanguage", () => {
      getTranslateWithContext();
      const getTranslate = () => (
        <Translate id="hello" options={{ language: 'fr' }}>
          Hey
        </Translate>
      );
      const { rerender } = render(getTranslate());
      const context = getTranslateWithContext();
      rerender(getTranslate());
      expect(context.addTranslationForLanguage).toHaveBeenLastCalledWith(
        { hello: 'Hey' },
        'fr'
      );
    });

    it('should not override default translation if <Translate/> has no children', () => {
      getTranslateWithContext();
      const getTranslate = () => <Translate id="hi" />;
      const { rerender } = render(getTranslate());
      const context = getTranslateWithContext();
      rerender(getTranslate());
      expect(context.addTranslationForLanguage).not.toHaveBeenCalled();
    });

    it('should not add default translation if options.ignoreTranslateChildren = true', () => {
      getTranslateWithContext();
      const getTranslate = () => (
        <Translate id="hello" options={{ ignoreTranslateChildren: true }}>
          Hey
        </Translate>
      );
      render(getTranslate());
      const context = getTranslateWithContext();
      expect(context.addTranslationForLanguage).not.toHaveBeenCalled();
    });

    it('should not add default language translation if ignoreTranslateChildren = true in context', () => {
      const newState = {
        ...INITIAL_STATE,
        options: {
          ...INITIAL_STATE.options,
          ignoreTranslateChildren: true
        }
      };
      getTranslateWithContext(newState);
      const getTranslate = () => <Translate id="hello">Hey</Translate>;
      const context = getTranslateWithContext(newState);
      expect(context.addTranslationForLanguage).not.toHaveBeenCalled();
    });
  });

  describe('props.data', () => {
    it('should do translation variable insertion with props.data', () => {
      getTranslateWithContext();
      const getTranslate = () => (
        <Translate id="placeholder" data={{ name: 'Ted' }}>
          {'Hey ${name}!'}
        </Translate>
      );
      const { container } = render(getTranslate());
      expect(container).toHaveTextContent('Hey Ted!');
    });
  });

  describe('props.options', () => {
    it('should override defualt onMissingTranslation with options.onMissingTranslation', () => {
      getTranslateWithContext();
      const onMissingTranslation = ({ translationId, languageCode }) =>
        '${translationId} - ${languageCode}';
      const getTranslate = () => (
        <Translate id="nope" options={{ onMissingTranslation }}>
          Hey
        </Translate>
      );
      const { container } = render(getTranslate());
      expect(container).toHaveTextContent('nope - en');
    });
  });

  describe('render()', () => {
    it('should call render with renderProps function', () => {
      const renderFn = jest.fn(() => <h1>Hello</h1>);
      const context = getTranslateWithContext();
      render(<Translate>{renderFn}</Translate>);
      expect(renderFn).toHaveBeenCalledWith(context);
    });
    it('should call render with translate function', () => {
      let context = getTranslateWithContext();
      context.translate = jest.fn(() => 'Test');
      render(<Translate id="test">Test</Translate>);
      expect(context.translate).toHaveBeenCalledWith('test', undefined, {});
    });
  });
});
