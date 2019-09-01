import React from 'react';
import { Language, onMissingTranslationFunction, InitializePayload, MultiLanguageTranslationData, SingleLanguageTranslationData, renderToStaticMarkupFunction } from './localize';
export interface TranslateOptions {
    language?: string;
    renderInnerHtml?: boolean;
    onMissingTranslation?: onMissingTranslationFunction;
    ignoreTranslateChildren?: boolean;
}
declare type LocalizedElement = string | React.DetailedReactHTMLElement<any, HTMLElement>;
declare type LocalizedElementMap = {
    [key: string]: LocalizedElement;
};
export declare type TranslateResult = LocalizedElement | LocalizedElementMap;
export declare type TranslateFunction = (value: string | string[], data?: {
    [key: string]: string;
}, options?: TranslateOptions) => TranslateResult;
export declare type LocalizeContextType = {
    initialize: (payload: InitializePayload) => void;
    addTranslation: (payload: MultiLanguageTranslationData) => void;
    addTranslationForLanguage: (translation: SingleLanguageTranslationData, language: string) => void;
    setActiveLanguage: (languageCode: string) => void;
    translate: TranslateFunction;
    languages: Language[];
    activeLanguage: Language;
    defaultLanguage: string;
    renderToStaticMarkup: renderToStaticMarkupFunction | boolean;
    ignoreTranslateChildren: boolean;
};
export declare const getContextPropsFromState: (dispatch: any) => import("reselect").OutputSelector<import("./localize").LocalizeState, {
    translate: (value: string | string[], data?: {
        [key: string]: string;
    }, translateOptions?: TranslateOptions) => TranslateResult;
    languages: Language[];
    defaultLanguage: string;
    activeLanguage: Language;
    initialize: (payload: any) => any;
    addTranslation: (translation: any) => any;
    addTranslationForLanguage: (translation: any, language: any) => any;
    setActiveLanguage: (languageCode: any) => any;
    renderToStaticMarkup: boolean | renderToStaticMarkupFunction;
    ignoreTranslateChildren: boolean;
}, (res1: (value: string | string[], data?: {
    [key: string]: string;
}, translateOptions?: TranslateOptions) => TranslateResult, res2: Language[], res3: Language, res4: import("./localize").InitializeOptions) => {
    translate: (value: string | string[], data?: {
        [key: string]: string;
    }, translateOptions?: TranslateOptions) => TranslateResult;
    languages: Language[];
    defaultLanguage: string;
    activeLanguage: Language;
    initialize: (payload: any) => any;
    addTranslation: (translation: any) => any;
    addTranslationForLanguage: (translation: any, language: any) => any;
    setActiveLanguage: (languageCode: any) => any;
    renderToStaticMarkup: boolean | renderToStaticMarkupFunction;
    ignoreTranslateChildren: boolean;
}>;
export declare const LocalizeContext: React.Context<LocalizeContextType>;
export {};
