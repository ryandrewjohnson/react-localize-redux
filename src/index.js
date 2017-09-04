// @flow
export type { 
  LocaleState, 
  Options, 
  Translations,
  Action,
  Translate,
  Language,
  InitializeAction,
  AddTranslationAction,
  AddTranslationForLanguageAction,
  SetLanguagesAction,
  SetActiveLanguageAction
} from './modules/locale';

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