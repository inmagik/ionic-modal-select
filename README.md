# ionic-modal-select

Modal select for Ionic Framework based on [$ionicModal](http://ionicframework.com/docs/api/service/$ionicModal/)

Demo [here](http://codepen.io/bianchimro/pen/epYYQO?editors=101)


## Features

* supports long list of object via collection-repeat
* supports unsetting the chosen value (optional)
* customizable modal classes, modal header and footer classes
* customizable buttons text

## Usage
<!--
Get the files from github or install from bower:
```
bower install ionic-modal-select
```
-->

Include `ionic-modal-select.js` or its minified version in your index.html:

```html

<script src="lib/ionic-color-picker/ionic-modal-select.js"></script>

```


Add the module `ionic-modal-select` to your application dependencies:

```javascript

angular.module('starter', ['ionic', 'ionic-modal-select'])


```


And you're ready to go.



## Directives

### modal-select

This directive will transform the element into a modal select: when clicking the element a  dialog will be open. For this to work the following conditions must apply:

* The element you use this directive must be clickable.
* The directive requires ngModel to be set on the element

The final value bound to your model will be determined as follow:

* if you set the attribute `option-getter` will be set as `getterFunction(selectedItem)`
* if you set the attribute `option-property` will be set as `selectedItem[propertyName]`
* otherwise it will be set as the full object


#### Options

option|meaning|accepted values|default
---|---|---|---
`options`|List of options to choose from|Array||
`option-getter`|Optional method to get the value from the chosen item|function|not set|
`option-property`|Optional property name to get as model value from the chosen item|string|not set|
`modal-class`|The class for the modal (set on `<ion-modal-view>`|string|''
`modal-title`|The title shown on the modal header|string|'Pick a color'
`header-footer-class`|The class for header and footer of the modal|string|'bar-stable'
`cancel-button`|Text of the button for closing the modal without changing the color|string|'Cancel'
`reset-button`|Text of the button for unsetting value in the modal dialog|string|'Reset'
`hide-reset`|Hides the button for unsetting value in the modal dialog|string. Set to 'true' for hiding the button|false
`use-collection-repeat`|Forces use of collection-repeat or ng-repeat for rendering options in the modal.| string "true", "false" | not set (automatically set according to number of options and `short-list-break` attribute)
`short-list-break`|The maximum number of item in list to be rendered with `ng-repeat`.(if `use-collection-repeat` is not set) If the list has a number of colors greater than this attribute it will be rendered with ionic `collection-repeat` directive instead. (see also `load-list-message` option)|integer|10
`load-list-message`|Message to be shown when loading a long list of color in the modal|string|'Loading'

<!--
### Examples


```html

```

More examples to come.

See this [codepen](http://codepen.io/bianchimro/pen/EVYgym?editors=101) for now.


## Support this project

This software package is available for free with a MIT license, but
if you find it useful and want support its development consider buying a copy on the [Ionic Marketplace](http://market.ionic.io/plugins/ionic-modal-select) for just a few bucks.
-->