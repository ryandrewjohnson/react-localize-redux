import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  languages,
  translations,
  getOptions,
  getActiveLanguage,
  getTranslationsForActiveLanguage,
  getTranslationsForSpecificLanguage,
  translationsEqualSelector,
  getTranslate,
  defaultTranslateOptions,
  options,
  localizeReducer
} from 'localize';
import {
  INITIALIZE,
  SET_ACTIVE_LANGUAGE,
  ADD_TRANSLATION,
  ADD_TRANSLATION_FOR_LANGUAGE
} from 'localize';
import { initialize } from '../src/localize';

Enzyme.configure({ adapter: new Adapter() });

describe('localize', () => {
  const transformFunction = (data, codes) => {
    ``;
    return Object.keys(data).reduce((prev, cur, index) => {
      const languageData = data[cur];

      for (let prop in languageData) {
        const values = prev[prop] || [];
        prev[prop] = codes.map((code, languageIndex) => {
          return index === languageIndex
            ? languageData[prop]
            : values[languageIndex];
        });
      }

      return prev;
    }, {});
  };

  describe('reducer: languages', () => {
    let initialState = [];

    beforeEach(() => {
      initialState = [
        { code: 'en', active: false },
        { code: 'fr', active: false },
        { code: 'ne', active: false }
      ];
    });

    describe('INITIALIZE', () => {
      describe('set with string[]', () => {
        it('should set languages and set default language to first language', () => {
          const action = {
            type: INITIALIZE,
            payload: {
              languages: ['en', 'fr', 'ne']
            }
          };
          const result = languages([], action);
          expect(result).toEqual([
            { code: 'en', active: true },
            { code: 'fr', active: false },
            { code: 'ne', active: false }
          ]);
        });

        it('should set active language based on defaultLanguage option', () => {
          const action = {
            type: INITIALIZE,
            payload: {
              languages: ['en', 'fr', 'ne'],
              options: { defaultLanguage: 'ne' }
            }
          };
          const result = languages([], action);
          expect(result).toEqual([
            { code: 'en', active: false },
            { code: 'fr', active: false },
            { code: 'ne', active: true }
          ]);
        });
      });
    });

    describe('SET_ACTIVE_LANGUAGE', () => {
      it('should set active language', () => {
        const action = {
          type: SET_ACTIVE_LANGUAGE,
          payload: {
            languageCode: 'ne'
          }
        };

        const result = languages(initialState, action);
        expect(result).toEqual([
          { code: 'en', active: false },
          { code: 'fr', active: false },
          { code: 'ne', active: true }
        ]);
      });

      it('should update active language', () => {
        const action = {
          type: SET_ACTIVE_LANGUAGE,
          payload: {
            languageCode: 'en'
          }
        };

        initialState[1].active = true;
        const result = languages(initialState, action);
        expect(result).toEqual([
          { code: 'en', active: true },
          { code: 'fr', active: false },
          { code: 'ne', active: false }
        ]);
      });
    });
  });

  describe('reducer: translations', () => {
    let initialState = {};

    beforeEach(() => {
      initialState = {
        hi: ['hi'],
        bye: ['bye']
      };
    });

    describe('INITIALIZE', () => {
      it('should not modify translations if !payload.translation', () => {
        const action = initialize({
          languages: ['en', 'fr', 'ne']
        });

        const result = translations(initialState, action);
        expect(result).toEqual(initialState);
      });

      it('should add multi-language translation data', () => {
        const action = initialize({
          languages: ['en', 'fr', 'ne'],
          translation: initialState
        });

        const result = translations({}, action);
        expect(result).toEqual(initialState);
      });

      it('should add single language translation data to first language', () => {
        const action = {
          type: INITIALIZE,
          payload: {
            languages: ['en', 'fr', 'ne'],
            translation: {
              greeting: 'hello',
              bye: 'goodbye'
            }
          },
          languageCodes: ['en', 'fr', 'ne']
        };

        const result = translations({}, action);
        expect(result).toEqual({
          greeting: ['hello', undefined, undefined],
          bye: ['goodbye', undefined, undefined]
        });
      });

      it('should add single language translation data to default language', () => {
        const action = {
          type: INITIALIZE,
          payload: {
            languages: ['en', 'fr', 'ne'],
            translation: {
              greeting: 'hello',
              bye: 'goodbye'
            },
            options: { defaultLanguage: 'fr' }
          },
          languageCodes: ['en', 'fr', 'ne']
        };

        const result = translations({}, action);
        expect(result).toEqual({
          greeting: [undefined, 'hello', undefined],
          bye: [undefined, 'goodbye', undefined]
        });
      });
    });

    describe('ADD_TRANSLATION', () => {
      it('should add new translations', () => {
        const action = {
          type: ADD_TRANSLATION,
          payload: {
            translation: {
              test: ['test'],
              test2: ['test2']
            }
          }
        };

        const result = translations({}, action);
        expect(result).toEqual({
          test: ['test'],
          test2: ['test2']
        });
      });

      it('should merge new translations with existing translations', () => {
        const action = {
          type: ADD_TRANSLATION,
          payload: {
            translation: { new: ['new'] }
          }
        };

        const result = translations(initialState, action);
        expect(result).toEqual({
          ...initialState,
          new: ['new']
        });
      });

      it('should overwrite existing translation key if it already exists', () => {
        const action = {
          type: ADD_TRANSLATION,
          payload: {
            translation: { hi: ['new'] }
          }
        };

        const result = translations(initialState, action);
        expect(result).toEqual({
          ...initialState,
          hi: ['new']
        });
      });

      it('should flatten nested objects in translation', () => {
        const action = {
          type: ADD_TRANSLATION,
          payload: {
            translation: {
              first: { second: { third: ['nested'] } },
              more: { nested: ['one'] }
            }
          }
        };

        const result = translations({}, action);
        expect(result).toEqual({
          'first.second.third': ['nested'],
          'more.nested': ['one']
        });
      });

      it('should use translationTransform from options', () => {
        const translationData = {
          en: {
            title: 'Title',
            subtitle: 'Subtitle'
          },
          fr: {
            title: 'FR - Title',
            subtitle: 'FR - Subtitle'
          }
        };

        const action = {
          type: ADD_TRANSLATION,
          payload: {
            translation: translationData,
            translationOptions: {
              translationTransform: transformFunction
            }
          },
          languageCodes: ['en', 'fr']
        };

        const result = translations({}, action);
        expect(result).toEqual({
          title: ['Title', 'FR - Title'],
          subtitle: ['Subtitle', 'FR - Subtitle']
        });
      });
    });

    describe('ADD_TRANSLATION_FOR_LANGUAGE', () => {
      it('should add translation for specific language', () => {
        const action = {
          type: ADD_TRANSLATION_FOR_LANGUAGE,
          payload: {
            language: 'en',
            translation: { title: 'title', description: 'description' }
          },
          languageCodes: ['en', 'fr']
        };

        const result = translations({}, action);
        expect(result).toEqual({
          title: ['title', undefined],
          description: ['description', undefined]
        });
      });

      it('should add nested translation for specific language', () => {
        const action = {
          type: ADD_TRANSLATION_FOR_LANGUAGE,
          payload: {
            language: 'en',
            translation: {
              movie: { title: 'title', description: 'description' }
            }
          },
          languageCodes: ['en', 'fr']
        };

        const result = translations({}, action);
        expect(result).toEqual({
          'movie.title': ['title', undefined],
          'movie.description': ['description', undefined]
        });
      });

      it('should add translation for specific language to existing translation', () => {
        const action = {
          type: ADD_TRANSLATION_FOR_LANGUAGE,
          payload: {
            language: 'en',
            translation: { title: 'title', description: 'description' }
          },
          languageCodes: ['en', 'fr']
        };

        const result = translations(
          {
            title: [undefined, 'titlefr'],
            description: [undefined, 'descriptionfr']
          },
          action
        );

        expect(result).toEqual({
          title: ['title', 'titlefr'],
          description: ['description', 'descriptionfr']
        });
      });

      it('should add translation for specific language and override existing translation', () => {
        const action = {
          type: ADD_TRANSLATION_FOR_LANGUAGE,
          payload: {
            language: 'fr',
            translation: { title: 'title', description: 'description' }
          },
          languageCodes: ['en', 'fr']
        };

        const result = translations(
          {
            title: [undefined, 'titlefr'],
            description: [undefined, 'descriptionfr']
          },
          action
        );

        expect(result).toEqual({
          title: [undefined, 'title'],
          description: [undefined, 'description']
        });
      });
    });
  });

  describe('reducer: options', () => {
    describe('INITIALIZE', () => {
      it('should set defaultLanguage option', () => {
        const action = {
          type: INITIALIZE,
          languageCodes: ['en', 'fr', 'ne'],
          payload: {
            options: {
              defaultLanguage: 'fr',
              renderToStaticMarkup: false
            }
          }
        };
        const result = options(defaultTranslateOptions, action);
        expect(result).toEqual({
          ...defaultTranslateOptions,
          defaultLanguage: 'fr',
          renderToStaticMarkup: false
        });
      });

      it('should set renderInnerHtml option', () => {
        const action = {
          type: INITIALIZE,
          languageCodes: ['en', 'fr', 'ne'],
          payload: {
            options: {
              renderInnerHtml: false,
              renderToStaticMarkup: false
            }
          }
        };
        const result = options(defaultTranslateOptions, action);
        expect(result).toEqual({
          ...defaultTranslateOptions,
          defaultLanguage: 'en',
          renderInnerHtml: false,
          renderToStaticMarkup: false
        });
      });
    });

    it('should set translationTransform option', () => {
      const action = {
        type: INITIALIZE,
        languageCodes: ['en', 'fr', 'ne'],
        payload: {
          options: {
            translationTransform: () => ({}),
            renderToStaticMarkup: false
          }
        }
      };

      const result = options({}, action);
      expect(result.translationTransform).toBeDefined();
      expect(typeof result.translationTransform).toEqual('function');
    });

    it('should override default onMissingTranslation option', () => {
      const callback = jest.fn();
      callback.mockReturnValueOnce('Override missing!');

      const action = {
        type: INITIALIZE,
        languageCodes: ['en', 'fr', 'ne'],
        payload: {
          options: {
            onMissingTranslation: callback,
            renderToStaticMarkup: false
          }
        }
      };

      const result = options({}, action);
      const value = result.onMissingTranslation();

      expect(result.onMissingTranslation).toBeDefined();
      expect(callback).toHaveBeenCalled();
      expect(value).toEqual('Override missing!');
    });

    it('should set renderToStaticMarkup when function provided', () => {
      const action = {
        type: INITIALIZE,
        languageCodes: ['en', 'fr', 'ne'],
        payload: {
          options: {
            renderToStaticMarkup: () => {}
          }
        }
      };
      const result = options({}, action);
      expect(result.renderToStaticMarkup).toEqual(
        action.payload.options.renderToStaticMarkup
      );
    });

    it('should set renderToStaticMarkup to false when provided', () => {
      const action = {
        type: INITIALIZE,
        languageCodes: ['en', 'fr', 'ne'],
        payload: {
          options: {
            renderToStaticMarkup: false
          }
        }
      };
      const result = options({}, action);
      expect(result.renderToStaticMarkup).toBe(false);
    });

    it('should throw an error when invalid renderToStaticMarkup not provided', () => {
      const action = {
        type: INITIALIZE,
        languageCodes: ['en', 'fr', 'ne'],
        payload: {
          options: {}
        }
      };
      const result = () => options({}, action);
      expect(result).toThrow();
    });

    it('should set ignoreTranslateChildren', () => {
      const action = {
        type: INITIALIZE,
        languageCodes: ['en', 'fr', 'ne'],
        payload: {
          options: {
            renderToStaticMarkup: false,
            ignoreTranslateChildren: true
          }
        }
      };
      const result = options({}, action);
      expect(result.ignoreTranslateChildren).toBe(true);
    });

    it('should use first language as default language if not set', () => {
      const action = {
        type: INITIALIZE,
        languageCodes: ['en', 'fr', 'ne'],
        payload: { options: { renderToStaticMarkup: false } }
      };
      const result = options({}, action);
      expect(result.defaultLanguage).toBe('en');
    });
  });

  describe('getActiveLanguage', () => {
    it('should return the active language object', () => {
      const state = {
        languages: [
          { code: 'en', active: false },
          { code: 'fr', active: true },
          { code: 'ne', active: false }
        ]
      };
      const result = getActiveLanguage(state);
      expect(result.code).toBe('fr');
    });

    it('should return undefined if no active language found', () => {
      const state = {
        languages: [
          { code: 'en', active: false },
          { code: 'fr', active: false }
        ]
      };
      const result = getActiveLanguage(state);
      expect(result).toBe(undefined);
    });

    it('should return undefined if no languages found', () => {
      const state = {
        languages: []
      };
      const result = getActiveLanguage(state);
      expect(result).toBe(undefined);
    });

    it('should return activeLanguage with name', () => {
      const state = {
        languages: [
          { code: 'en', name: 'English', active: false },
          { code: 'fr', name: 'French', active: true }
        ]
      };
      const result = getActiveLanguage(state);
      expect(result).toEqual({
        code: 'fr',
        name: 'French',
        active: true
      });
    });
  });

  describe('getTranslationsForActiveLanguage', () => {
    it('should return translations only for the active language', () => {
      const state = {
        languages: [
          { code: 'en', active: false },
          { code: 'fr', active: true }
        ],
        translations: {
          hi: ['hi-en', 'hi-fr'],
          bye: ['bye-en', 'bye-fr']
        }
      };
      const result = getTranslationsForActiveLanguage(state);
      expect(result).toEqual({
        hi: 'hi-fr',
        bye: 'bye-fr'
      });
    });

    it('should return empty object if no active language found', () => {
      const state = {
        languages: [],
        translations: {
          hi: ['hi-en', 'hi-fr'],
          bye: ['bye-en', 'bye-fr']
        }
      };
      const result = getTranslationsForActiveLanguage(state);
      expect(result).toEqual({});
    });
  });

  describe('getTranslationsForSpecificLanguage', () => {
    it('should return translations only for specific language', () => {
      const state = {
        languages: [
          { code: 'en', active: false },
          { code: 'fr', active: true }
        ],
        translations: {
          hi: ['hi-en', 'hi-fr'],
          bye: ['bye-en', 'bye-fr']
        }
      };
      const result = getTranslationsForSpecificLanguage(state)('en');
      expect(result).toEqual({
        hi: 'hi-en',
        bye: 'bye-en'
      });
    });

    it('should return empty object if language not found', () => {
      const state = {
        languages: [],
        translations: {
          hi: ['hi-en', 'hi-fr'],
          bye: ['bye-en', 'bye-fr']
        }
      };
      const result = getTranslationsForSpecificLanguage(state)({ code: 'ze' });
      expect(result).toEqual({});
    });
  });

  describe('getTranslate', () => {
    let state = {};

    beforeEach(() => {
      state = {
        languages: [
          { code: 'en', active: false },
          { code: 'fr', active: true }
        ],
        translations: {
          hi: ['hi-en', 'hi-fr'],
          bye: ['bye-en', 'bye-fr'],
          yo: ['yo ${ name }', 'yo-fr ${ name }'],
          foo: ['foo ${ bar }', 'foo-fr ${ bar }'],
          html: ['<b>hi-en</b>', '<b>hi-fr</b>'],
          money_no_translation: ['save $${ amount }']
        },
        options: defaultTranslateOptions
      };
    });

    it('should throw an error when invalid key provided to translate function', () => {
      const translate = getTranslate(state);
      expect(() => translate(23)).toThrow();
    });

    it('should return single translated element when valid key provided', () => {
      const translate = getTranslate(state);
      const value = translate('hi');
      expect(value).toBe('hi-fr');
    });

    it('should not render inner html if renderInnerHtml option is false', () => {
      const stateWithOpts = { ...state, options: { renderInnerHtml: false } };
      const translate = getTranslate(stateWithOpts);

      const value = translate('html');
      expect(value).toBe('<b>hi-fr</b>');
    });

    it('should render inner html if renderInnerHtml option is true', () => {
      const stateWithOpts = { ...state, options: { renderInnerHtml: true } };
      const translate = getTranslate(stateWithOpts);
      const wrapper = shallow(translate('html'));

      expect(wrapper.find('span').exists()).toBe(true);
      expect(wrapper.html()).toEqual(`<span><b>hi-fr</b></span>`);
    });

    it('should override renderInnerHtml to true when passed to translate', () => {
      const newState = { ...state, options: { renderInnerHtml: false } };
      const translate = getTranslate(newState);
      const wrapper = shallow(
        translate('html', null, { renderInnerHtml: true })
      );

      expect(wrapper.find('span').exists()).toBe(true);
      expect(wrapper.html()).toEqual(`<span><b>hi-fr</b></span>`);
    });

    it('should override renderInnerHtml to false when passed to translate', () => {
      const newState = { ...state, options: { renderInnerHtml: true } };
      const translate = getTranslate(newState);
      const result = translate('html', null, { renderInnerHtml: false });

      expect(result).toEqual('<b>hi-fr</b>');
    });

    it('should return an object of translation keys matched with translated element', () => {
      const translate = getTranslate(state);
      const result = translate(['hi', 'bye']);

      Object.keys(result).map((key, index) => {
        const value = result[key];
        expect(value).toBe(state.translations[key][1]);
      });
    });

    it('should insert dynamic data for single translation', () => {
      const translate = getTranslate(state);
      const result = translate('yo', { name: 'ted' });
      // const wrapper = shallow(element);
      expect(result).toBe('yo-fr ted');
    });

    it('should insert dynamic data for multiple translations', () => {
      const translate = getTranslate(state);
      const result = translate(['yo', 'foo'], { name: 'ted', bar: 'bar' });
      const results = ['yo-fr ted', 'foo-fr bar'];

      Object.keys(result).map((key, index) => {
        const value = result[key];
        expect(value).toBe(results[index]);
      });
    });

    it('should return value from default onMissingTranslation option', () => {
      state.options.onMissingTranslation =
        defaultTranslateOptions.onMissingTranslation;
      const translate = getTranslate(state);
      const result = translate('nothinghere');
      expect(result).toEqual(
        'Missing translationId: nothinghere for language: fr'
      );
    });

    it('should set first language available as default when no default is set', () => {
      state = localizeReducer({ languages: [] }, {
        type: INITIALIZE,
        payload: { 
          languages: ['en', 'fr', 'es'],
          options: { renderToStaticMarkup: false }
        }
      });

      const options = getOptions(state);
      expect(options.defaultLanguage).toBe(state.languages[0].code);
    });

    it('should return value using default language when missing a translation with USD hard coded into translation', () => {
      state = localizeReducer({ languages: [], translations: state.translations }, {
        type: INITIALIZE,
        payload: { 
          languages: ['en', 'fr', 'es'],
          options: { renderToStaticMarkup: false },
        }
      });
      state.options.onMissingTranslation = ({ defaultTranslation }) => defaultTranslation;
      const key = 'money_no_translation';
      const translate = getTranslate(state);
      const result = translate([key], { amount: 100 });
      expect(result[key]).toBe('save $100')
    });

    it('should return value from onMissingTranslation option override', () => {
      state.options.onMissingTranslation = ({ translationId, languageCode }) =>
        '${translationId} - ${languageCode}';
      const translate = getTranslate(state);
      const result = translate('nothinghere');
      expect(result).toEqual('nothinghere - fr');
    });

    it('should use language option instead of activeLanguage for translations', () => {
      const translate = getTranslate(state);
      const result = translate('hi', null, { language: 'en' });
      expect(result).toEqual('hi-en');
    });
  });

  describe('translationsEqualSelector', () => {
    let languages = [];
    let activeLanguage = {};
    let translations = {};

    beforeEach(() => {
      languages = [{ code: 'en', active: false }, { code: 'fr', active: true }];
      activeLanguage = { code: 'en', active: true };
      translations = {
        one: 'one',
        two: 'two',
        three: 'three'
      };
    });

    it('should call result function when languages changes', () => {
      const result = jest.fn();
      const selector = translationsEqualSelector(() => languages, result);
      selector({});
      languages = [...languages, [...{ code: 'ca', active: false }]];
      selector({});
      expect(result).toHaveBeenCalledTimes(2);
    });

    it("should not call result function when languages haven't changed", () => {
      const result = jest.fn();
      const selector = translationsEqualSelector(() => languages, result);
      selector({});
      selector({});
      expect(result).toHaveBeenCalledTimes(1);
    });

    it('should calla result function when active language changes', () => {
      const result = jest.fn();
      const selector = translationsEqualSelector(() => activeLanguage, result);
      selector({});
      activeLanguage = { code: 'ca', active: false };
      selector({});
      expect(result).toHaveBeenCalledTimes(2);
    });

    it("should not call result function when active language hasn't changed", () => {
      const result = jest.fn();
      const selector = translationsEqualSelector(() => activeLanguage, result);
      selector({});
      selector({});
      expect(result).toHaveBeenCalledTimes(1);
    });

    it('should call result function when translations change', () => {
      const result = jest.fn();
      const selector = translationsEqualSelector(() => translations, result);
      selector({});
      translations = { ...translations, four: 'four' };
      selector({});
      expect(result).toHaveBeenCalledTimes(2);
    });

    it("should not call result function when translations haven't changed", () => {
      const result = jest.fn();
      const selector = translationsEqualSelector(() => translations, result);
      selector({});
      selector({});
      expect(result).toHaveBeenCalledTimes(1);
    });

    it('should call result function when new value is added to translation', () => {
      const result = jest.fn();
      let initialTranslations = {
        title: ['title', undefined, undefined]
      };

      const selector = translationsEqualSelector(
        () => initialTranslations,
        result
      );
      selector({});
      initialTranslations = { title: ['title', 'title FR', undefined] };
      selector({});
      expect(result).toHaveBeenCalledTimes(2);
    });

    it('should not call result function when value has not changed', () => {
      const result = jest.fn();
      let initialTranslations = {
        title: ['title', 'title2', undefined]
      };

      const selector = translationsEqualSelector(
        () => initialTranslations,
        result
      );
      selector({});
      selector({});
      expect(result).toHaveBeenCalledTimes(1);
    });
  });
});
