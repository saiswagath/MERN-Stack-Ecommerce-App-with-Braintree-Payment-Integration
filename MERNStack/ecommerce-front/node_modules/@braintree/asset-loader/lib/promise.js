'use strict';

var PromisePolyfill = require('promise-polyfill');

module.exports = global.Promise || PromisePolyfill;
