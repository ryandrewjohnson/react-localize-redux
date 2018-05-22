## initialize(languages, [options])

Dispatch this action when your app is initialized, and pass in which languages you are supporting in your translations. An optional `options` param can be passed to configure additional settings.

** Arguments: **

name | Type | Description
--------- | ----------| ------------
languages | string [] or <br/>{ name: string, code: string } []  | An array of language codes or named language objects.
[options] | object  | Additional configuration options

<p id="initialize-options"><strong> Options: </strong></p>

name | Type | Default | Description
--------- | ----------| ------------ |  ------------
defaultLanguage | string | languages[0] | The language code for the language you'd like to set as the defualt.
renderInnerHtml | boolean  | true |  Controls whether HTML in your translations will be rendered or returned as a plain string. 
showMissingTranslationMsg | boolean | true | Controls whether missing translation message will be rendered when translation is undefined.
missingTranslationMsg | string | Missing translation key ${key} for language ${code} | A message that will be rendered in place of missing translations
missingTranslationCallback | function | undefined | A function that will be called when attempting to get an undefined translation. See [Handle missing translations](/features/#handle-missing-translations) for details.
translationTransform | function | undefined | A transformation function that will be applied to translation data. See [Custom data format](/formatting-translation-data#custom-data-format) for details.
ignoreTranslateChildren | boolean | false | A flag that determines whether or not to add the children of `<Translate>` to the default language. This can be useful for defining default values in tests without adding them to translations.

<div class="admonition error">
  <p class="first admonition-title">Deprecated</p>
  <p class="last"><strong>showMissingTranslationMsg</strong> - will be deprecated in the next major release, as you can set <code>missingTranslationMsg= ''</code>  to accomplish the same thing as <code>showMissingTranslationMsg=false</code>.</p>
</div>

<div class="admonition important">
  <p class="first admonition-title">Important</p>
  <p class="last">If you're adding translation data from un-trusted sources make sure you set <code>renderInnerHtml</code> option to <code>false</code>. In order to render HTML tags in translations react-localize-redux uses React's <a href="https://facebook.github.io/react/docs/dom-elements.html#dangerouslysetinnerhtml" target="_blank">dangerouslySetInnerHTML</a>, which has <a href="https://zhenyong.github.io/react/tips/dangerously-set-inner-html.html" target="_blank">risks</a> when used improperly. For this reason in the next major release this option will be set to <code>false</code> by default to align with <code>dangerouslySetInnerHTML</code>.</p>
</div>

** Usage: **

```javascript
// with named languages 
const languages = [
  { name: 'English', code: 'en' },
  { name: 'French', code: 'fr' },
  { name: 'Spanish', code: 'es' }
];
store.dispatch(initialize(languages));

// with language codes only
const languages = ['en', 'fr', 'es'];
store.dispatch(initialize(languages));

// if you wanted 'fr' to be default language instead of 'en'
store.dispatch(initialize(languages, { defaultLanguage: 'fr' }));
```


---------------



## setLanguages(languages, [defaultActiveLanguage])

<div class="admonition error">
  <p class="first admonition-title">Deprecated</p>
  <p class="last">This has been replaced by the <a href="#initializelanguages-options">initialize</a> action creator, and will be removed in the next major version.</p>
</div>

Dispatch this action to set which languages you are supporting in your translations. If `defaultActiveLanguage` is not passed then the first language in the `languages` array will be used.

** Arguments: **

name | Type | Description
--------- | ----------| ------------
languages | string []  | An array of languages codes
[defaultActiveLanguage] | string  | Pass a language code to override the default active language.

** Usage: **

```javascript
const languages = ['en', 'fr', 'es'];

store.dispatch(setLanguages(languages));

// if you wanted 'fr' to be default language instead of 'en'
store.dispatch(setLanguages(languages, 'fr'));
```


---------------


## addTranslation(data)

Dispatch this action to add translation data for multiple languages from a json file, or vanilla JS to your redux store. Please see [formatting translation data](/formatting-translation-data#multiple-language-format) to ensure your data is in the proper format. 

** Arguments **

name | Type | Description
--------- | ----------| ------------
data | json \| object  | Translation data in the [required format](/formatting-translation-data#multiple-language-format)

** Usage: **

```javascript
// assuming your app has set languages ['en', 'fr']
const welcomePageTranslations = {
  greeting: ['Hi!', 'Bonjour!'],
  farewell: ['Bye!', 'Au revoir!']
};

store.dispatch(addTranslation(welcomePageTranslations));
```


---------------



## addTranslationForLanguage(data, language)

Dispatch this action to add translation data for a single language from a json file, or vanilla JS to your redux store. Please see [formatting translation data](/formatting-translation-data#single-language-format) to ensure your data is in the proper format. 

** Arguments **

name | Type | Description
--------- | ----------| ------------
data | json \| object  | Translation data in the [required format](/formatting-translation-data#single-language-format)
language | string  | The language code this translation data belongs to

** Usage: **

```javascript
// assuming your app has set languages ['en', 'fr']
const welcomePageEnglish = {
  greeting: 'Hi!',
  farewell: 'Bye!'
};

store.dispatch(addTranslationForLanguage(welcomePageEnglish, 'en'));
```


---------------



## setActiveLanguage(language)

**Redux action creator** to change the current language being used.

** Arguments: **

name | Type | Description
--------- | ----------| ------------
language | string | The language code you want to set as active.

** Usage: **

```javascript
// assuming your app has set languages ['en', 'fr']
store.dispatch(setActiveLanguage('fr'));
```