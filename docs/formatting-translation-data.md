The translation data for you application will either come from json or vanilla JS, but in order for `react-localize-redux` to work with your data in needs to be in one of the following formats.

## Multiple language format

> Use **[addTranslation](../api/action-creators#addtranslationdata)** to add data in this format.

The data is an object where the property name is your translation key, and the value is an array of translations. The translation key is used to identify the translation, and the value is an array that enforces the following...

* Includes a translation for each language your app supports.
* The order of the translation strings in the array matters! The order **MUST** follow the order of the languages array passed to [setLanguages]([addTranslationForLanguage](../api/action-creators#addtranslationforlanguagedata-language)).

Assuming your application has dispatched `setLanguages('en', 'fr', 'es')`:

```json
{
  "greeting": [
    "Hello",      (en)
    "Bonjour",    (fr)
    "Hola",       (es)
  ],
  "farwell": [
    "Goodbye",    (en)
    "Au revoir",  (fr)
    "Adiós"       (es)
  ]
}
```



---------------



## Single language format

> Use **[addTranslationForLanguage](../api/action-creators#addtranslationforlanguagedata-language)** to add data in this format.

The data is an object where the property name is your translation key, and the value is the translation for the language. With the single language format you would dispatch `addTranslationForLanguage` for each language you support.

Assuming your application `setLanguages('en', 'fr', 'es')`:

```json
// en.json
{
  "greeting": "Hello",
  "farwell": "Goodbye"
}

// fr.json
{
  "greeting":"Bonjour",
  "farwell": "Au revoir"
}

// es.json
{
  "greeting": "Hola",
  "farwell": "Adiós"
}
```



---------------



## Nested data format

Both types of translation data support nested data format to help with organization of translations, and avoiding naming collisions with translation keys.

** Single language format **

```json
{
  "welcome" {
    "banner": {
      "greeting": ["Hello", "Bonjour", "Hola"]
    },
    "footer": {
      "farwell": ["Goodbye", "Au revoir", "Adiós"]
    }
  }
}
```

** Multiple language format **

```json
// en.json
{
  "welcome" {
    "banner": {
      "greeting": "Hello"
    },
    "footer": {
      "farwell": "Goodbye"
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
      "farwell": "Au revoir"
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
      "farwell": "Adiós"
    }
  }
}
```
