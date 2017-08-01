![React Localize Redux](https://cdn-images-1.medium.com/max/600/1*3Hg5LMvLmWCmEg-ICeUtjg.png)

A collection of helpers for managing localized content in your React/Redux application. 

<p>
  <a href="https://www.npmjs.com/package/react-localize-redux"><img src="https://img.shields.io/npm/dm/react-localize-redux.svg?style=flat-square"></a>
  <a href="https://travis-ci.org/ryandrewjohnson/react-localize-redux"><img src="https://img.shields.io/travis/ryandrewjohnson/react-localize-redux/master.svg?style=flat-square"></a>
</p>


## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Features](#features)
- [API](https://ryandrewjohnson.github.io/react-localize-redux/)
- [Dead simple localization for your React components](https://medium.com/@ryandrewjohnson/adding-multi-language-support-to-your-react-redux-app-cf6e64250050)
- [Migrating from v1 to v2?](MIGRATING.md)

## Installation

```
npm install react-localize-redux --save
```

## Getting Started

### 1. Add `localeReducer` to redux store.

> NOTE: Although the example uses the `locale` prop for the reducer, you can name this prop whatever you like. Just ensure that you use the correct prop name when passing the state to selectors.

```javascript
...
import { createStore, combineReducers } from 'redux';
import { localeReducer } from 'react-localize-redux';

const store = createStore(combineReducers({
  locale: localeReducer
}));

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
  translate: getTranslate(state.locale),
  currentLanguage: getActiveLanguage(state.locale).code
});

export default connect(mapStateToProps)(Greeting);
```

For components not already using `connect` instead use [localize](#localizecomponent-slice). This will automatically connect your component with the `translate` function and `currentLanguage` prop. 

```javascript
import { localize } from 'react-localize-redux';

const Greeting = ({ translate, currentLanguage }) => (
  <div>
    <h1>{ translate('greeting') }</h1>
    <button>{ translate('farwell') }</button>
  </div>
);

export default localize(Greeting, 'locale');
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

### Pass multiple translations to child components

A parent component that has added the `translate` function by using [getTranslate](#gettranslatestate) or [localize](#localizecomponent-slice) can easily pass multiple translations down to it's child components. Just pass the `translate` function an array of translation keys instead of a single key. 

```json
{
  "heading": ["Heading", "Heading French"],
  "article": {
    "title": ["Title", "Title French"],
    "author": ["By ${ name }", "By French ${ name }"],
    "desc": ["Description", "Description French"]
  }
}
```

```javascript
const Article = props => (
  <div>
    <h2>{ props['article.title'] }</h2>
    <h3>{ props['article.author'] }</h3>
    <p>{ props['article.desc'] }</p>
  </div>
);

const Page = ({ translate }) => (
  <div>
    <h1>{ translate('heading') }</h1>
    <Article { ...translate(['article.title', 'article.author', 'article.desc'], { name: 'Ted' }) } />
  </div>
);
```

### Load translation data on demand

If you have a larger app you may want to break your translation data up into multiple files, or maybe your translation data is being loaded from a service. Either way you can call [addTranslation](#addtranslationdata) for each new translation file/service, and the new translation data will be merged with any existing data.

Also If you are using a tool like [webpack](https://webpack.js.org) for bundling, then you can use [async code-splitting](https://webpack.js.org/guides/code-splitting-async/) to split translations across bundles, and async load them when you need them.
