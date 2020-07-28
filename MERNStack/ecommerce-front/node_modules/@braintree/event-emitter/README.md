# event-emitter

A helper module for creating objects with event emitter capabilities.

## Installation

**npm**

```bash
npm install --save @braintree/event-emitter
```

This module uses commonjs. You must use a build tool such as [Browserify](http://browserify.org/) or [Webpack](https://webpack.js.org/) to include it in your frontend project.

## Usage

### Creating an Object that Inherits from Event Emitter

```js
var EventEmitter = require('@braintree/event-emitter');

function MyClass () {
  EventEmitter.call(this);
}

MyClass.prototype = EventEmitter.createChild(MyClass);
```

### Listen for events 

```js
var obj = new MyClass();

obj.on('event-name', function (data) {
  console.log('called with', data.payload, '!');
});

obj._emit('event-name', {payload: 'foo'}); // logs "called with foo!"
```

### Unsubscribe from events 

```js
var obj = new MyClass();
var cb = function () {};

obj.on('event-name', cb);
obj.off('event-name', cb);

obj._emit('event-name', {payload: 'foo'}); // cb is not called
```

## Tests

```bash
npm test
```
