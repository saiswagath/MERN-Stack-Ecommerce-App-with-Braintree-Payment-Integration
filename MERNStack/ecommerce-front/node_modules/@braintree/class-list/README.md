# classList

A helper module for adding and removing classes from DOM nodes in browsers that do not natively support the `classList` property on DOM nodes.

## Installation

**npm**

```bash
npm install --save @braintree/class-list
```

This module uses commonjs. You must use a build tool such as [Browserify](http://browserify.org/) or [Webpack](https://webpack.js.org/) to include it in your frontend project.

## Usage

```js
var classList = require('@braintree/class-list');
```

### add

Adds a class to specified DOM node.

```js
var element = document.querySelector('#id');

element.className = 'some-class';

classList.add(element, 'any', 'number', 'of', 'classes', 'to', 'add');

element.className === 'some-class any number of classes to add';
```

### remove

Removes a class to specified DOM node.

```js
var element = document.querySelector('#id');

element.className = 'some-class some-other-class another-class';

classList.remove(element, 'some-class', 'another-class');

element.className === 'some-other-class';
```

### toggle

Toggles a class to specified DOM node. The first argument is the DOM node, the second is the class to toggle, and the third argument is a boolean for whether to add the class or remove it.

```js
var element = document.querySelector('#id');
var shouldAdd = function (className) {
  return element.className.indexOf(className) === -1;
}

element.className = 'some-class some-other-class';

classList.toggle(element, 'some-class', shouldAdd('some-class'));

element.className === 'some-other-class';

classList.toggle(element, 'some-class', shouldAdd('some-class'));

element.className === 'some-class some-other-class';
```

## Tests

```bash
npm test
```
