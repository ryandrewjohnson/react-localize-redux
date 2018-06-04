<p align="center">
  <a href="https://github.com/ryandrewjohnson/react-localize-redux">
    <img alt="React Localize" src="https://ryandrewjohnson.github.io/react-localize-redux-docs/images/react-localize-redux-new.png">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-localize-redux">
    <img src="https://img.shields.io/npm/dm/react-localize-redux.svg?style=flat-square">
  </a>
  <a href="https://travis-ci.org/ryandrewjohnson/react-localize-redux">
    <img src="https://img.shields.io/travis/ryandrewjohnson/react-localize-redux/master.svg?style=flat-square">
  </a>
  <a href="https://codecov.io/gh/ryandrewjohnson/react-localize-redux">
    <img src="https://codecov.io/gh/ryandrewjohnson/react-localize-redux/branch/master/graph/badge.svg" />
  </a>
</p>

---

Localization library for handling translations in [React](https://facebook.github.io/react).

* Does not require [Redux](https://redux.js.org/), but does provide out of the box support for it.
* Built on React's native [Context](https://reactjs.org/docs/context.html).
* [Include inline default translations](https://ryandrewjohnson.github.io/react-localize-redux-docs/#include-inline-default-translations)
* [Dynamic translations](https://ryandrewjohnson.github.io/react-localize-redux-docs/#dynamic-translations)
* [HTML translations](https://ryandrewjohnson.github.io/react-localize-redux-docs/#html-translations)
* [Plus more...](https://ryandrewjohnson.github.io/react-localize-redux-docs/#guides)

## Installation

```
npm install react-localize-redux --save
```

## Documentation

The official documentation can be found [online](https://ryandrewjohnson.github.io/react-localize-redux-docs/), and is divided into the following sections:

* [Getting Started](https://ryandrewjohnson.github.io/react-localize-redux-docs/#getting-started)
* [Formatting Translations](https://ryandrewjohnson.github.io/react-localize-redux-docs//#formatting-translations)
* [Guides](https://ryandrewjohnson.github.io/react-localize-redux-docs/#guides)
* [FAQ](https://ryandrewjohnson.github.io/react-localize-redux-docs/#faq)
* [API Reference](https://ryandrewjohnson.github.io/react-localize-redux-docs/#api-reference)
* [Migrating from v2 to v3](MIGRATING.md)

## Demo

[Code Sandbox Demo](https://codesandbox.io/s/14xp1xy9ql)

## Not using React 16?

If you are unable to upgrade to at least react `v16.0.0` in your app you do have the ability to use an
older version of react, but should only be used as a last resort. The [Translate](https://ryandrewjohnson.github.io/react-localize-redux-docs/#translate-2) component
requires the ability to render [fragments and strings](https://reactjs.org/blog/2017/09/26/react-v16.0.html#new-render-return-types-fragments-and-strings), which isn't available in older versions of react. See [Can I use older versions of React?](https://ryandrewjohnson.github.io/react-localize-redux-docs/#can-i-use-older-versions-of-react) for workarounds to this issue.

## Contributing

Want to help? Contributions are welcome, but please be sure before submitting a pull request that you
have first opened an issue to discuss the work with the maintainers first. This will ensure we're all
on the same page before any work is done.

**For additional info:**

* See [Issue Template](.github/ISSUE_TEMPLATE.md).
* See [Pull Request Templete](.github/PULL_REQUEST_TEMPLATE.md).

## Change Log

This project adheres to [Semantic Versioning](https://semver.org/).
Every release will be [documented](CHANGELOG.md) along with any breaking changes when applicable.
