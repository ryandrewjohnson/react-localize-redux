import * as actions from 'modules/locale';
import reducer, { FETCH_LOCALE_REQUEST, FETCH_LOCALE_SUCCESS, FETCH_LOCALE_ERROR } from 'modules/locale';

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

  describe('updateLanguage', () => {
    it('should set payload to provided language when valid', () => {
      const action = actions.updateLanguage('fr');
      expect(action.payload).toEqual('fr');
    });
  });

  describe('fetchLocaleJson', () => {
    it('should return an action object with this structure', () => {
      const json = { test: 'Test JSON' };
      const key = 'test';
      const action: any = actions.fetchLocaleJson(json, key);

      expect(action.type).toEqual([FETCH_LOCALE_REQUEST, FETCH_LOCALE_SUCCESS, FETCH_LOCALE_ERROR]);
      expect(action.shouldCallApi()).toBe(true);
      expect(action.callApi().then).toBeDefined();
      expect(action.payload).toEqual({ key });
    });
  });

  describe('reducer', () => {
    it('should return unmodified state if action.type does not match', () => {
      const state = { currentLanguage: 'en', translations: null };
      const emptyAction: any = {};
      const result = reducer(state, emptyAction);
      expect(result).toBe(state);
    });

    it('should add key/value to existing locale data', () => {
      const state: any = { currentLanguage: 'en', translations: null };
      const action: any = {
        type: FETCH_LOCALE_SUCCESS,
        payload: { key: 'page', response: 'page data' }
      };
      const result: any = reducer(state, action);
      expect(result.translations.page).toBe(action.payload.response);
      expect(result.translations.global).toBe(state.global);
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