## Do I have to connect every component that needs translations?

No you shouldn't have to connect every component. To avoid this add translate to a parent component, and then pass translations 
down to stateless child components as props. See the [pass multiple translations to components](/features/#pass-multiple-translations-to-components) feature on one way to accomplish this.

## What if my translation data isn't in the required format?

If you don't have control over the translation data for your application you can use the [translationTransform](/api/action-creators/#initializelanguages-options) option. 
This allows you to write a function that takes in your custom translation data, and outputs the data in the required format.
See [Custom data format](/formatting-translation-data/#custom-data-format) for documentaion.

## How does react-localize-redux differ from [react-intl](https://github.com/yahoo/react-intl)?

* **react-intl** is larger in size/complexity, and for good reason as it handles many things related to localization. e.g. Pluralization, currency. Where as with **react-localize-redux** you could still do pluralization, and currency, but you'd be writing the formatting functionality yourself. 
<br/>
<br/>
* **react-intl** doesn't work with Redux out of the box, and needs an additional library [react-intl-redux](https://github.com/ratson/react-intl-redux) to add support.
<br/>
<br/>
* For further discussion on this topic see [original github issue](https://github.com/ryandrewjohnson/react-localize-redux/issues/21).

