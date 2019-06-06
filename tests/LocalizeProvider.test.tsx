import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { shallow } from 'enzyme';
import { createStore, combineReducers } from 'redux';
import { Map } from 'immutable';
import { LocalizeProvider } from '../src/LocalizeProvider';
import { localizeReducer } from '../src/localize';
import { getTranslate, getLanguages, withLocalize, Translate } from '../src';
import { defaultTranslateOptions } from '../src/localize';
import { render } from 'react-testing-library';

describe('<LocalizeProvider />', () => {
  const initialState = {
    languages: [{ code: 'en', active: true }, { code: 'fr', active: false }],
    translations: {
      hello: ['Hello', 'Hello FR'],
      bye: ['Goodbye', 'Goodbye FR'],
      multiline: [null, ''],
      placeholder: ['Hey ${name}!', '']
    },
    options: defaultTranslateOptions
  };

  const getMockStore = () => {
    return createStore(
      combineReducers({
        localize: localizeReducer
      })
    );
  };
  const getImmutableStore = () => {
    const reducer = (s, a) => Map({ localize: localizeReducer(s, a) });
    return createStore(reducer, Map({ localize: initialState }));
  };

  it.skip('should set default values for localize state', () => {
    const { container } = render(
      <LocalizeProvider>
        <div>Hello</div>
      </LocalizeProvider>
    );

    // expect(wrapper.state().localize).toEqual(localizeReducer(undefined, {}));
  });

  it.skip('should set default context props', () => {
    const wrapper: any = shallow(
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
    });
  });

  it('should not throw error when store prop when passed', () => {
    const store = getMockStore();
    expect(() => {
      render(
        <LocalizeProvider store={store}>
          <div>Hello</div>
        </LocalizeProvider>
      );
    }).not.toThrow();
  });

  it('should allow passing a custom function to access state', () => {
    const store = getImmutableStore();
    expect(() => {
      render(
        <LocalizeProvider
          store={store}
          getState={state => state.get('localize')}
        >
          <div>Hello</div>
        </LocalizeProvider>
      );
    }).not.toThrow();
  });

  it('should work with SSR', () => {
    class App extends React.Component<any, any> {
      constructor(props) {
        super(props);

        this.props.initialize({
          languages: [
            { name: 'English', code: 'en' },
            { name: 'French', code: 'fr' }
          ],
          translation: {
            hello: ['hello', 'alo']
          },
          options: {
            defaultLanguage: 'en',
            renderToStaticMarkup: ReactDOMServer.renderToStaticMarkup
          }
        });
      }

      render() {
        return (
          <div>
            <Translate id="hello" />
          </div>
        );
      }
    }

    const LocalizedApp = withLocalize(App);

    const result = ReactDOMServer.renderToString(
      <LocalizeProvider
        initialize={{
          languages: [
            { name: 'English', code: 'en' },
            { name: 'French', code: 'fr' }
          ],
          translation: {
            hello: ['hello', 'alo']
          },
          options: {
            defaultLanguage: 'en',
            renderToStaticMarkup: ReactDOMServer.renderToStaticMarkup
          }
        }}
      >
        <LocalizedApp />
      </LocalizeProvider>
    );

    expect(result).toEqual('<div>hello</div>');
  });

  it('should work when store and initialize are passed to Provider', () => {
    const store: any = getMockStore();
    const initializePayload = {
      languages: [
        { name: 'English', code: 'en' },
        { name: 'French', code: 'fr' }
      ],
      translation: {
        hello: ['hello', 'alo']
      },
      options: {
        defaultLanguage: 'en',
        renderToStaticMarkup: ReactDOMServer.renderToStaticMarkup
      }
    };
    render(
      <LocalizeProvider store={store} initialize={initializePayload}>
        <div>Hello</div>
      </LocalizeProvider>
    );
    const translation = store.getState().localize.translations;
    expect(translation).toEqual(initializePayload.translation);
  });
});