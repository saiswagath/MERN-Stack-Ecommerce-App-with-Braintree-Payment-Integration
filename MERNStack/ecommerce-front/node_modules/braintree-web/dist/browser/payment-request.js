(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.braintree || (g.braintree = {})).paymentRequest = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
(function (global){
'use strict';

var PromisePolyfill = _dereq_('promise-polyfill');

module.exports = global.Promise || PromisePolyfill;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"promise-polyfill":28}],2:[function(_dereq_,module,exports){
'use strict';

var Promise = _dereq_('./lib/promise');
var scriptPromiseCache = {};

function loadScript(options) {
  var attrs, container, script, scriptLoadPromise;
  var stringifiedOptions = JSON.stringify(options);

  if (!options.forceScriptReload) {
    scriptLoadPromise = scriptPromiseCache[stringifiedOptions];

    if (scriptLoadPromise) {
      return scriptLoadPromise;
    }
  }

  script = document.createElement('script');
  attrs = options.dataAttributes || {};
  container = options.container || document.head;

  script.src = options.src;
  script.id = options.id;
  script.async = true;

  if (options.crossorigin) {
    script.setAttribute('crossorigin', options.crossorigin);
  }

  Object.keys(attrs).forEach(function (key) {
    script.setAttribute('data-' + key, attrs[key]);
  });

  scriptLoadPromise = new Promise(function (resolve, reject) {
    script.addEventListener('load', function () {
      resolve(script);
    });
    script.addEventListener('error', function () {
      reject(new Error(options.src + ' failed to load.'));
    });
    script.addEventListener('abort', function () {
      reject(new Error(options.src + ' has aborted.'));
    });
    container.appendChild(script);
  });

  scriptPromiseCache[stringifiedOptions] = scriptLoadPromise;

  return scriptLoadPromise;
}

loadScript.clearCache = function () {
  scriptPromiseCache = {};
};

module.exports = loadScript;

},{"./lib/promise":1}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
'use strict';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Methods
var PROMISE_METHODS = [
  'all',
  'allSettled',
  'race',
  'reject',
  'resolve'
];

function shouldCatchExceptions(options) {
  if (options.hasOwnProperty('suppressUnhandledPromiseMessage')) {
    return Boolean(options.suppressUnhandledPromiseMessage);
  }

  return Boolean(ExtendedPromise.suppressUnhandledPromiseMessage);
}

function ExtendedPromise(options) {
  var self = this;

  if (typeof options === 'function') {
    return new ExtendedPromise.Promise(options);
  }

  this._promise = new ExtendedPromise.Promise(function (resolve, reject) {
    self._resolveFunction = resolve;
    self._rejectFunction = reject;
  });

  options = options || {};
  this._onResolve = options.onResolve || ExtendedPromise.defaultOnResolve;
  this._onReject = options.onReject || ExtendedPromise.defaultOnReject;

  if (shouldCatchExceptions(options)) {
    this._promise.catch(function () {
      // prevents unhandled promise rejection warning
      // in the console for extended promises that
      // that catch the error in an asynchronous manner
    });
  }

  this._resetState();

  this._promise.resolve = this.resolve.bind(this);
  this._promise.reject = this.reject.bind(this);

  return this._promise;
}

PROMISE_METHODS.forEach(function (method) {
  ExtendedPromise[method] = function () {
    var args = Array.prototype.slice.call(arguments);

    return ExtendedPromise.Promise[method].apply(ExtendedPromise.Promise, args);
  };
});

ExtendedPromise.setPromise = function (PromiseClass) {
  ExtendedPromise.Promise = PromiseClass;
};

// default to system level Promise, but allow it to be overwritten
if (typeof Promise !== 'undefined') {
  // eslint-disable-next-line no-undef
  ExtendedPromise.setPromise(Promise);
}

ExtendedPromise.defaultOnResolve = function (result) {
  return ExtendedPromise.Promise.resolve(result);
};

ExtendedPromise.defaultOnReject = function (err) {
  return ExtendedPromise.Promise.reject(err);
};

ExtendedPromise.prototype.resolve = function (arg) {
  var self = this;

  if (this._promise.isFulfilled) {
    return this._promise;
  }
  this._setResolved();

  ExtendedPromise.Promise.resolve().then(function () {
    return self._onResolve(arg);
  }).then(this._resolveFunction).catch(function (err) {
    self._resetState();

    self._promise.reject(err);
  });

  return this._promise;
};

ExtendedPromise.prototype.reject = function (arg) {
  var self = this;

  if (this._promise.isFulfilled) {
    return this._promise;
  }
  this._setRejected();

  ExtendedPromise.Promise.resolve().then(function () {
    return self._onReject(arg);
  }).then(function (result) {
    self._setResolved();

    self._resolveFunction(result);
  }).catch(this._rejectFunction);

  return this._promise;
};

ExtendedPromise.prototype._resetState = function () {
  this._promise.isFulfilled = false;
  this._promise.isResolved = false;
  this._promise.isRejected = false;
};

ExtendedPromise.prototype._setResolved = function () {
  this._promise.isFulfilled = true;
  this._promise.isResolved = true;
  this._promise.isRejected = false;
};

ExtendedPromise.prototype._setRejected = function () {
  this._promise.isFulfilled = true;
  this._promise.isResolved = false;
  this._promise.isRejected = true;
};

module.exports = ExtendedPromise;

},{}],5:[function(_dereq_,module,exports){
'use strict';

var setAttributes = _dereq_('./lib/set-attributes');
var defaultAttributes = _dereq_('./lib/default-attributes');
var assign = _dereq_('./lib/assign');

module.exports = function createFrame(options) {
  var iframe = document.createElement('iframe');
  var config = assign({}, defaultAttributes, options);

  if (config.style && typeof config.style !== 'string') {
    assign(iframe.style, config.style);
    delete config.style;
  }

  setAttributes(iframe, config);

  if (!iframe.getAttribute('id')) {
    iframe.id = iframe.name;
  }

  return iframe;
};

},{"./lib/assign":6,"./lib/default-attributes":7,"./lib/set-attributes":8}],6:[function(_dereq_,module,exports){
'use strict';

module.exports = function assign(target) {
  var objs = Array.prototype.slice.call(arguments, 1);

  objs.forEach(function (obj) {
    if (typeof obj !== 'object') { return; }

    Object.keys(obj).forEach(function (key) {
      target[key] = obj[key];
    });
  });

  return target;
}

},{}],7:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  src: 'about:blank',
  frameBorder: 0,
  allowtransparency: true,
  scrolling: 'no'
};

},{}],8:[function(_dereq_,module,exports){
'use strict';

module.exports = function setAttributes(element, attributes) {
  var value;

  for (var key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      value = attributes[key];

      if (value == null) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, value);
      }
    }
  }
};

},{}],9:[function(_dereq_,module,exports){
'use strict';

function deferred(fn) {
  return function () {
    // IE9 doesn't support passing arguments to setTimeout so we have to emulate it.
    var args = arguments;

    setTimeout(function () {
      try {
        fn.apply(null, args);
      } catch (err) {
        /* eslint-disable no-console */
        console.log('Error in callback function');
        console.log(err);
        /* eslint-enable no-console */
      }
    }, 1);
  };
}

module.exports = deferred;

},{}],10:[function(_dereq_,module,exports){
'use strict';

function once(fn) {
  var called = false;

  return function () {
    if (!called) {
      called = true;
      fn.apply(null, arguments);
    }
  };
}

module.exports = once;

},{}],11:[function(_dereq_,module,exports){
'use strict';

function promiseOrCallback(promise, callback) { // eslint-disable-line consistent-return
  if (callback) {
    promise
      .then(function (data) {
        callback(null, data);
      })
      .catch(function (err) {
        callback(err);
      });
  } else {
    return promise;
  }
}

module.exports = promiseOrCallback;

},{}],12:[function(_dereq_,module,exports){
'use strict';

var deferred = _dereq_('./lib/deferred');
var once = _dereq_('./lib/once');
var promiseOrCallback = _dereq_('./lib/promise-or-callback');

function wrapPromise(fn) {
  return function () {
    var callback;
    var args = Array.prototype.slice.call(arguments);
    var lastArg = args[args.length - 1];

    if (typeof lastArg === 'function') {
      callback = args.pop();
      callback = once(deferred(callback));
    }

    return promiseOrCallback(fn.apply(this, args), callback); // eslint-disable-line no-invalid-this
  };
}

wrapPromise.wrapPrototype = function (target, options) {
  var methods, ignoreMethods, includePrivateMethods;

  options = options || {};
  ignoreMethods = options.ignoreMethods || [];
  includePrivateMethods = options.transformPrivateMethods === true;

  methods = Object.getOwnPropertyNames(target.prototype).filter(function (method) {
    var isNotPrivateMethod;
    var isNonConstructorFunction = method !== 'constructor' &&
      typeof target.prototype[method] === 'function';
    var isNotAnIgnoredMethod = ignoreMethods.indexOf(method) === -1;

    if (includePrivateMethods) {
      isNotPrivateMethod = true;
    } else {
      isNotPrivateMethod = method.charAt(0) !== '_';
    }

    return isNonConstructorFunction &&
      isNotPrivateMethod &&
      isNotAnIgnoredMethod;
  });

  methods.forEach(function (method) {
    var original = target.prototype[method];

    target.prototype[method] = wrapPromise(original);
  });

  return target;
};

module.exports = wrapPromise;

},{"./lib/deferred":9,"./lib/once":10,"./lib/promise-or-callback":11}],13:[function(_dereq_,module,exports){
"use strict";
var is_not_string_1 = _dereq_("./lib/is-not-string");
var subscription_args_invalid_1 = _dereq_("./lib/subscription-args-invalid");
var broadcast_1 = _dereq_("./lib/broadcast");
var package_payload_1 = _dereq_("./lib/package-payload");
var constants_1 = _dereq_("./lib/constants");
module.exports = /** @class */ (function () {
    function Framebus(origin) {
        if (origin === void 0) { origin = "*"; }
        this.origin = origin;
    }
    Framebus.prototype.include = function (childWindow) {
        if (childWindow == null) {
            return false;
        }
        if (childWindow.Window == null) {
            return false;
        }
        if (childWindow.constructor !== childWindow.Window) {
            return false;
        }
        constants_1.childWindows.push(childWindow);
        return true;
    };
    Framebus.prototype.target = function (origin) {
        if (origin === void 0) { origin = "*"; }
        return new Framebus(origin);
    };
    Framebus.prototype.emit = function (event, data, reply) {
        var origin = this.origin;
        if (is_not_string_1.isntString(event)) {
            return false;
        }
        if (is_not_string_1.isntString(origin)) {
            return false;
        }
        if (typeof data === "function") {
            reply = data;
            data = undefined; // eslint-disable-line no-undefined
        }
        var payload = package_payload_1.packagePayload(event, origin, data, reply);
        if (!payload) {
            return false;
        }
        broadcast_1.broadcast(window.top || window.self, payload, origin);
        return true;
    };
    Framebus.prototype.on = function (event, fn) {
        var origin = this.origin;
        if (subscription_args_invalid_1.subscriptionArgsInvalid(event, fn, origin)) {
            return false;
        }
        constants_1.subscribers[origin] = constants_1.subscribers[origin] || {};
        constants_1.subscribers[origin][event] = constants_1.subscribers[origin][event] || [];
        constants_1.subscribers[origin][event].push(fn);
        return true;
    };
    Framebus.prototype.off = function (event, fn) {
        var origin = this.origin;
        if (subscription_args_invalid_1.subscriptionArgsInvalid(event, fn, origin)) {
            return false;
        }
        var subscriberList = constants_1.subscribers[origin] && constants_1.subscribers[origin][event];
        if (!subscriberList) {
            return false;
        }
        for (var i = 0; i < subscriberList.length; i++) {
            if (subscriberList[i] === fn) {
                subscriberList.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    return Framebus;
}());

},{"./lib/broadcast":17,"./lib/constants":18,"./lib/is-not-string":21,"./lib/package-payload":23,"./lib/subscription-args-invalid":25}],14:[function(_dereq_,module,exports){
"use strict";
var attach_1 = _dereq_("./lib/attach");
var Framebus = _dereq_("./framebus");
var bus = new Framebus();
attach_1.attach();
module.exports = bus;

},{"./framebus":13,"./lib/attach":15}],15:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detach = exports.attach = void 0;
var message_1 = _dereq_("./message");
var isAttached = false;
function attach() {
    if (isAttached || typeof window === "undefined") {
        return;
    }
    isAttached = true;
    window.addEventListener("message", message_1.onmessage, false);
}
exports.attach = attach;
// removeIf(production)
function detach() {
    isAttached = false;
    window.removeEventListener("message", message_1.onmessage, false);
}
exports.detach = detach;
// endRemoveIf(production)

},{"./message":22}],16:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastToChildWindows = void 0;
var broadcast_1 = _dereq_("./broadcast");
var constants_1 = _dereq_("./constants");
function broadcastToChildWindows(payload, origin, source) {
    for (var i = constants_1.childWindows.length - 1; i >= 0; i--) {
        var childWindow = constants_1.childWindows[i];
        if (childWindow.closed) {
            constants_1.childWindows.splice(i, 1);
        }
        else if (source !== childWindow) {
            broadcast_1.broadcast(childWindow.top, payload, origin);
        }
    }
}
exports.broadcastToChildWindows = broadcastToChildWindows;

},{"./broadcast":17,"./constants":18}],17:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = void 0;
var has_opener_1 = _dereq_("./has-opener");
function broadcast(frame, payload, origin) {
    var i = 0;
    var frameToBroadcastTo;
    try {
        frame.postMessage(payload, origin);
        if (has_opener_1.hasOpener(frame)) {
            broadcast(frame.opener.top, payload, origin);
        }
        // previously, our max value was frame.frames.length
        // but frames.length inherits from window.length
        // which can be overwritten if a developer does
        // `var length = value;` outside of a function
        // scope, it'll prevent us from looping through
        // all the frames. With this, we loop through
        // until there are no longer any frames
        // eslint-disable-next-line no-cond-assign
        while ((frameToBroadcastTo = frame.frames[i])) {
            broadcast(frameToBroadcastTo, payload, origin);
            i++;
        }
    }
    catch (_) {
        /* ignored */
    }
}
exports.broadcast = broadcast;

},{"./has-opener":20}],18:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribers = exports.childWindows = exports.prefix = void 0;
exports.prefix = "/*framebus*/";
exports.childWindows = [];
exports.subscribers = {};

},{}],19:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatch = void 0;
var constants_1 = _dereq_("./constants");
function dispatch(origin, event, data, reply, e) {
    if (!constants_1.subscribers[origin]) {
        return;
    }
    if (!constants_1.subscribers[origin][event]) {
        return;
    }
    var args = [];
    if (data) {
        args.push(data);
    }
    if (reply) {
        args.push(reply);
    }
    for (var i = 0; i < constants_1.subscribers[origin][event].length; i++) {
        constants_1.subscribers[origin][event][i].apply(e, args);
    }
}
exports.dispatch = dispatch;

},{"./constants":18}],20:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOpener = void 0;
function hasOpener(frame) {
    if (frame.top !== frame) {
        return false;
    }
    if (frame.opener == null) {
        return false;
    }
    if (frame.opener === frame) {
        return false;
    }
    if (frame.opener.closed === true) {
        return false;
    }
    return true;
}
exports.hasOpener = hasOpener;

},{}],21:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isntString = void 0;
function isntString(str) {
    return typeof str !== "string";
}
exports.isntString = isntString;

},{}],22:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onmessage = void 0;
var is_not_string_1 = _dereq_("./is-not-string");
var unpack_payload_1 = _dereq_("./unpack-payload");
var dispatch_1 = _dereq_("./dispatch");
var broadcast_to_child_windows_1 = _dereq_("./broadcast-to-child-windows");
function onmessage(e) {
    if (is_not_string_1.isntString(e.data)) {
        return;
    }
    var payload = unpack_payload_1.unpackPayload(e);
    if (!payload) {
        return;
    }
    var data = payload.eventData;
    var reply = payload.reply;
    dispatch_1.dispatch("*", payload.event, data, reply, e);
    dispatch_1.dispatch(e.origin, payload.event, data, reply, e);
    broadcast_to_child_windows_1.broadcastToChildWindows(e.data, payload.origin, e.source);
}
exports.onmessage = onmessage;

},{"./broadcast-to-child-windows":16,"./dispatch":19,"./is-not-string":21,"./unpack-payload":26}],23:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packagePayload = void 0;
var subscribe_replier_1 = _dereq_("./subscribe-replier");
var constants_1 = _dereq_("./constants");
function packagePayload(event, origin, data, reply) {
    var packaged;
    var payload = {
        event: event,
        origin: origin,
    };
    if (typeof reply === "function") {
        payload.reply = subscribe_replier_1.subscribeReplier(reply, origin);
    }
    payload.eventData = data;
    try {
        packaged = constants_1.prefix + JSON.stringify(payload);
    }
    catch (e) {
        throw new Error("Could not stringify event: " + e.message);
    }
    return packaged;
}
exports.packagePayload = packagePayload;

},{"./constants":18,"./subscribe-replier":24}],24:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeReplier = void 0;
var Framebus = _dereq_("../framebus");
var uuid_1 = _dereq_("./uuid");
function subscribeReplier(fn, origin) {
    var uuid = uuid_1.uuid();
    function replier(data, replyOriginHandler) {
        fn(data, replyOriginHandler);
        new Framebus().target(origin).off(uuid, replier);
    }
    new Framebus().target(origin).on(uuid, replier);
    return uuid;
}
exports.subscribeReplier = subscribeReplier;

},{"../framebus":13,"./uuid":27}],25:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionArgsInvalid = void 0;
var is_not_string_1 = _dereq_("./is-not-string");
function subscriptionArgsInvalid(event, fn, origin) {
    if (is_not_string_1.isntString(event)) {
        return true;
    }
    if (typeof fn !== "function") {
        return true;
    }
    return is_not_string_1.isntString(origin);
}
exports.subscriptionArgsInvalid = subscriptionArgsInvalid;

},{"./is-not-string":21}],26:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackPayload = void 0;
var constants_1 = _dereq_("./constants");
var package_payload_1 = _dereq_("./package-payload");
function unpackPayload(e) {
    var payload;
    if (e.data.slice(0, constants_1.prefix.length) !== constants_1.prefix) {
        return false;
    }
    try {
        payload = JSON.parse(e.data.slice(constants_1.prefix.length));
    }
    catch (err) {
        return false;
    }
    if (payload.reply) {
        var replyOrigin_1 = e.origin;
        var replySource_1 = e.source;
        var replyEvent_1 = payload.reply;
        payload.reply = function reply(replyData) {
            if (!replySource_1) {
                return;
            }
            var replyPayload = package_payload_1.packagePayload(replyEvent_1, replyOrigin_1, replyData);
            if (!replyPayload) {
                return;
            }
            replySource_1.postMessage(replyPayload, replyOrigin_1);
        };
    }
    return payload;
}
exports.unpackPayload = unpackPayload;

},{"./constants":18,"./package-payload":23}],27:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = void 0;
/* eslint-disable no-mixed-operators */
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.uuid = uuid;

},{}],28:[function(_dereq_,module,exports){
'use strict';

/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        // @ts-ignore
        return constructor.reject(reason);
      });
    }
  );
}

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function isArray(x) {
  return Boolean(x && typeof x.length !== 'undefined');
}

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = finallyConstructor;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.all accepts an array'));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.race accepts an array'));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  // @ts-ignore
  (typeof setImmediate === 'function' &&
    function(fn) {
      // @ts-ignore
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

module.exports = Promise;

},{}],29:[function(_dereq_,module,exports){
'use strict';

var createAuthorizationData = _dereq_('./create-authorization-data');
var jsonClone = _dereq_('./json-clone');
var constants = _dereq_('./constants');

function addMetadata(configuration, data) {
  var key;
  var attrs = data ? jsonClone(data) : {};
  var authAttrs = createAuthorizationData(configuration.authorization).attrs;
  var _meta = jsonClone(configuration.analyticsMetadata);

  attrs.braintreeLibraryVersion = constants.BRAINTREE_LIBRARY_VERSION;

  for (key in attrs._meta) {
    if (attrs._meta.hasOwnProperty(key)) {
      _meta[key] = attrs._meta[key];
    }
  }

  attrs._meta = _meta;

  if (authAttrs.tokenizationKey) {
    attrs.tokenizationKey = authAttrs.tokenizationKey;
  } else {
    attrs.authorizationFingerprint = authAttrs.authorizationFingerprint;
  }

  return attrs;
}

module.exports = addMetadata;

},{"./constants":38,"./create-authorization-data":41,"./json-clone":47}],30:[function(_dereq_,module,exports){
'use strict';

var Promise = _dereq_('./promise');
var constants = _dereq_('./constants');
var addMetadata = _dereq_('./add-metadata');

function sendAnalyticsEvent(clientInstanceOrPromise, kind, callback) {
  var timestamp = Date.now(); // milliseconds

  return Promise.resolve(clientInstanceOrPromise).then(function (client) {
    var timestampInPromise = Date.now();
    var configuration = client.getConfiguration();
    var request = client._request;
    var url = configuration.gatewayConfiguration.analytics.url;
    var data = {
      analytics: [{
        kind: constants.ANALYTICS_PREFIX + kind,
        isAsync: Math.floor(timestampInPromise / 1000) !== Math.floor(timestamp / 1000),
        timestamp: timestamp
      }]
    };

    request({
      url: url,
      method: 'post',
      data: addMetadata(configuration, data),
      timeout: constants.ANALYTICS_REQUEST_TIMEOUT_MS
    }, callback);
  });
}

module.exports = {
  sendEvent: sendAnalyticsEvent
};

},{"./add-metadata":29,"./constants":38,"./promise":49}],31:[function(_dereq_,module,exports){
'use strict';

var loadScript = _dereq_('@braintree/asset-loader/load-script');

module.exports = {
  loadScript: loadScript
};

},{"@braintree/asset-loader/load-script":2}],32:[function(_dereq_,module,exports){
'use strict';

var assignNormalized = typeof Object.assign === 'function' ? Object.assign : assignPolyfill;

function assignPolyfill(destination) {
  var i, source, key;

  for (i = 1; i < arguments.length; i++) {
    source = arguments[i];
    for (key in source) {
      if (source.hasOwnProperty(key)) {
        destination[key] = source[key];
      }
    }
  }

  return destination;
}

module.exports = {
  assign: assignNormalized,
  _assign: assignPolyfill
};

},{}],33:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('./braintree-error');
var Promise = _dereq_('./promise');
var sharedErrors = _dereq_('./errors');
var VERSION = "3.63.0";

