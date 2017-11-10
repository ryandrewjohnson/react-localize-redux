// @flow
import type { Element } from 'react';

/**
 * TYPES
 */
export type Language = {
  name?: string,
  code: string,
  active: boolean
};

export type NamedLanguage = {
  name: string,
  code: string
};

export type Translations = {
  [key: string]: string[]
};

export type TransFormFunction = (data: Object, languageCodes: string[]) => Translations;

export type MissingTranslationCallback = (key: string, languageCode: string) => any;

export type Options = {
  renderInnerHtml?: boolean,
  defaultLanguage?: string,
  showMissingTranslationMsg?: boolean,
  missingTranslationCallback?: MissingTranslationCallback,
  translationTransform?: TransFormFunction
};

export type LocaleState = {
  +languages: Language[],
  +translations: Translations,
  +options: Options
};

export type TranslatedLanguage = {
  [string]: string
};

export type LocalizedElement = Element<'span'>|string;

export type LocalizedElementMap = {
  [string]: LocalizedElement
};

export type TranslatePlaceholderData = {
  [string]: string|number
};

export type TranslateValue = string|string[];

export type Translate = (value: TranslateValue, data?: TranslatePlaceholderData, options?: Options) => LocalizedElement|LocalizedElementMap; 

export type SingleLanguageTranslation = {
  [key: string]: Object | string
};

export type MultipleLanguageTranslation = {
  [key: string]: Object | string[]
};

export type InitializePayload = {
  languages: any[], // TODO: why does string[]|NamedLanguage[] not work?
  options?: Options
};

export type AddTranslationPayload = {
  translation: Object
};

export type AddTranslationForLanguagePayload = {
  translation: Object,
  language: string
};

export type SetLanguagesPayload = {
  languages: string[]|NamedLanguage[],
  activeLanguage?: string
};

export type SetActiveLanguagePayload = {
  languageCode: string
};

export type BaseAction<T, P> = {
  type: T,
  payload: P
};

export type InitializeAction = BaseAction<'@@localize/INITIALIZE', InitializePayload>;
export type AddTranslationAction = BaseAction<'@@localize/ADD_TRANSLATION', AddTranslationPayload>;
export type AddTranslationForLanguageAction = BaseAction<'@@localize/ADD_TRANSLATION_FOR_LANGUGE', AddTranslationForLanguagePayload>;
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

export type ActionDetailed = Action & { 
  languageCodes: string[],
  translationTransform: TransFormFunction
};

export type LocalizeStateProps = {
  currentLanguage: string,
  translate: Translate
};

export { localize } from './containers/Localize';

export { 
  localeReducer,
  
  initialize,
  addTranslation,
  addTranslationForLanguage,
  setLanguages,
  setActiveLanguage,

  getTranslate,
  getActiveLanguage,
  getLanguages,
  getTranslations,
  getOptions
} from './modules/locale';