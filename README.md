# react-localize-redux
Dead simple localization for your React/Redux components. 

* Supports multiple languages
* Provides components with global and component specific translations
* Will render HTML tags included in translation copy
* With webpack code splitting translation json can be bundled with their component 

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [localize](#localize-translationid--wrappedcomponent-)
    - [currentlanguage](#currentlanguage)
    - [translate](#translate-id-)
  - [Redux Actions](#redux-actions)
    - [setGlobalTranslations](#setglobaltranslationsjson)
    - [setLocalTranslations](#setlocaltranslationsid-json)
  

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

Start by adding the `localeReducer` to your app's redux store. This will contain all your translations and the current language of your app.

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

Set the current language for your app by dispatching the `updateLanguage` action.

```javascript
import { updateLanguage } from 'react-localize-redux';

store.dispatch(updateLanguage('en'));
```

### Set global translations

Translations that are shared throughout the application are called `global` translations.
Assuming you have global transaltions stored in a file called `global.locale.json` you can add them
to your store by dispatching the `setGlobalTranslations` action.

> NOTE: The following assumes you are using [webpack](https://webpack.github.io/) with [json-loader](https://github.com/webpack/json-loader)

```javascript
import { setGlobalTranslations } from 'react-localize-redux';

const json = require("global.locale.json");
store.dispatch(setGlobalTranslations(json));
```

As mentioned above translations are stored in json files. Each json file requires that there be
a property for each supported language, where the property name would match the key passed to `updateLanguage`.

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

To access global translations in your component pass your component class as a param
to the `localize` function. It will not modify the component passed to it, but return a 
new component with new props `translate` and `currentLanguage` added.

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

export default localize()(Greeting);
```

### Set local translations

In addtion to `global` translations you can add additional ones called `local` translations.
These can be added to your redux store by dispatching the `setLocalTranslations` action.

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

```javascript
import { setLocalTranslations } from 'react-localize-redux';

const json = require("welcome.locale.json");
store.dispatch(setLocalTranslations('welcome', json));
```

To access `local` translations in your component you still use the `localize` function, 
but this time passing the id passed to `setLocalTranslations`.

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

export default localize('welcome')(Greeting);
```

## API

### localize( [translationId] )( WrappedComponent )

A HoC factory method that returns an enhanced version of the WrappedComponent with the additional props for 
adding localized copy to your component. 

To give your component access to only `global` translations leave `translationId`:

```javascript
const MyComponent = ({ translate }) => <div>{ translate('greeting') }</div>;
export default localize()(MyComponent);
```

To give your component access to both `global` and `local` translations provide a `translationId`. This `translationId` must match the `id` used by the [setLocalTranslations]() action creator.

```javascript
const MyComponent = ({ translate }) => <div>{ translate('title') }</div>;
export default localize('localId')(MyComponent);
```

The following additional props are provided to localized components: 

#### currentLanguage

The current language set in your application. See [updateLanguage]() on how to update current language.

#### translate( id ) 

This function is used to retrieve the localized string for your component for the provided `id` param. This `id` should match the name of 
the property from the json localization file.

For example if this was your json file:

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

and you wanted to add this copy to your component...

```html
<h1>{ translate('title') }</h1>
<p>{ translate('desc') }</p>
```

>NOTE: The json content that `translate` has access to will depend on the `translationId` passed to the `localize` method.

### Redux Actions

These redux actions are used to add any localized json data for your application.

#### setGlobalTranslations(json)

The global json should contain any localized content that will be shared by multiple components. 
By default all components created by [localize]() will have access to transaltion from this global json.

#### setLocalTranslations(id, json)

The local json should contain localized content specific to a component. This is especially useful when used 
in combination with react-router dynamic routing, and webpack code splitting features.
