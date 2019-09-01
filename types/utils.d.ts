import React from 'react';
import { Language, Translations } from './localize';
export declare const getLocalizedElement: (options: any) => string | React.DetailedReactHTMLElement<any, HTMLElement>;
export declare const hasHtmlTags: (value: any) => boolean;
/**
 * @func templater
 * @desc A poor mans template parser
 * @param {string} strings The template string
 * @param {object} data The data that should be inserted in template
 * @return {string} The template string with the data merged in
 */
export declare const templater: (strings: any, data?: {}) => any;
/**
 * Given an array of Languages return the index of the language
 * that matches the provided langauge code.
 * @param code
 * @param languages
 */
export declare const getIndexForLanguageCode: (code: string, languages: Language[]) => number;
export declare const objectValuesToString: (data: any) => string;
export declare const validateOptions: (options: any) => any;
/**
 * Return an object with only the translations for the provided language.
 * @param language - The language to match
 * @param languages - Array of all languages
 * @param translations - Translation data for all languages
 */
export declare const getTranslationsForLanguage: (language: Language, languages: Language[], translations: Translations) => Translations;
export declare const storeDidChange: (store: any, onChange: any) => any;
export declare const getSingleToMultilanguageTranslation: (language: any, languageCodes: any, flattenedTranslations: any, existingTranslations: any) => {};
export declare const get: (obj: any, path: any, defaultValue?: any) => any;
export declare const warning: (message: any) => void;
export declare const isEmpty: (value: any) => boolean;
