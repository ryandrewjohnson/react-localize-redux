import * as actions from 'modules/locale';
import { shallow } from 'enzyme';
import { languages, translations, getActiveLanguage, getTranslationsForActiveLanguage, translationsEqualSelector, setLanguages, getTranslate, getTranslateSelector, defaultTranslateOptions, options } from 'modules/locale';
import { getLocalizedElement } from 'utils';
import { INITIALIZE, SET_LANGUAGES, SET_ACTIVE_LANGUAGE, ADD_TRANSLATION, ADD_TRANSLATION_FOR_LANGUGE } from 'modules/locale';

describe('locale module', () => {

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
      it('should set languages and set default language to first language', () => {
        const action = {
          type: INITIALIZE,
          payload: {
            languageCodes: ['en', 'fr', 'ne']
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
            languageCodes: ['en', 'fr', 'ne'],
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

    describe('SET_LANGUAGES', () => {
      it('should add new languages with first set to active by default', () => {
        const action = {
          type: SET_LANGUAGES,
          payload: {
            languageCodes: ['en', 'fr', 'ne']
          }
        };

        const result = languages([], action);
        expect(result).toEqual([
          { code: 'en', active: true },
          { code: 'fr', active: false },
          { code: 'ne', active: false }
        ]);
      });

      it('should set active language = to activeIndex passed to setLanguages', () => {
        const result = languages([], setLanguages(['en', 'fr', 'ne'], 'fr'));

        expect(result).toEqual([
          { code: 'en', active: false },
          { code: 'fr', active: true },
          { code: 'ne', active: false }
        ]);
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
        'hi': ['hi'],
        'bye': ['bye']
      };
    });

    describe('ADD_TRANSLATION', () => {
      it('should add new translations',  () => {
        const action = {
          type: ADD_TRANSLATION,
          payload: {
            translation: {
              'test': ['test'],
              'test2': ['test2']
            }
          }
        };

        const result = translations({}, action);
        expect(result).toEqual({
          'test': ['test'],
          'test2': ['test2']
        });
      });

      it('should merge new translations with existing translations', () => {
        const action = {
          type: ADD_TRANSLATION,
          payload: {
            translation: { 'new': ['new'] }
          }
        };

        const result = translations(initialState, action);
        expect(result).toEqual({
          ...initialState,
          'new': ['new']
        });
      });

      it('should overwrite existing translation key if it already exists', () => {
        const action = {
          type: ADD_TRANSLATION,
          payload: {
            translation: { 'hi': ['new'] }
          }
        };

        const result = translations(initialState, action);
        expect(result).toEqual({
          ...initialState,
          'hi': ['new']
        });
      });

      it('should flatten nested objects in translation', () => {
        const action = {
          type: ADD_TRANSLATION,
          payload: {
            translation: {
              'first': { second: { third: ['nested'] }},
              'more': { nested: ['one'] }
            }
          }
        };

        const result = translations({}, action);
        expect(result).toEqual({
          'first.second.third': ['nested'],
          'more.nested': ['one']
        });
      });
    });
    
    describe('ADD_TRANSLATION_FOR_LANGUGE', () => {
      it('should add translation for specific language', () => {
        const action = {
          type: ADD_TRANSLATION_FOR_LANGUGE,
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
          type: ADD_TRANSLATION_FOR_LANGUGE,
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
          type: ADD_TRANSLATION_FOR_LANGUGE,
          payload: { 
            language: 'en', 
            translation: { title: 'title', description: 'description' }
          },
          languageCodes: ['en', 'fr']
        };

        const result = translations({
          title: [undefined, 'titlefr'],
          description: [undefined, 'descriptionfr']
        }, action);

        expect(result).toEqual({
          title: ['title', 'titlefr'],
          description: ['description', 'descriptionfr']
        });
      });

      it('should add translation for specific language and override existing translation', () => {
        const action = {
          type: ADD_TRANSLATION_FOR_LANGUGE,
          payload: { 
            language: 'fr', 
            translation: { title: 'title', description: 'description' }
          },
          languageCodes: ['en', 'fr']
        };

        const result = translations({
          title: [undefined, 'titlefr'],
          description: [undefined, 'descriptionfr']
        }, action);

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
          payload: { 
            options: { defaultLanguage: 'fr' }
          }
        };
        const result = options(defaultTranslateOptions, action);
        expect(result).toEqual({
          ...defaultTranslateOptions,
          defaultLanguage: 'fr'
        });
      });

      it('should set renderInnerHtml option', () => {
        const action = {
          type: INITIALIZE,
          payload: { 
            options: { renderInnerHtml: false }
          }
        };
        const result = options(defaultTranslateOptions, action);
        expect(result).toEqual({
          ...defaultTranslateOptions,
          renderInnerHtml: false
        });
      });
    });
    
  });





  describe('getActiveLanguage', () => {
    it('should return the active language object', () => {
      const state = {
        languages: [{ code: 'en', active: false }, { code: 'fr', active: true }, { code: 'ne', active: false }]
      };
      const result = getActiveLanguage(state);
      expect(result.code).toBe('fr');
    });

    it('should return undefined if no active language found', () => {
      const state = {
        languages: [{ code: 'en', active: false }, { code: 'fr', active: false }]
      };
      const result = getActiveLanguage(state);
      expect(result).toBe(undefined);
    });
  });


  describe('getTranslationsForActiveLanguage', () => {
    it('should return translations only for the active language', () => {
      const state = {
        languages: [{ code: 'en', active: false }, { code: 'fr', active: true }],
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
  });


  describe('getTranslate', () => {
    let state = {};

    beforeEach(() => {
      state = {
        languages: [{ code: 'en', active: false }, { code: 'fr', active: true }],
        translations: {
          hi: ['hi-en', 'hi-fr'],
          bye: ['bye-en', 'bye-fr'],
          yo: ['yo ${ name }', 'yo-fr ${ name }'],
          foo: ['foo ${ bar }', 'foo-fr ${ bar }'],
          html: ['<b>hi-en</b>', '<b>hi-fr</b>']
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
      const stateWithOpts = {...state, options: { renderInnerHtml: false }};
      const translate = getTranslate(stateWithOpts);

      const value = translate('html');
      expect(value).toBe('<b>hi-fr</b>');
    });

    it('should render inner html if renderInnerHtml option is true', () => {
      const translate = getTranslate(state);
      const wrapper = shallow(translate('html'));

      expect(wrapper.find('span').exists()).toBe(true);
      expect(wrapper.html()).toEqual(`<span><b>hi-fr</b></span>`);
    });

    it('should override renderInnerHtml to true when passed to translate', () => {
      const newState = { ...state, options: { renderInnerHtml: false } };
      const translate = getTranslate(newState);
      const wrapper = shallow(translate('html', null, { renderInnerHtml: true }));

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
      const results = [
        'yo-fr ted',
        'foo-fr bar'
      ];
      
      Object.keys(result).map((key, index) => {
        const value = result[key];
        expect(value).toBe(results[index]);
      });
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

    it('should not call result function when languages haven\'t changed', () => {
      const result = jest.fn();
      const selector = translationsEqualSelector(() => languages, result);
      selector({});
      selector({});
      expect(result).toHaveBeenCalledTimes(1);
    });

    it('should call result function when active language changes', () => {
      const result = jest.fn();
      const selector = translationsEqualSelector(() => activeLanguage, result);
      selector({});
      activeLanguage = { code: 'ca', active: false };
      selector({});
      expect(result).toHaveBeenCalledTimes(2);
    });

    it('should not call result function when active language hasn\'t changed', () => {
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

    it('should not call result function when translations haven\'t changed', () => {
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

      const selector = translationsEqualSelector(() => initialTranslations, result);
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

      const selector = translationsEqualSelector(() => initialTranslations, result);
      selector({});
      selector({});
      expect(result).toHaveBeenCalledTimes(1);
    });
  });
});
