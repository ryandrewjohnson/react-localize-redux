## Translate

The `<Translate />` component is the recommended way to access translations in your components.

** props: **

name | Type | Description
--------- | ----------| ------------
id | string | Pass the key of the translation data you want to insert.
data | object | Optional data to be used in your localized strings for [variable replacement](/features/#insert-dynamic-content-into-translations).
options | object | Override `renderInnerHtml`, `defaultLanguage`, `missingTranslationMsg`, and `missingTranslationCallback` [initialize optons](/api/action-creators/#initializelanguages-options) for translation.


** Usage: **

If you want to include your default language's translations in your component you can pass the translations as `children` to the `<Translate />` component. These translations will automatically be added to your redux store's translation data.

```javascript
import { addTranslation } from 'react-localize-redux';

const translations = {
  greeting: [
    null, // default language translation will pull from Translate's children
    'Bonjour'
  ],
  farewell: [
    'goodbye',
    'Au revoir'
  ],
  food: [
    null,
    '<ul><li>Lait</li><li>biscuits</li></ul>'
  ],
  date: [
    null,
    'La date d\'aujourd\'hui est ${date}'
  ]
};

store.dispatch(addTranslation(translations));
```

Here we access the translations we added above:

```javascript
import { Translate } from 'react-localize-redux';

const Welcome = props => (
  <div>
    <!-- 
      'Hello' would be inserted into translation data under the 
      default language for 'greeting' key.
    -->
    <Translate id="greeting">Hello</Translate>

    <!-- 
      Overide 'goodbye' with 'Bye Bye!' in translation data under the
      default language for 'farewell' key.
    -->
    <Translate id="farewell">Bye Bye!</Translate>

    <!-- 
      If you don't include the default translation in Translate's children
      you will need to ensure you have set a value in your translation data.
      In this case default translation would use 'goodbye' from translation data.
    -->
    <Translate id="farewell" />

    <!-- 
      You can include HTML markup as children, but ensure you include 
      the same markup in your translation data.
    -->
    <Translate id="food">
      <ul>
        <li>Milk</li>
        <li>Cookies</li>
      </ul>
    </Translate>

    <!-- 
      You can insert translations with placeholder's for dynamic data.
      Then pass data in using data prop.
    -->
    <Translate id="date" data={{date: new Date()}}>
      {'Today\'s date is ${date}'}
    </Translate>

    <!-- 
      You can override initialize options using the options prop.
      Overriding renderInnerHtml to false to avoid rendering HTML markup.
    -->
    <Translate id="food" options={{renderInnerHtml: false}}>
      <ul>
        <li>Milk</li>
        <li>Cookies</li>
      </ul>
    </Translate>
  </div>
);
```

You can also pass Translate a function as it's child that returns the elements you want to render. This function is commonly referred to as a [render prop function](https://reactjs.org/docs/render-props.html), and is called with the following arguments:

name | Description
--------- | ------------
translate  | Same as value returned from [getTranslate](/api/selectors/#translatekey-string-string-data-options) selector.
activeLanguage | Same as value returned from [getActiveLanguage](/api/selectors/#getactivelanguagestate) selector.
languages | Same as value returned from [getLanguages](/api/selectors/#getlanguagesstate) selector.

```javascript
import { Translate } from 'react-localize-redux';

const Welcome = props => (
  <Translate>
    {(translate, activeLanguage, languages) => 
      <div>
        <h1>The active language is: {activeLanguage.name}</h2>

        <h2>Languages:</h2>
        <ul>
          {languages.map(language =>
            <li>{language.name} - {language.code}</li>
          )}
        </ul>

        <p>{ translate('greeting') }</p>
        <p>{ translate('farewell') }</p>
        <p>{ translate('date', {date: new Date()}) }</p>
        <p>{ translate('food', null, {renderInnerHtml: false}) }</p>
      </div>
    }
  </Translate>
);
```