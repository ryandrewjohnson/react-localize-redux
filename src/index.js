export { localize } from './containers/Localize';

export localeReducer, { 
  updateLanguage,
  setLocalTranslations,
  setGlobalTranslations,
  getTranslationsForKey
} from './modules/locale';