function basicComponentVerification(options) {
  var client, authorization, name;

  if (!options) {
    return Promise.reject(new BraintreeError({
      type: sharedErrors.INVALID_USE_OF_INTERNAL_FUNCTION.type,
      code: sharedErrors.INVALID_USE_OF_INTERNAL_FUNCTION.code,
      message: 'Options must be passed to basicComponentVerification function.'
    }));
  }

  name = options.name;
  client = options.client;
  authorization = options.authorization;

  if (!client && !authorization) {
    return Promise.reject(new BraintreeError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      // NEXT_MAJOR_VERSION in major version, we expose passing in authorization for all components
      // instead of passing in a client instance. Leave this a silent feature for now.
      message: 'options.client is required when instantiating ' + name + '.'
    }));
  }

  if (!authorization && client.getVersion() !== VERSION) {
    return Promise.reject(new BraintreeError({
      type: sharedErrors.INCOMPATIBLE_VERSIONS.type,
      code: sharedErrors.INCOMPATIBLE_VERSIONS.code,
      message: 'Client (version ' + client.getVersion() + ') and ' + name + ' (version ' + VERSION + ') components must be from the same SDK version.'
    }));
  }

  return Promise.resolve();
}

module.exports = {
  verify: basicComponentVerification
};

},{"./braintree-error":34,"./errors":44,"./promise":49}],34:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('./enumerate');

