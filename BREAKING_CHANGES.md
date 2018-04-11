# Breaking Changes
* renderInnerHtml option will be set to false by default instead of true
* showMissingTranslationMsg, missingTranslationMsg, missingTranslationCallback removed replaced with onMissingTranslation
* setTranslations action has been removed
* localize HOC has been removed
* change default slice name from 'locale' to 'localize'
* change name of 'localeReducer' to 'localizeReducer'
* Translate render props API takes single object instead of multiple arguments
* typo updates for action from outstanding PR
* getFunctionSlice stuff to handle immutablejs has been removed
* initialize now takes a single argument instead of multiple arguments

# TODO:
* test old version of react, see if can catch errors for <Translate>
* add prettier
* redo docs
* clean up package.json
* give a debug prop to LocalizeProvider to help with logging in development?
* rename all references to react-localize-redux to react-localize
* update all references to translation key to translation id


