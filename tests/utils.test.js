import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as utils from 'utils';

Enzyme.configure({ adapter: new Adapter() });

describe('locale utils', () => {
  const defaultLanguage = { code: 'en' };

  describe('getLocalizedElement', () => {

    it('should return element with localized string', () => {
      const translations = { test: 'Here is my test' };
      const result = utils.getLocalizedElement({
        translationId: 'test',
        translations
      });
      expect(result).toBe(translations.test);
    });

    it('should render inner HTML when renderInnerHtml = true', () => {
      const translations = { test: '<h1>Here</h1> is my <strong>test</strong>' };
      const wrapper = shallow(utils.getLocalizedElement({
        translationId: 'test',
        translations,
        renderInnerHtml: true
      }));
      
      expect(wrapper.find('span').exists()).toBe(true);
      expect(wrapper.html()).toEqual(`<span>${translations.test}</span>`);
    });

    it('should not render inner HTML when renderInnerHtml = false', () => {
      const translations = { test: '<h1>Here</h1> is my <strong>test</strong>' };
      const result = utils.getLocalizedElement({
        translationId: 'test',
        translations, 
        renderInnerHtml: false
      });
      expect(result).toBe(translations.test);
    });

    it('should return result of onMissingTranslation when translation = undefined', () => {
      const onMissingTranslation = () => 'My missing message';
      const result = utils.getLocalizedElement({
        translationId: 'nothing',
        translations: {},
        renderInnerHtml: true, 
        onMissingTranslation
      });
      expect(result).toEqual('My missing message');
    });

    it('should replace variables in translation string with data', () => {
      const translations = { test: 'Hello ${ name }' };
      const result = utils.getLocalizedElement({
        translationId: 'test',
        translations,
        renderInnerHtml: true,
        data: { name: 'Ted' }
      });
      expect(result).toEqual('Hello Ted');
    });

    it('should handle React in data', () => {
      const Comp = () => <div>ReactJS</div>
      const translations = { test: 'Hello ${ comp } data' }
      const result = utils.getLocalizedElement({
        translationId: 'test',
        translations,
        data: { comp: <Comp /> }
      });
      expect(mount(result).text()).toContain('ReactJS');
    })
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

    it('should return an array if React components are passed in data', () => {
      const Comp = () => <div>Test</div>;
      const data = { comp:  <Comp />};
      const before = 'Hello this is a ${ comp } translation';
      const after = ['Hello this is a ', <Comp /> , ' translation'];
      const result = utils.templater(before, data);
      expect(result).toEqual(after);
    })
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
});
