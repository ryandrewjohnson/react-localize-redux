import {
  ReactElement,
  ReactNode,
  Component as ReactComponent,
  ComponentType
} from 'react';

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

type TransFormFunction = (
  data: Object,
  languageCodes: string[]
) => Translations;

type MissingTranslationOptions = {
  translationId: string;
  languageCode: string;
  defaultTranslation: LocalizedElement;
};

export type onMissingTranslationFunction = (
  options: MissingTranslationOptions
) => string;

type renderToStaticMarkupFunction = (element: any) => string;

export interface InitializeOptions {
  renderToStaticMarkup: renderToStaticMarkupFunction | false;
  renderInnerHtml?: boolean;
  onMissingTranslation?: onMissingTranslationFunction;
  defaultLanguage?: string;
  ignoreTranslateChildren?: boolean;
}

export interface TranslateOptions {
  language?: string;
  renderInnerHtml?: boolean;
  onMissingTranslation?: onMissingTranslationFunction;
  ignoreTranslateChildren?: boolean;
}

export interface AddTranslationOptions {
  translationTransform?: TransFormFunction;
}

export interface LocalizeState {
  languages: Language[];
  translations: Translations;
  options: InitializeOptions;
}

export interface LocalizeContextProps {
  translate: TranslateFunction;
  languages: Language[];
  activeLanguage: Language;
  defaultLanguage: string;
  initialize: (payload: InitializePayload) => void;
  addTranslation: (translation: MultipleLanguageTranslation) => void;
  addTranslationForLanguage: (
    translation: SingleLanguageTranslation,
    language: string
  ) => void;
  setActiveLanguage: (languageCode: string) => void;
  renderToStaticMarkup: (element: any) => string | false;
}

export interface LocalizeProviderProps {
  store?: any;
  getState?: (state: any) => LocalizeState;
  initialize?: InitializePayload;
  children: any;
}

export interface TranslatedLanguage {
  [key: string]: string;
}

export type LocalizedElement = ReactElement<'span'> | string;

export interface LocalizedElementMap {
  [key: string]: LocalizedElement;
}

export interface TranslatePlaceholderData {
  [key: string]: string | number | React.ReactNode;
}

export type TranslateChildFunction = (context: LocalizeContextProps) => any;

export interface TranslateProps {
  id?: string;
  options?: InitializeOptions;
  data?: TranslatePlaceholderData;
  children?: TranslateChildFunction | ReactNode;
}

export type TranslateValue = string | string[];

interface BaseAction<T, P> {
  type: T;
  payload: P;
}

export type TranslateFunction = (
  value: TranslateValue,
  data?: TranslatePlaceholderData,
  options?: TranslateOptions
) => LocalizedElement | LocalizedElementMap;

export type InitializePayload = {
  languages: Array<string | NamedLanguage>;
  translation?: Object;
  options?: InitializeOptions;
};

type AddTranslationPayload = {
  translation: Object;
  translationOptions?: AddTranslationOptions;
};

type AddTranslationForLanguagePayload = {
  translation: Object;
  language: string;
};

type SetActiveLanguagePayload = {
  languageCode: string;
};

export type SingleLanguageTranslation = {
  [key: string]: Object | string;
};

export type MultipleLanguageTranslation = {
  [key: string]: Object | string[];
};

export type InitializeAction = BaseAction<
  '@@localize/INITIALIZE',
  InitializePayload
>;
export type AddTranslationAction = BaseAction<
  '@@localize/ADD_TRANSLATION',
  AddTranslationPayload
>;
export type AddTranslationForLanguageAction = BaseAction<
  '@@localize/ADD_TRANSLATION_FOR_LANGUAGE',
  AddTranslationForLanguagePayload
>;
export type SetActiveLanguageAction = BaseAction<
  '@@localize/SET_ACTIVE_LANGUAGE',
  SetActiveLanguagePayload
>;

export type Action = BaseAction<
  string,
  InitializePayload &
    AddTranslationPayload &
    AddTranslationForLanguagePayload &
    SetActiveLanguagePayload
>;

export type ActionLanguageCodes = Action & { languageCodes: string[] };

export function localizeReducer(
  state: LocalizeState,
  action: Action
): LocalizeState;

export function initialize(payload: InitializePayload): InitializeAction;

export function addTranslation(
  translation: MultipleLanguageTranslation,
  options?: AddTranslationOptions
): AddTranslationAction;

export function addTranslationForLanguage(
  translation: SingleLanguageTranslation,
  language: string
): AddTranslationForLanguageAction;

export function setActiveLanguage(
  languageCode: string
): SetActiveLanguageAction;

export function getTranslations(state: LocalizeState): Translations;

export function getLanguages(state: LocalizeState): Language[];

export function getOptions(state: LocalizeState): InitializeOptions;

export function getActiveLanguage(state: LocalizeState): Language;

export function getTranslate(state: LocalizeState): TranslateFunction;

export function withLocalize<Props extends LocalizeContextProps>(
  WrappedComponent: ComponentType<Props>
): ComponentType<Pick<Props, Exclude<keyof Props, keyof LocalizeContextProps>>>;

export function TranslateChildFunction(
  context: LocalizeContextProps
): ReactNode;

export const Translate: React.SFC<TranslateProps>;

export class LocalizeProvider extends ReactComponent<LocalizeProviderProps> {}
