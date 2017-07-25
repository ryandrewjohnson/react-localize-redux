import { shallow } from 'enzyme';
import * as utils from 'utils';

describe('locale utils', () => {

  describe('getLocalizedElement', () => {
    it('should return element with localized string', () => {
      const translations = { test: 'Here is my test' };
      const result = utils.getLocalizedElement('test', translations);
      expect(result).toBe(translations.test);
    });

    it('should return element with HTML from translation rendered', () => {
      const translations = { test: '<h1>Here</h1> is my <strong>test</strong>' };
      const wrapper = shallow(utils.getLocalizedElement('test', translations));
      
      expect(wrapper.find('span').exists()).toBe(true);
      expect(wrapper.html()).toEqual(`<span>${translations.test}</span>`);
    });

    it('should return element with warning when no localized string found', () => {
      const translations = { test: 'Here is my test' };
      const key = 'test2';
      const result = utils.getLocalizedElement(key, translations);
      expect(result).toEqual(`Missing locaized: ${key}`);
    });

    it('should replace variables in translation string with data', () => {
      const translations = { test: 'Hello ${ name }' };
      const result = utils.getLocalizedElement('test', translations, { name: 'Ted' });
      expect(result).toEqual('Hello Ted');
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
});