/**
 * @class
 * @global
 * @param {object} options Construction options
 * @classdesc This class is used to report error conditions, frequently as the first parameter to callbacks throughout the Braintree SDK.
 * @description <strong>You cannot use this constructor directly. Interact with instances of this class through {@link callback callbacks}.</strong>
 */
function BraintreeError(options) {
  if (!BraintreeError.types.hasOwnProperty(options.type)) {
    throw new Error(options.type + ' is not a valid type.');
  }

  if (!options.code) {
    throw new Error('Error code required.');
  }

  if (!options.message) {
    throw new Error('Error message required.');
  }

  this.name = 'BraintreeError';

  /**
   * @type {string}
   * @description A code that corresponds to specific errors.
   */
  this.code = options.code;

  /**
   * @type {string}
   * @description A short description of the error.
   */
  this.message = options.message;

  /**
   * @type {BraintreeError.types}
   * @description The type of error.
   */
  this.type = options.type;

  /**
   * @type {object=}
   * @description Additional information about the error, such as an underlying network error response.
   */
  this.details = options.details;
}

BraintreeError.prototype = Object.create(Error.prototype);
BraintreeError.prototype.constructor = BraintreeError;

/**
 * Enum for {@link BraintreeError} types.
 * @name BraintreeError.types
 * @enum
 * @readonly
 * @memberof BraintreeError
 * @property {string} CUSTOMER An error caused by the customer.
 * @property {string} MERCHANT An error that is actionable by the merchant.
 * @property {string} NETWORK An error due to a network problem.
 * @property {string} INTERNAL An error caused by Braintree code.
 * @property {string} UNKNOWN An error where the origin is unknown.
 */
BraintreeError.types = enumerate([
  'CUSTOMER',
  'MERCHANT',
  'NETWORK',
  'INTERNAL',
  'UNKNOWN'
]);

BraintreeError.findRootError = function (err) {
  if (err instanceof BraintreeError && err.details && err.details.originalError) {
    return BraintreeError.findRootError(err.details.originalError);
  }

  return err;
};

module.exports = BraintreeError;

},{"./enumerate":43}],35:[function(_dereq_,module,exports){
'use strict';

var isVerifiedDomain = _dereq_('../is-verified-domain');

function checkOrigin(postMessageOrigin, merchantUrl) {
  var merchantOrigin, merchantHost;
  var a = document.createElement('a');

  a.href = merchantUrl;

  if (a.protocol === 'https:') {
    merchantHost = a.host.replace(/:443$/, '');
  } else if (a.protocol === 'http:') {
    merchantHost = a.host.replace(/:80$/, '');
  } else {
    merchantHost = a.host;
  }

  merchantOrigin = a.protocol + '//' + merchantHost;

  if (merchantOrigin === postMessageOrigin) { return true; }

  a.href = postMessageOrigin;

  return isVerifiedDomain(postMessageOrigin);
}

module.exports = {
  checkOrigin: checkOrigin
};

},{"../is-verified-domain":46}],36:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../enumerate');

module.exports = enumerate([
  'CONFIGURATION_REQUEST'
], 'bus:');

},{"../enumerate":43}],37:[function(_dereq_,module,exports){
'use strict';

var bus = _dereq_('framebus');
var events = _dereq_('./events');
var checkOrigin = _dereq_('./check-origin').checkOrigin;
var BraintreeError = _dereq_('../braintree-error');

function BraintreeBus(options) {
  options = options || {};

  this.channel = options.channel;
  if (!this.channel) {
    throw new BraintreeError({
      type: BraintreeError.types.INTERNAL,
      code: 'MISSING_CHANNEL_ID',
      message: 'Channel ID must be specified.'
    });
  }

  this.merchantUrl = options.merchantUrl;

  this._isDestroyed = false;
  this._isVerbose = false;

  this._listeners = [];

  this._log('new bus on channel ' + this.channel, [location.href]);
}

BraintreeBus.prototype.on = function (eventName, originalHandler) {
  var namespacedEvent, args;
  var handler = originalHandler;
  var self = this;

  if (this._isDestroyed) { return; }

  if (this.merchantUrl) {
    handler = function () {
      /* eslint-disable no-invalid-this */
      if (checkOrigin(this.origin, self.merchantUrl)) {
        originalHandler.apply(this, arguments);
      }
      /* eslint-enable no-invalid-this */
    };
  }

  namespacedEvent = this._namespaceEvent(eventName);
  args = Array.prototype.slice.call(arguments);
  args[0] = namespacedEvent;
  args[1] = handler;

  this._log('on', args);
  bus.on.apply(bus, args);

  this._listeners.push({
    eventName: eventName,
    handler: handler,
    originalHandler: originalHandler
  });
};

BraintreeBus.prototype.emit = function (eventName) {
  var args;

  if (this._isDestroyed) { return; }

  args = Array.prototype.slice.call(arguments);
  args[0] = this._namespaceEvent(eventName);

  this._log('emit', args);
  bus.emit.apply(bus, args);
};

BraintreeBus.prototype._offDirect = function (eventName) {
  var args = Array.prototype.slice.call(arguments);

  if (this._isDestroyed) { return; }

  args[0] = this._namespaceEvent(eventName);

  this._log('off', args);
  bus.off.apply(bus, args);
};

BraintreeBus.prototype.off = function (eventName, originalHandler) {
  var i, listener;
  var handler = originalHandler;

  if (this._isDestroyed) { return; }

  if (this.merchantUrl) {
    for (i = 0; i < this._listeners.length; i++) {
      listener = this._listeners[i];

      if (listener.originalHandler === originalHandler) {
        handler = listener.handler;
      }
    }
  }

  this._offDirect(eventName, handler);
};

BraintreeBus.prototype._namespaceEvent = function (eventName) {
  return ['braintree', this.channel, eventName].join(':');
};

BraintreeBus.prototype.teardown = function () {
  var listener, i;

  for (i = 0; i < this._listeners.length; i++) {
    listener = this._listeners[i];
    this._offDirect(listener.eventName, listener.handler);
  }

  this._listeners.length = 0;

  this._isDestroyed = true;
};

BraintreeBus.prototype._log = function (functionName, args) {
  if (this._isVerbose) {
    console.log(functionName, args); // eslint-disable-line no-console
  }
};

BraintreeBus.events = events;

module.exports = BraintreeBus;

},{"../braintree-error":34,"./check-origin":35,"./events":36,"framebus":14}],38:[function(_dereq_,module,exports){
'use strict';

var VERSION = "3.63.0";
var PLATFORM = 'web';

var CLIENT_API_URLS = {
  production: 'https://api.braintreegateway.com:443',
  sandbox: 'https://api.sandbox.braintreegateway.com:443'
};

var ASSETS_URLS = {
  production: 'https://assets.braintreegateway.com',
  sandbox: 'https://assets.braintreegateway.com'
};

var GRAPHQL_URLS = {
  production: 'https://payments.braintree-api.com/graphql',
  sandbox: 'https://payments.sandbox.braintree-api.com/graphql'
};

// endRemoveIf(production)

module.exports = {
  ANALYTICS_PREFIX: PLATFORM + '.',
  ANALYTICS_REQUEST_TIMEOUT_MS: 2000,
  ASSETS_URLS: ASSETS_URLS,
  CLIENT_API_URLS: CLIENT_API_URLS,
  FRAUDNET_SOURCE: 'BRAINTREE_SIGNIN',
  FRAUDNET_FNCLS: 'fnparams-dede7cc5-15fd-4c75-a9f4-36c430ee3a99',
  FRAUDNET_URL: 'https://c.paypal.com/da/r/fb.js',
  GRAPHQL_URLS: GRAPHQL_URLS,
  INTEGRATION_TIMEOUT_MS: 60000,
  VERSION: VERSION,
  INTEGRATION: 'custom',
  SOURCE: 'client',
  PLATFORM: PLATFORM,
  BRAINTREE_LIBRARY_VERSION: 'braintree/' + PLATFORM + '/' + VERSION
};

},{}],39:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('./braintree-error');
var sharedErrors = _dereq_('./errors');

