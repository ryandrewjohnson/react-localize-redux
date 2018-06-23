## 3.1.2 (June 22, 2018)

* Update the TypeScript definition for withLocalize [#98](https://github.com/ryandrewjohnson/react-localize-redux/pull/98)

## 3.1.1 (June 17, 2018)

* Make performance imporvements to `getTranslationsForLanguage` and `getSingleToMultilanguageTranslation` method. [#92](https://github.com/ryandrewjohnson/react-localize-redux/pull/92)

## 3.1.0 (June 14, 2018)

* Add [ignoreTranslateChildren](https://ryandrewjohnson.github.io/react-localize-redux-docs/#initialize) to initialize options. [#91](https://github.com/ryandrewjohnson/react-localize-redux-docs/pull/1)
* Fix issue where Warning: Cannot update during an existing state transition message was appearing [#88](https://github.com/ryandrewjohnson/react-localize-redux/pull/88)

## 3.0.2 (June 11, 2018)

* remove `console.log` in `LocalizeProvider`

## 3.0.1 (June 4, 2018)

* Update package.json peerDependencies react version to 16.3.0 as the `Translate` component requires [getDerivedStateFromProps](https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops).

## 3.0.0 (June 3, 2018)

* Now works without Redux by defualt.
* Add [LoclaizeProvider](https://ryandrewjohnson.github.io/react-localize-redux-docs//#localizeprovider) a wrapper around React's [Context.Provider](https://reactjs.org/docs/context.html#provider)
* Add [LocalizeContext](https://ryandrewjohnson.github.io/react-localize-redux-docs/#localizecontext) built on [React.createContext](https://reactjs.org/docs/context.html#reactcreatecontext).
* Add [withLocalize](https://ryandrewjohnson.github.io/react-localize-redux-docs/#withlocalize) higher-order component
* Add [onMissingTranslation](https://ryandrewjohnson.github.io/react-localize-redux-docs/#handle-missing-translations) initialize option that provides more control over handling missing translations.
* Optionally supports Redux by passing redux store to `LocalizeProvider`.

### Breaking Changes

* The Redux action creators `initialize`, `addTranslation`, `addTranslationForLanguage`, and `setActiveLanguage` have been removed. Instead they are now methods available on [LocalizeContext](https://ryandrewjohnson.github.io/react-localize-redux-docs/#localizecontext), and can be added to your component's as props using the [withLocalize](https://ryandrewjohnson.github.io/react-localize-redux-docs/#withlocalize) higher-order component.

* The `translationTransform` option is no longer available as an initialize option. Instead [addTranslation](https://ryandrewjohnson.github.io/react-localize-redux-docs/#addtranslation) now takes an options object, which accepts the `translationTransform` function.

  * This made more sense as this allows for adding transformations specific to a single translation instead of globally setting a transformation that you'd be stuck using for all translations.

* [initialize](https://ryandrewjohnson.github.io/react-localize-redux-docs/#initialize) now takes a single options argument instead of multiple arguments.

* [Translate](https://ryandrewjohnson.github.io/react-localize-redux-docs/#render-props-api) render props API now takes a single options object as an argument instead of multiple arguments.

* `renderInnerHtml` option now set to `false` by default instead of `true`.

  * This is to mirror React's functionality where by default any children will be escaped by defualt.

* Remove `showMissingTranslationMsg`, `missingTranslationMsg`, `missingTranslationCallback` initialize options. THe new `onMissingTranslation` option now covers all these scenarios.

* Remove `setTranslations` action - instead pass `languages` to initialize.

* Remove `localize` higher-order component - use new `withLoclize` higher-order component instead. Or if you only require access to `translate` function use `<Translate>` component instead.

* If using Redux, all state related to localize will be added under the `localize` key instead of `locale`.

* If using Redux, `localeReducer` is now named `localizeReducer`.

* Fix typos in `ADD_TRANSLATION_FOR_LANGUAGE` action [(Issue #65)](https://github.com/ryandrewjohnson/react-localize-redux/issues/65)
