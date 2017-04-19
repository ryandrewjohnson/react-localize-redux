import { shallow } from 'enzyme';
import * as utils from 'utils';

describe('locale utils', () => {

  describe('getLocalizedElement', () => {
    it('should return element with localized string', () => {
      const translations = { test: 'Here is my test' };
      const result = shallow(utils.getLocalizedElement('test', translations));
      expect(result.find('span').exists()).toBe(true);
      expect(result.find('span').html()).toEqual(`<span>${translations.test}</span>`);
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
      const result = shallow(utils.getLocalizedElement(key, translations));
      expect(result.find('span').exists()).toBe(true);
      expect(result.find('span').html()).toEqual(`<span>Missing locaized: ${key}</span>`);
    });
  });

  describe('isDefinedNested', () => {
    it('should return false on empty first prop', () => {
      const test = { test: 'this' };
      const result = utils.isDefinedNested(test, 'empty');
      expect(result).toBe(false);
    });

    it('should return first prop', () => {
      const test = { test: 'this' };
      const result = utils.isDefinedNested(test, 'test');
      expect(result).toBe('this');
    });

    it('should return second prop', () => {
      const test = { test: { test2: 'this' } };
      const result = utils.isDefinedNested(test, 'test', 'test2');
      expect(result).toBe(true);
    });

    it('should return false nested prop', () => {
      const test = { test: { test2: 'this' } };
      const result = utils.isDefinedNested(test, 'test', 'test3');
      expect(result).toBe(false);
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
  
});