module.exports = function (instance, methodNames) {
  methodNames.forEach(function (methodName) {
    instance[methodName] = function () {
      throw new BraintreeError({
        type: sharedErrors.METHOD_CALLED_AFTER_TEARDOWN.type,
        code: sharedErrors.METHOD_CALLED_AFTER_TEARDOWN.code,
        message: methodName + ' cannot be called after teardown.'
      });
    };
  });
};

},{"./braintree-error":34,"./errors":44}],40:[function(_dereq_,module,exports){
'use strict';

// endRemoveIf(production)
var ASSETS_URLS = _dereq_('./constants').ASSETS_URLS;

function createAssetsUrl(authorization) {
  // endRemoveIf(production)

  return ASSETS_URLS.production;
}
/* eslint-enable */

module.exports = {
  create: createAssetsUrl
};

},{"./constants":38}],41:[function(_dereq_,module,exports){
'use strict';

var atob = _dereq_('../lib/vendor/polyfill').atob;
var CLIENT_API_URLS = _dereq_('../lib/constants').CLIENT_API_URLS;

function _isTokenizationKey(str) {
  return /^[a-zA-Z0-9]+_[a-zA-Z0-9]+_[a-zA-Z0-9_]+$/.test(str);
}

function _parseTokenizationKey(tokenizationKey) {
  var tokens = tokenizationKey.split('_');
  var environment = tokens[0];
  var merchantId = tokens.slice(2).join('_');

  return {
    merchantId: merchantId,
    environment: environment
  };
}

function createAuthorizationData(authorization) {
  var parsedClientToken, parsedTokenizationKey;
  var data = {
    attrs: {},
    configUrl: ''
  };

  if (_isTokenizationKey(authorization)) {
    parsedTokenizationKey = _parseTokenizationKey(authorization);
    data.environment = parsedTokenizationKey.environment;
    data.attrs.tokenizationKey = authorization;
    data.configUrl = CLIENT_API_URLS[parsedTokenizationKey.environment] + '/merchants/' + parsedTokenizationKey.merchantId + '/client_api/v1/configuration';
  } else {
    parsedClientToken = JSON.parse(atob(authorization));
    data.environment = parsedClientToken.environment;
    data.attrs.authorizationFingerprint = parsedClientToken.authorizationFingerprint;
    data.configUrl = parsedClientToken.configUrl;
    data.graphQL = parsedClientToken.graphQL;
  }

  return data;
}

module.exports = createAuthorizationData;

},{"../lib/constants":38,"../lib/vendor/polyfill":51}],42:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('./braintree-error');
var Promise = _dereq_('./promise');
var assets = _dereq_('./assets');
var sharedErrors = _dereq_('./errors');

var VERSION = "3.63.0";

function createDeferredClient(options) {
  var promise = Promise.resolve();

  if (options.client) {
    return Promise.resolve(options.client);
  }

  if (!(window.braintree && window.braintree.client)) {
    promise = assets.loadScript({
      src: options.assetsUrl + '/web/' + VERSION + '/js/client.min.js'
    }).catch(function (err) {
      return Promise.reject(new BraintreeError({
        type: sharedErrors.CLIENT_SCRIPT_FAILED_TO_LOAD.type,
        code: sharedErrors.CLIENT_SCRIPT_FAILED_TO_LOAD.code,
        message: sharedErrors.CLIENT_SCRIPT_FAILED_TO_LOAD.message,
        details: {
          originalError: err
        }
      }));
    });
  }

  return promise.then(function () {
    if (window.braintree.client.VERSION !== VERSION) {
      return Promise.reject(new BraintreeError({
        type: sharedErrors.INCOMPATIBLE_VERSIONS.type,
        code: sharedErrors.INCOMPATIBLE_VERSIONS.code,
        message: 'Client (version ' + window.braintree.client.VERSION + ') and ' + options.name + ' (version ' + VERSION + ') components must be from the same SDK version.'
      }));
    }

    return window.braintree.client.create({
      authorization: options.authorization,
      debug: options.debug
    });
  });
}

module.exports = {
  create: createDeferredClient
};

},{"./assets":31,"./braintree-error":34,"./errors":44,"./promise":49}],43:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;

    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],44:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Shared Interal Error Codes
 * @ignore
 * @description These codes should never be experienced by the mechant directly.
 * @property {INTERNAL} INVALID_USE_OF_INTERNAL_FUNCTION Occurs when the client is created without a gateway configuration. Should never happen.
 */

/**
 * @name BraintreeError.Shared Errors - Component Creation Error Codes
 * @description Errors that occur when creating components.
 * @property {MERCHANT} INSTANTIATION_OPTION_REQUIRED Occurs when a component is created that is missing a required option.
 * @property {MERCHANT} INCOMPATIBLE_VERSIONS Occurs when a component is created with a client with a different version than the component.
 * @property {NETWORK} CLIENT_SCRIPT_FAILED_TO_LOAD Occurs when a component attempts to load the Braintree client script, but the request fails.
 */

/**
 * @name BraintreeError.Shared Errors - Component Instance Error Codes
 * @description Errors that occur when using instances of components.
 * @property {MERCHANT} METHOD_CALLED_AFTER_TEARDOWN Occurs when a method is called on a component instance after it has been torn down.
 */

var BraintreeError = _dereq_('./braintree-error');

