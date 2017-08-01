## setLanguages(languages, [defaultActiveLanguage])

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

Dispatch this action to add translation data for multiple languages from a json file, or vanilla JS to your redux store. Please see [formatting transaltion data]() to ensure your data is in the proper format. 

** Arguments **

name | Type | Description
--------- | ----------| ------------
data | json \| object  | Translation data in the [required format]()

** Usage: **

```javascript
// assuming your app has set languages ['en', 'fr']
const welcomePageTranslations = {
  greeting: ['Hi!', 'Bonjour!'],
  farwell: ['Bye!', 'Au revoir!']
};

store.dispatch(addTranslation(welcomePageTranslations));
```


---------------



## addTranslationForLanguage(data, language)

Dispatch this action to add translation data for a single language from a json file, or vanilla JS to your redux store. Please see [formatting transaltion data]() to ensure your data is in the proper format. 

** Arguments **

name | Type | Description
--------- | ----------| ------------
data | json \| object  | Translation data in the [required format]()
language | string  | The language code this translation data belongs to

** Usage: **

```javascript
// assuming your app has set languages ['en', 'fr']
const welcomePageEnglish = {
  greeting: 'Hi!',
  farwell: 'Bye!'
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