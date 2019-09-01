import { ReactElement } from 'react';
import { createSelector } from 'reselect';
import { TranslateResult, TranslateOptions } from './LocalizeContext';
export interface Language {
    name?: string;
    code: string;
    active: boolean;
}
export interface Translations {
    [key: string]: string[];
}
export interface MultiLanguageTranslationData {
    [key: string]: MultiLanguageTranslationData | string[];
}
export interface SingleLanguageTranslationData {
    [key: string]: SingleLanguageTranslationData | string;
}
export declare type LocalizedElement = ReactElement<'span'> | string;
export declare type MissingTranslationOptions = {
    translationId: string;
    languageCode: string;
    defaultTranslation: LocalizedElement;
};
export declare type onMissingTranslationFunction = (options: MissingTranslationOptions) => string;
export declare type renderToStaticMarkupFunction = (element: any) => string;
export interface InitializeOptions {
    renderToStaticMarkup: renderToStaticMarkupFunction | boolean;
    renderInnerHtml?: boolean;
    onMissingTranslation?: onMissingTranslationFunction;
    defaultLanguage?: string;
    ignoreTranslateChildren?: boolean;
}
export interface LocalizeState {
    languages: Language[];
    translations: Translations;
    options: InitializeOptions;
}
export declare type NamedLanguage = {
    name: string;
    code: string;
};
declare type TransFormFunction = (data: MultiLanguageTranslationData, languageCodes: string[]) => Translations;
export interface AddTranslationOptions {
    translationTransform?: TransFormFunction;
}
export declare type InitializePayload = {
    languages: NamedLanguage[];
    translation?: Object;
    options?: InitializeOptions;
};
declare type SetActiveLanguagePayload = {
    languageCode: string;
};
export declare type AddTranslationPayload = {
    translation: MultiLanguageTranslationData;
    translationOptions?: AddTranslationOptions;
};
declare type AddTranslationForLanguagePayload = {
    translation: SingleLanguageTranslationData;
    language: string;
};
interface BaseAction<T, P> {
    type: T;
    payload: P;
}
export declare type InitializeAction = BaseAction<'@@localize/INITIALIZE', InitializePayload>;
export declare type SetActiveLanguageAction = BaseAction<'@@localize/SET_ACTIVE_LANGUAGE', SetActiveLanguagePayload>;
export declare type AddTranslationAction = BaseAction<'@@localize/ADD_TRANSLATION', AddTranslationPayload>;
export declare type AddTranslationForLanguageAction = BaseAction<'@@localize/ADD_TRANSLATION_FOR_LANGUAGE', AddTranslationForLanguagePayload>;
/**
 * ACTIONS
 */
export declare const INITIALIZE = "@@localize/INITIALIZE";
export declare const ADD_TRANSLATION = "@@localize/ADD_TRANSLATION";
export declare const ADD_TRANSLATION_FOR_LANGUAGE = "@@localize/ADD_TRANSLATION_FOR_LANGUAGE";
export declare const SET_ACTIVE_LANGUAGE = "@@localize/SET_ACTIVE_LANGUAGE";
export declare const TRANSLATE = "@@localize/TRANSLATE";
/**
 * REDUCERS
 */
export declare function languages(state: Language[], action: InitializeAction | SetActiveLanguageAction): Language[];
export declare function translations(state: Translations, action: InitializeAction & {
    languageCodes: string[];
} | AddTranslationAction & {
    languageCodes: string[];
} | AddTranslationForLanguageAction & {
    languageCodes: string[];
}): Translations;
export declare function options(state: InitializeOptions, action: InitializeAction & {
    languageCodes: string[];
}): InitializeOptions;
export declare const defaultTranslateOptions: InitializeOptions;
export declare const localizeReducer: (state: LocalizeState, action: any) => {
    languages: Language[];
    translations: Translations;
    options: InitializeOptions;
};
/**
 * ACTION CREATORS
 */
export declare const initialize: (payload: InitializePayload) => BaseAction<"@@localize/INITIALIZE", InitializePayload>;
export declare const addTranslation: (translation: MultiLanguageTranslationData, options?: AddTranslationOptions) => BaseAction<"@@localize/ADD_TRANSLATION", AddTranslationPayload>;
export declare const addTranslationForLanguage: (translation: SingleLanguageTranslationData, language: string) => BaseAction<"@@localize/ADD_TRANSLATION_FOR_LANGUAGE", AddTranslationForLanguagePayload>;
export declare const setActiveLanguage: (languageCode: string) => BaseAction<"@@localize/SET_ACTIVE_LANGUAGE", SetActiveLanguagePayload>;
/**
 * SELECTORS
 */
export declare const getTranslations: (state: LocalizeState) => Translations;
export declare const getLanguages: (state: LocalizeState) => Language[];
export declare const getOptions: (state: LocalizeState) => InitializeOptions;
export declare const getActiveLanguage: (state: LocalizeState) => Language;
/**
 * A custom equality checker that checker that compares an objects keys and values instead of === comparison
 * e.g. {name: 'Ted', sport: 'hockey'} would result in 'name,sport - Ted,hockey' which would be used for comparison
 *
 * NOTE: This works with activeLanguage, languages, and translations data types.
 * If a new data type is added to selector this would need to be updated to accomodate
 */
export declare const translationsEqualSelector: typeof createSelector;
export declare const getTranslationsForActiveLanguage: import("reselect").OutputSelector<LocalizeState, Translations, (res1: Language, res2: Language[], res3: Translations) => Translations>;
export declare const getTranslationsForSpecificLanguage: import("reselect").OutputSelector<LocalizeState, (languageCode: any) => Translations, (res1: Language[], res2: Translations) => (languageCode: any) => Translations>;
export declare const getTranslate: import("reselect").OutputSelector<LocalizeState, (value: string | string[], data?: {
    [key: string]: string;
}, translateOptions?: TranslateOptions) => TranslateResult, (res1: Translations, res2: (languageCode: any) => Translations, res3: Language, res4: InitializeOptions) => (value: string | string[], data?: {
    [key: string]: string;
}, translateOptions?: TranslateOptions) => TranslateResult>;
export {};