module.exports = {
  INVALID_USE_OF_INTERNAL_FUNCTION: {
    type: BraintreeError.types.INTERNAL,
    code: 'INVALID_USE_OF_INTERNAL_FUNCTION'
  },
  INSTANTIATION_OPTION_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'INSTANTIATION_OPTION_REQUIRED'
  },
  INCOMPATIBLE_VERSIONS: {
    type: BraintreeError.types.MERCHANT,
    code: 'INCOMPATIBLE_VERSIONS'
  },
  CLIENT_SCRIPT_FAILED_TO_LOAD: {
    type: BraintreeError.types.NETWORK,
    code: 'CLIENT_SCRIPT_FAILED_TO_LOAD',
    message: 'Braintree client script could not be loaded.'
  },
  METHOD_CALLED_AFTER_TEARDOWN: {
    type: BraintreeError.types.MERCHANT,
    code: 'METHOD_CALLED_AFTER_TEARDOWN'
  }
};

},{"./braintree-error":34}],45:[function(_dereq_,module,exports){
'use strict';

var VERSION = "3.63.0";
var assign = _dereq_('./assign').assign;

function generateTokenizationParameters(configuration, overrides) {
  var metadata = configuration.analyticsMetadata;
  var basicTokenizationParameters = {
    gateway: 'braintree',
    'braintree:merchantId': configuration.gatewayConfiguration.merchantId,
    'braintree:apiVersion': 'v1',
    'braintree:sdkVersion': VERSION,
    'braintree:metadata': JSON.stringify({
      source: metadata.source,
      integration: metadata.integration,
      sessionId: metadata.sessionId,
      version: VERSION,
      platform: metadata.platform
    })
  };

  return assign({}, basicTokenizationParameters, overrides);
}

module.exports = function (configuration, googlePayVersion, googleMerchantId) {
  var data, paypalPaymentMethod;
  var androidPayConfiguration = configuration.gatewayConfiguration.androidPay;
  var environment = configuration.gatewayConfiguration.environment === 'production' ? 'PRODUCTION' : 'TEST';

  if (googlePayVersion === 2) {
    data = {
      apiVersion: 2,
      apiVersionMinor: 0,
      environment: environment,
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: [
            'PAN_ONLY',
            'CRYPTOGRAM_3DS'
          ],
          allowedCardNetworks:
            androidPayConfiguration.supportedNetworks.map(function (card) { return card.toUpperCase(); })
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: generateTokenizationParameters(configuration, {
            'braintree:authorizationFingerprint': androidPayConfiguration.googleAuthorizationFingerprint
          })
        }
      }]
    };

    if (googleMerchantId) {
      data.merchantInfo = {
        merchantId: googleMerchantId
      };
    }

    if (androidPayConfiguration.paypalClientId) {
      paypalPaymentMethod = {
        type: 'PAYPAL',
        parameters: {
          /* eslint-disable camelcase */
          purchase_context: {
            purchase_units: [
              {
                payee: {
                  client_id: androidPayConfiguration.paypalClientId
                },
                recurring_payment: true
              }
            ]
          }
          /* eslint-enable camelcase */
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: generateTokenizationParameters(configuration, {
            'braintree:paypalClientId': androidPayConfiguration.paypalClientId
          })
        }
      };

      data.allowedPaymentMethods.push(paypalPaymentMethod);
    }
  } else {
    data = {
      environment: environment,
      allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD'],
      paymentMethodTokenizationParameters: {
        tokenizationType: 'PAYMENT_GATEWAY',
        parameters: generateTokenizationParameters(configuration, {
          'braintree:authorizationFingerprint': androidPayConfiguration.googleAuthorizationFingerprint
        })
      },
      cardRequirements: {
        allowedCardNetworks: androidPayConfiguration.supportedNetworks.map(function (card) { return card.toUpperCase(); })
      }
    };

    if (configuration.authorizationType === 'TOKENIZATION_KEY') {
      data.paymentMethodTokenizationParameters.parameters['braintree:clientKey'] = configuration.authorization;
    }

    if (googleMerchantId) {
      data.merchantId = googleMerchantId;
    }

    if (googlePayVersion) {
      data.apiVersion = googlePayVersion;
    }
  }

  return data;
};

},{"./assign":32}],46:[function(_dereq_,module,exports){
'use strict';

var parser;
var legalHosts = {
  'paypal.com': 1,
  'braintreepayments.com': 1,
  'braintreegateway.com': 1,
  'braintree-api.com': 1
};

// endRemoveIf(production)

function stripSubdomains(domain) {
  return domain.split('.').slice(-2).join('.');
}

function isVerifiedDomain(url) {
  var mainDomain;

  url = url.toLowerCase();

  if (!/^https:/.test(url)) {
    return false;
  }

  parser = parser || document.createElement('a');
  parser.href = url;
  mainDomain = stripSubdomains(parser.hostname);

  return legalHosts.hasOwnProperty(mainDomain);
}

module.exports = isVerifiedDomain;

},{}],47:[function(_dereq_,module,exports){
'use strict';

module.exports = function (value) {
  return JSON.parse(JSON.stringify(value));
};

},{}],48:[function(_dereq_,module,exports){
'use strict';

module.exports = function (obj) {
  return Object.keys(obj).filter(function (key) {
    return typeof obj[key] === 'function';
  });
};

},{}],49:[function(_dereq_,module,exports){
'use strict';

var PromisePolyfill = _dereq_('promise-polyfill');
var ExtendedPromise = _dereq_('@braintree/extended-promise');

// eslint-disable-next-line no-undef
var PromiseGlobal = typeof Promise !== 'undefined' ? Promise : PromisePolyfill;

ExtendedPromise.suppressUnhandledPromiseMessage = true;
ExtendedPromise.setPromise(PromiseGlobal);

module.exports = PromiseGlobal;

},{"@braintree/extended-promise":4,"promise-polyfill":28}],50:[function(_dereq_,module,exports){
'use strict';

function useMin(isDebug) {
  return isDebug ? '' : '.min';
}

module.exports = useMin;

},{}],51:[function(_dereq_,module,exports){
'use strict';

var atobNormalized = typeof atob === 'function' ? window.atob : atobPolyfill;

function atobPolyfill(base64String) {
  var a, b, c, b1, b2, b3, b4, i;
  var base64Matcher = new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})([=]{1,2})?$');
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var result = '';

  if (!base64Matcher.test(base64String)) {
    throw new Error('Non base64 encoded input passed to window.atob polyfill');
  }

  i = 0;
  do {
    b1 = characters.indexOf(base64String.charAt(i++));
    b2 = characters.indexOf(base64String.charAt(i++));
    b3 = characters.indexOf(base64String.charAt(i++));
    b4 = characters.indexOf(base64String.charAt(i++));

    a = (b1 & 0x3F) << 2 | b2 >> 4 & 0x3;
    b = (b2 & 0xF) << 4 | b3 >> 2 & 0xF;
    c = (b3 & 0x3) << 6 | b4 & 0x3F;

    result += String.fromCharCode(a) + (b ? String.fromCharCode(b) : '') + (c ? String.fromCharCode(c) : '');
  } while (i < base64String.length);

  return result;
}

