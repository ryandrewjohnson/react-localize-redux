<p>
  <a href="https://github.com/ryandrewjohnson/react-localize-redux">
    <img alt="React Localize" src="https://ryandrewjohnson.github.io/react-localize-docs/images/react-localize-redux-new.png">
  </a>
</p>

</hr>

<p>
  <a href="https://www.npmjs.com/package/react-localize-redux"><img src="https://img.shields.io/npm/dm/react-localize-redux.svg?style=flat-square"></a>
  <a href="https://travis-ci.org/ryandrewjohnson/react-localize-redux"><img src="https://img.shields.io/travis/ryandrewjohnson/react-localize-redux/master.svg?style=flat-square"></a>
</p>


Localization library for handling translations in [React](https://facebook.github.io/react).

* Does not require [Redux](https://redux.js.org/), but does provide out of the box support for it.
* Built on React's native [Context](https://reactjs.org/docs/context.html).
* [Include inline default translations](https://ryandrewjohnson.github.io/react-localize-docs/#include-inline-default-translations)
* [Dynamic translations](https://ryandrewjohnson.github.io/react-localize-docs/#dynamic-translations)
* [HTML translations](https://ryandrewjohnson.github.io/react-localize-docs/#html-translations)
* Plus more...



## Installation

```
npm install react-localize-redux --save
```

## Documentation

The official documentation can be found [online](https://ryandrewjohnson.github.io/react-localize-docs/), and is divided into the following sections:

* [Getting Started](https://ryandrewjohnson.github.io/react-localize-docs/#getting-started)
* [Formatting Translations](https://ryandrewjohnson.github.io/react-localize-docs/#formatting-translations)
* [Guides](https://ryandrewjohnson.github.io/react-localize-docs/#guides)
* [FAQ](https://ryandrewjohnson.github.io/react-localize-docs/#faq)
* [API Reference](https://ryandrewjohnson.github.io/react-localize-docs/#api-reference)

## Not using React 16?

If you are unable to upgrade to at least react `v16.0.0` in your app you do have the ability to use an
older version of react, but should only be used as a last resort. The [Transalte](https://ryandrewjohnson.github.io/react-localize-docs/#translate-2) component 
requires the ability to render [fragments and strings](https://reactjs.org/blog/2017/09/26/react-v16.0.html#new-render-return-types-fragments-and-strings), which isn't available in older versions of react. See [Can I use older versions of React?](https://ryandrewjohnson.github.io/react-localize-docs/#can-i-use-older-versions-of-react) for workarounds to this issue.

## Contributing