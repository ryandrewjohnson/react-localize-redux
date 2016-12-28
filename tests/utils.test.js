import { shallow } from 'enzyme';
import * as utils from 'utils/locale';

describe('locale utils', () => {

  describe('getLocalizedElement', () => {
    it('should return element with localized string', () => {
      const translations = { test: 'Here is my test' };
      const result = shallow(utils.getLocalizedElement('test', translations));
      expect(result.find('span').length > 0).toBe(true);
      expect(result.find('span').html()).toEqual(`<span>${translations.test}</span>`);
    });

    it('should return element with warning when no localized string found', () => {
      const translations = { test: 'Here is my test' };
      const key = 'test2';
      const result = shallow(utils.getLocalizedElement(key, translations));
      expect(result.find('span').length > 0).toBe(true);
      expect(result.find('span').html()).toEqual(`<span>Missing locaized: ${key}</span>`);
    });
  });
  
});