module.exports = {
  atob: function (base64String) {
    return atobNormalized.call(window, base64String);
  },
  _atob: atobPolyfill
};

},{}],52:[function(_dereq_,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}],53:[function(_dereq_,module,exports){
'use strict';

var analytics = _dereq_('../../lib/analytics');
var assign = _dereq_('../../lib/assign').assign;
var Bus = _dereq_('../../lib/bus');
var convertMethodsToError = _dereq_('../../lib/convert-methods-to-error');
var generateGooglePayConfiguration = _dereq_('../../lib/generate-google-pay-configuration');
var iFramer = _dereq_('@braintree/iframer');
var uuid = _dereq_('../../lib/vendor/uuid');
var useMin = _dereq_('../../lib/use-min');
var methods = _dereq_('../../lib/methods');
var Promise = _dereq_('../../lib/promise');
var EventEmitter = _dereq_('@braintree/event-emitter');
var BraintreeError = _dereq_('../../lib/braintree-error');
var VERSION = "3.63.0";
var constants = _dereq_('../shared/constants');
var events = constants.events;
var errors = constants.errors;
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @typedef {object} PaymentRequestComponent~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {object} details Additional account details.
 * @property {string} details.bin The BIN number of the card..
 * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
 * @property {string} details.lastFour Last four digits of card number.
 * @property {string} details.lastTwo Last two digits of card number.
 * @property {object} details.rawPaymentResponse The raw payment response from the payment request, with sensitive card details removed.
 * @property {string} description A human-readable description.
 * @property {string} type The payment method type, `CreditCard` or `AndroidPayCard`.
 * @property {object} binData Information about the card based on the bin.
 * @property {string} binData.commercial Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.countryOfIssuance The country of issuance.
 * @property {string} binData.debit Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.durbinRegulated Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.healthcare Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.issuingBank The issuing bank.
 * @property {string} binData.payroll Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.prepaid Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.productId The product id.
 */

/**
 * @typedef {object} PaymentRequestComponent~paymentRequestConfiguration
 * @property {object} configuration.details The payment details. For details on this object, see [Google's PaymentRequest API documentation](https://developers.google.com/web/fundamentals/discovery-and-monetization/payment-request/deep-dive-into-payment-request#defining_payment_details).
 * @property {array} [configuration.supportedPaymentMethods] The supported payment methods. If not passed in, the supported payment methods from the merchant account that generated the authorization for the client will be used. For details on this array, see [Google's PaymentRequest API documentation](https://developers.google.com/web/fundamentals/discovery-and-monetization/payment-request/deep-dive-into-payment-request#defining_supported_payment_methods).
 * @property {object} [configuration.options] Additional payment request options. For details on this object, see [Google's PaymentRequest API documentation](https://developers.google.com/web/fundamentals/discovery-and-monetization/payment-request/deep-dive-into-payment-request#defining_options_optional).
 */

/**
 * @typedef {object} PaymentRequestComponent~shippingEventObject
 * @description The event payload sent from {@link PaymentRequestComponent#on|on}.
 * @property {object} target An object which contains data about the event.
 * @property {function} updateWith A method to call with the updated Payment Request details.
 */

/**
 * @name PaymentRequestComponent#on
 * @function
 * @param {string} event The name of the event to which you are subscribing.
 * @param {function} handler A callback to handle the event.
 * @description Subscribes a handler function to a named event. `event` should be {@link PaymentRequestComponent#event:shippingAddressChange|shippingAddressChange} or {@link PaymentRequestComponent#event:shippingOptionChange|shippingOptionChange}. For convenience, you can also listen on `shippingaddresschange` or `shippingoptionchange` to match the event listeners in the [Payment Request API documentation](https://developers.google.com/web/fundamentals/payments/deep-dive-into-payment-request#shipping_in_payment_request_api). Events will emit a {@link PaymentRequestComponent~shippingEventObject|shippingEventObject}.
 * @example
 * <caption>Listening to a Payment Request event, in this case 'shippingAddressChange'</caption>
 * braintree.paymentRequest.create({ ... }, function (createErr, paymentRequestInstance) {
 *   paymentRequestInstance.on('shippingAddressChange', function (event) {
 *     console.log(event.target.shippingAddress);
 *   });
 * });
 * @returns {void}
 */

/**
 * @name PaymentRequestComponent#off
 * @function
 * @param {string} event The name of the event to which you are unsubscribing.
 * @param {function} handler The callback for the event you are unsubscribing from.
 * @description Unsubscribes the handler function to a named event.
 * @example
 * <caption>Subscribing and then unsubscribing from a Payment Request event, in this case 'shippingAddressChange'</caption>
 * braintree.paymentRequest.create({ ... }, function (createErr, paymentRequestInstance) {
 *   var callback = function (event) {
 *     console.log(event.target.shippingAddress);
 *   };
 *   paymentRequestInstance.on('shippingAddressChange', callback);
 *
 *   // later on
 *   paymentRequestInstance.off('shippingAddressChange', callback);
 * });
 * @returns {void}
 */

/**
 * This event is emitted when the customer selects a shipping address.
 * @event PaymentRequestComponent#shippingAddressChange
 * @type {PaymentRequestComponent~shippingEventObject}
 * @example
 * <caption>Listening to a shipping address change event</caption>
 * braintree.paymentRequest.create({ ... }, function (createErr, paymentRequestInstance) {
 *   paymentRequestInstance.on('shippingAddressChange', function (event) {
 *     // validate event.target.shippingAddress if needed
 *
 *     event.updateWith(paymentRequestDetails);
 *   });
 * });
 */

/**
 * This event is emitted when the customer selects a shipping option.
 * @event PaymentRequestComponent#shippingOptionChange
 * @type {PaymentRequestComponent~shippingEventObject}
 * @example
 * <caption>Listening to a shipping option change event</caption>
 * braintree.paymentRequest.create({ ... }, function (createErr, paymentRequestInstance) {
 *   paymentRequestInstance.on('shippingOptionChange', function (event) {
 *     // validate event.target.shippingOption if needed
 *
 *     paymentRequestDetails.shippingOptions.forEach(function (option) {
 *       option.selected = option.id === event.target.shippingOption;
 *     });
 *
 *     event.updateWith(paymentRequestDetails);
 *   });
 * });
 */

var CARD_TYPE_MAPPINGS = {
  Visa: 'visa',
  MasterCard: 'mastercard',
  'American Express': 'amex',
  'Diners Club': 'diners',
  Discover: 'discover',
  JCB: 'jcb',
  UnionPay: 'unionpay',
  Maestro: 'maestro'
};

var BRAINTREE_GOOGLE_PAY_MERCHANT_ID = '18278000977346790994';

function composeUrl(assetsUrl, componentId, isDebug) {
  var baseUrl = assetsUrl;

  // endRemoveIf(production)

  return baseUrl + '/web/' + VERSION + '/html/payment-request-frame' + useMin(isDebug) + '.html#' + componentId;
}

/**
 * @class PaymentRequestComponent
 * @param {object} options The Payment Request Component {@link module:braintree-web/payment-request.create create} options.
 * @description <strong>Do not use this constructor directly. Use {@link module:braintree-web/payment-request.create|braintree-web.payment-request.create} instead.</strong>
 *
 * @classdesc This class represents a Payment Request component produced by {@link module:braintree-web/payment-request.create|braintree-web/payment-request.create}. Instances of this class have methods for initializing a Payment Request.
 *
 * **Note:** This component is currently in beta and the API may include breaking changes when upgrading. Please review the [Changelog](https://github.com/braintree/braintree-web/blob/master/CHANGELOG.md) for upgrade steps whenever you upgrade the version of braintree-web.
 */
function PaymentRequestComponent(options) {
  var enabledPaymentMethods = options.enabledPaymentMethods || {};

  EventEmitter.call(this);

  this._componentId = uuid();
  this._client = options.client;
  this._enabledPaymentMethods = {
    basicCard: enabledPaymentMethods.basicCard !== false,
    googlePay: enabledPaymentMethods.googlePay !== false
  };
  this._googlePayVersion = options.googlePayVersion === 2 ? 2 : 1;
  this._googleMerchantId = BRAINTREE_GOOGLE_PAY_MERCHANT_ID;
  this._supportedPaymentMethods = this._constructDefaultSupportedPaymentMethods();
  this._defaultSupportedPaymentMethods = Object.keys(this._supportedPaymentMethods).map(function (key) {
    return this._supportedPaymentMethods[key];
  }.bind(this));
  this._bus = new Bus({channel: this._componentId});
}

EventEmitter.createChild(PaymentRequestComponent);

PaymentRequestComponent.prototype._constructDefaultSupportedPaymentMethods = function () {
  var configuration = this._client.getConfiguration();
  var androidPayConfiguration = configuration.gatewayConfiguration.androidPay;
  var cardConfiguration = configuration.gatewayConfiguration.creditCards;
  var supportedPaymentMethods = {};

  if (this._enabledPaymentMethods.basicCard && cardConfiguration && cardConfiguration.supportedCardTypes.length > 0) {
    supportedPaymentMethods.basicCard = {
      supportedMethods: 'basic-card',
      data: {
        supportedNetworks: cardConfiguration.supportedCardTypes.reduce(function (types, cardType) {
          if (cardType in CARD_TYPE_MAPPINGS) {
            types.push(CARD_TYPE_MAPPINGS[cardType]);
          }

          return types;
        }, [])
      }
    };
  }

  if (this._enabledPaymentMethods.googlePay && androidPayConfiguration && androidPayConfiguration.enabled) {
    supportedPaymentMethods.googlePay = {
      supportedMethods: 'https://google.com/pay',
      data: generateGooglePayConfiguration(
        configuration, this._googlePayVersion, this._googleMerchantId
      )
    };
  }

  return supportedPaymentMethods;
};

PaymentRequestComponent.prototype.initialize = function () {
  var clientConfiguration = this._client.getConfiguration();
  var self = this;

  this._frame = iFramer({
    allowPaymentRequest: true,
    name: 'braintree-payment-request-frame',
    'class': 'braintree-payment-request-frame',
    height: 0,
    width: 0,
    style: {
      position: 'absolute',
      left: '-9999px'
    },
    title: 'Secure Payment Frame'
  });

  if (this._defaultSupportedPaymentMethods.length === 0) {
    return Promise.reject(new BraintreeError(errors.PAYMENT_REQUEST_NO_VALID_SUPPORTED_PAYMENT_METHODS));
  }

  return new Promise(function (resolve) {
    self._bus.on(events.FRAME_READY, function (reply) {
      reply(self._client);
    });
    self._bus.on(events.FRAME_CAN_MAKE_REQUESTS, function () {
      analytics.sendEvent(self._client, 'payment-request.initialized');
      self._bus.on(events.SHIPPING_ADDRESS_CHANGE, function (shippingAddress) {
        var shippingAddressChangeEvent = {
          target: {
            shippingAddress: shippingAddress
          },
          updateWith: function (paymentDetails) {
            self._bus.emit(events.UPDATE_SHIPPING_ADDRESS, paymentDetails);
          }
        };

        self._emit('shippingAddressChange', shippingAddressChangeEvent);
        self._emit('shippingaddresschange', shippingAddressChangeEvent);
      });
      self._bus.on(events.SHIPPING_OPTION_CHANGE, function (shippingOption) {
        var shippingOptionChangeEvent = {
          target: {
            shippingOption: shippingOption
          },
          updateWith: function (paymentDetails) {
            self._bus.emit(events.UPDATE_SHIPPING_OPTION, paymentDetails);
          }
        };

        self._emit('shippingOptionChange', shippingOptionChangeEvent);
        self._emit('shippingoptionchange', shippingOptionChangeEvent);
      });
      resolve(self);
    });

    // TODO - We may need to apply the same setTimeout hack that Hosted Fields
    // uses for iframes to load correctly in Edge. See:
    // https://github.com/braintree/braintree-web/blob/0c951e5f9859c606652485de14188b6bd6656677/src/hosted-fields/external/hosted-fields.js#L449-L469
    self._frame.src = composeUrl(clientConfiguration.gatewayConfiguration.assetsUrl, self._componentId, clientConfiguration.isDebug);
    document.body.appendChild(self._frame);
  });
};

/**
 * Create an object to pass into tokenize to specify a custom configuration. If no overrides are provided, the default configuration will be provided.
 * @public
 * @param {string} type The supported payment method type. Possible values are `basicCard` and `googlePay`.
 * If no type is provided, the function will throw an error. If the type provided is not an enabled payemnt method for the merchant account , the function will throw an error.
 * @param {object} [overrides] The configuration overrides for the [data property on the supported payment methods objects](https://developers.google.com/web/fundamentals/payments/deep-dive-into-payment-request). If not passed in, the default configuration for the specified type will be provided. If a property is not provided, the value from the default configruation will be used.
 * @example <caption>Getting the default configuration for a specified type</caption>
 * var configuration = paymentRequestInstance.createSupportedPaymentMethodsConfiguration('basicCard');
 *
 * configuration.supportedMethods; // 'basic-card'
 * configuration.data.supportedNetworks; // ['visa', 'mastercard', 'amex'] <- whatever the supported card networks for the merchant account are
 * @example <caption>Specifying overrides</caption>
 * var configuration = paymentRequestInstance.createSupportedPaymentMethodsConfiguration('basicCard', {
 *   supportedNetworks: ['visa'],
 *   supportedTypes: ['credit', 'debit']
 * });
 *
 * configuration.supportedMethods; // 'basic-card'
 * configuration.data.supportedNetworks; // ['visa']
 * configuration.data.supportedTypes; // ['credit', 'debit']
 * @returns {object} Returns a configuration object for use in the tokenize function.
 */
PaymentRequestComponent.prototype.createSupportedPaymentMethodsConfiguration = function (type, overrides) {
  var configuration;

  if (!type) {
    throw new BraintreeError(errors.PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_MUST_INCLUDE_TYPE);
  }

  if (!this._enabledPaymentMethods[type]) {
    throw new BraintreeError(errors.PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_TYPE_NOT_ENABLED);
  }

  configuration = assign({}, this._supportedPaymentMethods[type]);
  configuration.data = assign({}, configuration.data, overrides);

  return configuration;
};

/**
 * Tokenizes a Payment Request
 * @public
 * @param {object} configuration A {@link PaymentRequestComponent~paymentRequestConfiguration|paymentRequestConfiguration}.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link PaymentRequest~paymentPayload|paymentPayload}. If no callback is provided, `tokenize` returns a function that resolves with a {@link PaymentRequestComponent~tokenizePayload|tokenizePayload}.
 * @example
 * paymentRequestInstance.tokenize({
 *   details: {
 *     total: {
 *       label: 'Price',
 *       amount: {
 *         currency: 'USD',
 *         value: '100.00'
 *       }
 *     }
 *   }
 * }).then(function (payload) {
 *   // send payload.nonce to server
 *
 *   // examine the raw response (with card details removed for security) from the payment request
 *   console.log(payload.details.rawPaymentResponse);
 * }).catch(function (err) {
 *   if (err.code === 'PAYMENT_REQUEST_CANCELED') {
 *     // payment request was canceled by user
 *   } else {
 *     // an error occurred while processing
 *   }
 * });
 * @example <caption>Tokenize only Visa cards</caption>
 * var basicCardConfiguration = paymentRequestInstance.createSupportedPaymentMethodsConfiguration('basicCard', {
 *   supportedNetworks: ['visa']
 * };
 *
 * paymentRequestInstance.tokenize({
 *   supportedPaymentMethods: [basicCardConfiguration],
 *   details: {
 *     total: {
 *       label: 'Price',
 *       amount: {
 *         currency: 'USD',
 *         value: '100.00'
 *       }
 *     }
 *   }
 * }).then(function (payload) {
 *   // send payload.nonce to your server
 * });
 * @example <caption>Include payment request options</caption>
 * paymentRequestInstance.tokenize({
 *   details: {
 *     total: {
 *       label: 'Price',
 *       amount: {
 *         currency: 'USD',
 *         value: '100.00'
 *       }
 *     }
 *   },
 *   options: {
 *     requestPayerName: true,
 *     requestPayerPhone: true,
 *     requestPayerEmail: true
 *   }
 * }).then(function (payload) {
 *   // send payload.nonce to your server
 *   // collect additional info from the raw response
 *   console.log(payload.details.rawPaymentResponse);
 * });
 * @example <caption>Request Shipping Information</caption>
 * var shippingOptions = [
 *   {
 *     id: 'economy',
 *     label: 'Economy Shipping (5-7 Days)',
 *     amount: {
 *       currency: 'USD',
 *       value: '0',
 *     },
 *   }, {
 *     id: 'express',
 *     label: 'Express Shipping (2-3 Days)',
 *     amount: {
 *       currency: 'USD',
 *       value: '5',
 *     },
 *   }, {
 *     id: 'next-day',
 *     label: 'Next Day Delivery',
 *     amount: {
 *       currency: 'USD',
 *       value: '12',
 *     },
 *   },
 * ];
 * var paymentDetails = {
 * 	 total: {
 *     label: 'Total',
 *     amount: {
 *       currency: 'USD',
 *       value: '10.00',
 *     }
 *   },
 *   shippingOptions: shippingOptions
 * };
 *
 * paymentRequestInstance.on('shippingAddressChange', function (event) {
 *   // validate shipping address on event.target.shippingAddress
 *   // make changes to the paymentDetails or shippingOptions if necessary
 *
 *   event.updateWith(paymentDetails)
 * });
 *
 * paymentRequestInstance.on('shippingOptionChange', function (event) {
 *   shippingOptions.forEach(function (option) {
 *     option.selected = option.id === event.target.shippingOption;
 *   });
 *
 *   event.updateWith(paymentDetails)
 * });
 *
 * paymentRequestInstance.tokenize({
 *   details: paymentDetails,
 *   options: {
 *     requestShipping: true
 *   }
 * }).then(function (payload) {
 *   // send payload.nonce to your server
 *   // collect shipping information from payload
 *   console.log(payload.details.rawPaymentResponse.shippingAddress);
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
PaymentRequestComponent.prototype.tokenize = function (configuration) {
  var self = this;

  // NEXT_MAJOR_VERSION fail early if a payment method is passed in
  // that the component does not support
  return new Promise(function (resolve, reject) {
    self._bus.emit(events.PAYMENT_REQUEST_INITIALIZED, {
      supportedPaymentMethods: configuration.supportedPaymentMethods || self._defaultSupportedPaymentMethods,
      details: configuration.details,
      options: configuration.options
    }, function (response) {
      var rawError = response[0];
      var payload = response[1];

      if (rawError) {
        reject(self._formatTokenizationError(rawError));

        return;
      }

      analytics.sendEvent(self._client, 'payment-request.tokenize.succeeded');
      resolve({
        nonce: payload.nonce,
        type: payload.type,
        description: payload.description,
        details: {
          rawPaymentResponse: payload.details.rawPaymentResponse,
          cardType: payload.details.cardType,
          lastFour: payload.details.lastFour,
          lastTwo: payload.details.lastTwo
        },
        binData: payload.binData
      });
    });
  });
};

/**
 * Check if the customer can make payments.
 * @public
 * @param {object} configuration A {@link PaymentRequestComponent~paymentRequestConfiguration|paymentRequestConfiguration}.
 * @param {callback} [callback] Called on completion.
 * @example
 * var paymentDetails = {
 * 	 total: {
 *     label: 'Total',
 *     amount: {
 *       currency: 'USD',
 *       value: '10.00',
 *     }
 *   }
 * };
 *
 * paymentRequestInstance.canMakePayment({
 *   details: paymentDetails
 * }).then(function (result) {
 *   if (result) {
 *     // set up payment request button
 *   }
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
PaymentRequestComponent.prototype.canMakePayment = function (configuration) {
  var self = this;
  var unsupportedPaymentMethod;

  // NEXT_MAJOR_VERSION Move this check to component creation
  if (!window.PaymentRequest) {
    analytics.sendEvent(self._client, 'payment-request.can-make-payment.not-available');

    return Promise.resolve(false);
  }

  if (configuration.supportedPaymentMethods) {
    configuration.supportedPaymentMethods.forEach(function (config) {
      var supportedMethods = config.supportedMethods;

      if (!(supportedMethods in constants.SUPPORTED_METHODS)) {
        unsupportedPaymentMethod = supportedMethods;
      }
    });

    if (unsupportedPaymentMethod) {
      return Promise.reject(new BraintreeError({
        type: errors.PAYMENT_REQUEST_UNSUPPORTED_PAYMENT_METHOD.type,
        code: errors.PAYMENT_REQUEST_UNSUPPORTED_PAYMENT_METHOD.code,
        message: unsupportedPaymentMethod + ' is not a supported payment method.'
      }));
    }
  }

  return new Promise(function (resolve, reject) {
    self._bus.emit(events.CAN_MAKE_PAYMENT, {
      supportedPaymentMethods: configuration.supportedPaymentMethods || self._defaultSupportedPaymentMethods,
      details: configuration.details,
      options: configuration.options
    }, function (response) {
      var error = response[0];
      var payload = response[1];

      if (error) {
        reject(self._formatCanMakePaymentError(error));

        return;
      }

      analytics.sendEvent(self._client, 'payment-request.can-make-payment.' + payload);

      resolve(payload);
    });
  });
};

/**
 * Cleanly remove anything set up by {@link module:braintree-web/payment-request.create|create}.
 * @public
 * @param {callback} [callback] Called on completion.
 * @example
 * paymentRequestInstance.teardown();
 * @example <caption>With callback</caption>
 * paymentRequestInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
PaymentRequestComponent.prototype.teardown = function () {
  this._bus.teardown();
  this._frame.parentNode.removeChild(this._frame);

  convertMethodsToError(this, methods(PaymentRequestComponent.prototype));

  analytics.sendEvent(this._client, 'payment-request.teardown-completed');

  return Promise.resolve();
};

PaymentRequestComponent.prototype._formatTokenizationError = function (error) {
  var formattedError;

  switch (error.name) {
    case 'AbortError':
      formattedError = new BraintreeError({
        type: errors.PAYMENT_REQUEST_CANCELED.type,
        code: errors.PAYMENT_REQUEST_CANCELED.code,
        message: errors.PAYMENT_REQUEST_CANCELED.message,
        details: {
          originalError: error
        }
      });

      analytics.sendEvent(this._client, 'payment-request.tokenize.canceled');

      return formattedError;
    case 'PAYMENT_REQUEST_INITIALIZATION_FAILED':
      formattedError = new BraintreeError({
        type: errors.PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED.type,
        code: errors.PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED.code,
        message: errors.PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED.message,
        details: {
          originalError: error
        }
      });
      break;
    case 'BRAINTREE_GATEWAY_GOOGLE_PAYMENT_TOKENIZATION_ERROR':
      formattedError = new BraintreeError({
        type: errors.PAYMENT_REQUEST_GOOGLE_PAYMENT_FAILED_TO_TOKENIZE.type,
        code: errors.PAYMENT_REQUEST_GOOGLE_PAYMENT_FAILED_TO_TOKENIZE.code,
        message: errors.PAYMENT_REQUEST_GOOGLE_PAYMENT_FAILED_TO_TOKENIZE.message,
        details: {
          originalError: error
        }
      });
      break;
    case 'BRAINTREE_GATEWAY_GOOGLE_PAYMENT_PARSING_ERROR':
      formattedError = new BraintreeError({
        type: errors.PAYMENT_REQUEST_GOOGLE_PAYMENT_PARSING_ERROR.type,
        code: errors.PAYMENT_REQUEST_GOOGLE_PAYMENT_PARSING_ERROR.code,
        message: errors.PAYMENT_REQUEST_GOOGLE_PAYMENT_PARSING_ERROR.message,
        details: {
          originalError: error
        }
      });
      break;
    default:
      formattedError = new BraintreeError({
        code: errors.PAYMENT_REQUEST_NOT_COMPLETED.code,
        type: error.type || BraintreeError.types.CUSTOMER,
        message: errors.PAYMENT_REQUEST_NOT_COMPLETED.message,
        details: {
          originalError: error
        }
      });
  }

  analytics.sendEvent(this._client, 'payment-request.tokenize.failed');

  return formattedError;
};

PaymentRequestComponent.prototype._formatCanMakePaymentError = function (error) {
  var formattedError;

  switch (error.name) {
    case 'PAYMENT_REQUEST_INITIALIZATION_FAILED':
      formattedError = new BraintreeError({
        type: errors.PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED.type,
        code: errors.PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED.code,
        message: errors.PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED.message,
        details: {
          originalError: error
        }
      });
      break;
    case 'NotAllowedError':
      formattedError = new BraintreeError({
        type: errors.PAYMENT_REQUEST_CAN_MAKE_PAYMENT_NOT_ALLOWED.type,
        code: errors.PAYMENT_REQUEST_CAN_MAKE_PAYMENT_NOT_ALLOWED.code,
        message: errors.PAYMENT_REQUEST_CAN_MAKE_PAYMENT_NOT_ALLOWED.message,
        details: {
          originalError: error
        }
      });
      break;
    default:
      formattedError = new BraintreeError({
        code: errors.PAYMENT_REQUEST_CAN_MAKE_PAYMENT_FAILED.code,
        type: errors.PAYMENT_REQUEST_CAN_MAKE_PAYMENT_FAILED.type,
        message: errors.PAYMENT_REQUEST_CAN_MAKE_PAYMENT_FAILED.message,
        details: {
          originalError: error
        }
      });
  }

  analytics.sendEvent(this._client, 'payment-request.can-make-payment.failed');

  return formattedError;
};

module.exports = wrapPromise.wrapPrototype(PaymentRequestComponent);

},{"../../lib/analytics":30,"../../lib/assign":32,"../../lib/braintree-error":34,"../../lib/bus":37,"../../lib/convert-methods-to-error":39,"../../lib/generate-google-pay-configuration":45,"../../lib/methods":48,"../../lib/promise":49,"../../lib/use-min":50,"../../lib/vendor/uuid":52,"../shared/constants":55,"@braintree/event-emitter":3,"@braintree/iframer":5,"@braintree/wrap-promise":12}],54:[function(_dereq_,module,exports){
'use strict';
/**
 * @module braintree-web/payment-request
 * @description A component to integrate with the Payment Request API.
 *
 * **Note:** This component is currently in beta and the API may include breaking changes when upgrading. Please review the [Changelog](https://github.com/braintree/braintree-web/blob/master/CHANGELOG.md) for upgrade steps whenever you upgrade the version of braintree-web.
 * */

var PaymentRequestComponent = _dereq_('./external/payment-request');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var VERSION = "3.63.0";

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {object} [options.enabledPaymentMethods] An object representing which payment methods to display.
 * @param {boolean} [options.enabledPaymentMethods.basicCard=true] Whether or not to display credit card as an option in the Payment Request dialog. If left blank or set to true, credit cards will be displayed in the dialog if the merchant account is set up to process credit cards.
 * @param {boolean} [options.enabledPaymentMethods.googlePay=true] Whether or not to display Google Pay as an option in the Payment Request dialog. If left blank or set to true, Google Pay will be displayed in the dialog if the merchant account is set up to process Google Pay.
 * @param {Number} [options.googlePayVersion=1] Ignored if `options.enabledPaymentMethods.googlePay = false`. If `true`, this option specifies the version of Google Pay to use. Choose either 1 (default) or 2.
 * @param {callback} [callback] The second argument, `data`, is the {@link PaymentRequestComponent} instance. If no callback is provided, `create` returns a promise that resolves with the {@link PaymentRequestComponent} instance.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * if (window.PaymentRequest) {
 *   braintree.paymentRequest.create({
 *     client: clientInstance
 *   }, cb);
 * } else {
 *   // fall back to Hosted Fields if browser does not support Payment Request API
 *   braintree.hostedFields.create(hostedFieldsOptions, cb);
 * }
 * @example <caption>Explicitly turning off credit cards from Payment Request API dialog</caption>
 * braintree.paymentRequest.create({
 *   client: clientInstance,
 *   enabledPaymentMethods: {
 *     googlePay: true,
 *     basicCard: false
 *   }
 * }, cb);
 * @example <caption>Using Google Pay v2 or basic card</caption>
 * braintree.paymentRequest.create({
 *   client: clientInstance,
 *   enabledPaymentMethods: {
 *     basicCard: true,
 *     googlePay: true
 *   },
 *   googlePayVersion: 2
 * }, cb);
 *
 */
function create(options) {
  var name = 'Payment Request';

  return basicComponentVerification.verify({
    name: name,
    client: options.client,
    authorization: options.authorization
  }).then(function () {
    return createDeferredClient.create({
      authorization: options.authorization,
      client: options.client,
      debug: options.debug,
      assetsUrl: createAssetsUrl.create(options.authorization),
      name: name
    });
  }).then(function (client) {
    var paymentRequestInstance;

    options.client = client;
    paymentRequestInstance = new PaymentRequestComponent(options);

    return paymentRequestInstance.initialize();
  });
}

module.exports = {
  create: wrapPromise(create),
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"../lib/basic-component-verification":33,"../lib/create-assets-url":40,"../lib/create-deferred-client":42,"./external/payment-request":53,"@braintree/wrap-promise":12}],55:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../../lib/enumerate');
var errors = _dereq_('./errors');

var constants = {};

constants.events = enumerate([
  'CAN_MAKE_PAYMENT',
  'FRAME_READY',
  'FRAME_CAN_MAKE_REQUESTS',
  'PAYMENT_REQUEST_INITIALIZED',
  'SHIPPING_ADDRESS_CHANGE',
  'UPDATE_SHIPPING_ADDRESS',
  'SHIPPING_OPTION_CHANGE',
  'UPDATE_SHIPPING_OPTION'
], 'payment-request:');

constants.errors = errors;

constants.SUPPORTED_METHODS = {
  'basic-card': true,
  'https://google.com/pay': true
};

module.exports = constants;

},{"../../lib/enumerate":43,"./errors":56}],56:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Payment Request - Creation Error Codes
 * @description Errors that occur when [creating the Payment Request component](/current/module-braintree-web_payment-request.html#.create).
 * @property {MERCHANT} PAYMENT_REQUEST_NO_VALID_SUPPORTED_PAYMENT_METHODS Occurs when there are no valid payment methods configured.
 */

/**
 * @name BraintreeError.Payment Request - createSupportedPaymentMethodsConfiguration  Error Codes
 * @description Errors that occur when using the [`createSupportedPaymentMethodsConfiguration` method](/current/PaymentRequestComponent.html#createSupportedPaymentMethodsConfiguration)
 * @property {MERCHANT} PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_MUST_INCLUDE_TYPE Occurs when no type is supplied for method.
 * @property {MERCHANT} PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_TYPE_NOT_ENABLED Occurs when configured type is not enabled.
 */

/**
 * @name BraintreeError.Payment Request - tokenize  Error Codes
 * @description Errors that occur when using the [`tokenize` method](/current/PaymentRequestComponent.html#tokenize)
 * @property {CUSTOMER} PAYMENT_REQUEST_CANCELED Occurs when customer cancels the Payment Request.
 * @property {MERCHANT} PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED Occurs when the Payment Request is closed do to the options being misconfigured.
 * @property {MERCHANT} PAYMENT_REQUEST_GOOGLE_PAYMENT_FAILED_TO_TOKENIZE Occurs when a Google Payment payment method is unable to be tokenized.
 * @property {UNKNOWN} PAYMENT_REQUEST_GOOGLE_PAYMENT_PARSING_ERROR Occurs when the result of tokenizing a Google Payment payment method could not be parsed.
 * @property {CUSTOMER} PAYMENT_REQUEST_NOT_COMPLETED Occurs when an error prevented the Payment Request from being completed.
 */

/**
 * @name BraintreeError.Payment Request - canMakePayment  Error Codes
 * @description Errors that occur when using the [`canMakePayment` method](/current/PaymentRequestComponent.html#canMakePayment)
 * @property {MERCHANT} PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED Occurs when the Payment Request is intatiated with misconfigured options.
 * @property {MERCHANT} PAYMENT_REQUEST_CAN_MAKE_PAYMENT_NOT_ALLOWED Occurs when `canMakePayment` results in a `DomException` with a `NotAllowedError`. This usually occurs when `canMakePayment` is called multiple times with different supported payment options.
 * @property {MERCHANT} PAYMENT_REQUEST_UNSUPPORTED_PAYMENT_METHOD Occurs when `canMakePayment` is called with a `supportedPaymentMethods` array that contains a payment method that is not supported by the Braintree SDK.
 * @property {UNKNOWN} PAYMENT_REQUEST_CAN_MAKE_PAYMENT_FAILED Occurs when `canMakePayment` fails for any reason other than a misconfigured Payment Request object.
 */

var BraintreeError = _dereq_('../../lib/braintree-error');

module.exports = {
  PAYMENT_REQUEST_NO_VALID_SUPPORTED_PAYMENT_METHODS: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_NO_VALID_SUPPORTED_PAYMENT_METHODS',
    message: 'There are no supported payment methods associated with this account.'
  },
  PAYMENT_REQUEST_CANCELED: {
    type: BraintreeError.types.CUSTOMER,
    code: 'PAYMENT_REQUEST_CANCELED',
    message: 'Payment request was canceled.'
  },
  PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED',
    message: 'Something went wrong when configuring the payment request.'
  },
  PAYMENT_REQUEST_CAN_MAKE_PAYMENT_FAILED: {
    type: BraintreeError.types.UNKNOWN,
    code: 'PAYMENT_REQUEST_CAN_MAKE_PAYMENT_FAILED',
    message: 'Something went wrong when calling `canMakePayment`'
  },
  PAYMENT_REQUEST_CAN_MAKE_PAYMENT_NOT_ALLOWED: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_CAN_MAKE_PAYMENT_NOT_ALLOWED',
    message: 'Something went wrong when calling `canMakePayment`. Most likely, `canMakePayment` was called multiple times with different supportedMethods configurations.'
  },
  PAYMENT_REQUEST_UNSUPPORTED_PAYMENT_METHOD: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_UNSUPPORTED_PAYMENT_METHOD'
  },
  PAYMENT_REQUEST_GOOGLE_PAYMENT_FAILED_TO_TOKENIZE: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_GOOGLE_PAYMENT_FAILED_TO_TOKENIZE',
    message: 'Something went wrong when tokenizing the Google Pay card.'
  },
  PAYMENT_REQUEST_GOOGLE_PAYMENT_PARSING_ERROR: {
    type: BraintreeError.types.UNKNOWN,
    code: 'PAYMENT_REQUEST_GOOGLE_PAYMENT_PARSING_ERROR',
    message: 'Something went wrong when tokenizing the Google Pay card.'
  },
  PAYMENT_REQUEST_NOT_COMPLETED: {
    code: 'PAYMENT_REQUEST_NOT_COMPLETED',
    message: 'Payment request could not be completed.'
  },
  PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_MUST_INCLUDE_TYPE: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_MUST_INCLUDE_TYPE',
    message: 'createSupportedPaymentMethodsConfiguration must include a type parameter.'
  },
  PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_TYPE_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_TYPE_NOT_ENABLED',
    message: 'createSupportedPaymentMethodsConfiguration type parameter must be valid or enabled.'
  }
};

},{"../../lib/braintree-error":34}]},{},[54])(54)
});
