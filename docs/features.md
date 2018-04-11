## Keep default translations in your components

If you are directly using the [translate](/api/selectors/#translatekey-string-string-data-options) function then your component might look something like this:

```javascript
import { getTranslate } from 'react-localize-redux';

const Heading = ({ translate }) => (
  <h1>{ translate('heading-01') }</h1>
);

const mapStateToProps = state => ({ translate: getTranslate(state.locale) });

export default connect(mapStateToProps)(Greeting);
```

Now the above works well enough, but beyond the key name of `heading-01` you have no context for the translation copy that will be inserted. With the 
[Translate](/api/translate/#translate) component you can include your default language's translation directly in the component, which can help with context, searching, and debugging.

```javascript
import { Translate } from 'react-localize-redux';

export const Heading = ({ translate }) => (
  <h1>
    <Translate id="heading-01">Here is my English heading</Translate>
  </h1>
);
```

------------



## Pass multiple translations to components

To retrieve multiple translations using [translate](/api/selectors#translatekey-string-string-data) pass an array of translation keys instead of a single key. This will return an object with translated strings mapped to translation keys.

Since `translate` returns an object we can use the object spread operator to pass the translations as props for the `<Article>` component.

```javascript
const translationData = {
  heading: ["Heading", "Heading French"],
  article: {
    title: ["Title", "Title French"],
    author: ["By ${ name }", "By French ${ name }"],
    desc: ["Description", "Description French"]
  }
};

const Page = ({ translate }) => (
  <div>
    <h1>{ translate('heading') }</h1>
    <Translate>
      {translate => 
        <Article { ...translate(['article.title', 'article.author', 'article.desc'], { name: 'Ted' }) } />
      }
    </Translate>
  </div>
);

const Article = props => (
  <div>
    <h2>{ props['article.title'] }</h2>
    <h3>{ props['article.author'] }</h3>
    <p>{ props['article.desc'] }</p>
  </div>
);
```


---------------



## Insert dynamic content into translations

Insert dynamic content into your translation strings by inserting placeholders with the following format `${ placeholder }`.

```json
{
  "greeting": [
    "Hello ${ name }",
    "Bonjour ${ name }"
  ]
}
```

** Using Translate component **

Use the **data** attribute to pass the data you want to swap in for placeholders.

```javascript
<h1>
  <Translate id="greeting" data="Testy McTest">
    {`Hello ${ name }`}
  </Translate>
</h1>
```

** Using translate function **

Pass in the data you want to swap in for placeholders to the [translate](/api/selectors#translatekey-string-string-data) function.

```javascript
<h1>{ translate('greeting', { name: 'Testy McTest' }) }</h1>
```


---------------



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



---------------



### Handle custom translation data

Does react-localize-redux's supported translation data formats not work for you? That's ok - there is a way for you to use your own custom trnaslation data format. See [Formatting Transltion Data - Custom data format](/formatting-translation-data/#custom-data-format) for full documentation.



---------------



### Avoid naming collisions with nested translation data

** Multiple language format **

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

** Single language format **

```json
{
  "welcome": {
    "greeting": "Hello ${ name }!"
  },
  "info": {
    "greeting": "Hello"
  }
}
```

```javascript
<h1>{ translate('welcome.greeting', { name: 'Testy McTest' }) }</h1>
<h1>{ translate('info.greeting') }</h1>
```


---------------


## Custom missing translation messages

By default when a translation isn't found the following message will be rendered in it's place: `'Missing translation key ${ key } for language ${ code }'`. Where `key` will be the missing translation key, and `code` will be the language code.

You can also override this message with a custom message by passing in your own [missingTranslationMsg](/api/action-creators/#initialize-options) option.

** Example **

```javascript
import { initialize } from 'react-localize-redux';

const languages = ['en', 'fr', 'es'];

// just like the default message you can include the ${key} and ${code} placeholders
const missingTranslationMsg = 'Oh man you missed translation: ${key} for language ${code}!';

store.dispatch(initialize(languages, { missingTranslationMsg }));

// Assuming there is no translation for "missing-key" doesn't exist it would render following:
// <h1>Oh man you missed translation: missing-key for language en!</h1>
const MyComponent = props => <h1><Translate id="missing-key">No translations here!</Translate></h1>;

// You also have the option to override the global missingTranslationMsg option
// by passing a custom message directly to the translate function
 const missingTranslationMsg = 'Whoops! Missing translation!';
 const AnotherComponent = props => 
  <h1>
    <Translate id="missing-key" options={{ missingTranslationMsg }}>Missing!</Translate>
  </h1>;
```


---------------

## Missing translations callback

If you need a way to detect missing translations you can set the [missingTranslationCallback](/api/action-creators/#initialize-options) option. When set this callback will be triggered anytime the [translate](/api/selectors/#translatekey-string-string-data-options) function detects an `undefined` translation.

```javascript
/**
 * The callback function will be called with the following arguments:
 * key - The key that was passed to the translate function
 * languageCode - The language code for the currently active language.
 */
const onMissingTranslation = (key, languageCode) => {
  // here you can do whatever you want e.g. call back end service that will
  // send email to translation team
};

store.dispatch(initialize(languages), { missingTranslationCallback: onMissingTranslation });
```

---------------


## Load translation data on demand

If you have a larger app you may want to break your translation data up into multiple files, or maybe your translation data is being loaded from a service. You can call [addTranslation](#addtranslationdata) for each new translation file/service, and the new translation data will be added to your Redux store.

Also If you are using a tool like [webpack](https://webpack.js.org) for bundling, then you can use [async code-splitting](https://webpack.js.org/guides/code-splitting-async/) to split translations across bundles, and async load them when you need them.
