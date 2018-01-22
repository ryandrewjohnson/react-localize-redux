import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as utils from 'utils';

Enzyme.configure({ adapter: new Adapter() });

describe('locale utils', () => {
  const defaultLanguage = { code: 'en' };

  describe('getLocalizedElement', () => {
    it('should return element with localized string', () => {
      const translations = { test: 'Here is my test' };
      const result = utils.getLocalizedElement('test', translations, null, defaultLanguage);
      expect(result).toBe(translations.test);
    });

    it('should return element with HTML from translation rendered', () => {
      const translations = { test: '<h1>Here</h1> is my <strong>test</strong>' };
      const wrapper = shallow(utils.getLocalizedElement('test', translations, null, defaultLanguage));
      
      expect(wrapper.find('span').exists()).toBe(true);
      expect(wrapper.html()).toEqual(`<span>${translations.test}</span>`);
    });

    it('should not render inner HTML when this is disabled', () => {
      const translations = { test: '<h1>Here</h1> is my <strong>test</strong>' };
      const options = { renderInnerHtml: false };
      const result = utils.getLocalizedElement('test', translations, null, null, options);
      expect(result).toBe(translations.test);
    });

    it('should return empty string when showMissingTranslationMsg is false', () => {
      const translations = { test: 'Here is my test' };
      const key = 'test2';
      const options = { showMissingTranslationMsg: false };
      const result = utils.getLocalizedElement(key, translations, null, null, options);
      expect(result).toEqual('');
    });

    it('should return missing translation msg when showMissingTranslationMsg is true', () => {
      const translations = { test: 'Here is my test' };
      const key = 'test2';
      const language = { code: 'en' };
      const options = { showMissingTranslationMsg: true, missingTranslationMsg: 'My missing message' };
      const result = utils.getLocalizedElement(key, translations, null, { code: 'en' }, options);
      expect(result).toEqual('My missing message');
    });

    it('should replace variables in translation string with data', () => {
      const translations = { test: 'Hello ${ name }' };
      const result = utils.getLocalizedElement('test', translations, { name: 'Ted' }, defaultLanguage);
      expect(result).toEqual('Hello Ted');
    });

    it('should call missingTranslationCallback when set and translation is missing', () => {
      const callback = jest.fn();
      const options = { missingTranslationCallback: callback };
      const result = utils.getLocalizedElement('nothinghere', {}, null, defaultLanguage, options);
      expect(callback).toHaveBeenCalledWith('nothinghere', 'en');
    });
  });

  describe('hasHtmlTags', () => {
    it('should return true if string contains html tag', () => {
      const value1 = 'Here is some <b>text</b> with html tag';
      const value2 = 'Here is a <a href="test">Link</a>';
      expect(utils.hasHtmlTags(value1)).toBe(true);
      expect(utils.hasHtmlTags(value2)).toBe(true);
    });
  });

  describe('templater', () => {
    it('should replace all variables in the string', () => {
      const data = { name: 'Ryan', country: 'Canada' };
      const before = 'Hi my name is ${ name } and I live in ${ country }';
      const after = 'Hi my name is Ryan and I live in Canada';
      const result = utils.templater(before, data);
      expect(result).toEqual(after);
    });

    it('should not modify string if no data param is provided', () => {
      const before = 'Hi my name is ${ name } and I live in ${ country }';
      const result = utils.templater(before);
      expect(result).toEqual(before);
    });
  });
  
  describe('getIndexForLanguageCode', () => {
    it('should return the index for matching language code', () => {
      const languages = [{ code: 'en' }, { code: 'fr' }, { code: 'ne' }];
      const result = utils.getIndexForLanguageCode('fr', languages);
      expect(result).toBe(1);
    });

    it('should return -1 when no match is found', () => {
      const languages = [{ code: 'en' }, { code: 'fr' }, { code: 'ne' }];
      const result = utils.getIndexForLanguageCode('zw', languages);
      expect(result).toBe(-1);
    });
  });

  describe('objectValuesToString', () => {
    let translationData = {};
    
    beforeEach(() => {
      translationData = {
        one: ['1', '2', '3'],
        two: ['4', '5', '6']
      };
    });

    describe('Object.values defined', () => {
      it('should return an stingified array of translation array data', () => {
        const result = utils.objectValuesToString(translationData);
        expect(result).toEqual('1,2,3,4,5,6');
      });
    });

    describe('Object.values undefined', () => {
      it('should return an stingified array of translation array data', () => {
        Object.values = undefined;
        const result = utils.objectValuesToString(translationData);
        expect(result).toEqual('1,2,3,4,5,6');
      });
    });
  });

  describe('validateOptions', () => {
    it('should return options object when valid', () => {
      const options = {
        renderInnerHtml: false,
        defaultLanguage: 'en',
        translationTransform: (data, codes) => ({})
      };
      const result = utils.validateOptions(options);
      expect(result).toEqual(options);
    });

    it('should throw error if translationTransform is not a function', () => {
      const options = {
        renderInnerHtml: false,
        defaultLanguage: 'en',
        translationTransform: false
      };
      expect(() => utils.validateOptions(options)).toThrow();
    });
  });
});
