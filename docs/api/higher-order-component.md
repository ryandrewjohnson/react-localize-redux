## localize(Component, [reducerName])

<div class="admonition important">
  <p class="first admonition-title">Important</p>
  <p class="last">if your component is already using <a href="https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options" target="_blank">connect</a> then you should use the <a href="../selectors/#gettranslatestate">getTranslate</a>, and <a href="../selectors#getactivelanguagestate">getActiveLanguage</a> selectors instead of <code>localize</code>.</p>
</div>

If you have a component that just needs access to translations, and nothing else then you can use the `localize` higher-order function. When you pass your Component to localize it will automatically add [translate](selectors.md#translatekey-string-string-data) and `currentLanguage` to props. 

** Arguments: **

name | Type | Description
--------- | ----------| ------------
Component | ReactComponent | The localeReducer slice of your state.
[reducerName] | string | If you added localeReducer with [combineReducers](http://redux.js.org/docs/api/combineReducers.html) then you will need to pass the reducerName to localize.


** Returns: ** 

A higher-order React component that adds [translate](selectors.md#translatekey-string-string-data) and `currentLanguage` to props.

** Usage: **

```javascript
const Greeting = ({ translate, currentLanguage }) => (
  <span>
    <h1>languageCode: { currentLanguage }</h1>
    <h2>{ translate('greeting', { name: 'Testy McTest' }) }</h2>
  </span>
);
export default localize(Greeting, 'locale');
```