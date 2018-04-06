## 1. Add reducer

<div class="admonition note">
  <p class="first admonition-title">Note</p>
  <p class="last">By default <strong>react-localize-redux</strong> assumes the reducer is mounted under the <strong>locale</strong> key. TODO: ... instruct on how to add custom slice for Translate</p>
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

Dispatch [initialize](api/action-creators#initializelanguages-options) action creator with the languages you wish to support. By default the first language in the array will be set as the active language.

<div class="admonition note">
  <p class="first admonition-title">Note</p>
  <p class="last">Ensure you dispatch <strong>initialize</strong> before mounting any components that need translations. For example in your root component's <a href="https://reactjs.org/docs/react-component.html#constructor" target="_blank">constructor</a>.</p>
</div>

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

** Multiple language format **

```javascript
import { addTranslation } from 'react-localize-redux';

const translations = {
  greeting: ['Hello', 'Bonjour', 'Hola'],
  farewell: ['Goodbye', 'Au revoir', 'Adiós']
};

store.dispatch(addTranslation(translations));
```

** Single language format **

```javascript
import { addTranslationForLanguage } from 'react-localize-redux';

const english = {
  greeting: 'Hello',
  farewell: 'Goodbye'
};

const json = require('en.json');
store.dispatch(addTranslationForLanguage(english, 'en'));
```



---------------



## 4. Add translations to components

Once you've added your translation data you'll need a way to get it into your components. That is where the [Translate](api/translate/) component comes in and it comes in a couple different flavours.

** Flavour 1 **

The `id` prop should match the key of the translation data you want to insert. Any copy added as Translate's `children` will automatically be added to your translation data for that key under the default language. 

```javascript
import { Translate } from 'react-localize-redux';

const Greeting = props => (
  <h1><Translate id="greeting">Hello</Translate></h1>
);
```

You can include HTML markup as `children`, but ensure you include the same markup in your translation data. Since the default language's translation will automatically be pulled from Translate's `children` you can set it to `null`.

```javascript
import { Translate } from 'react-localize-redux';

const translations = {
  food: [
    null,
    '<ul><li>Lait</li><li>biscuits</li></ul>'
  ]
};

const Foods = props => (
  <Translate id="food">
    <ul>
      <li>Milk</li>
      <li>Cookies</li>
    </ul>
  </Translate>
);
```

You can insert translations with placeholder's for dynamic data.

```javascript
import { Translate } from 'react-localize-redux';

const Profile = props => (
  <Translate id="profile" data={{ name: 'Ted', date: new Date() }}>
    {'User: ${name} last login ${date}'}
  </Translate>
);
```
<br/>

** Flavour 2 - render prop function **

You can also pass Translate a function as it's child that returns the elements you want to render. This function is commonly referred to as a [render prop function](https://reactjs.org/docs/render-props.html), and is called with the following arguments:

name | Description
--------- | ------------
translate  | Same as value returned from [getTranslate](/api/selectors/#translatekey-string-string-data-options) selector.
activeLanguage | Same as value returned from [getActiveLanguage](/api/selectors/#getactivelanguagestate) selector.
languages | Same as value returned from [getLanguages](/api/selectors/#getlanguagesstate) selector.



```javascript
import { Translate } from 'react-localize-redux';

const LanguageSelector = props => (
  <Translate>
    {(translate, activeLanguage, languages) =>
      <div>
        <h2>{ translate('heading') } - ({ activeLanguage.code })</h2>
        <ul>
          {languages.map(languge =>
            <li>
              <a href={`/${language.code}`}>{ language.name }</a>
            </li>
          )}
        </ul>
      </div>
    }
  </Translate>
);
```

<br/>


** You can also access the translate function directly in connected components **


If you have a component that is already using [connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) use [getTranslate](/api/selectors#gettranslatestate) in your `mapStateToProps` to add the [translate](/api/selectors#translatekey-string-string-data) function to your component's props.

```javascript
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

const Greeting = ({ translate, currentLanguage }) => (
  <div>
    <h1>{ translate('greeting') }</h1>
    <button>{ translate('farewell') }</button>
  </div>
);

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  currentLanguage: getActiveLanguage(state.locale).code
});

export default connect(mapStateToProps)(Greeting);
```



---------------



## 5. Change language

Dispatch [setActiveLanguage](/api/action-creators#setactivelanguagelanguage) and pass the language.

```javascript
import { setActiveLanguage } from 'react-localize-redux';

store.dispatch(setActiveLanguage('fr'));
```