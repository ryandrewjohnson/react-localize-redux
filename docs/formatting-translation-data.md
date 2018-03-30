The translation data for you application will either come from json or vanilla JS, but in order for `react-localize-redux` to work with your data in needs to be in one of the following formats.

## Multiple language format

> Use **[addTranslation](/api/action-creators#addtranslationdata)** to add data in this format.

The data is an object where the property name is your translation key, and the value is an array of translations. The translation key is used to identify the translation, and the value is an array that enforces the following...

* Includes a translation for each language your app supports.
* The order of the translation strings in the array matters! The order **MUST** follow the order of the languages array passed to [setLanguages]([addTranslationForLanguage](/api/action-creators#addtranslationforlanguagedata-language)).

Assuming your application has dispatched `setLanguages('en', 'fr', 'es')`:

```json
{
  "greeting": [
    "Hello",      (en)
    "Bonjour",    (fr)
    "Hola",       (es)
  ],
  "farewell": [
    "Goodbye",    (en)
    "Au revoir",  (fr)
    "Adiós"       (es)
  ]
}
```



---------------



## Single language format

> Use **[addTranslationForLanguage](/api/action-creators#addtranslationforlanguagedata-language)** to add data in this format.

The data is an object where the property name is your translation key, and the value is the translation for the language. With the single language format you would dispatch `addTranslationForLanguage` for each language you support.

Assuming your application `setLanguages('en', 'fr', 'es')`:

```json
// en.json
{
  "greeting": "Hello",
  "farewell": "Goodbye"
}

// fr.json
{
  "greeting":"Bonjour",
  "farewell": "Au revoir"
}

// es.json
{
  "greeting": "Hola",
  "farewell": "Adiós"
}
```




---------------





## Custom data format

If you cannot use the supported data formats there is a way to instruct react-localize-redux on how to handle your custom data. To do this you must pass the [translationTransform](/api/action-creators#initialize-options) option when dispatching the [intialize](/api/action-creators#initializelanguages-options) action, which takes a function in the following format: 

```javascript
const transformationFunction = (translationData: Object, languagesCodes: string[]) => {
  // Your transformation logic goes here...
};
```

This function is responsible for taking your custom data, and transforming it into the format required by react-localize-redux. You are responsible for writing the transformation logic, but after that the function will be run automatically whenever dispatching [addTranslation](/api/action-creators#addtranslationdata).

<div class="admonition note">
  <p class="first admonition-title">Note</p>
  <p class="last">The transformation function will not be run if you use the <code><a href="/api/action-creators/#addtranslationforlanguagedata-language">addTranslationForLanguage</a></code> action.</p>
</div>

** Example **

For example if you had data in the following format that you wanted to use...

```javascript
const customTranslation = {
  en: {
    title: 'Title',
    subtitle: 'Subtitle'
  },
  fr: {
    title: 'FR - Title',
    subtitle: 'FR - Subtitle'
  }
};
```

You would need to transform it into this format to work with react-localize-redux.

```javascript
const translations = {
  title: ['Title', 'FR - Title'],
  subtitle: ['Subtitle', 'FR - Subtitle']
};
```

This is where the transformation function comes in - we need to write a function that takes the custom translationData and returns the react-localize-redux format. Here is an example of what that function could look like for the example custom data:

```javascript
const transformFunction = (translationData, languageCodes) => {
  return Object.keys(translationData).reduce((prev, cur, index) => {
    const languageData = data[cur];
    
    for(let prop in languageData) {
      const values = prev[prop] || [];
      prev[prop] = languageCodes.map((code, languageIndex) => {
        return index === languageIndex
          ? languageData[prop]
          : values[languageIndex];
      })
    }
  
    return prev;
  }, {});
};
```

Now when you dispatch the [intialize](/api/action-creators#initializelanguages-options) action make sure you set the [translationTransform](/api/action-creators#initialize-options) option equal to the `transformFunction`. Now anytime you dispatch the [addTranslation](/api/action-creators#addtranslationdata) action the `transformFunction` will run on the translation data you are adding.

```javascript
const languages = ['en', 'fr'];
store.dispatch(initialize(languages, { translationTransform: transformFunction }));

store.dispatch(addTranslation(customTranslation));
```





---------------





## Nested data format

Both types of translation data support nested data format to help with organization of translations, and avoiding naming collisions with translation keys.

** Multiple language format **

```json
{
  "welcome" {
    "banner": {
      "greeting": ["Hello", "Bonjour", "Hola"]
    },
    "footer": {
      "farewell": ["Goodbye", "Au revoir", "Adiós"]
    }
  }
}
```

** Single language format **

```json
// en.json
{
  "welcome" {
    "banner": {
      "greeting": "Hello"
    },
    "footer": {
      "farewell": "Goodbye"
    }
  }
}

// fr.json
{
  "welcome" {
    "banner": {
      "greeting": "Bonjour"
    },
    "footer": {
      "farewell": "Au revoir"
    }
  }
}

// es.json
{
  "welcome" {
    "banner": {
      "greeting": "Hola"
    },
    "footer": {
      "farewell": "Adiós"
    }
  }
}
```