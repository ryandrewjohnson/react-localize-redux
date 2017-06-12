import * as actions from 'modules/locale';
import { languages, translations, getActiveLanguage, getTranslationsForActiveLanguage } from 'modules/locale';
import reducer, { 
  UPDATE_LANGUAGE, 
  SET_LOCAL_TRANSLATIONS, 
  SET_GLOBAL_TRANSLATIONS,
  SET_LANGUAGES,
  SET_ACTIVE_LANGUAGE,
  ADD_TRANSLATION
} from 'modules/locale';

describe('locale module', () => {

  let mainState = {};

  beforeEach(() => {
    mainState = {
      locale: {
        currentLanguage: 'en',
        translations: {
          global: {
            en: {
              title: 'Global Title'
            },
            fr: {
              title: 'FR Global Title'
            }
          },
          local: {
            en: {
              greeting: 'Greeting'
            },
            fr: {
              greeting: 'FR Greeting'
            }
          }
        }
      }
    };
  });


  describe('reducer: languages', () => {
    let initialState = [];

    beforeEach(() => {
      initialState = [
        { code: 'en', active: false },
        { code: 'fr', active: false },
        { code: 'ne', active: false }
      ];
    });

    it('should add new languages all set to false', () => {
      const action = {
        type: SET_LANGUAGES,
        payload: {
          languageCodes: ['en', 'fr', 'ne']
        }
      };

      const result = languages([], action);
      expect(result).toEqual([
        { code: 'en', active: false },
        { code: 'fr', active: false },
        { code: 'ne', active: false }
      ]);
    });

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

  describe('reducer: translations', () => {
    let initialState = {};

    beforeEach(() => {
      initialState = {
        'hi': ['hi'],
        'bye': ['bye']
      };
    });

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

  describe('updateLanguage', () => {
    it('should set payload to provided language when valid', () => {
      const action = actions.updateLanguage('fr');
      expect(action.payload).toEqual('fr');
    });
  });

  describe('setLocaleJson', () => {
    it('should return an action object with this structure', () => {
      const json = { test: 'Test JSON' };
      const key = 'test';
      const action = actions.setLocalTranslations(key, json);
      expect(action.type).toEqual(SET_LOCAL_TRANSLATIONS);
      expect(action.payload).toEqual({ key, json });
    });
  });

  describe('setGlobalJson', () => {
    it('should return an action object with this structure', () => {
      const json = { test: 'Test JSON' };
      const action = actions.setGlobalTranslations(json);
      expect(action.type).toEqual(SET_GLOBAL_TRANSLATIONS);
      expect(action.payload).toEqual(json);
    });
  });

  describe('reducer', () => {
    it('should update currentLanguage', () => {
      const state = { currentLanguage: 'en', translations: null };
      const action = { 
        type: UPDATE_LANGUAGE, 
        payload: 'fr'
      };
      const result = reducer(state, action);
      expect(result.currentLanguage).toBe('fr');
    });

    it('should return unmodified state if action.type does not match', () => {
      const state = { currentLanguage: 'en', translations: null };
      const emptyAction = {};
      const result = reducer(state, emptyAction);
      expect(result).toBe(state);
    });

    it('should add json to global key in translations', () => {
      const state = { currentLanguage: 'en', translations: null };
      const action = {
        type: SET_GLOBAL_TRANSLATIONS,
        payload: mainState.locale.translations.global
      };
      const result = reducer(state, action);
      expect(result.translations.global).toEqual(action.payload);
    });

    it('should add key/value to existing locale data', () => {
      const state = mainState.locale;
      const action = {
        type: SET_LOCAL_TRANSLATIONS,
        payload: { key: 'page', json: { test: 'Test JSON' } }
      };
      const result = reducer(state, action);
      expect(result.translations.page).toBe(action.payload.json);
      expect(result.translations.global).toBe(state.translations.global);
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

  describe('getTranslationsForKey', () => {
    it('should return a function', () => {
      expect(typeof actions.getTranslationsForKey('test') === 'function').toBe(true);
    });

    it('should return an empty object when translations are empty', () => {
      const state = {
        locale: {
          currentLanguage: 'en',
          translations: null
        }
      };
      expect(actions.getTranslationsForKey('test')(state)).toEqual({});
    });

    it('should return an object with local and global translations merged', () => {
      expect(actions.getTranslationsForKey('local')(mainState)).toEqual({
        title: mainState.locale.translations.global.en.title,
        greeting: mainState.locale.translations.local.en.greeting
      });
    });

    it('should overwrite the global translation when local has the same key', () => {
      mainState.locale.translations.local = { en: { title: 'Local Title' } };
      expect(actions.getTranslationsForKey('local')(mainState)).toEqual({
        title: mainState.locale.translations.local.en.title
      });
    });

    it('should return only global translations when local key is not provided', () => {
      expect(actions.getTranslationsForKey()(mainState)).toEqual({
        title: mainState.locale.translations.global.en.title
      });
    });

    it('should return french translations', () => {
      mainState.locale.currentLanguage = 'fr';
      expect(actions.getTranslationsForKey('local')(mainState)).toEqual({
        title: mainState.locale.translations.global.fr.title,
        greeting: mainState.locale.translations.local.fr.greeting
      });
    });

  });
});