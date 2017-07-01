# React Localize Redux

A collection of helpers for managing localized content in your React/Redux application. 

<p>
  <a href="https://www.npmjs.com/package/react-localize-redux"><img src="https://img.shields.io/npm/dm/react-localize-redux.svg?style=flat-square"></a>
  <a href="https://travis-ci.org/ryandrewjohnson/react-localize-redux"><img src="https://img.shields.io/travis/ryandrewjohnson/react-localize-redux/master.svg?style=flat-square"></a>
</p>


## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Features](#features)
- [API](#api)
- [Migrating from v1 to v2?](MIGRATING.md)

## Installation

```
npm install react-localize-redux --save
```

## Getting Started

### 1. Add `localeReducer` to redux store.

```javascript
...
import { localeReducer } from 'react-localize-redux';

const store = createStore(localeReducer);

const App = props => {
  return (
    <Provider store={ store }>
      ...
    </Provider>
  );
};
```

### 2. Set the supported languages

Dispatch [setLanguages](#setlanguageslanguages-defaultactivelanguage) action creator and pass in the languages for your app. By default the first language in the array will be set as the active language.

```javascript
import { setLanguages } from 'react-localize-redux';

const languages = ['en', 'fr', 'es'];
store.dispatch(setLanguages(languages));
```

To set a different default active language pass in the `language`.

```javascript
const languages = ['en', 'fr', 'es'];
store.dispatch(setLanguages(languages, 'fr'));
```

### 3. Add localized translation data

Typically you will store your translation data in json files, but the data can also be a vanilla JS object. Once your translation data is in the correct format use the [addTranslation](#addtranslationdata) action creator.

> NOTE: The following assumes you are using [webpack](https://webpack.github.io/) to bundle json

```javascript
import { addTranslation } from 'react-localize-redux';

const json = require('global.locale.json');
store.dispatch(addTranslation(json));
```

The json data should enforce the following format, where each translation string is a represented by a `{ key: value }` pair. 

The `value` is an array that should enforce the following...

* Include a translation for each language your app supports.
* The translation order matches the order of the languages in `setLanguages`.

```json
{
  "greeting": [
    "Hello",      (en)
    "Bonjour",    (fr)
    "Hola",       (es)
  ],
  "farwell": [
    "Goodbye",    (en)
    "Au revoir",  (fr)
    "Adiós"       (es)
  ]
}
```

### 4. Change the current language

Dispatch [setActiveLanguage](#setactivelanguagelanguage) action creator and pass the language.

```javascript
import { setActiveLanguage } from 'react-localize-redux';

store.dispatch(setActiveLanguage('fr'));
```

### 5. Translate components

If you have a component that is already using `connect` you can use the [getTranslate](#gettranslatestate) selector that returns the `translate` function. This function will return the localized string based on active language.

```javascript
import { getTranslate } from 'react-localize-redux';

const Greeting = ({ translate, currentLanguage }) => (
  <div>
    <h1>{ translate('greeting') }</h1>
    <button>{ translate('farwell') }</button>
  </div>
);

const mapStateToProps = state => ({
  translate: getTranslate(state),
  currentLanguage: getActiveLanguage(state).code
});

export default connect(mapStateToProps)(Greeting);
```

For components not already using `connect` instead use [localize](#localizecomponent). This will automatically connect your component with the `translate` function and `currentLanguage` prop. 

```javascript
import { localize } from 'react-localize-redux';

const Greeting = ({ translate, currentLanguage }) => (
  <div>
    <h1>{ translate('greeting') }</h1>
    <button>{ translate('farwell') }</button>
  </div>
);

export default localize(Greeting);
```

## Features

### Include HTML in translations

Include HTML in your translation strings and it will be rendered in your component.

```json
{
  "google-link": [
    "<a href='https://www.google.en/'>Google</a>",
    "<a href='https://www.google.fr/'>Google</a>"
  ]
}
```

### Add dynamic content to translations

You can insert dynamic content into your translation strings by inserting placeholders with the following format `${ placeholder }`.

```json
{
  "greeting": [
    "Hello ${ name }",
    "Bonjour ${ name }"
  ]
}
```

Then pass in the data you want to swap in for placeholders to the `translate` function.

```javascript
<h1>{ translate('greeting', { name: 'Testy McTest' }) }</h1>
```

### Supports nested translation data to avoid naming collisions

```json
{
  "welcome": {
    "greeting": [
      "Hello ${ name }!",
      "Bonjour ${ name }!"
    ]
  },
  "info": {
    "greeting": [
      "Hello",
      "Bonjour"
    ]
  }
}
```

```javascript
<h1>{ translate('welcome.greeting', { name: 'Testy McTest' }) }</h1>
<h1>{ translate('info.greeting') }</h1>
```

### Load translation data on demand

If you have a larger app you may want to break your translation data up into multiple files, or maybe your translation data is being loaded from a service. Either way you can call [addTranslation](#addtranslationdata) for each new translation file/service, and the new translation data will be merged with any existing data.

Also If you are using a tool like [webpack](https://webpack.js.org) for bundling, then you can use [async code-splitting](https://webpack.js.org/guides/code-splitting-async/) to split translations across bundles, and async load them when you need them.

## API

### `getTranslate(state)`

A selector that takes your redux `state` and returns the translate function. This function will have access to any and all translations that were added with [addTranslation](#addtranslationdata).

returns `(key, data) => LocalizedElement`

* `key: string` = The key for the transaltion string e.g. 'greeting'
* `data: object` = Pass data to your [dynamic translation](#add-dynamic-content-to-translations) string.

#### Usage: 

```javascript
const Greeting = ({ translate }) => <h1>{ translate('greeting', { name: 'Testy McTest' }) }</h1>

const mapStateToProps = state => ({ translate: getTranslate(state) });
export default connect(mapStateToProps)(Greeting);
```

### `getActiveLanguage(state)`

A selector that takes your redux `state` and returns the currently active language object.

returns `{ code: 'en', active: true }`;

#### Usage: 

```javascript
const Greeting = ({ currentLanguage }) => <h1>My language is: { currentLanguage }</h1>

const mapStateToProps = state => ({ currentLanguage: getActiveLanguage(state).code });
export default connect(mapStateToProps)(Greeting);
```

### `getLanguages(state)`

A selector that takes your redux `state` and returns the languages you set.

returns `[{ code: 'en', active: true }, { code: 'fr', active: false }]`;

#### Usage: 

```javascript
const LanguageSelector = ({ languages }) => (
  <ul>
    { languages.map(language => 
      <a href={ `/${ language.code }` }>{ language.code }</a>
    )}
  </ul>
)

const mapStateToProps = state => ({ languages: getLanguages(state) });
export default connect(mapStateToProps)(Greeting);
```

### `localize(Component)`

If you have a Component that is not using `connect` you can wrap it with `localize` to automatically add the `translate` function and `currentLanguage` prop.

#### Usage: 

```javascript
const Greeting = ({ translate, currentLanguage }) => (
  <span>
    <h1>languageCode: { currentLanguage }</h1>
    <h2>{ translate('greeting', { name: 'Testy McTest' }) }</h2>
  </span>
);
export default localize(Greeting);
```

### `setLanguages(languages, defaultActiveLanguage)`

**Redux action creator** to set which languages you are supporting in your translations. If `defaultActiveLanguage` is not passed then the first language in the `languages` array will be used.

#### Usage: 

```javascript
const languages = ['en', 'fr', 'es'];

store.dispatch(setLanguages(languages));

// if you wanted 'fr' to be default language instead of 'en'
store.dispatch(setLanguages(languages, 'fr'));
```

### `addTranslation(data)`

**Redux action creator** to add new translation data to your redux store. Typically this data will be loaded from a json file, but can also be a plain JS object as long as it's structured properly.

>**IMPORTANT:** The order of the translation strings in the array matters! The order **MUST** follow the order of the languages array passed to [setLanguages](#setlanguageslanguages-defaultactivelanguage).

#### Usage: 

```javascript
// assuming your app has set languages ['en', 'fr']
const welcomePageTranslations = {
  greeting: ['Hi!', 'Bonjour!'],
  farwell: ['Bye!', 'Au revoir!']
};

store.dispatch(addTranslation(welcomePageTranslations));
```

#### `setActiveLanguage(language)`

**Redux action creator** to change the current language being used.

#### Usage: 

```javascript
// assuming your app has set languages ['en', 'fr']
store.dispatch(setActiveLanguage('fr'));
```
