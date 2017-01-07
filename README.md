# react-localize-redux

A HoC (higher-order component) to add multi-language support to your React/Redux components.

* Supports multiple languages
* Provides components with global and component specific translations
* Will render HTML tags included in translation copy
* With webpack code splitting translation json can be bundled with their component 

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)

## Installation

The following dependencies are required:

* [react](https://facebook.github.io/react/)
* [redux](https://github.com/reactjs/redux)
* [react-redux](https://github.com/reactjs/react-redux)
* [reselect](https://github.com/reactjs/reselect)  

```
npm install react-localize-redux --save
```

## Usage

Add the `localeReducer` to your app's redux store. This will contain all translations data as well as the setting for current language.

```javascript
import React from 'react';
import { createStore, combineReducers } from 'redux';
import ReactDOM from 'react-dom';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { localeReducer } from 'react-localize-redux';

const ROOT_NODE = document.getElementById('root');

const store = createStore(
  combineReducers({
    locale: localeReducer
  }),
);

const App = props => {
  return (
    <Provider store={ store }>
      ...
    </Provider>
  );
};

ReactDOM.render(<App />, ROOT_NODE);
```

### Setting the language

Set the current language for your app by dispatching the `updateLanguage` action creator.

```javascript
import { updateLanguage } from 'react-localize-redux';

store.dispatch(updateLanguage('en'));
```

### Set global translations

Translations that are shared between components are called `global` translations.
Assuming you have global transaltions stored in a file called `global.locale.json` you can add them
to your store by dispatching the `setGlobalTranslations` action creator.

> NOTE: The following assumes you are using [webpack](https://webpack.github.io/) with [json-loader](https://github.com/webpack/json-loader)

```javascript
import { setGlobalTranslations } from 'react-localize-redux';

const json = require("global.locale.json");
store.dispatch(setGlobalTranslations(json));
```

As mentioned above translation content is stored in json files. Each json file requires that there be
a property for each supported language, where the property name would match the language key passed to [updateLanguage]().

```json
{
  "en": {
    "greeting": "Hello",
    "farwell": "Goodbye"
  },
  "fr": {
    "greeting": "Bonjour",
    "farwell": "Au revoir"
  },
  "es": {
    "greeting": "Hola",
    "farwell": "Adiós"
  }
}
```
To add translations to a component you will need to decorate it with the `localize` function. By default
all components decorated with `localize` will have access to `global` translations. It will not modify your
component class, but instead returns a new localized component with new props `translate` and `currentLanguage` added.

The `translate` prop is a function that takes the unique id from the transaltion file as a param,
and will return the localized string based on `currentLanguage`.

```javascript
import React from 'react';
import { localize } from 'react-localize-redux';

const Greeting = ({ translate, currentLanguage }) => (
  <div>
    <h1>{ translate('greeting') }</h1>
    <p>The current language is { `${ currentLanguage }` }</p>
    <button>{ translate('farwell') }</button>
  </div>
);

// decorate your component with localize
export default localize()(Greeting);
```

### Set local translations

In addtion to `global` translations you can also include translations specific to your component called `local` translations.
Similar to global translations `local` transaltions are added using an action creator `setLocalTranslations`.

Assuming we have a component called `WelcomeView` with translations specific to it stored in a file named `welcome.locale.json`.

```json
{
  "en": {
    "welcome-body": "Here is some <strong>bold</strong> text."
  },
  "fr": {
    "welcome-body": "Voici un texte en <strong>gras</strong>"
  },
  "es": {
    "welcome-body": "Aquí le damos algunos texto en <strong>negrita</strong>"
  }
}
```

First you will load the local json data passing in a `translationId`, in this case `welcome`, followed by the json data.

```javascript
import { setLocalTranslations } from 'react-localize-redux';

const json = require("welcome.locale.json");
store.dispatch(setLocalTranslations('welcome', json));
```

To access `local` translations in your component you still use the `localize` function, 
but this time passing in the unique id that was used in `setLocalTranslations`.

> NOTE: In addition to the `local` translations you will still have access `global` translations as well.

```javascript
import React from 'react';
import { localize } from 'react-localize-redux';

const WelcomeView = ({ translate }) => (
  <div>
    <h1>{ translate('greeting') }</h1>
    <p>{ translate('welcome-body') }</p>
    <button>{ translate('farwell') }</button>
  </div>
);

// pass in the unique id for the local content you would like to add
export default localize('welcome')(Greeting);
```

## API

### localize( [translationId] )( WrappedComponent )

A HoC factory method that returns an enhanced version of the WrappedComponent with the additional props for 
adding localized content to your component. 

By calling `localize` with no params your WrappedComponent will only have access to `global` translations.

```javascript
const MyComponent = ({ translate }) => <div>{ translate('greeting') }</div>;
export default localize()(MyComponent);
```

By default all components decorated with `localize` will have access to `global` transaltions. To add additional transaltion
data that was added by [setLocalTranslations(translationId, json)](#setlocaltranslationsid-json) you will need pass the `translationId` as a param to `localize`.

```javascript
const MyComponent = ({ translate }) => <div>{ translate('title') }</div>;
export default localize('translationId')(MyComponent);
```

The following additional props are provided to localized components: 

#### currentLanguage

The current language set in your application. See [updateLanguage]() on how to update current language.

#### translate( id ) 

The translate will be used to insert translated copy in your component. The `id` param will need to match the property of the string you wish
to retrieve from your json translaion data.

For example if the below json file was added using either [setGlobalTranslations](#setglobaltranslationsjson) or [setLocalTranslations](#setlocaltranslationsid-json).

```json
{
  "en": {
    "title": "My Title",
    "desc": "My Description"
  },
  "fr": {
    "title": "My Title French",
    "desc": "My Description French"
  }
}
```

and this component had been decorated with [localize](#localize-translationid--wrappedcomponent-) you would access the json content like so...

```html
<h1>{ translate('title') }</h1>
<p>{ translate('desc') }</p>
```

>NOTE: The json content that `translate` has access to will depend on the `translationId` passed to the `localize` method.

### Redux Action Creators

The following action creators are avaialble:

#### updateLanguage(languageCode)

This will set the current language for your application, where `languageCode` should match the `languageCode` prop used in your translation json data.

#### setGlobalTranslations(json)

The global json should contain any localized content that will be shared by multiple components. 
By default all components created by [localize](#localize-translationid--wrappedcomponent-) will have access to transaltion from this global json.

#### setLocalTranslations(translationId, json)

The local json should contain localized content specific to a component. This is especially useful when used 
in combination with react-router dynamic routing, and webpack code splitting features.
