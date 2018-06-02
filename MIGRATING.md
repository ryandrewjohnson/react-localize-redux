# Migrating from v2 to v3

If you are migrating from v2 the first thing you need to decide whether you still need Redux.
If you don't need to have your translations in your Redux store, then you may consider following
the [Getting Started](https://ryandrewjohnson.github.io/react-localize-redux-docs/#getting-started) docs for the non-redux implementation guide.

For a list of all breaking changes see the [Change Log](CHANGELOG.md).

## Add Reducer

If you're no longer using redux then you no longer need to `createStore`, which means you don't need a reducer. If you are planning
on sticking with Redux the reducer function is now exported as `localizeReducer` instead of `localeReducer`.

### v2

```jsx
import { createStore, combineReducers } from 'redux';
import { user } from './reducers';
import { localeReducer as locale } from 'react-localize-redux';

const store = createStore(combineReducers({ user, locale }));
```

### v3

```jsx
import { createStore, combineReducers } from 'redux';
import { localizeReducer } from 'react-localize-redux';

const store = createStore(
  combineReducers({
    user,
    localize: localizeReducer
  })
);
```

## Add LocalizeProvider

There is no longer a dependency on `react-redux`'s `<Provider />`. Instead you will need to wrap your app with [LocalizeProvider](https://ryandrewjohnson.github.io/react-localize-redux-docs/#localizeprovider).

### v2

```jsx
import React from 'react';
import { createStore, combineReducers } from 'redux';
import { user } from './reducers';
import { localeReducer as locale } from 'react-localize-redux';

const store = createStore(combineReducers({ user, locale }));

const App = props => {
  return <Provider store={store}>...</Provider>;
};
```

### v3

> Note: If you're not using redux then you don't need to pass `store` to LocalizeProvider

```jsx
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import { LocalizeProvider, localizeReducer } from 'react-localize-redux';
import Main from './Main';

const store = createStore(combineReducers({ user, locale }));

const App = props => (
  <LocalizeProvider store={store}">
    <Router>
      <Route path="/" component={Main} />
    </Router>
  </LocalizeProvider>
);

render(<App />, document.getElementById('root'));
```

## Initialize

### v2

```jsx
import { initialize } from 'react-localize-redux';

const languages = ['en', 'fr', 'es'];
store.dispatch(initialize(languages));
```

### v3

You no longer need to dispatch actions in v3. Instead you need to wrap you component with the [withLocalize](https://ryandrewjohnson.github.io/react-localize-redux-docs/#withlocalize) higher-order component.
This will add all the props from [LocalizeContext](https://ryandrewjohnson.github.io/react-localize-redux-docs/#localizecontext) to your component including [initialize](https://ryandrewjohnson.github.io/react-localize-redux-docs/#initialize).

You are also required to pass a reference to ReactDOMServer's [renderToStaticMarkup](https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup)
as an option to `initialize`. See [Why do I need to pass renderToStaticMarkup to initialize?](https://ryandrewjohnson.github.io/react-localize-redux-docs/#why-do-i-need-to-pass-rendertostaticmarkup-to-initialize) for more info.

```jsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import globalTranslations from './translations/global.json';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.props.initialize({
      languages: [
        { name: 'English', code: 'en' },
        { name: 'French', code: 'fr' }
      ],
      translation: globalTranslations,
      options: { renderToStaticMarkup }
    });
  }

  render() {
    // render Main layout component
  }
}

export default withLocalize(Main);
```

## Add translation data

### v2

```jsx
import { addTranslation } from 'react-localize-redux';
import { addTranslationForLanguage } from 'react-localize-redux';

const translations = {
  greeting: ['Hello', 'Bonjour', 'Hola'],
  farewell: ['Goodbye', 'Au revoir', 'Adiós']
};

store.dispatch(addTranslation(translations));
```

### v3

To add multi language translations, use addTranslation:

```jsx
import React from 'react';
import { withLocalize } from 'react-localize-redux';
import movieTranslations from './translations/movies.json';

class Movies extends React.Component {
  constructor(props) {
    super(props);

    this.props.addTranslation(movieTranslations);
  }

  render() {
    // render movie component
  }
}

export default withLocalize(Movies);
```

To add single language translations, use addTranslationForLanguage:

```jsx
import frenchMovieTranslations from './translations/fr.movies.json';

this.props.addTranslationForLanguage(frenchMovieTranslations, 'fr');
```

## Change language

### v2

```jsx
import { setActiveLanguage } from 'react-localize-redux';

store.dispatch(setActiveLanguage('fr'));
```

### v3

```jsx
import React from 'react';
import { withLocalize } from 'react-localize-redux';

const LanguageToggle = ({ languages, activeLanguage, setActiveLanguage }) => (
  <ul className="selector">
    {languages.map(lang => (
      <li key={lang.code}>
        <button onClick={() => setActiveLanguage(lang.code)}>
          {lang.name}
        </button>
      </li>
    ))}
  </ul>
);

export default withLocalize(LanguageToggle);
```

## onMissingTranslation initialize option

If you are using any of the below `initialize` options from v2 they are no longer available as they can all be covered by
the new [onMissingTranslation](https://ryandrewjohnson.github.io/react-localize-redux-docs/#initialize) option.

Instead of `showMissingTranslationMsg = false`:

```jsx
import { renderToStaticMarkup } from 'react-dom/server';

this.props.initialize({
  languages: [{ name: 'English', code: 'en' }, { name: 'French', code: 'fr' }],
  options: {
    renderToStaticMarkup,
    onMissingTranslation: () => ''
  }
});
```

Instead of `missingTranslationMsg`:

```jsx
import React from 'react';
import { Translate } from 'react-localize-redux';

const onMissingTranslation = ({ translationId, languageCode }) => {
  return `Nada for ${translationId} - ${languageCode}`;
};

const Missing = props => (
  <Translate id="missing" options={{ onMissingTranslation }} />
);
```

Instead of `missingTranslationCallback` just add your callback to `onMissingTranslation` function.

## The `translationTransform` option has moved

The `translationTransform` option is no longer available as an `initialize` option. Instead you can
pass [translationTransform](https://ryandrewjohnson.github.io/react-localize-redux-docs/#custom-translation-format) as an option to [addTranslation](https://ryandrewjohnson.github.io/react-localize-redux-docs/#addtranslation) as an option. This allows you to target a transform to specific translation data instead of applying translations globally.

```jsx
import React from 'react';
import { withLocalize } from 'react-localize-redux';

const transformFunction = (
  translationData: Object,
  languagesCodes: string[]
) => {
  // Your transformation logic goes here...
};

class CustomStuff extends React.Component {
  constructor(props) {
    super(props);

    this.props.addTranslation(customTranslation, {
      translationTransform: transformFunction
    });
  }
}

export default withLocalize(CustomStuff);
```

## The `renderInnerHtml` option is now set to `false` by default

If you have HTML markup in your translations then you will need to set this to true. This is to mirror React's functionality where by default any HTML will be escaped by defualt.

## localize has been removed

The `localize` higher-order component has been removed. Instead use the new [withLocalize](https://ryandrewjohnson.github.io/react-localize-redux-docs/#withlocalize) higher-order component to get access
to [activeLanguage](https://ryandrewjohnson.github.io/react-localize-redux-docs/#activelanguage), and the [Translate](https://ryandrewjohnson.github.io/react-localize-redux-docs/#translate-2) component
instead of `translate` function.

## Other changes

* [Translate](https://ryandrewjohnson.github.io/react-localize-redux-docs/#render-props-api) render props API now takes a single options object as an argument instead of multiple arguments.

* If using Redux, all state related to localize will be added under the `localize` key instead of `locale`.
