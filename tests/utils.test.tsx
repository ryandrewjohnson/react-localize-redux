import React from 'react';
import { shallow } from 'enzyme';
import { render } from 'react-testing-library';
import * as utils from '../src/utils';

describe('locale utils', () => {
  const defaultLanguage = { code: 'en' };

  describe('getLocalizedElement', () => {
    it('should return element with localized string', () => {
      const translations = { test: 'Here is my test' };
      const result = utils.getLocalizedElement({
        translation: 'Here is my test'
      });
      expect(result).toBe(translations.test);
    });

    it('should render inner HTML when renderInnerHtml = true', () => {
      const translation = '<h1>Here</h1> is my <strong>test</strong>';
      const wrapper = shallow(utils.getLocalizedElement({
        translation,
        renderInnerHtml: true
      }) as any);

      expect(wrapper.find('span').exists()).toBe(true);
      expect(wrapper.html()).toEqual(`<span>${translation}</span>`);
    });

    it('should not render inner HTML when renderInnerHtml = false', () => {
      const translation = '<h1>Here</h1> is my <strong>test</strong>';
      const result = utils.getLocalizedElement({
        translation,
        renderInnerHtml: false
      });
      expect(result).toBe(translation);
    });

    it('should replace variables in translation string with data', () => {
      const translation = 'Hello ${ name }';
      const result = utils.getLocalizedElement({
        translation,
        renderInnerHtml: true,
        data: { name: 'Ted' }
      });
      expect(result).toEqual('Hello Ted');
    });

    it('should handle React in data', () => {
      const Comp = () => <div>ReactJS</div>;
      const translation = 'Hello ${ comp } data';
      const result: any = utils.getLocalizedElement({
        translation,
        data: { comp: <Comp /> }
      });
      const { container } = render(result);
      expect(container.textContent).toContain('ReactJS');
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

    it('should replace all variables in the string even when variable are adjacent', () => {
      const data = { name: 'Ryan', type: 'Air' };
      const before = 'Hi my airline company is ${name}${type}';
      const after = 'Hi my airline company is RyanAir';
      const result = utils.templater(before, data);
      expect(result).toEqual(after);
    });

    it('should not modify string if no data param is provided', () => {
      const before = 'Hi my name is ${ name } and I live in ${ country }';
      const result = utils.templater(before);
      expect(result).toEqual(before);
    });

    it('should return an array if React components are passed in data', () => {
      const Comp = () => <div>Test</div>;
      const data = { comp: <Comp /> };
      const before = 'Hello this is a ${ comp } translation';
      const after = ['Hello this is a ', <Comp />, ' translation'];
      const result = utils.templater(before, data);
      expect(result).toEqual(after);
    });

    it('should handle falsy data values (except undefined)', () => {
      const data = { zero: 0, empty: '' };
      const before = 'Number ${zero}, empty ${empty}';
      const after = 'Number 0, empty ';
      const result = utils.templater(before, data);
      expect(result).toEqual(after);
    });
  });

  describe('getIndexForLanguageCode', () => {
    it('should return the index for matching language code', () => {
      const languages = [{ code: 'en' }, { code: 'fr' }, { code: 'ne' }];
      const result = utils.getIndexForLanguageCode('fr', languages as any);
      expect(result).toBe(1);
    });

    it('should return -1 when no match is found', () => {
      const languages = [{ code: 'en' }, { code: 'fr' }, { code: 'ne' }];
      const result = utils.getIndexForLanguageCode('zw', languages as any);
      expect(result).toBe(-1);
    });
  });

  describe('validateOptions', () => {
    it('should return options object when valid', () => {
      const options = {
        renderInnerHtml: false,
        defaultLanguage: 'en',
        translationTransform: (data, codes) => ({}),
        renderToStaticMarkup: false
      };
      const result = utils.validateOptions(options);
      expect(result).toEqual(options);
    });

    it('should throw error if onMissingTranslation is not a function', () => {
      const options = {
        renderInnerHtml: false,
        defaultLanguage: 'en',
        onMissingTranslation: false,
        renderToStaticMarkup: false
      };
      expect(() => utils.validateOptions(options)).toThrow();
    });

    it('should throw error if renderToStaticMarkup is not a function', () => {
      const options = {
        renderInnerHtml: false,
        defaultLanguage: 'en',
        renderToStaticMarkup: ''
      };
      expect(() => utils.validateOptions(options)).toThrow();
    });

    it('should throw error if renderToStaticMarkup is not false', () => {
      const options = {
        renderInnerHtml: false,
        defaultLanguage: 'en',
        renderToStaticMarkup: true
      };
      expect(() => utils.validateOptions(options)).toThrow();
    });
  });

  describe('get', () => {
    const obj = { a: { b: { c: 'd' } } };

    it('gets value at path', () => {
      const path = 'a.b.c';
      expect(utils.get(obj, path)).toBe('d');
    });

    it('returns passed default value', () => {
      const path = 'foo';
      expect(utils.get(obj, path, 'default')).toBe('default');
    });

    it('falls back to undefined', () => {
      const path = 'foo';
      expect(utils.get(obj, path)).toBeUndefined();
    });
  });

  describe('isEmpty()', () => {
    it('should return true if undefined', () => {
      const result = utils.isEmpty(undefined);
      expect(result).toBe(true);
    });

    it('should return true if null', () => {
      const result = utils.isEmpty(null);
      expect(result).toBe(true);
    });

    it('should return true if empty string', () => {
      const result = utils.isEmpty('');
      expect(result).toBe(true);
    });

    it('should return true when not empty', () => {
      const result = utils.isEmpty('test');
      expect(result).toBe(false);
    });
  });
});
