'use strict';

function EventEmitter() {
  this._events = {};
}

EventEmitter.prototype.on = function (event, callback) {
  if (this._events[event]) {
    this._events[event].push(callback);
  } else {
    this._events[event] = [callback];
  }
};

EventEmitter.prototype.off = function (event, callback) {
  var eventCallbacks = this._events[event];
  var indexOfCallback;

  if (!eventCallbacks) {
    return;
  }

  indexOfCallback = eventCallbacks.indexOf(callback);

  eventCallbacks.splice(indexOfCallback, 1);
};

EventEmitter.prototype._emit = function (event) {
  var args;
  var eventCallbacks = this._events[event];

  if (!eventCallbacks) { return; }

  args = Array.prototype.slice.call(arguments, 1);

  eventCallbacks.forEach(function (callback) {
    callback.apply(null, args);
  });
};

EventEmitter.prototype.hasListener = function (event) {
  var eventCallbacks = this._events[event];

  if (!eventCallbacks) {
    return false;
  }

  return eventCallbacks.length > 0;
};

EventEmitter.createChild = function (ChildObject) {
  ChildObject.prototype = Object.create(EventEmitter.prototype, {
    constructor: ChildObject
  });
};

module.exports = EventEmitter;
