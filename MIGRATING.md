# Migrating from v1 to v2

1. Replace references to `setGlobalTranslations` and `setLocalTranslations` with the new `addTranslation` action creator.  

```javascript
const globalJson = require('global.locale.json');
const welcomeJson = require('welcome.locale.json');

// this...
store.dispatch(setGlobalTranslations(globalJson));
store.dispatch(setLocalTranslations('welcome', welcomeJson));

// changes to...
store.dispatch(addTranslation(globalJson));
store.dispatch(addTranslation(welcomeJson));
```

2. Use new `getTranslate` and `getActiveLanguage` selectors instead of `localize` for components that are already using connect.

```javascript
const MyComponent = ({ translate, currentLanguage }) => <div>{ translate('greeting') }</div>;

const mapStateToProps = state => ({
  translate: getTranslate(state),
  currentLanguage: getActiveLanguage(state).code
});

export default connect(mapStateToProps)(MyComponent);
```

3. If a component is not using connect, you can still use `localize`, but you will need to make the following updates.

```javascript
const MyComponent = ({ translate }) => <div>{ translate('greeting') }</div>;

// this...
export default localize('welcome')(MyComponent);

// changes to...
export default localize(MyComponent);
```

4. Update translation data format.

```json
// old format 
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

// new format
{
  "title": ["My Title", "My Title French"],
  "desc": ["My Description", "My Description French"]
}
```
