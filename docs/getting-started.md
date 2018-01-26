## 1. Add reducer

<div class="admonition note">
  <p class="first admonition-title">Note</p>
  <p class="last">Although this example uses <strong>locale</strong> for the reducer name, you can change this to a name of your choosing. Just ensure that you use your name when passing the state to selectors.</p>
</div>

```javascript
import { createStore, combineReducers } from 'redux';
import { user } from './reducers';
import { localeReducer as locale } from 'react-localize-redux';

const store = createStore(combineReducers({ user, locale }));

const App = props => {
  return (
    <Provider store={ store }>
      ...
    </Provider>
  );
};
```


---------------


## 2. Initialize languages

Dispatch [initialize](api/action-creators#initializelanguages-options) action creator and pass in the languages for your app. By default the first language in the array will be set as the active language.

```javascript
import { initialize } from 'react-localize-redux';

const languages = ['en', 'fr', 'es'];
store.dispatch(initialize(languages));
```

To set a different default active language set the `defaultLanguage` option.

```javascript
const languages = ['en', 'fr', 'es'];
store.dispatch(initialize(languages, { defaultLanguage: 'fr' }));
```

If you want to associate a language name with each language code you can use the following format:

```javascript
const languages = [
  { name: 'English', code: 'en' },
  { name: 'French', code: 'fr' },
  { name: 'Spanish', code: 'es' }
];
store.dispatch(initialize(languages));
```


---------------



## 3. Add translation data

Typically you will store your translation data in json files, but the data can also be a vanilla JS object. 

In order to add translation data to your application there are two action creators available - [addTranslation](/api/action-creators#addtranslationdata) and [addTranslationForLanguage](/api/action-creators#addtranslationforlanguagedata-language). Which one you use will depend on which format your translation data is in - see [formatting translation data](/formatting-translation-data) for more information.

<div class="admonition note">
  <p class="first admonition-title">Note</p>
  <p class="last">The following assumes you are using <a href="https://webpack.github.io/" target="_blank">webpack</a> to bundle json</p>
</div>

** Multiple language format **

```javascript
import { addTranslation } from 'react-localize-redux';

const json = require('global.locale.json');
store.dispatch(addTranslation(json));
```

** Single language format **

```javascript
import { addTranslationForLanguage } from 'react-localize-redux';

const json = require('en.json');
store.dispatch(addTranslationForLanguage(json, 'en'));
```



---------------



## 4. Change language

Dispatch [setActiveLanguage](/api/action-creators#setactivelanguagelanguage) and pass the language.

```javascript
import { setActiveLanguage } from 'react-localize-redux';

store.dispatch(setActiveLanguage('fr'));
```


---------------



## 5. Translate components

If you have a component that is already using [connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) use [getTranslate](/api/selectors#gettranslatestate) in your `mapStateToProps` to add the [translate](/api/selectors#translatekey-string-string-data) function to your component's props.

```javascript
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

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

For components where you only need access to [translate](/api/selectors#translatekey-string-string-data) and `currentLanguage` you can use [localize](/api/higher-order-component#localizecomponent-reducername). This will automatically connect your component with the `translate` function and `currentLanguage` prop. 

<div class="admonition warning">
  <p class="first admonition-title">Warning</p>
  <p class="last">Components that use <strong>localize</strong> still use <a href="https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options" target="_blank">connect</a> behind the scenes, which means you will want to avoid overusing <strong>localize</strong>. Instead <a href="../features/#pass-multiple-translations-to-components">pass multiple translations to components</a> when possible.</p>
</div>

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
