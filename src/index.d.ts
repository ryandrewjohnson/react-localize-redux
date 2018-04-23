import { ReactElement, ReactNode, Component as ReactComponent  } from 'react';
import { ComponentClass, Component } from 'react-redux';

export as namespace ReactLocalizeRedux;

export interface Language {
  name?: string;
  code: string;
  active: boolean;
}

export interface NamedLanguage {
  name: string;
  code: string;
}

export interface Translations {
  [key: string]: string[];
}

type TransFormFunction = (data: Object, languageCodes: string[]) => Translations;

type MissingTranslationCallback = (key: string, languageCode: string) => any;

export interface Options {
  renderInnerHtml?: boolean;
  defaultLanguage?: string;
  showMissingTranslationMsg?: boolean;
  missingTranslationMsg?: string;
  missingTranslationCallback?: MissingTranslationCallback;
  translationTransform?: TransFormFunction;
  ignoreTranslateChildren?: boolean;
}

export interface LocaleState {
  languages: Language[];
  translations: Translations;
  options: Options;
}

export interface TranslatedLanguage {
  [key: string]: string;
}

export type LocalizedElement = ReactElement<'span'>|string;

export interface LocalizedElementMap {
  [key: string]: LocalizedElement;
}

export interface TranslatePlaceholderData {
  [key: string]: string|number;
}

export type TranslateChildFunction = (
  translate: TranslateFunction, 
  activeLanguage: Language, 
  languages: Language[]) => any;

export interface TranslateProps {
  id?: string;
  options?: Options;
  data?: TranslatePlaceholderData;
  children?: any|TranslateChildFunction;
}

export type TranslateValue = string|string[];

interface BaseAction<T, P> {
  type: T;
  payload: P;
}

export type TranslateFunction = (value: TranslateValue, data?: TranslatePlaceholderData, options?: Options) => LocalizedElement|LocalizedElementMap; 

type InitializePayload = {
  languages: any[], 
  options?: Options
};

type AddTranslationPayload = {
  translation: Object
};

type AddTranslationForLanguagePayload = {
  translation: Object,
  language: string
};

type SetLanguagesPayload = {
  languages: string[]|NamedLanguage[],
  activeLanguage?: string
};

type SetActiveLanguagePayload = {
  languageCode: string
};

type LocalizeProps = {
  currentLanguage: string,
  translate: TranslateFunction
};

export type SingleLanguageTranslation = {
  [key: string]: Object | string
};

export type MultipleLanguageTranslation = {
  [key: string]: Object | string[]
};

export type InitializeAction = BaseAction<'@@localize/INITIALIZE', InitializePayload>;
export type AddTranslationAction = BaseAction<'@@localize/ADD_TRANSLATION', AddTranslationPayload>;
export type AddTranslationForLanguageAction = BaseAction<'@@localize/ADD_TRANSLATION_FOR_LANGUAGE', AddTranslationForLanguagePayload>;
export type SetActiveLanguageAction = BaseAction<'@@localize/SET_ACTIVE_LANGUAGE', SetActiveLanguagePayload>;
export type SetLanguagesAction = BaseAction<'@@localize/SET_LANGUAGES', SetLanguagesPayload>;

export type Action = BaseAction<
  string, 
  & InitializePayload
  & AddTranslationPayload 
  & AddTranslationForLanguagePayload 
  & SetActiveLanguagePayload
  & SetLanguagesPayload
>;

export type GetSliceStateFn = (state: Object|LocaleState) => LocaleState;

export type ActionLanguageCodes = Action & { languageCodes: string[] };

export function localeReducer(state: LocaleState, action: Action): LocaleState;

export function initialize(languages: Array<string|NamedLanguage>, options?: Options): InitializeAction;

export function addTranslation(translation: MultipleLanguageTranslation): AddTranslationAction;

export function addTranslationForLanguage(translation: SingleLanguageTranslation, language: string): AddTranslationForLanguageAction;

export function setLanguages(languages: Array<string|NamedLanguage>, activeLanguage?: string): SetLanguagesAction;

export function setActiveLanguage(languageCode: string): SetActiveLanguageAction;

export function getTranslations(state: LocaleState): Translations;

export function getLanguages(state: LocaleState): Language[];

export function getOptions(state: LocaleState): Options;

export function getActiveLanguage(state: LocaleState): Language;

export function getTranslate(state: LocaleState): TranslateFunction;

export function localize(Component: Component<any>, slice?: string, getStateSlice?: GetSliceStateFn): (state: Object|LocaleState) => ComponentClass<LocalizeProps>;

export function TranslateChildFunction(translate: Translate, activeLanguage: Language, languages: Language[]): ReactNode;

export class Translate extends ReactComponent<TranslateProps> {}