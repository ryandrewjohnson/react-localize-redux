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
import { Translate } from '../src/Translate';
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
    const localizeState = localizeReducer(state as any, {});

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

    (useContext as any).mockImplementationOnce(() => defaultContext);

    return defaultContext;
  };

  describe('handle adding translations', () => {
    it("should add <Translate>'s children to translations under languages[0].code for id", () => {
      const context = getTranslateWithContext();
      const { container } = render(<Translate id="hello">Hey</Translate>);

      expect(context.addTranslationForLanguage).toHaveBeenLastCalledWith(
        { hello: 'Hey' },
        'en'
      );
    });
  });

  describe('handle React elements in translations', () => {
    it('should render empty string if passing React placeholder data to translation with html', () => {
      const Comp = ({ name }) => <strong>{name}</strong>;
      getTranslateWithContext();
      const { container } = render(
        <Translate
          id="htmlPlaceholder"
          data={{ comp: <Comp name="ReactJS" /> }}
        />
      );

      expect(container.textContent).toBe('');
    });

    it('should render React elements in translations', () => {
      const Comp = ({ name }) => (
        <strong data-testid="component">{name}</strong>
      );
      getTranslateWithContext();
      const { container, getByTestId } = render(
        <Translate id="placeholder" data={{ name: <Comp name="ReactJS" /> }} />
      );
      expect(getByTestId('component')).toBeTruthy();
      expect(container.textContent).toContain('ReactJS');
    });
  });

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

    it('should override defualt onMissingTranslation with options.onMissingTranslation that returns default language', () => {
      getTranslateWithContext({
        ...INITIAL_STATE,
        languages: [
          { code: 'en', active: false },
          { code: 'fr', active: true }
        ],
        options: {
          ...INITIAL_STATE.options,
          defaultLanguage: 'en'
        }
      });
      const onMissingTranslation = ({ defaultTranslation }) =>
        defaultTranslation;
      const getTranslate = () => (
        <Translate id="missing" options={{ onMissingTranslation }}>
          Hey
        </Translate>
      );
      const { container } = render(getTranslate());
      expect(container).toHaveTextContent('Missing');
    });

    it('should override avtiveLanguage when language prop provided for <Translate/>', () => {
      getTranslateWithContext();
      const { container } = render(
        <Translate id="hello" options={{ language: 'fr' }}>
          Hey
        </Translate>
      );
      expect(container.textContent).toEqual('Hello FR');
    });

    it('should override context ignoreTranslateChildren with options.ignoreTranslateChildren', () => {
      const context = getTranslateWithContext({
        ...INITIAL_STATE,
        options: {
          ...INITIAL_STATE.options,
          ignoreTranslateChildren: true
        }
      });
      const { container } = render(
        <Translate id="hello" options={{ ignoreTranslateChildren: false }}>
          Override
        </Translate>
      );
      expect(context.addTranslationForLanguage).toHaveBeenLastCalledWith(
        { hello: 'Override' },
        'en'
      );
    });

    it('should just pass through string when options.renderToStaticMarkup=false', () => {
      const context = getTranslateWithContext({
        ...INITIAL_STATE,
        options: {
          ...INITIAL_STATE.options,
          renderToStaticMarkup: false
        }
      });

      render(<Translate id="test">Hello</Translate>);

      expect(context.addTranslationForLanguage).toHaveBeenLastCalledWith(
        { test: 'Hello' },
        'en'
      );
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

    it('should call render with renderProps and provide context as argument', () => {
      getTranslateWithContext();
      const { container } = render(
        <Translate>
          {context => (
            <React.Fragment>
              {context.translate('hello')}
              {context.activeLanguage.code}
              {context.languages.map(lang => lang.code).toString()}
            </React.Fragment>
          )}
        </Translate>
      );
      expect(container.textContent).toEqual('Helloenen,fr');
    });

    it("should add <Translate>'s children to translations when id changes", () => {
      let context = getTranslateWithContext();
      const Parent = ({ condition }) =>
        condition ? (
          <Translate id="hello">Hello</Translate>
        ) : (
          <Translate id="world">World</Translate>
        );

      const { container } = render(<Translate id="hello">Hello</Translate>);

      expect(context.addTranslationForLanguage).toHaveBeenLastCalledWith(
        { hello: 'Hello' },
        'en'
      );

      context = getTranslateWithContext();
      render(<Translate id="world">World</Translate>, { container });

      expect(context.addTranslationForLanguage).toHaveBeenLastCalledWith(
        { world: 'World' },
        'en'
      );
    });

    it("should convert <Translate>'s children to a string when multi-line HTML markup is provided", () => {
      const context = getTranslateWithContext();
      render(
        <Translate id="multiline">
          <h1>Heading</h1>
          <ul>
            <li>Item #1</li>
          </ul>
        </Translate>
      );

      expect(context.addTranslationForLanguage).toHaveBeenLastCalledWith(
        { multiline: '<h1>Heading</h1><ul><li>Item #1</li></ul>' },
        'en'
      );
    });

    it('should render HTML markup as text in translations when renderInnerHtml = false', () => {
      getTranslateWithContext();
      const { container } = render(
        <Translate id="html" options={{ renderInnerHtml: false }}>
          Hey <a href="http://google.com">google</a>
        </Translate>
      );

      expect(container.textContent).toEqual(
        'Hey <a href="http://google.com">google</a>'
      );
    });

    it('should render HTML in translations when renderInnerHtml = true', () => {
      getTranslateWithContext();
      const { container } = render(
        <Translate id="html" options={{ renderInnerHtml: true }}>
          Hey <a href="http://google.com">google</a>
        </Translate>
      );
      expect(container.textContent).toEqual('Hey google');
    });
  });
});
