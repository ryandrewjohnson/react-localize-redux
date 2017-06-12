export { localize } from './containers/Localize';

export { localize as localizeMiddleware } from './middleware/localize';

export { 
  localeReducer,
  addTranslation,
  setLanguages,
  setActiveLanguage,
  getTranslate
} from './modules/locale';