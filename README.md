# react-localize-redux
Dead simple localization for your React/Redux components. 

* Supports multiple languages
* Provide components with global and component specific translations
* With webpack code splitting translations can be bundled with their component 

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

Start by adding the `localeReducer` to your app's redux store.

```
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

Next set the current language for your app by dispatching the `updateLanguage` action.

```
import { updateLanguage } from 'react-localize-redux';

store.dispatch(updateLanguage('en'));
```

Translations that are shared throughout the application are called `global` translations.
Assuming you have global transaltions stored in a file called `global.locale.json` you can add them
to your store by dispatching the `setGlobalTranslations` action.

> NOTE: The following assumes you are using [webpack](https://webpack.github.io/) with [json-loader](https://github.com/webpack/json-loader)

```
import { setGlobalTranslations } from 'react-localize-redux';

const json = require('global.locale.json`);
store.dispatch(setGlobalTranslations(json));
```

As mentioned above translations are stored in json files. Each json file requires that there be
a property for each supported language, where the property name would match the key passed to `updateLanguage`.

```
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
and will return the localized sting based on `currentLanguage`.

```
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
In addtion to `global` translations you can add additional translations called `local` translations.
These can be added to your redux store by dispatching the `setLocalTranslations` action.

Assuming we have a component called `WelcomeView` with translations specific to it stored in a file named `welcome.locale.json`.

```
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

```
import { setLocalTranslations } from 'react-localize-redux';

const json = require('welcome.locale.json`);
store.dispatch(setLocalTranslations('welcome', json));
```

To access `local` translations in your component you still use the `localize` function, 
but this time passing the id passed to `setLocalTranslations`.

> NOTE: In addition to the `local` translations you will still have access `global` translations as well.

```
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