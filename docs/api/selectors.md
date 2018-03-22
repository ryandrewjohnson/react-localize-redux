## getTranslate(state)

A selector that takes the localeReducer slice of your `state` and returns the [translate](#translatekey-string-string-data) function. This function will have access to any and all translations that were added to your redux store.

** Arguments: **

name | Type | Description
--------- | ----------| ------------
state | any | The localeReducer slice of your state.

** Returns: **

Returns the [translate](#translatekey-string-string-data) function.

** Usage: **

```javascript
const Greeting = ({ translate }) => <h1>{ translate('greeting') }</h1>

const mapStateToProps = state => ({ translate: getTranslate(state.locale) });
export default connect(mapStateToProps)(Greeting);
```


--------------------



## translate(key: string | string[], [data], [options])

The [getTranslate](#gettranslatestate) selector will return the `translate` function, which is used to add localized strings to your connected React components. The translate function will return single, or multiple translations depending on the arguments passed. 

** Arguments: **

name | Type | Description
--------- | ----------| ------------
key | string \| string [] | Pass a single key or multiple keys from your translation data.
[data] | object | Optional data to be used in your localized strings for [variable replacement](/features/#insert-dynamic-content-into-translations).
[options]| object | Override `renderInnerHtml`, `defaultLanguage`, `missingTranslationMsg`, and `missingTranslationCallback` [initialize optons](/api/action-creators/#initializelanguages-options) for translation.

** Returns: **

If a single key is passed then a single localized value will be returned in one of the following formats:

* *if localized string contains HTML* a `ReactElement` will be returned.
* *if localized string contains NO HTML* a `string` will be returned.

If multiple keys are passed then multiple localized values will be returned in the following format:

```javascript
{
  'article.title': 'Article Title',
  'article.author': 'Ted Tedson',
  'article.desc': 'My awesome article description',
  'article.code': '<code>console.log("hi")</code>'
}
```

** Usage: **

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
    <!-- Instead of pulling translation based on activeLanguage, specify language using defaultLanguage option -->
    <p>{ translate('heading', null, { defaultLanguage: 'fr' }) }</p>
    <!-- override renderHtml option for this translation -->
    <p>{ translate('article.code', null, { renderInnerHtml: false }) }</p>
    <!-- pass multiple translations -->
    <Article { ...translate(['article.title', 'article.author', 'article.desc'], { name: 'Ted' }) } />
  </div>
);

const mapStateToProps = state => ({ translate: getTranslate(state.locale) });
export default connect(mapStateToProps)(Page);
```


--------------------


## getActiveLanguage(state)

A selector that takes the localeReducer slice of your `state` and returns the currently active language object.

** Arguments: **

name | Type | Description
--------- | ----------| ------------
state | any | The localeReducer slice of your state.

** Returns: **

The active language object 

```javascript
{ name: 'English', code: 'en', active: true }
```

** Usage: **

```javascript
const Greeting = ({ currentLanguage }) => <h1>My language is: { currentLanguage }</h1>

const mapStateToProps = state => ({ currentLanguage: getActiveLanguage(state.locale).code });
export default connect(mapStateToProps)(Greeting);
```


--------------------


## getLanguages(state)

A selector that takes the localeReducer slice of your `state` and returns the languages you set.

** Arguments: **

name | Type | Description
--------- | ----------| ------------
state | any | The localeReducer slice of your state.

** Returns: ** 

An array of language codes 

```javascript
[{ name: 'English', code: 'en', active: true }, { name: 'French', code: 'fr', active: false }]
```

** Usage: **

```javascript
const LanguageSelector = ({ languages }) => (
  <ul>
    { languages.map(language => (
      <a onClick={ () => { setActiveLanguage(language.code) }>{ language.name }</a>
    )}
  </ul>
);

const mapStateToProps = state => ({ languages: getLanguages(state.locale) });
export default connect(mapStateToProps, { setActiveLanguage })(Greeting);
```


--------------------



## getTranslations(state)

A selector that takes your redux `state` and returns all the translation data in your redux store.

** Arguments: **

name | Type | Description
--------- | ----------| ------------
state | any | The localeReducer slice of your state.

** Returns: ** 

An object containing all your translation data.
