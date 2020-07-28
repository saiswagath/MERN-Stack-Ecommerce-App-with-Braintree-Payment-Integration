(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.braintree = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
(function (global){
'use strict';

var PromisePolyfill = _dereq_('promise-polyfill');

module.exports = global.Promise || PromisePolyfill;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"promise-polyfill":53}],2:[function(_dereq_,module,exports){
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
(function (global){
'use strict';

module.exports = function isAndroid(ua) {
  ua = ua || global.navigator.userAgent;

  return /Android/.test(ua);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(_dereq_,module,exports){
(function (global){
'use strict';

module.exports = function isChromeOS(ua) {
  ua = ua || global.navigator.userAgent;

  return /CrOS/i.test(ua);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(_dereq_,module,exports){
'use strict';

var isEdge = _dereq_('./is-edge');
var isSamsung = _dereq_('./is-samsung');

module.exports = function isChrome(ua) {
  ua = ua || navigator.userAgent;

  return (ua.indexOf('Chrome') !== -1 || ua.indexOf('CriOS') !== -1) && !isEdge(ua) && !isSamsung(ua);
};

},{"./is-edge":6,"./is-samsung":18}],6:[function(_dereq_,module,exports){
'use strict';

module.exports = function isEdge(ua) {
  ua = ua || navigator.userAgent;

  return ua.indexOf('Edge/') !== -1;
};

},{}],7:[function(_dereq_,module,exports){
(function (global){
'use strict';

module.exports = function isFirefox(ua) {
  ua = ua || global.navigator.userAgent;

  return /Firefox/i.test(ua);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(_dereq_,module,exports){
(function (global){
'use strict';

var isIE11 = _dereq_('./is-ie11');

module.exports = function isIE(ua) {
  ua = ua || global.navigator.userAgent;

  return ua.indexOf('MSIE') !== -1 || isIE11(ua);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./is-ie11":10}],9:[function(_dereq_,module,exports){
'use strict';

module.exports = function isIe10(ua) {
  ua = ua || navigator.userAgent;

  return ua.indexOf('MSIE 10') !== -1;
};

},{}],10:[function(_dereq_,module,exports){
'use strict';

module.exports = function isIe11(ua) {
  ua = ua || navigator.userAgent;

  return ua.indexOf('Trident/7') !== -1;
};

},{}],11:[function(_dereq_,module,exports){
'use strict';

module.exports = function isIe9(ua) {
  ua = ua || navigator.userAgent;

  return ua.indexOf('MSIE 9') !== -1;
};

},{}],12:[function(_dereq_,module,exports){
(function (global){
'use strict';

module.exports = function isIosFirefox(ua) {
  ua = ua || global.navigator.userAgent;

  return /FxiOS/i.test(ua);
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(_dereq_,module,exports){
'use strict';

var isIos = _dereq_('./is-ios');
var webkitRegexp = /webkit/i;

function isWebkit(ua) {
  return ua.match(webkitRegexp);
}

module.exports = function isIosSafari(ua) {
  ua = ua || navigator.userAgent;

  return isIos(ua) && isWebkit(ua) && ua.indexOf('CriOS') === -1;
};

},{"./is-ios":16}],14:[function(_dereq_,module,exports){
(function (global){
'use strict';

var isIos = _dereq_('./is-ios');

// The Google Search iOS app is technically a webview and doesn't support popups.
function isGoogleSearchApp(ua) {
  return /\bGSA\b/.test(ua);
}

module.exports = function isIosWebview(ua) {
  ua = ua || global.navigator.userAgent;
  if (isIos(ua)) {
    if (isGoogleSearchApp(ua)) {
      return true;
    }

    return /.+AppleWebKit(?!.*Safari)/.test(ua);
  }

  return false;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./is-ios":16}],15:[function(_dereq_,module,exports){
(function (global){
'use strict';

var isIosWebview = _dereq_('./is-ios-webview');

module.exports = function isIosWKWebview(ua, statusBarVisible) {
  statusBarVisible = typeof statusBarVisible !== 'undefined' ? statusBarVisible : global.statusbar.visible;

  return isIosWebview(ua) && statusBarVisible;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./is-ios-webview":14}],16:[function(_dereq_,module,exports){
(function (global){
'use strict';

module.exports = function isIos(ua) {
  ua = ua || global.navigator.userAgent;

  return /iPhone|iPod|iPad/i.test(ua);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],17:[function(_dereq_,module,exports){
(function (global){
'use strict';

var isIosFirefox = _dereq_('./is-ios-firefox');
var isFirefox = _dereq_('./is-firefox');

module.exports = function isMobileFirefox(ua) {
  ua = ua || global.navigator.userAgent;

  return isIosFirefox(ua) || (/iPhone|iPod|iPad|Mobile|Tablet/i.test(ua) && isFirefox(ua));
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./is-firefox":7,"./is-ios-firefox":12}],18:[function(_dereq_,module,exports){
(function (global){
'use strict';

module.exports = function isSamsungBrowser(ua) {
  ua = ua || global.navigator.userAgent;

  return /SamsungBrowser/i.test(ua);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],19:[function(_dereq_,module,exports){
(function (global){
'use strict';

var MINIMUM_SUPPORTED_CHROME_IOS_VERSION = 48;

var isAndroid = _dereq_('./is-android');
var isIosFirefox = _dereq_('./is-ios-firefox');
var isIosWebview = _dereq_('./is-ios-webview');
var isChrome = _dereq_('./is-chrome');
var isSamsungBrowser = _dereq_('./is-samsung');

function isUnsupportedIosChrome(ua) {
  var match, version;

  ua = ua || global.navigator.userAgent;
  match = ua.match(/CriOS\/(\d+)\./);

  if (!match) {
    return false;
  }

  version = parseInt(match[1], 10);

  return version < MINIMUM_SUPPORTED_CHROME_IOS_VERSION;
}

function isOperaMini(ua) {
  ua = ua || global.navigator.userAgent;

  return ua.indexOf('Opera Mini') > -1;
}

function isAndroidWebview(ua) {
  var androidWebviewRegExp = /Version\/[\d\.]+/;

  ua = ua || global.navigator.userAgent;
  if (isAndroid(ua)) {
    return androidWebviewRegExp.test(ua) && !isOperaMini(ua);
  }

  return false;
}

function isOldSamsungBrowserOrSamsungWebview(ua) {
  return !isChrome(ua) && !isSamsungBrowser(ua) && /samsung/i.test(ua);
}

module.exports = function supportsPopups(ua) {
  ua = ua || global.navigator.userAgent;

  return !(
    isIosWebview(ua) ||
    isIosFirefox(ua) ||
    isAndroidWebview(ua) ||
    isOperaMini(ua) ||
    isUnsupportedIosChrome(ua) ||
    isOldSamsungBrowserOrSamsungWebview(ua)
  );
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./is-android":3,"./is-chrome":5,"./is-ios-firefox":12,"./is-ios-webview":14,"./is-samsung":18}],20:[function(_dereq_,module,exports){
'use strict';

function _classesOf(element) {
  return element.className.trim().split(/\s+/);
}

function add(element) {
  var toAdd = Array.prototype.slice.call(arguments, 1);
  var className = _classesOf(element).filter(function (classname) {
    return toAdd.indexOf(classname) === -1;
  }).concat(toAdd).join(' ');

  element.className = className;
}

function remove(element) {
  var toRemove = Array.prototype.slice.call(arguments, 1);
  var className = _classesOf(element).filter(function (classname) {
    return toRemove.indexOf(classname) === -1;
  }).join(' ');

  element.className = className;
}

function toggle(element, classname, adding) {
  if (adding) {
    add(element, classname);
  } else {
    remove(element, classname);
  }
}

module.exports = {
  add: add,
  remove: remove,
  toggle: toggle
};

},{}],21:[function(_dereq_,module,exports){
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

},{}],22:[function(_dereq_,module,exports){
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

},{}],23:[function(_dereq_,module,exports){
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

},{"./lib/assign":24,"./lib/default-attributes":25,"./lib/set-attributes":26}],24:[function(_dereq_,module,exports){
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

},{}],25:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  src: 'about:blank',
  frameBorder: 0,
  allowtransparency: true,
  scrolling: 'no'
};

},{}],26:[function(_dereq_,module,exports){
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

},{}],27:[function(_dereq_,module,exports){
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

},{}],28:[function(_dereq_,module,exports){
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

},{}],29:[function(_dereq_,module,exports){
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

},{}],30:[function(_dereq_,module,exports){
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

},{"./lib/deferred":27,"./lib/once":28,"./lib/promise-or-callback":29}],31:[function(_dereq_,module,exports){
'use strict';

var types = _dereq_('./lib/card-types');
var clone = _dereq_('./lib/clone');
var findBestMatch = _dereq_('./lib/find-best-match');
var isValidInputType = _dereq_('./lib/is-valid-input-type');
var addMatchingCardsToResults = _dereq_('./lib/add-matching-cards-to-results');

var testOrder;
var customCards = {};

var cardNames = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMERICAN_EXPRESS: 'american-express',
  DINERS_CLUB: 'diners-club',
  DISCOVER: 'discover',
  JCB: 'jcb',
  UNIONPAY: 'unionpay',
  MAESTRO: 'maestro',
  ELO: 'elo',
  MIR: 'mir',
  HIPER: 'hiper',
  HIPERCARD: 'hipercard'
};

var ORIGINAL_TEST_ORDER = [
  cardNames.VISA,
  cardNames.MASTERCARD,
  cardNames.AMERICAN_EXPRESS,
  cardNames.DINERS_CLUB,
  cardNames.DISCOVER,
  cardNames.JCB,
  cardNames.UNIONPAY,
  cardNames.MAESTRO,
  cardNames.ELO,
  cardNames.MIR,
  cardNames.HIPER,
  cardNames.HIPERCARD
];

testOrder = clone(ORIGINAL_TEST_ORDER);

function findType(type) {
  return customCards[type] || types[type];
}

function getAllCardTypes() {
  return testOrder.map(function (type) {
    return clone(findType(type));
  });
}

function getCardPosition(name, ignoreErrorForNotExisting) {
  var position = testOrder.indexOf(name);

  if (!ignoreErrorForNotExisting && position === -1) {
    throw new Error('"' + name + '" is not a supported card type.');
  }

  return position;
}

function creditCardType(cardNumber) {
  var bestMatch;
  var results = [];

  if (!isValidInputType(cardNumber)) {
    return [];
  }

  if (cardNumber.length === 0) {
    return getAllCardTypes(testOrder);
  }

  testOrder.forEach(function (type) {
    var cardConfiguration = findType(type);

    addMatchingCardsToResults(cardNumber, cardConfiguration, results);
  });

  bestMatch = findBestMatch(results);

  if (bestMatch) {
    return [bestMatch];
  }

  return results;
}

creditCardType.getTypeInfo = function (type) {
  return clone(findType(type));
};

creditCardType.removeCard = function (name) {
  var position = getCardPosition(name);

  testOrder.splice(position, 1);
};

creditCardType.addCard = function (config) {
  var existingCardPosition = getCardPosition(config.type, true);

  customCards[config.type] = config;

  if (existingCardPosition === -1) {
    testOrder.push(config.type);
  }
};

creditCardType.updateCard = function (cardType, updates) {
  var clonedCard;
  var originalObject = customCards[cardType] || types[cardType];

  if (!originalObject) {
    throw new Error('"' + cardType + '" is not a recognized type. Use `addCard` instead.');
  }

  if (updates.type && originalObject.type !== updates.type) {
    throw new Error('Cannot overwrite type parameter.');
  }

  clonedCard = clone(originalObject, true);

  Object.keys(clonedCard).forEach(function (key) {
    if (updates[key]) {
      clonedCard[key] = updates[key];
    }
  });

  customCards[clonedCard.type] = clonedCard;
};

creditCardType.changeOrder = function (name, position) {
  var currentPosition = getCardPosition(name);

  testOrder.splice(currentPosition, 1);
  testOrder.splice(position, 0, name);
};

creditCardType.resetModifications = function () {
  testOrder = clone(ORIGINAL_TEST_ORDER);
  customCards = {};
};

creditCardType.types = cardNames;

module.exports = creditCardType;

},{"./lib/add-matching-cards-to-results":32,"./lib/card-types":33,"./lib/clone":34,"./lib/find-best-match":35,"./lib/is-valid-input-type":36}],32:[function(_dereq_,module,exports){
'use strict';

var clone = _dereq_('./clone');
var matches = _dereq_('./matches');

function addMatchingCardsToResults(cardNumber, cardConfiguration, results) {
  var i, pattern, patternLength, clonedCardConfiguration;

  for (i = 0; i < cardConfiguration.patterns.length; i++) {
    pattern = cardConfiguration.patterns[i];

    if (!matches(cardNumber, pattern)) {
      continue;
    }

    clonedCardConfiguration = clone(cardConfiguration);

    if (Array.isArray(pattern)) {
      patternLength = String(pattern[0]).length;
    } else {
      patternLength = String(pattern).length;
    }

    if (cardNumber.length >= patternLength) {
      clonedCardConfiguration.matchStrength = patternLength;
    }

    results.push(clonedCardConfiguration);
    break;
  }
}

module.exports = addMatchingCardsToResults;

},{"./clone":34,"./matches":37}],33:[function(_dereq_,module,exports){
'use strict';

var cardTypes = {
  visa: {
    niceType: 'Visa',
    type: 'visa',
    patterns: [
      4
    ],
    gaps: [4, 8, 12],
    lengths: [16, 18, 19],
    code: {
      name: 'CVV',
      size: 3
    }
  },
  mastercard: {
    niceType: 'Mastercard',
    type: 'mastercard',
    patterns: [
      [51, 55],
      [2221, 2229],
      [223, 229],
      [23, 26],
      [270, 271],
      2720
    ],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CVC',
      size: 3
    }
  },
  'american-express': {
    niceType: 'American Express',
    type: 'american-express',
    patterns: [
      34,
      37
    ],
    gaps: [4, 10],
    lengths: [15],
    code: {
      name: 'CID',
      size: 4
    }
  },
  'diners-club': {
    niceType: 'Diners Club',
    type: 'diners-club',
    patterns: [
      [300, 305],
      36,
      38,
      39
    ],
    gaps: [4, 10],
    lengths: [14, 16, 19],
    code: {
      name: 'CVV',
      size: 3
    }
  },
  discover: {
    niceType: 'Discover',
    type: 'discover',
    patterns: [
      6011,
      [644, 649],
      65
    ],
    gaps: [4, 8, 12],
    lengths: [16, 19],
    code: {
      name: 'CID',
      size: 3
    }
  },
  jcb: {
    niceType: 'JCB',
    type: 'jcb',
    patterns: [
      2131,
      1800,
      [3528, 3589]
    ],
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: {
      name: 'CVV',
      size: 3
    }
  },
  unionpay: {
    niceType: 'UnionPay',
    type: 'unionpay',
    patterns: [
      620,
      [624, 626],
      [62100, 62182],
      [62184, 62187],
      [62185, 62197],
      [62200, 62205],
      [622010, 622999],
      622018,
      [622019, 622999],
      [62207, 62209],
      [622126, 622925],
      [623, 626],
      6270,
      6272,
      6276,
      [627700, 627779],
      [627781, 627799],
      [6282, 6289],
      6291,
      6292,
      810,
      [8110, 8131],
      [8132, 8151],
      [8152, 8163],
      [8164, 8171]
    ],
    gaps: [4, 8, 12],
    lengths: [14, 15, 16, 17, 18, 19],
    code: {
      name: 'CVN',
      size: 3
    }
  },
  maestro: {
    niceType: 'Maestro',
    type: 'maestro',
    patterns: [
      493698,
      [500000, 506698],
      [506779, 508999],
      [56, 59],
      63,
      67,
      6
    ],
    gaps: [4, 8, 12],
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    code: {
      name: 'CVC',
      size: 3
    }
  },
  elo: {
    niceType: 'Elo',
    type: 'elo',
    patterns: [
      401178,
      401179,
      438935,
      457631,
      457632,
      431274,
      451416,
      457393,
      504175,
      [506699, 506778],
      [509000, 509999],
      627780,
      636297,
      636368,
      [650031, 650033],
      [650035, 650051],
      [650405, 650439],
      [650485, 650538],
      [650541, 650598],
      [650700, 650718],
      [650720, 650727],
      [650901, 650978],
      [651652, 651679],
      [655000, 655019],
      [655021, 655058]
    ],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CVE',
      size: 3
    }
  },
  mir: {
    niceType: 'Mir',
    type: 'mir',
    patterns: [
      [2200, 2204]
    ],
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: {
      name: 'CVP2',
      size: 3
    }
  },
  hiper: {
    niceType: 'Hiper',
    type: 'hiper',
    patterns: [
      637095,
      637568,
      637599,
      637609,
      637612
    ],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CVC',
      size: 3
    }
  },
  hipercard: {
    niceType: 'Hipercard',
    type: 'hipercard',
    patterns: [
      606282
    ],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CVC',
      size: 3
    }
  }
};

module.exports = cardTypes;

},{}],34:[function(_dereq_,module,exports){
'use strict';

function clone(originalObject) {
  var dupe;

  if (!originalObject) { return null; }

  dupe = JSON.parse(JSON.stringify(originalObject));

  return dupe;
}

module.exports = clone;

},{}],35:[function(_dereq_,module,exports){
'use strict';

function hasEnoughResultsToDetermineBestMatch(results) {
  var numberOfResultsWithMaxStrengthProperty = results.filter(function (result) {
    return result.matchStrength;
  }).length;

  // if all possible results have a maxStrength property
  // that means the card number is sufficiently long
  // enough to determine conclusively what the type is
  return numberOfResultsWithMaxStrengthProperty > 0 &&
    numberOfResultsWithMaxStrengthProperty === results.length;
}

function findBestMatch(results) {
  if (!hasEnoughResultsToDetermineBestMatch(results)) {
    return;
  }

  return results.reduce(function (bestMatch, result) { // eslint-disable-line consistent-return
    if (!bestMatch) {
      return result;
    }

    // if the current best match pattern is less specific
    // than this result, set the result as the new best match
    if (bestMatch.matchStrength < result.matchStrength) {
      return result;
    }

    return bestMatch;
  });
}

module.exports = findBestMatch;

},{}],36:[function(_dereq_,module,exports){
'use strict';

function isValidInputType(cardNumber) {
  return typeof cardNumber === 'string' || cardNumber instanceof String;
}

module.exports = isValidInputType;

},{}],37:[function(_dereq_,module,exports){
'use strict';

// Adapted from https://github.com/polvo-labs/card-type/blob/aaab11f80fa1939bccc8f24905a06ae3cd864356/src/cardType.js#L37-L42
function matchesRange(cardNumber, min, max) {
  var maxLengthToCheck = String(min).length;
  var substr = cardNumber.substr(0, maxLengthToCheck);
  var integerRepresentationOfCardNumber = parseInt(substr, 10);

  min = parseInt(String(min).substr(0, substr.length), 10);
  max = parseInt(String(max).substr(0, substr.length), 10);

  return integerRepresentationOfCardNumber >= min && integerRepresentationOfCardNumber <= max;
}

function matchesPattern(cardNumber, pattern) {
  pattern = String(pattern);

  return pattern.substring(0, cardNumber.length) === cardNumber.substring(0, pattern.length);
}

function matches(cardNumber, pattern) {
  if (Array.isArray(pattern)) {
    return matchesRange(cardNumber, pattern[0], pattern[1]);
  }

  return matchesPattern(cardNumber, pattern);
}

module.exports = matches;

},{}],38:[function(_dereq_,module,exports){
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

},{"./lib/broadcast":42,"./lib/constants":43,"./lib/is-not-string":46,"./lib/package-payload":48,"./lib/subscription-args-invalid":50}],39:[function(_dereq_,module,exports){
"use strict";
var attach_1 = _dereq_("./lib/attach");
var Framebus = _dereq_("./framebus");
var bus = new Framebus();
attach_1.attach();
module.exports = bus;

},{"./framebus":38,"./lib/attach":40}],40:[function(_dereq_,module,exports){
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

},{"./message":47}],41:[function(_dereq_,module,exports){
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

},{"./broadcast":42,"./constants":43}],42:[function(_dereq_,module,exports){
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

},{"./has-opener":45}],43:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribers = exports.childWindows = exports.prefix = void 0;
exports.prefix = "/*framebus*/";
exports.childWindows = [];
exports.subscribers = {};

},{}],44:[function(_dereq_,module,exports){
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

},{"./constants":43}],45:[function(_dereq_,module,exports){
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

},{}],46:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isntString = void 0;
function isntString(str) {
    return typeof str !== "string";
}
exports.isntString = isntString;

},{}],47:[function(_dereq_,module,exports){
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

},{"./broadcast-to-child-windows":41,"./dispatch":44,"./is-not-string":46,"./unpack-payload":51}],48:[function(_dereq_,module,exports){
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

},{"./constants":43,"./subscribe-replier":49}],49:[function(_dereq_,module,exports){
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

},{"../framebus":38,"./uuid":52}],50:[function(_dereq_,module,exports){
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

},{"./is-not-string":46}],51:[function(_dereq_,module,exports){
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

},{"./constants":43,"./package-payload":48}],52:[function(_dereq_,module,exports){
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

},{}],53:[function(_dereq_,module,exports){
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

},{}],54:[function(_dereq_,module,exports){
'use strict';

var UA = typeof window !== 'undefined' && window.navigator && window.navigator.userAgent;

var isAndroid = _dereq_('@braintree/browser-detection/is-android');
var isChromeOs = _dereq_('@braintree/browser-detection/is-chrome-os');
var isChrome = _dereq_('@braintree/browser-detection/is-chrome');
var isIos = _dereq_('@braintree/browser-detection/is-ios');
var isIE9 = _dereq_('@braintree/browser-detection/is-ie9');

// Old Android Webviews used specific versions of Chrome with 0.0.0 as their version suffix
// https://developer.chrome.com/multidevice/user-agent#webview_user_agent
var KITKAT_WEBVIEW_REGEX = /Version\/\d\.\d* Chrome\/\d*\.0\.0\.0/;

function _isOldSamsungBrowserOrSamsungWebview(ua) {
  return !isChrome(ua) && ua.indexOf('Samsung') > -1;
}

function isKitKatWebview(uaArg) {
  var ua = uaArg || UA;

  return isAndroid(ua) && KITKAT_WEBVIEW_REGEX.test(ua);
}

function isAndroidChrome(uaArg) {
  var ua = uaArg || UA;

  return (isAndroid(ua) || isChromeOs(ua)) && isChrome(ua);
}

function isSamsungBrowser(ua) {
  ua = ua || UA;

  return /SamsungBrowser/.test(ua) || _isOldSamsungBrowserOrSamsungWebview(ua);
}

module.exports = {
  isIE9: isIE9,
  isAndroidChrome: isAndroidChrome,
  isIos: isIos,
  isKitKatWebview: isKitKatWebview,
  isSamsungBrowser: isSamsungBrowser
};

},{"@braintree/browser-detection/is-android":3,"@braintree/browser-detection/is-chrome":5,"@braintree/browser-detection/is-chrome-os":4,"@braintree/browser-detection/is-ie9":11,"@braintree/browser-detection/is-ios":16}],55:[function(_dereq_,module,exports){
'use strict';

var device = _dereq_('./lib/device');

module.exports = function () {
  // Digits get dropped in samsung browser
  return !device.isSamsungBrowser();
};

},{"./lib/device":54}],56:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('../lib/braintree-error');
var errors = _dereq_('./errors');
var assign = _dereq_('../lib/assign').assign;
var Promise = _dereq_('../lib/promise');
var methods = _dereq_('../lib/methods');
var convertMethodsToError = _dereq_('../lib/convert-methods-to-error');
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @class
 * @param {object} options Options
 * @description <strong>You cannot use this constructor directly. Use {@link module:braintree-web/american-express.create|braintree.american-express.create} instead.</strong>
 * @classdesc This class allows you use a nonce to interact with American Express Checkout. To accept American Express cards, use Hosted Fields.
 */
function AmericanExpress(options) {
  this._client = options.client;
}

/**
 * Gets the rewards balance associated with a Braintree nonce.
 * @public
 * @param {object} options Request options
 * @param {string} options.nonce An existing Braintree nonce.
 * @param {callback} [callback] The second argument, <code>data</code>, is the returned server data. If no callback is provided, `getRewardsBalance` returns a promise that resolves with the server data.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * var americanExpress = require('braintree-web/american-express');
 *
 * americanExpress.create({client: clientInstance}, function (createErr, americanExpressInstance) {
 *   var options = {nonce: existingBraintreeNonce};
 *   americanExpressInstance.getRewardsBalance(options, function (getErr, payload) {
 *     if (getErr || payload.error) {
 *       // Handle error
 *       return;
 *     }
 *
 *     console.log('Rewards amount: ' + payload.rewardsAmount);
 *   });
 * });
 */
AmericanExpress.prototype.getRewardsBalance = function (options) {
  var nonce = options.nonce;
  var data;

  if (!nonce) {
    return Promise.reject(new BraintreeError({
      type: errors.AMEX_NONCE_REQUIRED.type,
      code: errors.AMEX_NONCE_REQUIRED.code,
      message: 'getRewardsBalance must be called with a nonce.'
    }));
  }

  data = assign({
    _meta: {source: 'american-express'},
    paymentMethodNonce: nonce
  }, options);

  delete data.nonce;

  return this._client.request({
    method: 'get',
    endpoint: 'payment_methods/amex_rewards_balance',
    data: data
  }).catch(function (err) {
    return Promise.reject(new BraintreeError({
      type: errors.AMEX_NETWORK_ERROR.type,
      code: errors.AMEX_NETWORK_ERROR.code,
      message: 'A network error occurred when getting the American Express rewards balance.',
      details: {
        originalError: err
      }
    }));
  });
};

/**
 * Gets the Express Checkout nonce profile given a nonce from American Express.
 * @public
 * @param {object} options Request options
 * @param {string} options.nonce An existing nonce from American Express (note that this is <em>not</em> a nonce from Braintree).
 * @param {callback} [callback] The second argument, <code>data</code>, is the returned server data. If no callback is provided, `getExpressCheckoutProfile` returns a promise that resolves with the server data.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * var americanExpress = require('braintree-web/american-express');
 *
 * americanExpress.create({client: clientInstance}, function (createErr, americanExpressInstance) {
 *   var options = {nonce: existingAmericanExpressNonce};
 *   americanExpressInstance.getExpressCheckoutProfile(options, function (getErr, payload) {
 *     if (getErr) {
 *       // Handle error
 *       return;
 *     }
 *
 *     console.log('Number of cards: ' + payload.amexExpressCheckoutCards.length);
 *   });
 * });
 */
AmericanExpress.prototype.getExpressCheckoutProfile = function (options) {
  if (!options.nonce) {
    return Promise.reject(new BraintreeError({
      type: errors.AMEX_NONCE_REQUIRED.type,
      code: errors.AMEX_NONCE_REQUIRED.code,
      message: 'getExpressCheckoutProfile must be called with a nonce.'
    }));
  }

  return this._client.request({
    method: 'get',
    endpoint: 'payment_methods/amex_express_checkout_cards/' + options.nonce,
    data: {
      _meta: {source: 'american-express'},
      paymentMethodNonce: options.nonce
    }
  }).catch(function (err) {
    return Promise.reject(new BraintreeError({
      type: errors.AMEX_NETWORK_ERROR.type,
      code: errors.AMEX_NETWORK_ERROR.code,
      message: 'A network error occurred when getting the American Express Checkout nonce profile.',
      details: {
        originalError: err
      }
    }));
  });
};

/**
 * Cleanly tear down anything set up by {@link module:braintree-web/american-express.create|create}.
 * @public
 * @param {callback} [callback] Called once teardown is complete. No data is returned if teardown completes successfully.
 * @example
 * americanExpressInstance.teardown();
 * @example <caption>With callback</caption>
 * americanExpressInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
AmericanExpress.prototype.teardown = function () {
  convertMethodsToError(this, methods(AmericanExpress.prototype));

  return Promise.resolve();
};

module.exports = wrapPromise.wrapPrototype(AmericanExpress);

},{"../lib/assign":109,"../lib/braintree-error":112,"../lib/convert-methods-to-error":118,"../lib/methods":144,"../lib/promise":146,"./errors":57,"@braintree/wrap-promise":30}],57:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.American Express - getRewardsBalance Error Codes
 * @description Errors that occur when creating components.
 * @property {MERCHANT} AMEX_NONCE_REQUIRED Occurs when a nonce is not provided to method.
 * @property {NETWORK} AMEX_NETWORK_ERROR Occurs when there is an error communicating with the Braintree gateway.
 */

/**
 * @name BraintreeError.American Express - getExpressCheckoutProfile Error Codes
 * @description Errors that occur when creating components.
 * @property {MERCHANT} AMEX_NONCE_REQUIRED Occurs when a nonce is not provided to method.
 * @property {NETWORK} AMEX_NETWORK_ERROR Occurs when there is an error communicating with the Braintree gateway.
 */

var BraintreeError = _dereq_('../lib/braintree-error');

module.exports = {
  AMEX_NONCE_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'AMEX_NONCE_REQUIRED'
  },
  AMEX_NETWORK_ERROR: {
    type: BraintreeError.types.NETWORK,
    code: 'AMEX_NETWORK_ERROR'
  }
};

},{"../lib/braintree-error":112}],58:[function(_dereq_,module,exports){
'use strict';
/**
 * @module braintree-web/american-express
 * @description This module is for use with Amex Express Checkout. To accept American Express cards, use Hosted Fields.
 */

var AmericanExpress = _dereq_('./american-express');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var VERSION = "3.63.0";
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {callback} [callback] The second argument, `data`, is the {@link AmericanExpress} instance. If no callback is provided, `create` returns a promise that resolves with the {@link AmericanExpress} instance.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
function create(options) {
  var name = 'American Express';

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
    options.client = client;

    return new AmericanExpress(options);
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

},{"../lib/basic-component-verification":110,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"./american-express":56,"@braintree/wrap-promise":30}],59:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('../lib/braintree-error');
var analytics = _dereq_('../lib/analytics');
var errors = _dereq_('./errors');
var Promise = _dereq_('../lib/promise');
var methods = _dereq_('../lib/methods');
var convertMethodsToError = _dereq_('../lib/convert-methods-to-error');
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @typedef {object} ApplePay~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {object} details Additional details.
 * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
 * @property {string} details.cardHolderName The name of the card holder.
 * @property {string} details.dpanLastTwo Last two digits of card number.
 * @property {string} description A human-readable description.
 * @property {string} type The payment method type, always `ApplePayCard`.
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
 * An Apple Pay Payment Authorization Event object.
 * @typedef {object} ApplePayPaymentAuthorizedEvent
 * @external ApplePayPaymentAuthorizedEvent
 * @see {@link https://developer.apple.com/reference/applepayjs/applepaypaymentauthorizedevent ApplePayPaymentAuthorizedEvent}
 */

/**
 * An Apple Pay Payment Request object.
 * @typedef {object} ApplePayPaymentRequest
 * @external ApplePayPaymentRequest
 * @see {@link https://developer.apple.com/reference/applepayjs/1916082-applepay_js_data_types/paymentrequest PaymentRequest}
 */

/**
 * @class
 * @param {object} options Options
 * @description <strong>You cannot use this constructor directly. Use {@link module:braintree-web/apple-pay.create|braintree.applePay.create} instead.</strong>
 * @classdesc This class represents an Apple Pay component. Instances of this class have methods for validating the merchant server and tokenizing payments.
 */
function ApplePay(options) {
  this._instantiatedWithClient = Boolean(!options.useDeferredClient);
  this._client = options.client;
  this._createPromise = options.createPromise;

  if (this._client) {
    this._setMerchantIdentifier();
  }
}

ApplePay.prototype._waitForClient = function () {
  if (this._client) {
    return Promise.resolve();
  }

  return this._createPromise.then(function (client) {
    this._client = client;

    this._setMerchantIdentifier();
  }.bind(this));
};

ApplePay.prototype._setMerchantIdentifier = function () {
  var applePayConfig = this._client.getConfiguration().gatewayConfiguration.applePayWeb;

  if (!applePayConfig) {
    return;
  }
  /**
   * @name ApplePay#merchantIdentifier
   * @description A special merchant ID which represents the merchant association with Braintree. Required when using `ApplePaySession.canMakePaymentsWithActiveCard`.
   * @example
   * var promise = ApplePaySession.canMakePaymentsWithActiveCard(applePayInstance.merchantIdentifier);
   * promise.then(function (canMakePaymentsWithActiveCard) {
   *   if (canMakePaymentsWithActiveCard) {
   *     // Set up Apple Pay buttons
   *   }
   * });
   */
  Object.defineProperty(this, 'merchantIdentifier', {
    value: applePayConfig.merchantIdentifier,
    configurable: false,
    writable: false
  });
};

/**
 * Merges a payment request with Braintree defaults to return an {external:ApplePayPaymentRequest}.
 *
 * The following properties are assigned to `paymentRequest` if not already defined. Their default values come from the Braintree gateway.
 * - `countryCode`
 * - `currencyCode`
 * - `merchantCapabilities`
 * - `supportedNetworks`
 * @public
 * @param {external:ApplePayPaymentRequest} paymentRequest The payment request details to apply on top of those from Braintree.
 * @returns {external:ApplePayPaymentRequest|Promise} The decorated `paymentRequest` object. If `useDeferredClient` is used along with an `authorization`, this method will return a promise that resolves with the `paymentRequest` object.
 * @example
 * var applePay = require('braintree-web/apple-pay');
 *
 * applePay.create({client: clientInstance}, function (applePayErr, applePayInstance) {
 *   if (applePayErr) {
 *     // Handle error here
 *     return;
 *   }
 *
 *   var paymentRequest = applePayInstance.createPaymentRequest({
 *     total: {
 *       label: 'My Company',
 *       amount: '19.99'
 *     }
 *   });
 *
 *   var session = new ApplePaySession(3, paymentRequest);
 *
 *   // ...
 * @example <caption>With deferred client</caption>
 * var applePay = require('braintree-web/apple-pay');
 *
 * applePay.create({
 *   authorization: 'client-token-or-tokenization-key',
 *   useDeferredClient: true
 * }, function (applePayErr, applePayInstance) {
 *   if (applePayErr) {
 *     // Handle error here
 *     return;
 *   }
 *
 *   applePayInstance.createPaymentRequest({
 *     total: {
 *       label: 'My Company',
 *       amount: '19.99'
 *     }
 *   }).then(function (paymentRequest) {
 *     var session = new ApplePaySession(3, paymentRequest);
 *
 *     // ...
 *   });
 */
ApplePay.prototype.createPaymentRequest = function (paymentRequest) {
  if (this._instantiatedWithClient) {
    return this._createPaymentRequestSynchronously(paymentRequest);
  }

  return this._waitForClient().then(function () {
    return this._createPaymentRequestSynchronously(paymentRequest);
  }.bind(this));
};

ApplePay.prototype._createPaymentRequestSynchronously = function (paymentRequest) {
  var applePay = this._client.getConfiguration().gatewayConfiguration.applePayWeb;
  var defaults = {
    countryCode: applePay.countryCode,
    currencyCode: applePay.currencyCode,
    merchantCapabilities: applePay.merchantCapabilities || ['supports3DS'],
    supportedNetworks: applePay.supportedNetworks.map(function (network) {
      return network === 'mastercard' ? 'masterCard' : network;
    })
  };

  return Object.assign({}, defaults, paymentRequest);
};

/**
 * Validates your merchant website, as required by `ApplePaySession` before payment can be authorized.
 * @public
 * @param {object} options Options
 * @param {string} options.validationURL The validationURL fram an `ApplePayValidateMerchantEvent`.
 * @param {string} options.displayName The canonical name for your store. Use a non-localized name. This parameter should be a UTF-8 string that is a maximum of 128 characters. The system may display this name to the user.
 * @param {callback} [callback] The second argument, <code>data</code>, is the Apple Pay merchant session object. If no callback is provided, `performValidation` returns a promise.
 * Pass the merchant session to your Apple Pay session's `completeMerchantValidation` method.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * var applePay = require('braintree-web/apple-pay');
 *
 * applePay.create({client: clientInstance}, function (applePayErr, applePayInstance) {
 *   if (applePayErr) {
 *     // Handle error here
 *     return;
 *   }
 *
 *   var paymentRequest = applePayInstance.createPaymentRequest({
 *     total: {
 *       label: 'My Company',
 *       amount: '19.99'
 *     }
 *   });
 *   var session = new ApplePaySession(3, paymentRequest);
 *
 *   session.onvalidatemerchant = function (event) {
 *     applePayInstance.performValidation({
 *       validationURL: event.validationURL,
 *       displayName: 'My Great Store'
 *     }, function (validationErr, validationData) {
 *       if (validationErr) {
 *         console.error(validationErr);
 *         session.abort();
 *         return;
 *       }
 *
 *       session.completeMerchantValidation(validationData);
 *     });
 *   };
 * });
 */
ApplePay.prototype.performValidation = function (options) {
  var self = this;

  if (!options || !options.validationURL) {
    return Promise.reject(new BraintreeError(errors.APPLE_PAY_VALIDATION_URL_REQUIRED));
  }

  return this._waitForClient().then(function () {
    var applePayWebSession = {
      validationUrl: options.validationURL,
      domainName: options.domainName || window.location.hostname,
      merchantIdentifier: options.merchantIdentifier || self.merchantIdentifier
    };

    if (options.displayName != null) {
      applePayWebSession.displayName = options.displayName;
    }

    return self._client.request({
      method: 'post',
      endpoint: 'apple_pay_web/sessions',
      data: {
        _meta: {source: 'apple-pay'},
        applePayWebSession: applePayWebSession
      }
    });
  }).then(function (response) {
    analytics.sendEvent(self._client, 'applepay.performValidation.succeeded');

    return Promise.resolve(response);
  }).catch(function (err) {
    analytics.sendEvent(self._client, 'applepay.performValidation.failed');

    if (err.code === 'CLIENT_REQUEST_ERROR') {
      return Promise.reject(new BraintreeError({
        type: errors.APPLE_PAY_MERCHANT_VALIDATION_FAILED.type,
        code: errors.APPLE_PAY_MERCHANT_VALIDATION_FAILED.code,
        message: errors.APPLE_PAY_MERCHANT_VALIDATION_FAILED.message,
        details: {
          originalError: err.details.originalError
        }
      }));
    }

    return Promise.reject(new BraintreeError({
      type: errors.APPLE_PAY_MERCHANT_VALIDATION_NETWORK.type,
      code: errors.APPLE_PAY_MERCHANT_VALIDATION_NETWORK.code,
      message: errors.APPLE_PAY_MERCHANT_VALIDATION_NETWORK.message,
      details: {
        originalError: err
      }
    }));
  });
};

/**
 * Tokenizes an Apple Pay payment. This will likely be called in your `ApplePaySession`'s `onpaymentauthorized` callback.
 * @public
 * @param {object} options Options
 * @param {object} options.token The `payment.token` property of an {@link external:ApplePayPaymentAuthorizedEvent}.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link ApplePay~tokenizePayload|tokenizePayload}. If no callback is provided, `tokenize` returns a promise that resolves with a {@link ApplePay~tokenizePayload|tokenizePayload}.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * var applePay = require('braintree-web/apple-pay');
 *
 * applePay.create({client: clientInstance}, function (applePayErr, applePayInstance) {
 *   if (applePayErr) {
 *     // Handle error here
 *     return;
 *   }
 *
 *   var paymentRequest = applePayInstance.createPaymentRequest({
 *     total: {
 *       label: 'My Company',
 *       amount: '19.99'
 *     }
 *   });
 *   var session = new ApplePaySession(3, paymentRequest);
 *
 *   session.onpaymentauthorized = function (event) {
 *     applePayInstance.tokenize({
 *       token: event.payment.token
 *     }, function (tokenizeErr, tokenizedPayload) {
 *       if (tokenizeErr) {
 *         session.completePayment(ApplePaySession.STATUS_FAILURE);
 *         return;
 *       }
 *       // Send the tokenizedPayload to your server here!
 *
 *       // Once the transaction is complete, call completePayment
 *       // to close the Apple Pay sheet
 *       session.completePayment(ApplePaySession.STATUS_SUCCESS);
 *     });
 *   };
 *
 *   // ...
 * });
 */
ApplePay.prototype.tokenize = function (options) {
  var self = this;

  if (!options.token) {
    return Promise.reject(new BraintreeError(errors.APPLE_PAY_PAYMENT_TOKEN_REQUIRED));
  }

  return this._waitForClient().then(function () {
    return self._client.request({
      method: 'post',
      endpoint: 'payment_methods/apple_payment_tokens',
      data: {
        _meta: {
          source: 'apple-pay'
        },
        applePaymentToken: Object.assign({}, options.token, {
          // The gateway requires this key to be base64-encoded.
          paymentData: btoa(JSON.stringify(options.token.paymentData))
        })
      }
    });
  }).then(function (response) {
    analytics.sendEvent(self._client, 'applepay.tokenize.succeeded');

    return Promise.resolve(response.applePayCards[0]);
  }).catch(function (err) {
    analytics.sendEvent(self._client, 'applepay.tokenize.failed');

    return Promise.reject(new BraintreeError({
      type: errors.APPLE_PAY_TOKENIZATION.type,
      code: errors.APPLE_PAY_TOKENIZATION.code,
      message: errors.APPLE_PAY_TOKENIZATION.message,
      details: {
        originalError: err
      }
    }));
  });
};

/**
 * Cleanly tear down anything set up by {@link module:braintree-web/apple-pay.create|create}.
 * @public
 * @param {callback} [callback] Called once teardown is complete. No data is returned if teardown completes successfully.
 * @example
 * applePayInstance.teardown();
 * @example <caption>With callback</caption>
 * applePayInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
ApplePay.prototype.teardown = function () {
  convertMethodsToError(this, methods(ApplePay.prototype));

  return Promise.resolve();
};

module.exports = wrapPromise.wrapPrototype(ApplePay);

},{"../lib/analytics":107,"../lib/braintree-error":112,"../lib/convert-methods-to-error":118,"../lib/methods":144,"../lib/promise":146,"./errors":60,"@braintree/wrap-promise":30}],60:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Apple Pay - Creation Error Codes
 * @description Errors that occur when [creating the Apple Pay component](/current/module-braintree-web_apple-pay.html#.create).
 * @property {MERCHANT} APPLE_PAY_NOT_ENABLED Occurs when the authorization used is not authorized to process Apple Pay.
 */

/**
 * @name BraintreeError.Apple Pay - performValidation Error Codes
 * @description Errors that occur when [validating](/current/ApplePay.html#performValidation).
 * @property {MERCHANT} APPLE_PAY_VALIDATION_URL_REQUIRED Occurs when the `validationURL` option is not passed in.
 * @property {MERCHANT} APPLE_PAY_MERCHANT_VALIDATION_FAILED Occurs when the website domain has not been registered in the Braintree control panel.
 * @property {NETWORK} APPLE_PAY_MERCHANT_VALIDATION_NETWORK Occurs when an unknown network error occurs.
 */

/**
 * @name BraintreeError.Apple Pay - tokenize Error Codes
 * @description Errors that occur when [tokenizing](/current/ApplePay.html#tokenize).
 * @property {MERCHANT} APPLE_PAY_PAYMENT_TOKEN_REQUIRED Occurs when the `token` option is not passed in.
 * @property {NETWORK} APPLE_PAY_TOKENIZATION Occurs when an unknown network error occurs.
 */

var BraintreeError = _dereq_('../lib/braintree-error');

module.exports = {
  APPLE_PAY_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'APPLE_PAY_NOT_ENABLED',
    message: 'Apple Pay is not enabled for this merchant.'
  },
  APPLE_PAY_VALIDATION_URL_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'APPLE_PAY_VALIDATION_URL_REQUIRED',
    message: 'performValidation must be called with a validationURL.'
  },
  APPLE_PAY_MERCHANT_VALIDATION_NETWORK: {
    type: BraintreeError.types.NETWORK,
    code: 'APPLE_PAY_MERCHANT_VALIDATION_NETWORK',
    message: 'A network error occurred when validating the Apple Pay merchant.'
  },
  APPLE_PAY_MERCHANT_VALIDATION_FAILED: {
    type: BraintreeError.types.MERCHANT,
    code: 'APPLE_PAY_MERCHANT_VALIDATION_FAILED',
    message: 'Make sure you have registered your domain name in the Braintree Control Panel.'
  },
  APPLE_PAY_PAYMENT_TOKEN_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'APPLE_PAY_PAYMENT_TOKEN_REQUIRED',
    message: 'tokenize must be called with a payment token.'
  },
  APPLE_PAY_TOKENIZATION: {
    type: BraintreeError.types.NETWORK,
    code: 'APPLE_PAY_TOKENIZATION',
    message: 'A network error occurred when processing the Apple Pay payment.'
  }
};

},{"../lib/braintree-error":112}],61:[function(_dereq_,module,exports){
'use strict';

/**
 * @module braintree-web/apple-pay
 * @description Accept Apple Pay on the Web. *This component is currently in beta and is subject to change.*
 */

var ApplePay = _dereq_('./apple-pay');
var analytics = _dereq_('../lib/analytics');
var BraintreeError = _dereq_('../lib/braintree-error');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var Promise = _dereq_('../lib/promise');
var errors = _dereq_('./errors');
var VERSION = "3.63.0";
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {boolean} [options.useDeferredClient] Used in conjunction with `authorization`, allows the Apple Pay instance to be available right away by fetching the client configuration in the background. When this option is used, {@link ApplePay#createPaymentRequest} will return a promise that resolves with the configuration instead of returning synchronously.
 * @param {callback} [callback] The second argument, `data`, is the {@link ApplePay} instance. If no callback is provided, `create` returns a promise that resolves with the {@link ApplePay} instance.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
function create(options) {
  var name = 'Apple Pay';

  return basicComponentVerification.verify({
    name: name,
    client: options.client,
    authorization: options.authorization
  }).then(function () {
    var applePayInstance;
    var createPromise = createDeferredClient.create({
      authorization: options.authorization,
      client: options.client,
      debug: options.debug,
      assetsUrl: createAssetsUrl.create(options.authorization),
      name: name
    }).then(function (client) {
      if (!client.getConfiguration().gatewayConfiguration.applePayWeb) {
        return Promise.reject(new BraintreeError(errors.APPLE_PAY_NOT_ENABLED));
      }

      analytics.sendEvent(client, 'applepay.initialized');

      return client;
    });

    options.createPromise = createPromise;
    applePayInstance = new ApplePay(options);

    if (!options.useDeferredClient) {
      return createPromise.then(function (client) {
        applePayInstance._client = client;

        return applePayInstance;
      });
    }

    return applePayInstance;
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

},{"../lib/analytics":107,"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/promise":146,"./apple-pay":59,"./errors":60,"@braintree/wrap-promise":30}],62:[function(_dereq_,module,exports){
'use strict';

var isIe = _dereq_('@braintree/browser-detection/is-ie');
var isIe9 = _dereq_('@braintree/browser-detection/is-ie9');

module.exports = {
  isIe: isIe,
  isIe9: isIe9
};

},{"@braintree/browser-detection/is-ie":8,"@braintree/browser-detection/is-ie9":11}],63:[function(_dereq_,module,exports){
'use strict';

var BRAINTREE_VERSION = _dereq_('./constants').BRAINTREE_VERSION;

var GraphQL = _dereq_('./request/graphql');
var request = _dereq_('./request');
var isVerifiedDomain = _dereq_('../lib/is-verified-domain');
var BraintreeError = _dereq_('../lib/braintree-error');
var convertToBraintreeError = _dereq_('../lib/convert-to-braintree-error');
var getGatewayConfiguration = _dereq_('./get-configuration').getConfiguration;
var createAuthorizationData = _dereq_('../lib/create-authorization-data');
var addMetadata = _dereq_('../lib/add-metadata');
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var once = _dereq_('../lib/once');
var deferred = _dereq_('../lib/deferred');
var assign = _dereq_('../lib/assign').assign;
var analytics = _dereq_('../lib/analytics');
var errors = _dereq_('./errors');
var VERSION = _dereq_('../lib/constants').VERSION;
var GRAPHQL_URLS = _dereq_('../lib/constants').GRAPHQL_URLS;
var methods = _dereq_('../lib/methods');
var convertMethodsToError = _dereq_('../lib/convert-methods-to-error');
var assets = _dereq_('../lib/assets');
var FRAUDNET_FNCLS = _dereq_('../lib/constants').FRAUDNET_FNCLS;
var FRAUDNET_SOURCE = _dereq_('../lib/constants').FRAUDNET_SOURCE;
var FRAUDNET_URL = _dereq_('../lib/constants').FRAUDNET_URL;

var cachedClients = {};

/**
 * This object is returned by {@link Client#getConfiguration|getConfiguration}. This information is used extensively by other Braintree modules to properly configure themselves.
 * @typedef {object} Client~configuration
 * @property {object} client The braintree-web/client parameters.
 * @property {string} client.authorization A tokenizationKey or clientToken.
 * @property {object} gatewayConfiguration Gateway-supplied configuration.
 * @property {object} analyticsMetadata Analytics-specific data.
 * @property {string} analyticsMetadata.sessionId Uniquely identifies a browsing session.
 * @property {string} analyticsMetadata.sdkVersion The braintree.js version.
 * @property {string} analyticsMetadata.merchantAppId Identifies the merchant's web app.
 */

/**
 * @class
 * @param {Client~configuration} configuration Options
 * @description <strong>Do not use this constructor directly. Use {@link module:braintree-web/client.create|braintree.client.create} instead.</strong>
 * @classdesc This class is required by many other Braintree components. It serves as the base API layer that communicates with our servers. It is also capable of being used to formulate direct calls to our servers, such as direct credit card tokenization. See {@link Client#request}.
 */
function Client(configuration) {
  var configurationJSON, gatewayConfiguration;

  configuration = configuration || {};

  configurationJSON = JSON.stringify(configuration);
  gatewayConfiguration = configuration.gatewayConfiguration;

  if (!gatewayConfiguration) {
    throw new BraintreeError(errors.CLIENT_MISSING_GATEWAY_CONFIGURATION);
  }

  [
    'assetsUrl',
    'clientApiUrl',
    'configUrl'
  ].forEach(function (property) {
    if (property in gatewayConfiguration && !isVerifiedDomain(gatewayConfiguration[property])) {
      throw new BraintreeError({
        type: errors.CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN.type,
        code: errors.CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN.code,
        message: property + ' property is on an invalid domain.'
      });
    }
  });

  /**
   * Returns a copy of the configuration values.
   * @public
   * @returns {Client~configuration} configuration
   */
  this.getConfiguration = function () {
    return JSON.parse(configurationJSON);
  };

  this._request = request;
  this._configuration = this.getConfiguration();

  this._clientApiBaseUrl = gatewayConfiguration.clientApiUrl + '/v1/';

  if (gatewayConfiguration.graphQL) {
    this._graphQL = new GraphQL({
      graphQL: gatewayConfiguration.graphQL
    });
  }
}

Client.initialize = function (options) {
  var clientInstance, authData;
  var promise = cachedClients[options.authorization];

  if (promise) {
    analytics.sendEvent(promise, 'custom.client.load.cached');

    return promise;
  }

  try {
    authData = createAuthorizationData(options.authorization);
  } catch (err) {
    return Promise.reject(new BraintreeError(errors.CLIENT_INVALID_AUTHORIZATION));
  }

  promise = getGatewayConfiguration(authData).then(function (configuration) {
    if (options.debug) {
      configuration.isDebug = true;
    }

    configuration.authorization = options.authorization;

    clientInstance = new Client(configuration);

    return clientInstance;
  });

  cachedClients[options.authorization] = promise;

  analytics.sendEvent(promise, 'custom.client.load.initialized');

  return promise.then(function (client) {
    analytics.sendEvent(clientInstance, 'custom.client.load.succeeded');

    return client;
  }).catch(function (err) {
    delete cachedClients[options.authorization];

    return Promise.reject(err);
  });
};

// Primarily used for testing the client initalization call
Client.clearCache = function () {
  cachedClients = {};
};

Client.prototype._findOrCreateFraudnetJSON = function (clientMetadataId) {
  var el = document.querySelector('script[fncls="' + FRAUDNET_FNCLS + '"]');
  var config, additionalData, authorizationFingerprint, parameters;

  if (!el) {
    el = document.body.appendChild(document.createElement('script'));
    el.type = 'application/json';
    el.setAttribute('fncls', FRAUDNET_FNCLS);
  }

  config = this.getConfiguration();
  additionalData = {
    rda_tenant: 'bt_card', // eslint-disable-line camelcase
    mid: config.gatewayConfiguration.merchantId
  };
  authorizationFingerprint = config.authorizationFingerprint;

  if (authorizationFingerprint) {
    authorizationFingerprint.split('&').forEach(function (pieces) {
      var component = pieces.split('=');

      if (component[0] === 'customer_id' && component.length > 1) {
        additionalData.cid = component[1];
      }
    });
  }

  parameters = {
    f: clientMetadataId.substr(0, 32),
    fp: additionalData,
    bu: false,
    s: FRAUDNET_SOURCE
  };
  el.text = JSON.stringify(parameters);
};

/**
 * Used by other modules to formulate all network requests to the Braintree gateway. It is also capable of being used directly from your own form to tokenize credit card information. However, be sure to satisfy PCI compliance if you use direct card tokenization.
 * @public
 * @param {object} options Request options:
 * @param {string} options.method HTTP method, e.g. "get" or "post".
 * @param {string} options.endpoint Endpoint path, e.g. "payment_methods".
 * @param {object} options.data Data to send with the request.
 * @param {number} [options.timeout=60000] Set a timeout (in milliseconds) for the request.
 * @param {callback} [callback] The second argument, <code>data</code>, is the returned server data.
 * @example
 * <caption>Direct Credit Card Tokenization</caption>
 * var createClient = require('braintree-web/client').create;
 *
 * createClient({
 *   authorization: CLIENT_AUTHORIZATION
 * }, function (createErr, clientInstance) {
 *   var form = document.getElementById('my-form-id');
 *   var data = {
 *     creditCard: {
 *       number: form['cc-number'].value,
 *       cvv: form['cc-cvv'].value,
 *       expirationDate: form['cc-expiration-date'].value,
 *       billingAddress: {
 *         postalCode: form['cc-postal-code'].value
 *       },
 *       options: {
 *         validate: false
 *       }
 *     }
 *   };
 *
 *   // Warning: For a merchant to be eligible for the easiest level of PCI compliance (SAQ A),
 *   // payment fields cannot be hosted on your checkout page.
 *   // For an alternative to the following, use Hosted Fields.
 *   clientInstance.request({
 *     endpoint: 'payment_methods/credit_cards',
 *     method: 'post',
 *     data: data
 *   }, function (requestErr, response) {
 *     // More detailed example of handling API errors: https://codepen.io/braintree/pen/MbwjdM
 *     if (requestErr) { throw new Error(requestErr); }
 *
 *     console.log('Got nonce:', response.creditCards[0].nonce);
 *   });
 * });
 * @example
 * <caption>Tokenizing Fields for AVS Checks</caption>
 * var createClient = require('braintree-web/client').create;
 *
 * createClient({
 *   authorization: CLIENT_AUTHORIZATION
 * }, function (createErr, clientInstance) {
 *   var form = document.getElementById('my-form-id');
 *   var data = {
 *     creditCard: {
 *       number: form['cc-number'].value,
 *       cvv: form['cc-cvv'].value,
 *       expirationDate: form['cc-date'].value,
 *       // The billing address can be checked with AVS rules.
 *       // See: https://articles.braintreepayments.com/support/guides/fraud-tools/basic/avs-cvv-rules
 *       billingAddress: {
 *         postalCode: form['cc-postal-code'].value,
 *         streetAddress: form['cc-street-address'].value,
 *         countryName: form['cc-country-name'].value,
 *         countryCodeAlpha2: form['cc-country-alpha2'].value,
 *         countryCodeAlpha3: form['cc-country-alpha3'].value,
 *         countryCodeNumeric: form['cc-country-numeric'].value
 *       },
 *       options: {
 *         validate: false
 *       }
 *     }
 *   };
 *
 *   // Warning: For a merchant to be eligible for the easiest level of PCI compliance (SAQ A),
 *   // payment fields cannot be hosted on your checkout page.
 *   // For an alternative to the following, use Hosted Fields.
 *   clientInstance.request({
 *     endpoint: 'payment_methods/credit_cards',
 *     method: 'post',
 *     data: data
 *   }, function (requestErr, response) {
 *     // More detailed example of handling API errors: https://codepen.io/braintree/pen/MbwjdM
 *     if (requestErr) { throw new Error(requestErr); }
 *
 *     console.log('Got nonce:', response.creditCards[0].nonce);
 *   });
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
Client.prototype.request = function (options, callback) {
  var self = this; // eslint-disable-line no-invalid-this
  var requestPromise = new Promise(function (resolve, reject) {
    var optionName, api, baseUrl, requestOptions;
    var shouldCollectData = Boolean(options.endpoint === 'payment_methods/credit_cards' && self.getConfiguration().gatewayConfiguration.creditCards.collectDeviceData);

    if (options.api !== 'graphQLApi') {
      if (!options.method) {
        optionName = 'options.method';
      } else if (!options.endpoint) {
        optionName = 'options.endpoint';
      }
    }

    if (optionName) {
      throw new BraintreeError({
        type: errors.CLIENT_OPTION_REQUIRED.type,
        code: errors.CLIENT_OPTION_REQUIRED.code,
        message: optionName + ' is required when making a request.'
      });
    }

    if ('api' in options) {
      api = options.api;
    } else {
      api = 'clientApi';
    }

    requestOptions = {
      method: options.method,
      graphQL: self._graphQL,
      timeout: options.timeout,
      metadata: self._configuration.analyticsMetadata
    };

    if (api === 'clientApi') {
      baseUrl = self._clientApiBaseUrl;

      requestOptions.data = addMetadata(self._configuration, options.data);
    } else if (api === 'graphQLApi') {
      baseUrl = GRAPHQL_URLS[self._configuration.gatewayConfiguration.environment];
      options.endpoint = '';
      requestOptions.method = 'post';
      requestOptions.data = assign({
        clientSdkMetadata: {
          source: self._configuration.analyticsMetadata.source,
          integration: self._configuration.analyticsMetadata.integration,
          sessionId: self._configuration.analyticsMetadata.sessionId
        }
      }, options.data);

      requestOptions.headers = getAuthorizationHeadersForGraphQL(self._configuration);
    } else {
      throw new BraintreeError({
        type: errors.CLIENT_OPTION_INVALID.type,
        code: errors.CLIENT_OPTION_INVALID.code,
        message: 'options.api is invalid.'
      });
    }

    requestOptions.url = baseUrl + options.endpoint;
    requestOptions.sendAnalyticsEvent = function (kind) {
      analytics.sendEvent(self, kind);
    };

    self._request(requestOptions, function (err, data, status) {
      var resolvedData, requestError;

      requestError = formatRequestError(status, err);

      if (requestError) {
        reject(requestError);

        return;
      }

      if (api === 'graphQLApi' && data.errors) {
        reject(convertToBraintreeError(data.errors, {
          type: errors.CLIENT_GRAPHQL_REQUEST_ERROR.type,
          code: errors.CLIENT_GRAPHQL_REQUEST_ERROR.code,
          message: errors.CLIENT_GRAPHQL_REQUEST_ERROR.message
        }));

        return;
      }

      resolvedData = assign({_httpStatus: status}, data);

      if (shouldCollectData && resolvedData.creditCards && resolvedData.creditCards.length > 0) {
        self._findOrCreateFraudnetJSON(resolvedData.creditCards[0].nonce);

        assets.loadScript({
          src: FRAUDNET_URL,
          forceScriptReload: true
        });
      }
      resolve(resolvedData);
    });
  });

  if (typeof callback === 'function') {
    callback = once(deferred(callback));

    requestPromise.then(function (response) {
      callback(null, response, response._httpStatus);
    }).catch(function (err) {
      var status = err && err.details && err.details.httpStatus;

      callback(err, null, status);
    });

    return;
  }

  return requestPromise; // eslint-disable-line consistent-return
};

function formatRequestError(status, err) { // eslint-disable-line consistent-return
  var requestError;

  if (status === -1) {
    requestError = new BraintreeError(errors.CLIENT_REQUEST_TIMEOUT);
  } else if (status === 403) {
    requestError = new BraintreeError(errors.CLIENT_AUTHORIZATION_INSUFFICIENT);
  } else if (status === 429) {
    requestError = new BraintreeError(errors.CLIENT_RATE_LIMITED);
  } else if (status >= 500) {
    requestError = new BraintreeError(errors.CLIENT_GATEWAY_NETWORK);
  } else if (status < 200 || status >= 400) {
    requestError = convertToBraintreeError(err, {
      type: errors.CLIENT_REQUEST_ERROR.type,
      code: errors.CLIENT_REQUEST_ERROR.code,
      message: errors.CLIENT_REQUEST_ERROR.message
    });
  }

  if (requestError) {
    requestError.details = requestError.details || {};
    requestError.details.httpStatus = status;

    return requestError;
  }
}

Client.prototype.toJSON = function () {
  return this.getConfiguration();
};

/**
 * Returns the Client version.
 * @public
 * @returns {String} The created client's version.
 * @example
 * var createClient = require('braintree-web/client').create;
 *
 * createClient({
 *   authorization: CLIENT_AUTHORIZATION
 * }, function (createErr, clientInstance) {
 *   console.log(clientInstance.getVersion()); // Ex: 1.0.0
 * });
 * @returns {void}
 */
Client.prototype.getVersion = function () {
  return VERSION;
};

/**
 * Cleanly tear down anything set up by {@link module:braintree-web/client.create|create}.
 * @public
 * @param {callback} [callback] Called once teardown is complete. No data is returned if teardown completes successfully.
 * @example
 * clientInstance.teardown();
 * @example <caption>With callback</caption>
 * clientInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
Client.prototype.teardown = wrapPromise(function () {
  var self = this; // eslint-disable-line no-invalid-this

  delete cachedClients[self.getConfiguration().authorization];
  convertMethodsToError(self, methods(Client.prototype));

  return Promise.resolve();
});

function getAuthorizationHeadersForGraphQL(configuration) {
  var token = configuration.authorizationFingerprint || configuration.authorization;

  return {
    Authorization: 'Bearer ' + token,
    'Braintree-Version': BRAINTREE_VERSION
  };
}

module.exports = Client;

},{"../lib/add-metadata":106,"../lib/analytics":107,"../lib/assets":108,"../lib/assign":109,"../lib/braintree-error":112,"../lib/constants":117,"../lib/convert-methods-to-error":118,"../lib/convert-to-braintree-error":119,"../lib/create-authorization-data":121,"../lib/deferred":123,"../lib/is-verified-domain":142,"../lib/methods":144,"../lib/once":145,"../lib/promise":146,"./constants":64,"./errors":65,"./get-configuration":66,"./request":78,"./request/graphql":76,"@braintree/wrap-promise":30}],64:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  BRAINTREE_VERSION: '2018-05-10'
};

},{}],65:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Client - Interal Error Codes
 * @ignore
 * @description These codes should never be experienced by the mechant directly.
 * @property {MERCHANT} CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN An error to prevent client creation for domains that are not allowed in the JS.
 * @property {INTERNAL} CLIENT_MISSING_GATEWAY_CONFIGURATION Occurs when the client is created without a gateway configuration. Should never happen.
 */

/**
 * @name BraintreeError.Client - Create Error Codes
 * @description Errors that may occur when [creating the client](/current/module-braintree-web_client.html#.create)
 * @property {MERCHANT} CLIENT_INVALID_AUTHORIZATION Occurs when client token cannot be parsed.
 */

/**
 * @name BraintreeError.Client - Request Error Codes
 * @description Errors that may occur when [using the request method](/current/Client.html#request)
 * @property {MERCHANT} CLIENT_OPTION_REQUIRED An option required in the request method was not provided. Usually `options.method` or `options.endpoint`
 * @property {MERCHANT} CLIENT_OPTION_INVALID The request option provided is invalid.
 * @property {MERCHANT} CLIENT_GATEWAY_NETWORK The Braintree gateway could not be contacted.
 * @property {NETWORK} CLIENT_REQUEST_TIMEOUT The request took too long to complete and timed out.
 * @property {NETWORK} CLIENT_REQUEST_ERROR The response from a request had status 400 or greater.
 * @property {NETWORK} CLIENT_GRAPHQL_REQUEST_ERROR The response from a request to GraphQL contained an error.
 * @property {MERCHANT} CLIENT_RATE_LIMITED The response from a request had a status of 429, indicating rate limiting.
 * @property {MERCHANT} CLIENT_AUTHORIZATION_INSUFFICIENT The user assocaited with the client token or tokenization key does not have permissions to make the request.
 */

var BraintreeError = _dereq_('../lib/braintree-error');

module.exports = {
  CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN: {
    type: BraintreeError.types.MERCHANT,
    code: 'CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN'
  },
  CLIENT_OPTION_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'CLIENT_OPTION_REQUIRED'
  },
  CLIENT_OPTION_INVALID: {
    type: BraintreeError.types.MERCHANT,
    code: 'CLIENT_OPTION_INVALID'
  },
  CLIENT_MISSING_GATEWAY_CONFIGURATION: {
    type: BraintreeError.types.INTERNAL,
    code: 'CLIENT_MISSING_GATEWAY_CONFIGURATION',
    message: 'Missing gatewayConfiguration.'
  },
  CLIENT_INVALID_AUTHORIZATION: {
    type: BraintreeError.types.MERCHANT,
    code: 'CLIENT_INVALID_AUTHORIZATION',
    message: 'Authorization is invalid. Make sure your client token or tokenization key is valid.'
  },
  CLIENT_GATEWAY_NETWORK: {
    type: BraintreeError.types.NETWORK,
    code: 'CLIENT_GATEWAY_NETWORK',
    message: 'Cannot contact the gateway at this time.'
  },
  CLIENT_REQUEST_TIMEOUT: {
    type: BraintreeError.types.NETWORK,
    code: 'CLIENT_REQUEST_TIMEOUT',
    message: 'Request timed out waiting for a reply.'
  },
  CLIENT_REQUEST_ERROR: {
    type: BraintreeError.types.NETWORK,
    code: 'CLIENT_REQUEST_ERROR',
    message: 'There was a problem with your request.'
  },
  CLIENT_GRAPHQL_REQUEST_ERROR: {
    type: BraintreeError.types.NETWORK,
    code: 'CLIENT_GRAPHQL_REQUEST_ERROR',
    message: 'There was a problem with your request.'
  },
  CLIENT_RATE_LIMITED: {
    type: BraintreeError.types.MERCHANT,
    code: 'CLIENT_RATE_LIMITED',
    message: 'You are being rate-limited; please try again in a few minutes.'
  },
  CLIENT_AUTHORIZATION_INSUFFICIENT: {
    type: BraintreeError.types.MERCHANT,
    code: 'CLIENT_AUTHORIZATION_INSUFFICIENT',
    message: 'The authorization used has insufficient privileges.'
  }
};

},{"../lib/braintree-error":112}],66:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('../lib/braintree-error');
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var request = _dereq_('./request');
var uuid = _dereq_('../lib/vendor/uuid');
var constants = _dereq_('../lib/constants');
var errors = _dereq_('./errors');
var GraphQL = _dereq_('./request/graphql');
var GRAPHQL_URLS = _dereq_('../lib/constants').GRAPHQL_URLS;
var isDateStringBeforeOrOn = _dereq_('../lib/is-date-string-before-or-on');

var BRAINTREE_VERSION = _dereq_('./constants').BRAINTREE_VERSION;

function getConfiguration(authData) {
  return new Promise(function (resolve, reject) {
    var configuration, attrs, configUrl, reqOptions;
    var sessionId = uuid();
    var analyticsMetadata = {
      merchantAppId: window.location.host,
      platform: constants.PLATFORM,
      sdkVersion: constants.VERSION,
      source: constants.SOURCE,
      integration: constants.INTEGRATION,
      integrationType: constants.INTEGRATION,
      sessionId: sessionId
    };

    attrs = authData.attrs;
    configUrl = authData.configUrl;

    attrs._meta = analyticsMetadata;
    attrs.braintreeLibraryVersion = constants.BRAINTREE_LIBRARY_VERSION;
    attrs.configVersion = '3';

    reqOptions = {
      url: configUrl,
      method: 'GET',
      data: attrs
    };

    if (attrs.authorizationFingerprint && authData.graphQL) {
      if (isDateStringBeforeOrOn(authData.graphQL.date, BRAINTREE_VERSION)) {
        reqOptions.graphQL = new GraphQL({
          graphQL: {
            url: authData.graphQL.url,
            features: ['configuration']
          }
        });
      }

      reqOptions.metadata = analyticsMetadata;
    } else if (attrs.tokenizationKey) {
      reqOptions.graphQL = new GraphQL({
        graphQL: {
          url: GRAPHQL_URLS[authData.environment],
          features: ['configuration']
        }
      });

      reqOptions.metadata = analyticsMetadata;
    }

    request(reqOptions, function (err, response, status) {
      var errorTemplate;

      if (err) {
        if (status === 403) {
          errorTemplate = errors.CLIENT_AUTHORIZATION_INSUFFICIENT;
        } else {
          errorTemplate = errors.CLIENT_GATEWAY_NETWORK;
        }

        reject(new BraintreeError({
          type: errorTemplate.type,
          code: errorTemplate.code,
          message: errorTemplate.message,
          details: {
            originalError: err
          }
        }));

        return;
      }

      configuration = {
        authorizationType: attrs.tokenizationKey ? 'TOKENIZATION_KEY' : 'CLIENT_TOKEN',
        authorizationFingerprint: attrs.authorizationFingerprint,
        analyticsMetadata: analyticsMetadata,
        gatewayConfiguration: response
      };

      resolve(configuration);
    });
  });
}

module.exports = {
  getConfiguration: wrapPromise(getConfiguration)
};

},{"../lib/braintree-error":112,"../lib/constants":117,"../lib/is-date-string-before-or-on":140,"../lib/promise":146,"../lib/vendor/uuid":150,"./constants":64,"./errors":65,"./request":78,"./request/graphql":76,"@braintree/wrap-promise":30}],67:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('../lib/braintree-error');
var Client = _dereq_('./client');
var VERSION = "3.63.0";
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var sharedErrors = _dereq_('../lib/errors');

/** @module braintree-web/client */

/**
 * @function create
 * @description This function is the entry point for the <code>braintree.client</code> module. It is used for creating {@link Client} instances that service communication to Braintree servers.
 * @param {object} options Object containing all {@link Client} options:
 * @param {string} options.authorization A tokenizationKey or clientToken.
 * @param {callback} [callback] The second argument, <code>data</code>, is the {@link Client} instance.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * var createClient = require('braintree-web/client').create;
 *
 * createClient({
 *   authorization: CLIENT_AUTHORIZATION
 * }, function (createErr, clientInstance) {
 *   // ...
 * });
 * @static
 */
function create(options) {
  if (!options.authorization) {
    return Promise.reject(new BraintreeError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.authorization is required when instantiating a client.'
    }));
  }

  return Client.initialize(options);
}

module.exports = {
  create: wrapPromise(create),
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"../lib/braintree-error":112,"../lib/errors":126,"../lib/promise":146,"./client":63,"@braintree/wrap-promise":30}],68:[function(_dereq_,module,exports){
'use strict';

var querystring = _dereq_('../../lib/querystring');
var assign = _dereq_('../../lib/assign').assign;
var prepBody = _dereq_('./prep-body');
var parseBody = _dereq_('./parse-body');
var xhr = _dereq_('./xhr');
var isXHRAvailable = xhr.isAvailable;
var GraphQLRequest = _dereq_('./graphql/request');
var DefaultRequest = _dereq_('./default-request');

var MAX_TCP_RETRYCOUNT = 1;
var TCP_PRECONNECT_BUG_STATUS_CODE = 408;

function requestShouldRetry(status) {
  return !status || status === TCP_PRECONNECT_BUG_STATUS_CODE;
}

function graphQLRequestShouldRetryWithClientApi(body) {
  var errorClass = !body.data && body.errors &&
      body.errors[0] &&
      body.errors[0].extensions &&
      body.errors[0].extensions.errorClass;

  return errorClass === 'UNKNOWN' || errorClass === 'INTERNAL';
}

function _requestWithRetry(options, tcpRetryCount, cb) {
  var status, resBody, ajaxRequest, body, method, headers, parsedBody;
  var url = options.url;
  var graphQL = options.graphQL;
  var timeout = options.timeout;
  var req = xhr.getRequestObject();
  var callback = cb;
  var isGraphQLRequest = Boolean(graphQL && graphQL.isGraphQLRequest(url, options.data));

  options.headers = assign({'Content-Type': 'application/json'}, options.headers);

  if (isGraphQLRequest) {
    ajaxRequest = new GraphQLRequest(options);
  } else {
    ajaxRequest = new DefaultRequest(options);
  }

  url = ajaxRequest.getUrl();
  body = ajaxRequest.getBody();
  method = ajaxRequest.getMethod();
  headers = ajaxRequest.getHeaders();

  if (method === 'GET') {
    url = querystring.queryify(url, body);
    body = null;
  }

  if (isXHRAvailable) {
    req.onreadystatechange = function () {
      if (req.readyState !== 4) { return; }

      if (req.status === 0 && isGraphQLRequest) {
        // If a merchant experiences a connection
        // issue to the GraphQL endpoint (possibly
        // due to a Content Security Policy), retry
        // the request against the old client API.
        delete options.graphQL;
        _requestWithRetry(options, tcpRetryCount, cb);

        return;
      }

      parsedBody = parseBody(req.responseText);
      resBody = ajaxRequest.adaptResponseBody(parsedBody);
      status = ajaxRequest.determineStatus(req.status, parsedBody);

      if (status >= 400 || status < 200) {
        if (isGraphQLRequest && graphQLRequestShouldRetryWithClientApi(parsedBody)) {
          delete options.graphQL;
          _requestWithRetry(options, tcpRetryCount, cb);

          return;
        }

        if (tcpRetryCount < MAX_TCP_RETRYCOUNT && requestShouldRetry(status)) {
          tcpRetryCount++;
          _requestWithRetry(options, tcpRetryCount, cb);

          return;
        }
        callback(resBody || 'error', null, status || 500);
      } else {
        callback(null, resBody, status);
      }
    };
  } else {
    if (options.headers) {
      url = querystring.queryify(url, headers);
    }

    req.onload = function () {
      callback(null, parseBody(req.responseText), req.status);
    };

    req.onerror = function () {
      // XDomainRequest does not report a body or status for errors, so
      // hardcode to 'error' and 500, respectively
      callback('error', null, 500);
    };

    // This must remain for IE9 to work
    req.onprogress = function () {};

    req.ontimeout = function () {
      callback('timeout', null, -1);
    };
  }

  try {
    req.open(method, url, true);
  } catch (requestOpenError) {
    // If a merchant has a Content Security Policy and they have
    // not allowed our endpoints, some browsers may
    // synchronously throw an error. If it is not a GraphQL
    // request, we throw the error. If it is a GraphQL request
    // we remove the GraphQL option and try the request against
    // the old client API.
    if (!isGraphQLRequest) {
      throw requestOpenError;
    }

    delete options.graphQL;

    _requestWithRetry(options, tcpRetryCount, cb);

    return;
  }

  req.timeout = timeout;

  if (isXHRAvailable) {
    Object.keys(headers).forEach(function (headerKey) {
      req.setRequestHeader(headerKey, headers[headerKey]);
    });
  }

  try {
    req.send(prepBody(method, body));
  } catch (e) { /* ignored */ }
}

function request(options, cb) {
  _requestWithRetry(options, 0, cb);
}

module.exports = {
  request: request
};

},{"../../lib/assign":109,"../../lib/querystring":147,"./default-request":69,"./graphql/request":77,"./parse-body":81,"./prep-body":82,"./xhr":83}],69:[function(_dereq_,module,exports){
'use strict';

function DefaultRequest(options) {
  this._url = options.url;
  this._data = options.data;
  this._method = options.method;
  this._headers = options.headers;
}

DefaultRequest.prototype.getUrl = function () {
  return this._url;
};

DefaultRequest.prototype.getBody = function () {
  return this._data;
};

DefaultRequest.prototype.getMethod = function () {
  return this._method;
};

DefaultRequest.prototype.getHeaders = function () {
  return this._headers;
};

DefaultRequest.prototype.adaptResponseBody = function (parsedBody) {
  return parsedBody;
};

DefaultRequest.prototype.determineStatus = function (status) {
  return status;
};

module.exports = DefaultRequest;

},{}],70:[function(_dereq_,module,exports){
'use strict';

module.exports = function getUserAgent() {
  return window.navigator.userAgent;
};

},{}],71:[function(_dereq_,module,exports){
'use strict';

var errorResponseAdapter = _dereq_('./error');
var assign = _dereq_('../../../../lib/assign').assign;

/* eslint-disable camelcase */
var cardTypeTransforms = {
  creditCard: {
    AMERICAN_EXPRESS: 'American Express',
    DISCOVER: 'Discover',
    INTERNATIONAL_MAESTRO: 'Maestro',
    JCB: 'JCB',
    MASTERCARD: 'MasterCard',
    SOLO: 'Solo',
    UK_MAESTRO: 'UK Maestro',
    UNION_PAY: 'UnionPay',
    VISA: 'Visa'
  },
  applePayWeb: {
    VISA: 'visa',
    MASTERCARD: 'mastercard',
    DISCOVER: 'discover',
    AMERICAN_EXPRESS: 'amex'
  },
  visaCheckout: {
    VISA: 'Visa',
    MASTERCARD: 'MasterCard',
    DISCOVER: 'Discover',
    AMERICAN_EXPRESS: 'American Express'
  },
  googlePay: {
    VISA: 'visa',
    MASTERCARD: 'mastercard',
    DISCOVER: 'discover',
    AMERICAN_EXPRESS: 'amex'
  },
  masterpass: {
    VISA: 'visa',
    MASTERCARD: 'master',
    DISCOVER: 'discover',
    AMERICAN_EXPRESS: 'amex',
    DINERS: 'diners',
    INTERNATIONAL_MAESTRO: 'maestro',
    JCB: 'jcb'
  }
};
/* eslint-enable camelcase */

function configurationResponseAdapter(responseBody, ctx) {
  var adaptedResponse;

  if (responseBody.data && !responseBody.errors) {
    adaptedResponse = adaptConfigurationResponseBody(responseBody, ctx);
  } else {
    adaptedResponse = errorResponseAdapter(responseBody);
  }

  return adaptedResponse;
}

function adaptConfigurationResponseBody(body, ctx) {
  var configuration = body.data.clientConfiguration;
  var response;

  response = {
    environment: configuration.environment.toLowerCase(),
    clientApiUrl: configuration.clientApiUrl,
    assetsUrl: configuration.assetsUrl,
    analytics: {
      url: configuration.analyticsUrl
    },
    merchantId: configuration.merchantId,
    venmo: 'off'
  };

  if (configuration.supportedFeatures) {
    response.graphQL = {
      url: ctx._graphQL._config.url,
      features: configuration.supportedFeatures.map(function (feature) {
        return feature.toLowerCase();
      })
    };
  }

  if (configuration.braintreeApi) {
    response.braintreeApi = configuration.braintreeApi;
  }

  if (configuration.applePayWeb) {
    response.applePayWeb = configuration.applePayWeb;
    response.applePayWeb.supportedNetworks = mapCardTypes(configuration.applePayWeb.supportedCardBrands, cardTypeTransforms.applePayWeb);

    delete response.applePayWeb.supportedCardBrands;
  }

  if (configuration.ideal) {
    response.ideal = configuration.ideal;
  }

  if (configuration.kount) {
    response.kount = {
      kountMerchantId: configuration.kount.merchantId
    };
  }

  if (configuration.creditCard) {
    response.challenges = configuration.creditCard.challenges.map(function (challenge) {
      return challenge.toLowerCase();
    });

    response.creditCards = {
      supportedCardTypes: mapCardTypes(configuration.creditCard.supportedCardBrands, cardTypeTransforms.creditCard)
    };
    response.threeDSecureEnabled = configuration.creditCard.threeDSecureEnabled;
    response.threeDSecure = configuration.creditCard.threeDSecure;
  } else {
    response.challenges = [];
    response.creditCards = {
      supportedCardTypes: []
    };
    response.threeDSecureEnabled = false;
  }

  if (configuration.googlePay) {
    response.androidPay = {
      displayName: configuration.googlePay.displayName,
      enabled: true,
      environment: configuration.googlePay.environment.toLowerCase(),
      googleAuthorizationFingerprint: configuration.googlePay.googleAuthorization,
      paypalClientId: configuration.googlePay.paypalClientId,
      supportedNetworks: mapCardTypes(configuration.googlePay.supportedCardBrands, cardTypeTransforms.googlePay)
    };
  }

  if (configuration.venmo) {
    response.payWithVenmo = {
      merchantId: configuration.venmo.merchantId,
      accessToken: configuration.venmo.accessToken,
      environment: configuration.venmo.environment.toLowerCase()
    };
  }

  if (configuration.paypal) {
    response.paypalEnabled = true;
    response.paypal = assign({}, configuration.paypal);
    response.paypal.currencyIsoCode = response.paypal.currencyCode;
    response.paypal.environment = response.paypal.environment.toLowerCase();

    delete response.paypal.currencyCode;
  } else {
    response.paypalEnabled = false;
  }

  if (configuration.unionPay) {
    response.unionPay = {
      enabled: true,
      merchantAccountId: configuration.unionPay.merchantAccountId
    };
  }

  if (configuration.visaCheckout) {
    response.visaCheckout = {
      apikey: configuration.visaCheckout.apiKey,
      externalClientId: configuration.visaCheckout.externalClientId,
      supportedCardTypes: mapCardTypes(configuration.visaCheckout.supportedCardBrands, cardTypeTransforms.visaCheckout)
    };
  }

  if (configuration.masterpass) {
    response.masterpass = {
      merchantCheckoutId: configuration.masterpass.merchantCheckoutId,
      supportedNetworks: mapCardTypes(configuration.masterpass.supportedCardBrands, cardTypeTransforms.masterpass)
    };
  }

  if (configuration.usBankAccount) {
    response.usBankAccount = {
      routeId: configuration.usBankAccount.routeId,
      plaid: {
        publicKey: configuration.usBankAccount.plaidPublicKey
      }
    };
  }

  return response;
}

function mapCardTypes(cardTypes, cardTypeTransformMap) {
  return cardTypes.reduce(function (acc, type) {
    if (cardTypeTransformMap.hasOwnProperty(type)) {
      return acc.concat(cardTypeTransformMap[type]);
    }

    return acc;
  }, []);
}

module.exports = configurationResponseAdapter;

},{"../../../../lib/assign":109,"./error":73}],72:[function(_dereq_,module,exports){
'use strict';

var errorResponseAdapter = _dereq_('./error');

var CARD_BRAND_MAP = {
  /* eslint-disable camelcase */
  AMERICAN_EXPRESS: 'American Express',
  DINERS: 'Discover',
  DISCOVER: 'Discover',
  INTERNATIONAL_MAESTRO: 'Maestro',
  JCB: 'JCB',
  MASTERCARD: 'MasterCard',
  UK_MAESTRO: 'Maestro',
  UNION_PAY: 'Union Pay',
  VISA: 'Visa'
  /* eslint-enable camelcase */
};

var BIN_DATA_MAP = {
  YES: 'Yes',
  NO: 'No',
  UNKNOWN: 'Unknown'
};

var AUTHENTICATION_INSIGHT_MAP = {
  PSDTWO: 'psd2'
};

function creditCardTokenizationResponseAdapter(responseBody) {
  var adaptedResponse;

  if (responseBody.data && !responseBody.errors) {
    adaptedResponse = adaptTokenizeCreditCardResponseBody(responseBody);
  } else {
    adaptedResponse = errorResponseAdapter(responseBody);
  }

  return adaptedResponse;
}

function adaptTokenizeCreditCardResponseBody(body) {
  var data = body.data.tokenizeCreditCard;
  var creditCard = data.creditCard;
  var lastTwo = creditCard.last4 ? creditCard.last4.substr(2, 4) : '';
  var binData = creditCard.binData;
  var response, regulationEnvironment;

  if (binData) {
    ['commercial', 'debit', 'durbinRegulated', 'healthcare', 'payroll', 'prepaid'].forEach(function (key) {
      if (binData[key]) {
        binData[key] = BIN_DATA_MAP[binData[key]];
      } else {
        binData[key] = 'Unknown';
      }
    });

    ['issuingBank', 'countryOfIssuance', 'productId'].forEach(function (key) {
      if (!binData[key]) { binData[key] = 'Unknown'; }
    });
  }

  response = {
    creditCards: [
      {
        binData: binData,
        consumed: false,
        description: lastTwo ? 'ending in ' + lastTwo : '',
        nonce: data.token,
        details: {
          expirationMonth: creditCard.expirationMonth,
          expirationYear: creditCard.expirationYear,
          bin: creditCard.bin || '',
          cardType: CARD_BRAND_MAP[creditCard.brandCode] || 'Unknown',
          lastFour: creditCard.last4 || '',
          lastTwo: lastTwo
        },
        type: 'CreditCard',
        threeDSecureInfo: null
      }
    ]
  };

  if (data.authenticationInsight) {
    regulationEnvironment = data.authenticationInsight.customerAuthenticationRegulationEnvironment;
    response.creditCards[0].authenticationInsight = {
      regulationEnvironment: AUTHENTICATION_INSIGHT_MAP[regulationEnvironment] || regulationEnvironment.toLowerCase()
    };
  }

  return response;
}

module.exports = creditCardTokenizationResponseAdapter;

},{"./error":73}],73:[function(_dereq_,module,exports){
'use strict';

function errorResponseAdapter(responseBody) {
  var response;
  var errorClass = responseBody.errors &&
    responseBody.errors[0] &&
    responseBody.errors[0].extensions &&
    responseBody.errors[0].extensions.errorClass;

  if (errorClass === 'VALIDATION') {
    response = userErrorResponseAdapter(responseBody);
  } else if (errorClass) {
    response = errorWithClassResponseAdapter(responseBody);
  } else {
    response = {error: {message: 'There was a problem serving your request'}, fieldErrors: []};
  }

  return response;
}

function errorWithClassResponseAdapter(responseBody) {
  return {error: {message: responseBody.errors[0].message}, fieldErrors: []};
}

function userErrorResponseAdapter(responseBody) {
  var fieldErrors = buildFieldErrors(responseBody.errors);

  if (fieldErrors.length === 0) {
    return {error: {message: responseBody.errors[0].message}};
  }

  return {error: {message: getLegacyMessage(fieldErrors)}, fieldErrors: fieldErrors};
}

function buildFieldErrors(errors) {
  var fieldErrors = [];

  errors.forEach(function (error) {
    if (!(error.extensions && error.extensions.inputPath)) {
      return;
    }
    addFieldError(error.extensions.inputPath.slice(1), error, fieldErrors);
  });

  return fieldErrors;
}

function addFieldError(inputPath, errorDetail, fieldErrors) {
  var fieldError;
  var legacyCode = errorDetail.extensions.legacyCode;
  var inputField = inputPath[0];

  if (inputPath.length === 1) {
    fieldErrors.push({
      code: legacyCode,
      field: inputField,
      message: errorDetail.message
    });

    return;
  }

  fieldErrors.forEach(function (candidate) {
    if (candidate.field === inputField) {
      fieldError = candidate;
    }
  });

  if (!fieldError) {
    fieldError = {field: inputField, fieldErrors: []};
    fieldErrors.push(fieldError);
  }

  addFieldError(inputPath.slice(1), errorDetail, fieldError.fieldErrors);
}

function getLegacyMessage(errors) {
  var legacyMessages = {
    creditCard: 'Credit card is invalid'
  };

  var field = errors[0].field;

  return legacyMessages[field];
}

module.exports = errorResponseAdapter;

},{}],74:[function(_dereq_,module,exports){
'use strict';

var CONFIGURATION_QUERY = 'query ClientConfiguration { ' +
'  clientConfiguration { ' +
'    analyticsUrl ' +
'    environment ' +
'    merchantId ' +
'    assetsUrl ' +
'    clientApiUrl ' +
'    creditCard { ' +
'      supportedCardBrands ' +
'      challenges ' +
'      threeDSecureEnabled ' +
'      threeDSecure { ' +
'        cardinalAuthenticationJWT ' +
'      } ' +
'    } ' +
'    applePayWeb { ' +
'      countryCode ' +
'      currencyCode ' +
'      merchantIdentifier ' +
'      supportedCardBrands ' +
'    } ' +
'    googlePay { ' +
'      displayName ' +
'      supportedCardBrands ' +
'      environment ' +
'      googleAuthorization ' +
'      paypalClientId ' +
'    } ' +
'    ideal { ' +
'      routeId ' +
'      assetsUrl ' +
'    } ' +
'    kount { ' +
'      merchantId ' +
'    } ' +
'    masterpass { ' +
'      merchantCheckoutId ' +
'      supportedCardBrands ' +
'    } ' +
'    paypal { ' +
'      displayName ' +
'      clientId ' +
'      privacyUrl ' +
'      userAgreementUrl ' +
'      assetsUrl ' +
'      environment ' +
'      environmentNoNetwork ' +
'      unvettedMerchant ' +
'      braintreeClientId ' +
'      billingAgreementsEnabled ' +
'      merchantAccountId ' +
'      currencyCode ' +
'      payeeEmail ' +
'    } ' +
'    unionPay { ' +
'      merchantAccountId ' +
'    } ' +
'    usBankAccount { ' +
'      routeId ' +
'      plaidPublicKey ' +
'    } ' +
'    venmo { ' +
'      merchantId ' +
'      accessToken ' +
'      environment ' +
'    } ' +
'    visaCheckout { ' +
'      apiKey ' +
'      externalClientId ' +
'      supportedCardBrands ' +
'    } ' +
'    braintreeApi { ' +
'      accessToken ' +
'      url ' +
'    } ' +
'    supportedFeatures ' +
'  } ' +
'}';

function configuration() {
  return {
    query: CONFIGURATION_QUERY,
    operationName: 'ClientConfiguration'
  };
}

module.exports = configuration;

},{}],75:[function(_dereq_,module,exports){
'use strict';

var assign = _dereq_('../../../../lib/assign').assign;

function createMutation(config) {
  var hasAuthenticationInsight = config.hasAuthenticationInsight;
  var mutation = 'mutation TokenizeCreditCard($input: TokenizeCreditCardInput!';

  if (hasAuthenticationInsight) {
    mutation += ', $authenticationInsightInput: AuthenticationInsightInput!';
  }

  mutation += ') { ' +
    '  tokenizeCreditCard(input: $input) { ' +
    '    token ' +
    '    creditCard { ' +
    '      bin ' +
    '      brandCode ' +
    '      last4 ' +
    '      expirationMonth' +
    '      expirationYear' +
    '      binData { ' +
    '        prepaid ' +
    '        healthcare ' +
    '        debit ' +
    '        durbinRegulated ' +
    '        commercial ' +
    '        payroll ' +
    '        issuingBank ' +
    '        countryOfIssuance ' +
    '        productId ' +
    '      } ' +
    '    } ';

  if (hasAuthenticationInsight) {
    mutation += '    authenticationInsight(input: $authenticationInsightInput) {' +
      '      customerAuthenticationRegulationEnvironment' +
      '    }';
  }

  mutation += '  } ' +
    '}';

  return mutation;
}

function createCreditCardTokenizationBody(body, options) {
  var cc = body.creditCard;
  var billingAddress = cc && cc.billingAddress;
  var expDate = cc && cc.expirationDate;
  var expirationMonth = cc && (cc.expirationMonth || (expDate && expDate.split('/')[0].trim()));
  var expirationYear = cc && (cc.expirationYear || (expDate && expDate.split('/')[1].trim()));
  var variables = {
    input: {
      creditCard: {
        number: cc && cc.number,
        expirationMonth: expirationMonth,
        expirationYear: expirationYear,
        cvv: cc && cc.cvv,
        cardholderName: cc && cc.cardholderName
      },
      options: {}
    }
  };

  if (options.hasAuthenticationInsight) {
    variables.authenticationInsightInput = {
      merchantAccountId: body.merchantAccountId
    };
  }

  if (billingAddress) {
    variables.input.creditCard.billingAddress = billingAddress;
  }

  variables.input = addValidationRule(body, variables.input);

  return variables;
}

function addValidationRule(body, input) {
  var validate;

  if (body.creditCard && body.creditCard.options && typeof body.creditCard.options.validate === 'boolean') {
    validate = body.creditCard.options.validate;
  } else if ((body.authorizationFingerprint && body.tokenizationKey) || body.authorizationFingerprint) {
    validate = true;
  } else if (body.tokenizationKey) {
    validate = false;
  }

  if (typeof validate === 'boolean') {
    input.options = assign({
      validate: validate
    }, input.options);
  }

  return input;
}

function creditCardTokenization(body) {
  var options = {
    hasAuthenticationInsight: Boolean(body.authenticationInsight && body.merchantAccountId)
  };

  return {
    query: createMutation(options),
    variables: createCreditCardTokenizationBody(body, options),
    operationName: 'TokenizeCreditCard'
  };
}

module.exports = creditCardTokenization;

},{"../../../../lib/assign":109}],76:[function(_dereq_,module,exports){
'use strict';

var browserDetection = _dereq_('../../browser-detection');

var features = {
  tokenize_credit_cards: 'payment_methods/credit_cards', // eslint-disable-line camelcase
  configuration: 'configuration'
};

var disallowedInputPaths = [
  'creditCard.options.unionPayEnrollment'
];

function GraphQL(config) {
  this._config = config.graphQL;
}

GraphQL.prototype.getGraphQLEndpoint = function () {
  return this._config.url;
};

GraphQL.prototype.isGraphQLRequest = function (url, body) {
  var featureEnabled;
  var path = this.getClientApiPath(url);

  if (!this._isGraphQLEnabled() || !path || browserDetection.isIe9()) {
    return false;
  }

  featureEnabled = this._config.features.some(function (feature) {
    return features[feature] === path;
  });

  if (containsDisallowedlistedKeys(body)) {
    return false;
  }

  return featureEnabled;
};

GraphQL.prototype.getClientApiPath = function (url) {
  var path;
  var clientApiPrefix = '/client_api/v1/';
  var pathParts = url.split(clientApiPrefix);

  if (pathParts.length > 1) {
    path = pathParts[1].split('?')[0];
  }

  return path;
};

GraphQL.prototype._isGraphQLEnabled = function () {
  return Boolean(this._config);
};

function containsDisallowedlistedKeys(body) {
  return disallowedInputPaths.some(function (keys) {
    var value = keys.split('.').reduce(function (accumulator, key) {
      return accumulator && accumulator[key];
    }, body);

    return value !== undefined; // eslint-disable-line no-undefined
  });
}

module.exports = GraphQL;

},{"../../browser-detection":62}],77:[function(_dereq_,module,exports){
'use strict';

var BRAINTREE_VERSION = _dereq_('../../constants').BRAINTREE_VERSION;

var assign = _dereq_('../../../lib/assign').assign;

var creditCardTokenizationBodyGenerator = _dereq_('./generators/credit-card-tokenization');
var creditCardTokenizationResponseAdapter = _dereq_('./adapters/credit-card-tokenization');

var configurationBodyGenerator = _dereq_('./generators/configuration');
var configurationResponseAdapter = _dereq_('./adapters/configuration');

var generators = {
  'payment_methods/credit_cards': creditCardTokenizationBodyGenerator,
  configuration: configurationBodyGenerator
};
var adapters = {
  'payment_methods/credit_cards': creditCardTokenizationResponseAdapter,
  configuration: configurationResponseAdapter
};

function GraphQLRequest(options) {
  var clientApiPath = options.graphQL.getClientApiPath(options.url);

  this._graphQL = options.graphQL;
  this._data = options.data;
  this._method = options.method;
  this._headers = options.headers;
  this._clientSdkMetadata = {
    source: options.metadata.source,
    integration: options.metadata.integration,
    sessionId: options.metadata.sessionId
  };
  this._sendAnalyticsEvent = options.sendAnalyticsEvent || Function.prototype;

  this._generator = generators[clientApiPath];
  this._adapter = adapters[clientApiPath];

  this._sendAnalyticsEvent('graphql.init');
}

GraphQLRequest.prototype.getUrl = function () {
  return this._graphQL.getGraphQLEndpoint();
};

GraphQLRequest.prototype.getBody = function () {
  var formattedBody = formatBodyKeys(this._data);
  var generatedBody = this._generator(formattedBody);
  var body = assign({clientSdkMetadata: this._clientSdkMetadata}, generatedBody);

  return JSON.stringify(body);
};

GraphQLRequest.prototype.getMethod = function () {
  return 'POST';
};

GraphQLRequest.prototype.getHeaders = function () {
  var authorization, headers;

  if (this._data.authorizationFingerprint) {
    this._sendAnalyticsEvent('graphql.authorization-fingerprint');
    authorization = this._data.authorizationFingerprint;
  } else {
    this._sendAnalyticsEvent('graphql.tokenization-key');
    authorization = this._data.tokenizationKey;
  }

  headers = {
    Authorization: 'Bearer ' + authorization,
    'Braintree-Version': BRAINTREE_VERSION
  };

  return assign({}, this._headers, headers);
};

GraphQLRequest.prototype.adaptResponseBody = function (parsedBody) {
  return this._adapter(parsedBody, this);
};

GraphQLRequest.prototype.determineStatus = function (httpStatus, parsedResponse) {
  var status, errorClass;

  if (httpStatus === 200) {
    errorClass = parsedResponse.errors &&
      parsedResponse.errors[0] &&
      parsedResponse.errors[0].extensions &&
      parsedResponse.errors[0].extensions.errorClass;

    if (parsedResponse.data && !parsedResponse.errors) {
      status = 200;
    } else if (errorClass === 'VALIDATION') {
      status = 422;
    } else if (errorClass === 'AUTHORIZATION') {
      status = 403;
    } else if (errorClass === 'AUTHENTICATION') {
      status = 401;
    } else if (isGraphQLError(errorClass, parsedResponse)) {
      status = 403;
    } else {
      status = 500;
    }
  } else if (!httpStatus) {
    status = 500;
  } else {
    status = httpStatus;
  }

  this._sendAnalyticsEvent('graphql.status.' + httpStatus);
  this._sendAnalyticsEvent('graphql.determinedStatus.' + status);

  return status;
};

function isGraphQLError(errorClass, parsedResponse) {
  return !errorClass && parsedResponse.errors[0].message;
}

function snakeCaseToCamelCase(snakeString) {
  if (snakeString.indexOf('_') === -1) {
    return snakeString;
  }

  return snakeString.toLowerCase().replace(/(\_\w)/g, function (match) {
    return match[1].toUpperCase();
  });
}

function formatBodyKeys(originalBody) {
  var body = {};

  Object.keys(originalBody).forEach(function (key) {
    var camelCaseKey = snakeCaseToCamelCase(key);

    if (typeof originalBody[key] === 'object') {
      body[camelCaseKey] = formatBodyKeys(originalBody[key]);
    } else if (typeof originalBody[key] === 'number') {
      body[camelCaseKey] = String(originalBody[key]);
    } else {
      body[camelCaseKey] = originalBody[key];
    }
  });

  return body;
}

module.exports = GraphQLRequest;

},{"../../../lib/assign":109,"../../constants":64,"./adapters/configuration":71,"./adapters/credit-card-tokenization":72,"./generators/configuration":74,"./generators/credit-card-tokenization":75}],78:[function(_dereq_,module,exports){
'use strict';

var ajaxIsAvaliable;
var once = _dereq_('../../lib/once');
var JSONPDriver = _dereq_('./jsonp-driver');
var AJAXDriver = _dereq_('./ajax-driver');
var getUserAgent = _dereq_('./get-user-agent');
var isHTTP = _dereq_('./is-http');

function isAjaxAvailable() {
  if (ajaxIsAvaliable == null) {
    ajaxIsAvaliable = !(isHTTP() && /MSIE\s(8|9)/.test(getUserAgent()));
  }

  return ajaxIsAvaliable;
}

module.exports = function (options, cb) {
  cb = once(cb || Function.prototype);
  options.method = (options.method || 'GET').toUpperCase();
  options.timeout = options.timeout == null ? 60000 : options.timeout;
  options.data = options.data || {};

  if (isAjaxAvailable()) {
    AJAXDriver.request(options, cb);
  } else {
    JSONPDriver.request(options, cb);
  }
};

},{"../../lib/once":145,"./ajax-driver":68,"./get-user-agent":70,"./is-http":79,"./jsonp-driver":80}],79:[function(_dereq_,module,exports){
'use strict';

module.exports = function () {
  return window.location.protocol === 'http:';
};

},{}],80:[function(_dereq_,module,exports){
'use strict';

var head;
var uuid = _dereq_('../../lib/vendor/uuid');
var querystring = _dereq_('../../lib/querystring');
var timeouts = {};

function _removeScript(script) {
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

function _createScriptTag(url, callbackName) {
  var script = document.createElement('script');
  var done = false;

  script.src = url;
  script.async = true;
  script.onerror = function () {
    window[callbackName]({message: 'error', status: 500});
  };

  script.onload = script.onreadystatechange = function () {
    if (done) { return; }

    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
      done = true;
      script.onload = script.onreadystatechange = null;
    }
  };

  return script;
}

function _cleanupGlobal(callbackName) {
  try {
    delete window[callbackName];
  } catch (_) {
    window[callbackName] = null;
  }
}

function _setupTimeout(timeout, callbackName) {
  timeouts[callbackName] = setTimeout(function () {
    timeouts[callbackName] = null;

    window[callbackName]({
      error: 'timeout',
      status: -1
    });

    window[callbackName] = function () {
      _cleanupGlobal(callbackName);
    };
  }, timeout);
}

function _setupGlobalCallback(script, callback, callbackName) {
  window[callbackName] = function (response) {
    var status = response.status || 500;
    var err = null;
    var data = null;

    delete response.status;

    if (status >= 400 || status < 200) {
      err = response;
    } else {
      data = response;
    }

    _cleanupGlobal(callbackName);
    _removeScript(script);

    clearTimeout(timeouts[callbackName]);
    callback(err, data, status);
  };
}

function request(options, callback) {
  var script;
  var callbackName = 'callback_json_' + uuid().replace(/-/g, '');
  var url = options.url;
  var attrs = options.data;
  var method = options.method;
  var timeout = options.timeout;

  url = querystring.queryify(url, attrs);
  url = querystring.queryify(url, {
    _method: method,
    callback: callbackName
  });

  script = _createScriptTag(url, callbackName);
  _setupGlobalCallback(script, callback, callbackName);
  _setupTimeout(timeout, callbackName);

  if (!head) {
    head = document.getElementsByTagName('head')[0];
  }

  head.appendChild(script);
}

module.exports = {
  request: request
};

},{"../../lib/querystring":147,"../../lib/vendor/uuid":150}],81:[function(_dereq_,module,exports){
'use strict';

module.exports = function (body) {
  try {
    body = JSON.parse(body);
  } catch (e) { /* ignored */ }

  return body;
};

},{}],82:[function(_dereq_,module,exports){
'use strict';

module.exports = function (method, body) {
  if (typeof method !== 'string') {
    throw new Error('Method must be a string');
  }

  if (method.toLowerCase() !== 'get' && body != null) {
    body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return body;
};

},{}],83:[function(_dereq_,module,exports){
'use strict';

var isXHRAvailable = typeof window !== 'undefined' && window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest();

function getRequestObject() {
  return isXHRAvailable ? new window.XMLHttpRequest() : new window.XDomainRequest();
}

module.exports = {
  isAvailable: isXHRAvailable,
  getRequestObject: getRequestObject
};

},{}],84:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Data Collector - Creation Error Codes
 * @description Errors that occur when [creating the Data Collector component](/current/module-braintree-web_data-collector.html#.create).
 * @property {MERCHANT} DATA_COLLECTOR_KOUNT_NOT_ENABLED Occurs when Kount is enabled in creation options but is not enabled on the Braintree control panel.
 * @property {MERCHANT} DATA_COLLECTOR_KOUNT_ERROR Occurs when Kount errors while setting up.
 * @property {MERCHANT} DATA_COLLECTOR_REQUIRES_CREATE_OPTIONS Occurs when Kount or PayPal Fraudnet could not be enabled.
 */

var BraintreeError = _dereq_('../lib/braintree-error');

module.exports = {
  DATA_COLLECTOR_KOUNT_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'DATA_COLLECTOR_KOUNT_NOT_ENABLED',
    message: 'Kount is not enabled for this merchant.'
  },
  DATA_COLLECTOR_KOUNT_ERROR: {
    type: BraintreeError.types.MERCHANT,
    code: 'DATA_COLLECTOR_KOUNT_ERROR'
  },
  DATA_COLLECTOR_REQUIRES_CREATE_OPTIONS: {
    type: BraintreeError.types.MERCHANT,
    code: 'DATA_COLLECTOR_REQUIRES_CREATE_OPTIONS',
    message: 'Data Collector must be created with Kount and/or PayPal.'
  }
};

},{"../lib/braintree-error":112}],85:[function(_dereq_,module,exports){
'use strict';

var FRAUDNET_FNCLS = _dereq_('../lib/constants').FRAUDNET_FNCLS;
var FRAUDNET_SOURCE = _dereq_('../lib/constants').FRAUDNET_SOURCE;
var FRAUDNET_URL = _dereq_('../lib/constants').FRAUDNET_URL;
var loadScript = _dereq_('../lib/assets').loadScript;
var Promise = _dereq_('../lib/promise');

var cachedSessionId;

function setup() {
  var fraudNet = new Fraudnet();

  if (cachedSessionId) {
    fraudNet.sessionId = cachedSessionId;

    return Promise.resolve(fraudNet);
  }

  return fraudNet.initialize();
}

function clearSessionIdCache() {
  cachedSessionId = null;
}

function Fraudnet() {
}

Fraudnet.prototype.initialize = function () {
  var self = this;

  this.sessionId = cachedSessionId = _generateSessionId();
  this._beaconId = _generateBeaconId(this.sessionId);
  this._parameterBlock = _createParameterBlock(this.sessionId, this._beaconId);

  return loadScript({
    src: FRAUDNET_URL
  }).then(function (block) {
    self._thirdPartyBlock = block;

    return self;
  }).catch(function () {
    // if the fraudnet script fails to load
    // we just resolve with nothing
    // and data collector ignores it
    return null;
  });
};

Fraudnet.prototype.teardown = function () {
  removeElementIfOnPage(document.querySelector('iframe[title="ppfniframe"]'));
  removeElementIfOnPage(document.querySelector('iframe[title="pbf"]'));

  removeElementIfOnPage(this._parameterBlock);
  removeElementIfOnPage(this._thirdPartyBlock);
};

function removeElementIfOnPage(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

function _generateSessionId() {
  var i;
  var id = '';

  for (i = 0; i < 32; i++) {
    id += Math.floor(Math.random() * 16).toString(16);
  }

  return id;
}

function _generateBeaconId(sessionId) {
  var timestamp = new Date().getTime() / 1000;

  return 'https://b.stats.paypal.com/counter.cgi' +
    '?i=127.0.0.1' +
    '&p=' + sessionId +
    '&t=' + timestamp +
    '&a=14';
}

function _createParameterBlock(sessionId, beaconId) {
  var el = document.body.appendChild(document.createElement('script'));

  el.type = 'application/json';
  el.setAttribute('fncls', FRAUDNET_FNCLS);
  el.text = JSON.stringify({
    f: sessionId,
    s: FRAUDNET_SOURCE,
    b: beaconId
  });

  return el;
}

module.exports = {
  setup: setup,
  clearSessionIdCache: clearSessionIdCache
};

},{"../lib/assets":108,"../lib/constants":117,"../lib/promise":146}],86:[function(_dereq_,module,exports){
'use strict';
/** @module braintree-web/data-collector */

var kount = _dereq_('./kount');
var fraudnet = _dereq_('./fraudnet');
var BraintreeError = _dereq_('../lib/braintree-error');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var methods = _dereq_('../lib/methods');
var convertMethodsToError = _dereq_('../lib/convert-methods-to-error');
var VERSION = "3.63.0";
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var errors = _dereq_('./errors');

/**
 * @class
 * @global
 * @name DataCollector
 * @description <strong>Do not use this constructor directly. Use {@link module:braintree-web/data-collector.create|braintree-web.data-collector.create} instead.</strong>
 * @classdesc This class is used for fraud integration with PayPal and Kount. Instances of this class have {@link DataCollector#deviceData|deviceData} which is used to correlate user sessions with server transactions.
 */

/**
 * @memberof DataCollector
 * @name deviceData
 * @type string
 * @description JSON string to pass with server transactions.
 * @instance
 */

/**
 * @memberof DataCollector
 * @name rawDeviceData
 * @type object
 * @description The device data as an object instead of a string.
 * @instance
 */

/**
 * @memberof DataCollector
 * @name teardown
 * @function
 * @description Cleanly remove anything set up by {@link module:braintree-web/data-collector.create|create}.
 * @param {callback} [callback] Called on completion. If no callback is provided, `teardown` returns a promise.
 * @instance
 * @example
 * dataCollectorInstance.teardown();
 * @example <caption>With callback</caption>
 * dataCollectorInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */

/**
 * @memberof DataCollector
 * @name getDeviceData
 * @function
 * @description Resolves with device data once it is ready.
 * @param {object} [options] Options for how device data is resolved.
 * @param {boolean} [stringify=false] Whether or not to return the device data as a JSON string.
 * @param {callback} [callback] Called on completion. If no callback is provided, `getDeviceData` returns a promise.
 * @instance
 * @example
 * dataCollectorInstance.getDeviceData();
 * @example <caption>Without options</caption>
 * dataCollectorInstance.getDeviceData().then(function (deviceData) {
 *   // typeof deviceData === 'string'
 *   // pass onto your server with the payment method nonce
 * });
 * @example <caption>With options</caption>
 * dataCollectorInstance.getDeviceData({
 *   raw: true
 * }).then(function (deviceData) {
 *   // typeof deviceData === 'object'
 *   // for if you'd like to parse the data before sending it to your server
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */

/**
 * @static
 * @function create
 * @description Creates a DataCollector instance and collects device data based on your merchant configuration. We recommend that you call this method as early as possible, e.g. as soon as your website loads. If that's too early, call it at the beginning of customer checkout.
 * **Note:** To use your own Kount ID, contact our support team ([support@braintreepayments.com](mailto:support@braintreepayments.com) or [877.434.2894](tel:877.434.2894)).
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {boolean} [options.useDeferredClient] Used in conjunction with `authorization`, allows the Data Collector instance to be available right away by fetching the client configuration in the background. When this option is used, {@link GooglePayment#getDeviceData} must be used to collect the device data.
 * @param {boolean} [options.kount] Kount fraud data collection will occur if the merchant configuration has it enabled.
 * **Note:** the data sent to Kount is asynchronous and may not have completed by the time the data collector create call is complete. In most cases, this will not matter, but if you create the data collector instance and immediately navigate away from the page, the device information may fail to be sent to Kount.
 * @param {boolean} [options.paypal] *Deprecated:* PayPal fraud data collection will occur when the DataCollector instance is created.
 * @param {callback} [callback] The second argument, `data`, is the {@link DataCollector} instance.
 * @returns {(Promise|void)} Returns a promise that resolves the {@link DataCollector} instance if no callback is provided.
 */
function create(options) {
  var name = 'Data Collector';
  var result = {
    _instances: []
  };
  var data;

  return basicComponentVerification.verify({
    name: name,
    client: options.client,
    authorization: options.authorization
  }).then(function () {
    result._instantiatedWithAClient = !options.useDeferredClient;
    result._createPromise = createDeferredClient.create({
      authorization: options.authorization,
      client: options.client,
      debug: options.debug,
      assetsUrl: createAssetsUrl.create(options.authorization),
      name: name
    }).then(function (client) {
      var kountInstance;
      var config = client.getConfiguration();

      if (options.kount === true && config.gatewayConfiguration.kount) {
        try {
          kountInstance = kount.setup({
            environment: config.gatewayConfiguration.environment,
            merchantId: config.gatewayConfiguration.kount.kountMerchantId
          });
        } catch (err) {
          return Promise.reject(new BraintreeError({
            type: errors.DATA_COLLECTOR_KOUNT_ERROR.type,
            code: errors.DATA_COLLECTOR_KOUNT_ERROR.code,
            message: err.message
          }));
        }

        data = kountInstance.deviceData;
        result._instances.push(kountInstance);
      } else {
        data = {};
      }

      return Promise.resolve();
    }).then(function () {
      return fraudnet.setup().then(function (fraudnetInstance) {
        if (fraudnetInstance) {
          data.correlation_id = fraudnetInstance.sessionId; // eslint-disable-line camelcase
          result._instances.push(fraudnetInstance);
        }
      });
    }).then(function () {
      if (result._instances.length === 0) {
        // NEXT_MAJOR_VERSION either this should error with a specific error that
        // no data collector instances could be set up, or we should just swallow
        // the error and document that no device data will be returned if
        // data collector cannot be instantiated. We can't change the error code here
        // without possibly breaking merchant integrations relying on this inccorrect
        // behavior.
        return Promise.reject(new BraintreeError(errors.DATA_COLLECTOR_REQUIRES_CREATE_OPTIONS));
      }

      result.deviceData = JSON.stringify(data);
      result.rawDeviceData = data;

      return result;
    });

    result.teardown = createTeardownMethod(result);
    result.getDeviceData = createGetDeviceDataMethod(result);

    if (result._instantiatedWithAClient) {
      return result._createPromise;
    }

    return result;
  });
}

function createTeardownMethod(result) {
  return wrapPromise(function teardown() {
    return result._createPromise.then(function () {
      result._instances.forEach(function (instance) {
        if (instance) {
          instance.teardown();
        }
      });

      convertMethodsToError(result, methods(result));
    });
  });
}

function createGetDeviceDataMethod(result) {
  return wrapPromise(function getDeviceData(options) {
    options = options || {};

    return result._createPromise.then(function () {
      if (options.raw) {
        return Promise.resolve(result.rawDeviceData);
      }

      return Promise.resolve(result.deviceData);
    });
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

},{"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/convert-methods-to-error":118,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/methods":144,"../lib/promise":146,"./errors":84,"./fraudnet":85,"./kount":87,"@braintree/wrap-promise":30}],87:[function(_dereq_,module,exports){
'use strict';

var sjcl = _dereq_('./vendor/sjcl');
var camelCaseToSnakeCase = _dereq_('../lib/camel-case-to-snake-case');

var QA_URL = 'https://assets.qa.braintreepayments.com/data';
var IFRAME_ID_PREFIX = 'braintreeDataFrame-';
var environmentUrls = {
  development: QA_URL,
  qa: QA_URL,
  sandbox: 'https://assets.braintreegateway.com/sandbox/data',
  production: 'https://assets.braintreegateway.com/data'
};
var cachedDeviceData = {};

function setup(o) {
  var options = o != null ? o : {};

  return new Kount(options);
}

function Kount(options) {
  var previouslyInitializedDeviceData = Kount.getCachedDeviceData(options.merchantId);

  if (previouslyInitializedDeviceData) {
    this.deviceData = previouslyInitializedDeviceData;
    this._isCached = true;

    return;
  }

  this._currentEnvironment = this._initializeEnvironment(options);

  sjcl.random.startCollectors();

  this._deviceSessionId = this._generateDeviceSessionId();
  this.deviceData = this._getDeviceData();

  Kount.setCachedDeviceData(options.merchantId, this.deviceData);

  this._iframe = this._setupIFrame();
}

Kount.getCachedDeviceData = function (merchantId) {
  return cachedDeviceData[merchantId];
};

Kount.setCachedDeviceData = function (merchantId, data) {
  cachedDeviceData[merchantId] = data;
};

Kount.prototype.teardown = function () {
  if (!this._isCached) {
    sjcl.random.stopCollectors();

    this._removeIframe();
  }
};

Kount.prototype._removeIframe = function () {
  this._iframe.parentNode.removeChild(this._iframe);
};

Kount.prototype._getDeviceData = function () {
  return camelCaseToSnakeCase({
    deviceSessionId: this._deviceSessionId,
    fraudMerchantId: this._currentEnvironment.id
  });
};

Kount.prototype._generateDeviceSessionId = function () {
  var bits, hexString;

  bits = sjcl.random.randomWords(4, 0);
  hexString = sjcl.codec.hex.fromBits(bits);

  return hexString;
};

Kount.prototype._setupIFrame = function () {
  var params, iframe;
  var self = this;

  params = '?m=' + this._currentEnvironment.id + '&s=' + this._deviceSessionId;

  iframe = document.createElement('iframe');
  iframe.width = 1;
  iframe.id = IFRAME_ID_PREFIX + this._deviceSessionId;
  iframe.height = 1;
  iframe.frameBorder = 0;
  iframe.scrolling = 'no';
  iframe.style.position = 'fixed';
  iframe.style.left = '-999999px';
  iframe.style.top = '-999999px';
  iframe.title = 'Braintree-Kount-iframe';
  iframe.setAttribute('aria-hidden', 'true');

  document.body.appendChild(iframe);
  setTimeout(function () {
    iframe.src = self._currentEnvironment.url + '/logo.htm' + params;
    iframe.innerHTML = '<img src="' + self._currentEnvironment.url + '/logo.gif' + params + '" alt="" />';
  }, 10);

  return iframe;
};

Kount.prototype._initializeEnvironment = function (options) {
  var url = environmentUrls[options.environment];

  if (url == null) {
    throw new Error(options.environment + ' is not a valid environment for kount.environment');
  }

  return {
    url: url,
    name: options.environment,
    id: options.merchantId
  };
};

module.exports = {
  setup: setup,
  Kount: Kount,
  environmentUrls: environmentUrls
};

},{"../lib/camel-case-to-snake-case":116,"./vendor/sjcl":88}],88:[function(_dereq_,module,exports){
"use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
sjcl.cipher.aes=function(a){this.l[0][0][0]||this.G();var b,c,d,e,f=this.l[0][4],g=this.l[1];b=a.length;var k=1;if(4!==b&&6!==b&&8!==b)throw new sjcl.exception.invalid("invalid aes key size");this.b=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^k<<24,k=k<<1^283*(k>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&
255]]};
sjcl.cipher.aes.prototype={encrypt:function(a){return t(this,a,0)},decrypt:function(a){return t(this,a,1)},l:[[[],[],[],[],[]],[[],[],[],[],[]]],G:function(){var a=this.l[0],b=this.l[1],c=a[4],d=b[4],e,f,g,k=[],l=[],p,n,h,m;for(e=0;0x100>e;e++)l[(k[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=p||1,g=l[g]||1)for(h=g^g<<1^g<<2^g<<3^g<<4,h=h>>8^h&255^99,c[f]=h,d[h]=f,n=k[e=k[p=k[f]]],m=0x1010101*n^0x10001*e^0x101*p^0x1010100*f,n=0x101*k[h]^0x1010100*h,e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][h]=m=m<<24^m>>>8;for(e=
0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};
function t(a,b,c){if(4!==b.length)throw new sjcl.exception.invalid("invalid aes block size");var d=a.b[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var k,l,p,n=d.length/4-2,h,m=4,q=[0,0,0,0];k=a.l[c];a=k[0];var r=k[1],v=k[2],w=k[3],x=k[4];for(h=0;h<n;h++)k=a[e>>>24]^r[f>>16&255]^v[g>>8&255]^w[b&255]^d[m],l=a[f>>>24]^r[g>>16&255]^v[b>>8&255]^w[e&255]^d[m+1],p=a[g>>>24]^r[b>>16&255]^v[e>>8&255]^w[f&255]^d[m+2],b=a[b>>>24]^r[e>>16&255]^v[f>>8&255]^w[g&255]^d[m+3],m+=4,e=k,f=l,g=p;for(h=
0;4>h;h++)q[c?3&-h:h]=x[e>>>24]<<24^x[f>>16&255]<<16^x[g>>8&255]<<8^x[b&255]^d[m++],k=e,e=f,f=g,g=b,b=k;return q}
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.M(a.slice(b/32),32-(b&31)).slice(1);return void 0===c?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.M(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b=b&31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return!1;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},M:function(a,b,c,d){var e;e=0;for(void 0===d&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},Y:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&0xff00|(c&0xff00)<<8|c<<24;return a}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>8>>>8>>>8),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a=a+"00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};sjcl.hash.sha256=function(a){this.b[0]||this.G();a?(this.u=a.u.slice(0),this.o=a.o.slice(0),this.h=a.h):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.u=this.K.slice(0);this.o=[];this.h=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.o=sjcl.bitArray.concat(this.o,a);b=this.h;a=this.h=b+sjcl.bitArray.bitLength(a);if(0x1fffffffffffff<a)throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!==typeof Uint32Array){var d=new Uint32Array(c),e=0;for(b=512+b-(512+b&0x1ff);b<=a;b+=512)u(this,d.subarray(16*e,
16*(e+1))),e+=1;c.splice(0,16*e)}else for(b=512+b-(512+b&0x1ff);b<=a;b+=512)u(this,c.splice(0,16));return this},finalize:function(){var a,b=this.o,c=this.u,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.h/0x100000000));for(b.push(this.h|0);b.length;)u(this,b.splice(0,16));this.reset();return c},K:[],b:[],G:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}for(var b=0,c=2,d,e;64>b;c++){e=!0;for(d=2;d*d<=c;d++)if(0===c%d){e=
!1;break}e&&(8>b&&(this.K[b]=a(Math.pow(c,.5))),this.b[b]=a(Math.pow(c,1/3)),b++)}}};
function u(a,b){var c,d,e,f=a.u,g=a.b,k=f[0],l=f[1],p=f[2],n=f[3],h=f[4],m=f[5],q=f[6],r=f[7];for(c=0;64>c;c++)16>c?d=b[c]:(d=b[c+1&15],e=b[c+14&15],d=b[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+b[c&15]+b[c+9&15]|0),d=d+r+(h>>>6^h>>>11^h>>>25^h<<26^h<<21^h<<7)+(q^h&(m^q))+g[c],r=q,q=m,m=h,h=n+d|0,n=p,p=l,l=k,k=d+(l&p^n&(l^p))+(l>>>2^l>>>13^l>>>22^l<<30^l<<19^l<<10)|0;f[0]=f[0]+k|0;f[1]=f[1]+l|0;f[2]=f[2]+p|0;f[3]=f[3]+n|0;f[4]=f[4]+h|0;f[5]=f[5]+m|0;f[6]=f[6]+q|0;f[7]=
f[7]+r|0}sjcl.prng=function(a){this.c=[new sjcl.hash.sha256];this.i=[0];this.H=0;this.v={};this.F=0;this.J={};this.L=this.f=this.j=this.T=0;this.b=[0,0,0,0,0,0,0,0];this.g=[0,0,0,0];this.C=void 0;this.D=a;this.s=!1;this.B={progress:{},seeded:{}};this.m=this.S=0;this.w=1;this.A=2;this.O=0x10000;this.I=[0,48,64,96,128,192,0x100,384,512,768,1024];this.P=3E4;this.N=80};
sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;if(d===this.m)throw new sjcl.exception.notReady("generator isn't seeded");if(d&this.A){d=!(d&this.w);e=[];var f=0,g;this.L=e[0]=(new Date).valueOf()+this.P;for(g=0;16>g;g++)e.push(0x100000000*Math.random()|0);for(g=0;g<this.c.length&&(e=e.concat(this.c[g].finalize()),f+=this.i[g],this.i[g]=0,d||!(this.H&1<<g));g++);this.H>=1<<this.c.length&&(this.c.push(new sjcl.hash.sha256),this.i.push(0));this.f-=f;f>this.j&&(this.j=
f);this.H++;this.b=sjcl.hash.sha256.hash(this.b.concat(e));this.C=new sjcl.cipher.aes(this.b);for(d=0;4>d&&(this.g[d]=this.g[d]+1|0,!this.g[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.O&&y(this),e=z(this),c.push(e[0],e[1],e[2],e[3]);y(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){if(0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b)throw new sjcl.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");this.D=a},addEntropy:function(a,
b,c){c=c||"user";var d,e,f=(new Date).valueOf(),g=this.v[c],k=this.isReady(),l=0;d=this.J[c];void 0===d&&(d=this.J[c]=this.T++);void 0===g&&(g=this.v[c]=0);this.v[c]=(this.v[c]+1)%this.c.length;switch(typeof a){case "number":void 0===b&&(b=1);this.c[g].update([d,this.F++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else for("[object Array]"!==c&&(l=1),c=0;c<a.length&&!l;c++)"number"!==typeof a[c]&&
(l=1);if(!l){if(void 0===b)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,e=e>>>1;this.c[g].update([d,this.F++,2,b,f,a.length].concat(a))}break;case "string":void 0===b&&(b=a.length);this.c[g].update([d,this.F++,3,b,f,a.length]);this.c[g].update(a);break;default:l=1}if(l)throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");this.i[g]+=b;this.f+=b;k===this.m&&(this.isReady()!==this.m&&A("seeded",Math.max(this.j,this.f)),A("progress",this.getProgress()))},
isReady:function(a){a=this.I[void 0!==a?a:this.D];return this.j&&this.j>=a?this.i[0]>this.N&&(new Date).valueOf()>this.L?this.A|this.w:this.w:this.f>=a?this.A|this.m:this.m},getProgress:function(a){a=this.I[a?a:this.D];return this.j>=a?1:this.f>a?1:this.f/a},startCollectors:function(){if(!this.s){this.a={loadTimeCollector:B(this,this.V),mouseCollector:B(this,this.W),keyboardCollector:B(this,this.U),accelerometerCollector:B(this,this.R),touchCollector:B(this,this.X)};if(window.addEventListener)window.addEventListener("load",
this.a.loadTimeCollector,!1),window.addEventListener("mousemove",this.a.mouseCollector,!1),window.addEventListener("keypress",this.a.keyboardCollector,!1),window.addEventListener("devicemotion",this.a.accelerometerCollector,!1),window.addEventListener("touchmove",this.a.touchCollector,!1);else if(document.attachEvent)document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector);else throw new sjcl.exception.bug("can't attach event");
this.s=!0}},stopCollectors:function(){this.s&&(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,!1),window.removeEventListener("mousemove",this.a.mouseCollector,!1),window.removeEventListener("keypress",this.a.keyboardCollector,!1),window.removeEventListener("devicemotion",this.a.accelerometerCollector,!1),window.removeEventListener("touchmove",this.a.touchCollector,!1)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",
this.a.mouseCollector),document.detachEvent("keypress",this.a.keyboardCollector)),this.s=!1)},addEventListener:function(a,b){this.B[a][this.S++]=b},removeEventListener:function(a,b){var c,d,e=this.B[a],f=[];for(d in e)e.hasOwnProperty(d)&&e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},U:function(){C(this,1)},W:function(a){var b,c;try{b=a.x||a.clientX||a.offsetX||0,c=a.y||a.clientY||a.offsetY||0}catch(d){c=b=0}0!=b&&0!=c&&this.addEntropy([b,c],2,"mouse");C(this,0)},X:function(a){a=
a.touches[0]||a.changedTouches[0];this.addEntropy([a.pageX||a.clientX,a.pageY||a.clientY],1,"touch");C(this,0)},V:function(){C(this,2)},R:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&this.addEntropy(b,1,"accelerometer")}a&&this.addEntropy(a,2,"accelerometer");C(this,0)}};
function A(a,b){var c,d=sjcl.random.B[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}function C(a,b){"undefined"!==typeof window&&window.performance&&"function"===typeof window.performance.now?a.addEntropy(window.performance.now(),b,"loadtime"):a.addEntropy((new Date).valueOf(),b,"loadtime")}function y(a){a.b=z(a).concat(z(a));a.C=new sjcl.cipher.aes(a.b)}function z(a){for(var b=0;4>b&&(a.g[b]=a.g[b]+1|0,!a.g[b]);b++);return a.C.encrypt(a.g)}
function B(a,b){return function(){b.apply(a,arguments)}}sjcl.random=new sjcl.prng(6);
a:try{var D,E,F,G;if(G="undefined"!==typeof module&&module.exports){var H;try{H=_dereq_("crypto")}catch(a){H=null}G=E=H}if(G&&E.randomBytes)D=E.randomBytes(128),D=new Uint32Array((new Uint8Array(D)).buffer),sjcl.random.addEntropy(D,1024,"crypto['randomBytes']");else if("undefined"!==typeof window&&"undefined"!==typeof Uint32Array){F=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(F);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(F);
else break a;sjcl.random.addEntropy(F,1024,"crypto['getRandomValues']")}}catch(a){"undefined"!==typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(a))}"undefined"!==typeof module&&module.exports&&(module.exports=sjcl);"function"===typeof define&&define([],function(){return sjcl});

},{"crypto":undefined}],89:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Google Payment - Creation Error Codes
 * @description Errors that occur when [creating the Google Payment component](/current/module-braintree-web_google-payment.html#.create).
 * @property {MERCHANT} GOOGLE_PAYMENT_NOT_ENABLED Occurs when Google Pay is not enabled on the Braintree control panel.
 * @property {MERCHANT} GOOGLE_PAYMENT_UNSUPPORTED_VERSION Occurs when a Google Pay version is used that is not supported by the Braintree SDK.
 */

/**
 * @name BraintreeError.Google Payment - parseResponse Error Codes
 * @description Errors that occur when [parsing the response from Google](/current/GooglePayment.html#parseResponse).
 * @property {UNKNOWN} GOOGLE_PAYMENT_GATEWAY_ERROR Occurs when Google Pay could not be tokenized.
 */

var BraintreeError = _dereq_('../lib/braintree-error');

module.exports = {
  GOOGLE_PAYMENT_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'GOOGLE_PAYMENT_NOT_ENABLED',
    message: 'Google Pay is not enabled for this merchant.'
  },
  GOOGLE_PAYMENT_GATEWAY_ERROR: {
    code: 'GOOGLE_PAYMENT_GATEWAY_ERROR',
    message: 'There was an error when tokenizing the Google Pay payment method.',
    type: BraintreeError.types.UNKNOWN
  },
  GOOGLE_PAYMENT_UNSUPPORTED_VERSION: {
    code: 'GOOGLE_PAYMENT_UNSUPPORTED_VERSION',
    type: BraintreeError.types.MERCHANT
  }
};

},{"../lib/braintree-error":112}],90:[function(_dereq_,module,exports){
'use strict';

var analytics = _dereq_('../lib/analytics');
var assign = _dereq_('../lib/assign').assign;
var convertMethodsToError = _dereq_('../lib/convert-methods-to-error');
var find = _dereq_('../lib/find');
var generateGooglePayConfiguration = _dereq_('../lib/generate-google-pay-configuration');
var BraintreeError = _dereq_('../lib/braintree-error');
var errors = _dereq_('./errors');
var methods = _dereq_('../lib/methods');
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');

var CREATE_PAYMENT_DATA_REQUEST_METHODS = {
  1: '_createV1PaymentDataRequest',
  2: '_createV2PaymentDataRequest'
};

/**
 * @typedef {object} GooglePayment~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {object} details Additional account details.
 * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
 * @property {string} details.lastFour Last four digits of card number.
 * @property {string} details.lastTwo Last two digits of card number.
 * @property {boolean} details.isNetworkTokenized True if the card is network tokenized.
 * @property {string} details.bin First six digits of card number.
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
 * @class GooglePayment
 * @param {object} options Google Payment {@link module:braintree-web/google-payment.create create} options.
 * @description <strong>Do not use this constructor directly. Use {@link module:braintree-web/google-payment.create|braintree-web.google-payment.create} instead.</strong>
 * @classdesc This class represents a Google Payment component produced by {@link module:braintree-web/google-payment.create|braintree-web/google-payment.create}. Instances of this class have methods for initializing the Google Pay flow.
 */
function GooglePayment(options) {
  this._createPromise = options.createPromise;
  this._client = options.client;
  this._useDeferredClient = options.useDeferredClient;
  this._googlePayVersion = options.googlePayVersion || 1;
  this._googleMerchantId = options.googleMerchantId;

  if (this._isUnsupportedGooglePayAPIVersion()) {
    throw new BraintreeError({
      code: errors.GOOGLE_PAYMENT_UNSUPPORTED_VERSION.code,
      message: 'The Braintree SDK does not support Google Pay version ' + this._googlePayVersion + '. Please upgrade the version of your Braintree SDK and contact support if this error persists.',
      type: errors.GOOGLE_PAYMENT_UNSUPPORTED_VERSION.type
    });
  }
}

GooglePayment.prototype._waitForClient = function () {
  if (this._client) {
    return Promise.resolve();
  }

  return this._createPromise.then(function (client) {
    this._client = client;
  }.bind(this));
};

GooglePayment.prototype._isUnsupportedGooglePayAPIVersion = function () {
  // if we don't have createPaymentDatqRequest method for the specific
  // API version, then the version is not supported
  return !(this._googlePayVersion in CREATE_PAYMENT_DATA_REQUEST_METHODS);
};

GooglePayment.prototype._getDefaultConfig = function () {
  if (!this._defaultConfig) {
    this._defaultConfig = generateGooglePayConfiguration(this._client.getConfiguration(), this._googlePayVersion, this._googleMerchantId);
  }

  return this._defaultConfig;
};

GooglePayment.prototype._createV1PaymentDataRequest = function (paymentDataRequest) {
  var defaultConfig = this._getDefaultConfig();
  var overrideCardNetworks = paymentDataRequest.cardRequirements && paymentDataRequest.cardRequirements.allowedCardNetworks;
  var defaultConfigCardNetworks = defaultConfig.cardRequirements.allowedCardNetworks;
  var allowedCardNetworks = overrideCardNetworks || defaultConfigCardNetworks;

  paymentDataRequest = assign({}, defaultConfig, paymentDataRequest);

  // this way we can preserve allowedCardNetworks from default integration
  // if merchant did not pass any in `cardRequirements`
  paymentDataRequest.cardRequirements.allowedCardNetworks = allowedCardNetworks;

  return paymentDataRequest;
};

GooglePayment.prototype._createV2PaymentDataRequest = function (paymentDataRequest) {
  var defaultConfig = this._getDefaultConfig();

  if (paymentDataRequest.allowedPaymentMethods) {
    paymentDataRequest.allowedPaymentMethods.forEach(function (paymentMethod) {
      var defaultPaymentMethod = find(defaultConfig.allowedPaymentMethods, 'type', paymentMethod.type);

      if (defaultPaymentMethod) {
        applyDefaultsToPaymentMethodConfiguration(paymentMethod, defaultPaymentMethod);
      }
    });
  }

  paymentDataRequest = assign({}, defaultConfig, paymentDataRequest);

  return paymentDataRequest;
};

/**
 * Create a configuration object for use in the `loadPaymentData` method.
 *
 * **Note**: Version 1 of the Google Pay Api is deprecated and will become unsupported in a future version. Until then, version 1 will continue to be used by default, and version 1 schema parameters and overrides will remain functional on existing integrations. However, new integrations and all following examples will be presented in the GooglePay version 2 schema. See [Google Pay's upgrade guide](https://developers.google.com/pay/api/web/guides/resources/update-to-latest-version) to see how to update your integration.
 *
 * If `options.googlePayVersion === 2` was set during the initial {@link module:braintree-web/google-payment.create|create} call, overrides must match the Google Pay v2 schema to be valid.
 *
 * @public
 * @param {object} overrides The supplied parameters for creating the PaymentDataRequest object. Required parameters are:
 *  @param {object} overrides.transactionInfo Object according to the [Google Pay Transaction Info](https://developers.google.com/pay/api/web/reference/object#TransactionInfo) spec.
 *  Optionally, any of the parameters in the [PaymentDataRequest](https://developers.google.com/pay/api/web/reference/object#PaymentDataRequest) parameters can be overridden, but note that it is recommended only to override top level parameters to avoid squashing deeply nested configuration objects. An example can be found below showing how to safely edit these deeply nested objects.
 * @example
 * var paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
 *   merchantInfo: {
 *     merchantId: 'my-merchant-id-from-google'
 *   },
 *   transactionInfo: {
 *     currencyCode: 'USD',
 *     totalPriceStatus: 'FINAL',
 *     totalPrice: '100.00'
 *   }
 * });
 *
 * // Update card payment methods to require billing address
 * var cardPaymentMethod = paymentDataRequest.allowedPaymentMethods;
 * cardPaymentMethod.parameters.billingAddressRequired = true;
 * cardPaymentMethod.parameters.billingAddressParameters = {
 *   format: 'FULL',
 *   phoneNumberRequired: true
 * };
 *
 * var paymentsClient = new google.payments.api.PaymentsClient({
 *   environment: 'TEST' // or 'PRODUCTION'
 * })
 *
 * paymentsClient.loadPaymentData(paymentDataRequest).then(function (response) {
 *   // handle response with googlePaymentInstance.parseResponse
 *   // (see below)
 * });
 * @example <caption>With deferred client</caption>
 * googlePaymentInstance.createPaymentDataRequest({
 *   merchantInfo: {
 *     merchantId: 'my-merchant-id-from-google'
 *   },
 *   transactionInfo: {
 *     currencyCode: 'USD',
 *     totalPriceStatus: 'FINAL',
 *     totalPrice: '100.00'
 *   }
 * }).then(function (paymentDataRequest) {
 *   // Update card payment methods to require billing address
 *   var cardPaymentMethod = paymentDataRequest.allowedPaymentMethods;
 *   cardPaymentMethod.parameters.billingAddressRequired = true;
 *   cardPaymentMethod.parameters.billingAddressParameters = {
 *     format: 'FULL',
 *     phoneNumberRequired: true
 *   };
 *
 *   var paymentsClient = new google.payments.api.PaymentsClient({
 *     environment: 'TEST' // or 'PRODUCTION'
 *   })
 *
 *   return paymentsClient.loadPaymentData(paymentDataRequest);
 * }).then(function (response) {
 *   // handle response with googlePaymentInstance.parseResponse
 *   // (see below)
 * });
 * @returns {object|Promise} Returns a configuration object for Google PaymentDataRequest. If instantiated with `useDeferredClient` and an `authorization` it will return a promise that resolves with the configuration.
 */
GooglePayment.prototype.createPaymentDataRequest = function (overrides) {
  if (!this._useDeferredClient) {
    return this._createPaymentDataRequestSyncronously(overrides);
  }

  return this._waitForClient().then(function () {
    return this._createPaymentDataRequestSyncronously(overrides);
  }.bind(this));
};

GooglePayment.prototype._createPaymentDataRequestSyncronously = function (overrides) {
  var paymentDataRequest = assign({}, overrides);
  var version = this._googlePayVersion;
  var createPaymentDataRequestMethod = CREATE_PAYMENT_DATA_REQUEST_METHODS[version];

  analytics.sendEvent(this._createPromise, 'google-payment.v' + version + '.createPaymentDataRequest');

  return this[createPaymentDataRequestMethod](paymentDataRequest);
};

/**
 * Parse the response from the tokenization.
 * @public
 * @param {object} response The response back from the Google Pay tokenization.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link GooglePay~tokenizePayload|tokenizePayload}. If no callback is provided, `parseResponse` returns a promise that resolves with a {@link GooglePayment~tokenizePayload|tokenizePayload}.
 * @example with callback
 * var paymentsClient = new google.payments.api.PaymentsClient({
 *   environment: 'TEST' // or 'PRODUCTION'
 * })
 *
 * paymentsClient.loadPaymentData(paymentDataRequestFromCreatePaymentDataRequest).then(function (response) {
 *   googlePaymentInstance.parseResponse(response, function (err, data) {
 *     if (err) {
 *       // handle errors
 *     }
 *     // send parsedResponse.nonce to your server
 *   });
 * });
 * @example with promise
 * var paymentsClient = new google.payments.api.PaymentsClient({
 *   environment: 'TEST' // or 'PRODUCTION'
 * })
 *
 * paymentsClient.loadPaymentData(paymentDataRequestFromCreatePaymentDataRequest).then(function (response) {
 *   return googlePaymentInstance.parseResponse(response);
 * }).then(function (parsedResponse) {
 *   // send parsedResponse.nonce to your server
 * }).catch(function (err) {
 *   // handle errors
 * });
 * @returns {(Promise|void)} Returns a promise that resolves the parsed response if no callback is provided.
 */
GooglePayment.prototype.parseResponse = function (response) {
  var self = this;

  return Promise.resolve().then(function () {
    var payload;
    var rawResponse = response.apiVersion === 2 ?
      response.paymentMethodData.tokenizationData.token :
      response.paymentMethodToken.token;
    var parsedResponse = JSON.parse(rawResponse);
    var error = parsedResponse.error;

    if (error) {
      return Promise.reject(error);
    }

    analytics.sendEvent(self._createPromise, 'google-payment.parseResponse.succeeded');

    if (parsedResponse.paypalAccounts) {
      payload = parsedResponse.paypalAccounts[0];
      analytics.sendEvent(self._createPromise, 'google-payment.parseResponse.succeeded.paypal');

      return Promise.resolve({
        nonce: payload.nonce,
        type: payload.type,
        description: payload.description
      });
    }
    payload = parsedResponse.androidPayCards[0];
    analytics.sendEvent(self._createPromise, 'google-payment.parseResponse.succeeded.google-payment');

    return Promise.resolve({
      nonce: payload.nonce,
      type: payload.type,
      description: payload.description,
      details: {
        cardType: payload.details.cardType,
        lastFour: payload.details.lastFour,
        lastTwo: payload.details.lastTwo,
        isNetworkTokenized: payload.details.isNetworkTokenized,
        bin: payload.details.bin
      },
      binData: payload.binData
    });
  }).catch(function (error) {
    analytics.sendEvent(self._createPromise, 'google-payment.parseResponse.failed');

    return Promise.reject(new BraintreeError({
      code: errors.GOOGLE_PAYMENT_GATEWAY_ERROR.code,
      message: errors.GOOGLE_PAYMENT_GATEWAY_ERROR.message,
      type: errors.GOOGLE_PAYMENT_GATEWAY_ERROR.type,
      details: {
        originalError: error
      }
    }));
  });
};

/**
 * Cleanly tear down anything set up by {@link module:braintree-web/google-payment.create|create}.
 * @public
 * @param {callback} [callback] Called once teardown is complete. No data is returned if teardown completes successfully.
 * @example
 * googlePaymentInstance.teardown();
 * @example <caption>With callback</caption>
 * googlePaymentInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
GooglePayment.prototype.teardown = function () {
  convertMethodsToError(this, methods(GooglePayment.prototype));

  return Promise.resolve();
};

function applyDefaultsToPaymentMethodConfiguration(merchantSubmittedPaymentMethod, defaultPaymentMethod) {
  Object.keys(defaultPaymentMethod).forEach(function (parameter) {
    if (typeof defaultPaymentMethod[parameter] === 'object') {
      merchantSubmittedPaymentMethod[parameter] = assign(
        {},
        defaultPaymentMethod[parameter],
        merchantSubmittedPaymentMethod[parameter]
      );
    } else {
      merchantSubmittedPaymentMethod[parameter] = merchantSubmittedPaymentMethod[parameter] || defaultPaymentMethod[parameter];
    }
  });
}

module.exports = wrapPromise.wrapPrototype(GooglePayment);

},{"../lib/analytics":107,"../lib/assign":109,"../lib/braintree-error":112,"../lib/convert-methods-to-error":118,"../lib/find":127,"../lib/generate-google-pay-configuration":139,"../lib/methods":144,"../lib/promise":146,"./errors":89,"@braintree/wrap-promise":30}],91:[function(_dereq_,module,exports){
'use strict';
/**
 * @module braintree-web/google-payment
 * @description A component to integrate with Google Pay. The majority of the integration uses [Google's pay.js JavaScript file](https://pay.google.com/gp/p/js/pay.js). The Braintree component generates the configuration object necessary for Google Pay to initiate the Payment Request and parse the returned data to retrieve the payment method nonce which is used to process the transaction on the server.
 */

var GooglePayment = _dereq_('./google-payment');
var BraintreeError = _dereq_('../lib/braintree-error');
var Promise = _dereq_('../lib/promise');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var VERSION = "3.63.0";
var errors = _dereq_('./errors');

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {boolean} [options.useDeferredClient] Used in conjunction with `authorization`, allows the Google Payment instance to be available right away by fetching the client configuration in the background. When this option is used, {@link GooglePayment#createPaymentDataRequest} will return a promise that resolves with the configuration instead of returning synchronously.
 * @param {number} [options.googlePayVersion] The version of the Google Pay API to use. Value of 2 is required to accept parameters documented [by Google](https://developers.google.com/pay/api/web/reference/object). Omit this parameter to use the deprecated Google Pay Version 1.
 * @param {string} [options.googleMerchantId] A Google merchant identifier issued after your website is approved by Google. Required when PaymentsClient is initialized with an environment property of PRODUCTION, but may be omitted in TEST environment.
 * @param {callback} [callback] The second argument, `data`, is the {@link GooglePayment} instance. If no callback is provided, `create` returns a promise that resolves with the {@link GooglePayment} instance.
 * @example <caption>Simple Example</caption>
 * // include https://pay.google.com/gp/p/js/pay.js in a script tag
 * // on your page to load the `google.payments.api.PaymentsClient` global object.
 *
 * var paymentButton = document.querySelector('#google-pay-button');
 * var paymentsClient = new google.payments.api.PaymentsClient({
 *   environment: 'TEST' // or 'PRODUCTION'
 * });
 *
 * braintree.client.create({
 *   authorization: 'tokenization-key-or-client-token'
 * }).then(function (clientInstance) {
 *   return braintree.googlePayment.create({
 *     client: clientInstance,
*      googlePayVersion: 2,
*      googleMerchantId: 'your-merchant-id-from-google'
 *   });
 * }).then(function (googlePaymentInstance) {
 *   paymentButton.addEventListener('click', function (event) {
 *     var paymentDataRequest;
 *
 *     event.preventDefault();
 *
 *     paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
 *       transactionInfo: {
 *         currencyCode: 'USD',
 *         totalPriceStatus: 'FINAL',
 *         totalPrice: '100.00'
 *       }
 *     });
 *
 *     paymentsClient.loadPaymentData(paymentDataRequest).then(function (paymentData) {
 *       return googlePaymentInstance.parseResponse(paymentData);
 *     }).then(function (result) {
 *       // send result.nonce to your server
 *     }).catch(function (err) {
 *       // handle err
 *     });
 *   });
 * });
 * @example <caption>Check Browser and Customer Compatibility</caption>
 * var paymentsClient = new google.payments.api.PaymentsClient({
 *   environment: 'TEST' // or 'PRODUCTION'
 * });
 *
 * function setupGooglePayButton(googlePaymentInstance) {
 *   var button = document.createElement('button');
 *
 *   button.id = 'google-pay';
 *   button.appendChild(document.createTextNode('Google Pay'));
 *   button.addEventListener('click', function (event) {
 *     var paymentRequestData;
 *
 *     event.preventDefault();
 *
 *     paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
 *       transactionInfo: {
 *         currencyCode: 'USD',
 *         totalPriceStatus: 'FINAL',
 *         totalPrice: '100.00' // your amount
 *       }
 *     });
 *
 *     paymentsClient.loadPaymentData(paymentDataRequest).then(function (paymentData) {
 *       return googlePaymentInstance.parseResponse(paymentData);
*       }).then(function (result) {
 *       // send result.nonce to your server
 *     }).catch(function (err) {
 *       // handle errors
 *     });
 *   });
 *
 *   document.getElementById('container').appendChild(button);
 * }
 *
 * braintree.client.create({
 *   authorization: 'tokenization-key-or-client-token'
 * }).then(function (clientInstance) {
 *   return braintree.googlePayment.create({
 *     client: clientInstance,
 *     googlePayVersion: 2,
 *     googleMerchantId: 'your-merchant-id-from-google'
 *   });
 * }).then(function (googlePaymentInstance) {
 *
 *   return paymentsClient.isReadyToPay({
 *     // see https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest for all options
 *     apiVersion: 2,
 *     apiVersionMinor: 0,
 *     allowedPaymentMethods: googlePaymentInstance.createPaymentDataRequest().allowedPaymentMethods,
 *     existingPaymentMethodRequired: true
 *   });
 * }).then(function (response) {
 *   if (response.result) {
 *     setupGooglePayButton(googlePaymentInstance);
 *   }
 * }).catch(function (err) {
 *   // handle setup errors
 * });
 *
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
function create(options) {
  var name = 'Google Pay';

  return basicComponentVerification.verify({
    name: name,
    client: options.client,
    authorization: options.authorization
  }).then(function () {
    var createPromise, instance;

    createPromise = createDeferredClient.create({
      authorization: options.authorization,
      client: options.client,
      debug: options.debug,
      assetsUrl: createAssetsUrl.create(options.authorization),
      name: name
    }).then(function (client) {
      var configuration = client.getConfiguration();

      options.client = client;
      if (!configuration.gatewayConfiguration.androidPay) {
        return Promise.reject(new BraintreeError(errors.GOOGLE_PAYMENT_NOT_ENABLED));
      }

      return client;
    });

    options.createPromise = createPromise;
    instance = new GooglePayment(options);

    if (!options.useDeferredClient) {
      return createPromise.then(function (client) {
        instance._client = client;

        return instance;
      });
    }

    return instance;
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

},{"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/promise":146,"./errors":89,"./google-payment":90,"@braintree/wrap-promise":30}],92:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('../../lib/braintree-error');
var errors = _dereq_('../shared/errors');
var allowedAttributes = _dereq_('../shared/constants').allowedAttributes;

function attributeValidationError(attribute, value) {
  var err;

  if (!allowedAttributes.hasOwnProperty(attribute)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_ATTRIBUTE_NOT_SUPPORTED.type,
      code: errors.HOSTED_FIELDS_ATTRIBUTE_NOT_SUPPORTED.code,
      message: 'The "' + attribute + '" attribute is not supported in Hosted Fields.'
    });
  } else if (value != null && !_isValid(attribute, value)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED.type,
      code: errors.HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED.code,
      message: 'Value "' + value + '" is not allowed for "' + attribute + '" attribute.'
    });
  }

  return err;
}

function _isValid(attribute, value) {
  if (allowedAttributes[attribute] === 'string') {
    return typeof value === 'string' || typeof value === 'number';
  } else if (allowedAttributes[attribute] === 'boolean') {
    return String(value) === 'true' || String(value) === 'false';
  }

  return false;
}

module.exports = attributeValidationError;

},{"../../lib/braintree-error":112,"../shared/constants":100,"../shared/errors":101}],93:[function(_dereq_,module,exports){
'use strict';

var constants = _dereq_('../shared/constants');
var useMin = _dereq_('../../lib/use-min');

module.exports = function composeUrl(assetsUrl, componentId, isDebug) {
  return assetsUrl +
    '/web/' +
    constants.VERSION +
    '/html/hosted-fields-frame' + useMin(isDebug) + '.html#' +
    componentId;
};

},{"../../lib/use-min":148,"../shared/constants":100}],94:[function(_dereq_,module,exports){
'use strict';

var directions = _dereq_('../shared/constants').navigationDirections;
var browserDetection = _dereq_('../shared/browser-detection');
var focusIntercept = _dereq_('../shared/focus-intercept');
var findParentTags = _dereq_('../shared/find-parent-tags');
var userFocusableTagNames = [
  'INPUT', 'SELECT', 'TEXTAREA'
];
// Devices with software keyboards do not or cannot focus on input types
// that do not require keyboard-based interaction.
var unfocusedInputTypes = [
  'hidden', 'button', 'reset', 'submit', 'checkbox', 'radio', 'file'
];

function _isUserFocusableElement(element) {
  if (!browserDetection.hasSoftwareKeyboard()) {
    // on desktop browsers, the only input type that isn't focusable
    // is the hidden input
    return element.type !== 'hidden';
  }

  return userFocusableTagNames.indexOf(element.tagName) > -1 &&
    unfocusedInputTypes.indexOf(element.type) < 0;
}

function _createNavigationHelper(direction, numberOfElementsInForm) {
  switch (direction) {
    case directions.BACK:
      return {
        checkIndexBounds: function (index) {
          return index < 0;
        },
        indexChange: -1
      };
    case directions.FORWARD:
      return {
        checkIndexBounds: function (index) {
          return index > numberOfElementsInForm - 1;
        },
        indexChange: 1
      };
    default:
  }

  return {};
}

function _findFirstFocusableElement(elementsInForm) {
  var elementsIndex, element;

  for (elementsIndex = 0; elementsIndex < elementsInForm.length; elementsIndex++) {
    element = elementsInForm[elementsIndex];

    if (_isUserFocusableElement(element)) {
      return element;
    }
  }

  return null;
}

module.exports = {
  removeExtraFocusElements: function (checkoutForm, onRemoveFocusIntercepts) {
    var elements = Array.prototype.slice.call(checkoutForm.elements);
    var firstFocusableInput = _findFirstFocusableElement(elements);
    var lastFocusableInput = _findFirstFocusableElement(elements.reverse());

    // these should never be identical, because there will at least be the
    // before and the after input
    [
      firstFocusableInput,
      lastFocusableInput
    ].forEach(function (input) {
      if (!input) {
        return;
      }

      if (focusIntercept.matchFocusElement(input.getAttribute('id'))) {
        onRemoveFocusIntercepts(input.getAttribute('id'));
      }
    });
  },

  createFocusChangeHandler: function (callbacks) {
    return function (data) {
      var currentIndex, targetElement, checkoutForm, navHelper;
      var sourceElement = document.getElementById('bt-' + data.field + '-' + data.direction);

      if (!sourceElement) {
        return;
      }

      checkoutForm = findParentTags(sourceElement, 'form')[0];

      if (document.forms.length < 1 || !checkoutForm) {
        callbacks.onRemoveFocusIntercepts();

        return;
      }

      checkoutForm = [].slice.call(checkoutForm.elements);
      currentIndex = checkoutForm.indexOf(sourceElement);
      navHelper = _createNavigationHelper(data.direction, checkoutForm.length);

      do {
        currentIndex += navHelper.indexChange;
        if (navHelper.checkIndexBounds(currentIndex)) {
          return;
        }
        targetElement = checkoutForm[currentIndex];
      } while (!_isUserFocusableElement(targetElement));

      if (focusIntercept.matchFocusElement(targetElement.getAttribute('id'))) {
        callbacks.onTriggerInputFocus(targetElement.getAttribute('data-braintree-type'));
      } else {
        targetElement.focus();
      }
    };
  }
};

},{"../shared/browser-detection":99,"../shared/constants":100,"../shared/find-parent-tags":102,"../shared/focus-intercept":103}],95:[function(_dereq_,module,exports){
'use strict';

var allowedStyles = _dereq_('../shared/constants').allowedStyles;

module.exports = function getStylesFromClass(cssClass) {
  var element = document.createElement('input');
  var styles = {};
  var computedStyles;

  if (cssClass[0] === '.') {
    cssClass = cssClass.substring(1);
  }

  element.className = cssClass;
  element.style.display = 'none !important';
  element.style.position = 'fixed !important';
  element.style.left = '-99999px !important';
  element.style.top = '-99999px !important';
  document.body.appendChild(element);

  computedStyles = window.getComputedStyle(element);

  allowedStyles.forEach(function (style) {
    var value = computedStyles[style];

    if (value) {
      styles[style] = value;
    }
  });

  document.body.removeChild(element);

  return styles;
};

},{"../shared/constants":100}],96:[function(_dereq_,module,exports){
'use strict';

var assign = _dereq_('../../lib/assign').assign;
var createAssetsUrl = _dereq_('../../lib/create-assets-url');
var Destructor = _dereq_('../../lib/destructor');
var classList = _dereq_('@braintree/class-list');
var iFramer = _dereq_('@braintree/iframer');
var Bus = _dereq_('../../lib/bus');
var createDeferredClient = _dereq_('../../lib/create-deferred-client');
var BraintreeError = _dereq_('../../lib/braintree-error');
var composeUrl = _dereq_('./compose-url');
var getStylesFromClass = _dereq_('./get-styles-from-class');
var constants = _dereq_('../shared/constants');
var errors = _dereq_('../shared/errors');
var INTEGRATION_TIMEOUT_MS = _dereq_('../../lib/constants').INTEGRATION_TIMEOUT_MS;
var uuid = _dereq_('../../lib/vendor/uuid');
var findParentTags = _dereq_('../shared/find-parent-tags');
var browserDetection = _dereq_('../shared/browser-detection');
var events = constants.events;
var EventEmitter = _dereq_('@braintree/event-emitter');
var injectFrame = _dereq_('./inject-frame');
var analytics = _dereq_('../../lib/analytics');
var allowedFields = constants.allowedFields;
var methods = _dereq_('../../lib/methods');
var convertMethodsToError = _dereq_('../../lib/convert-methods-to-error');
var sharedErrors = _dereq_('../../lib/errors');
var getCardTypes = _dereq_('../shared/get-card-types');
var attributeValidationError = _dereq_('./attribute-validation-error');
var Promise = _dereq_('../../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var focusChange = _dereq_('./focus-change');
var destroyFocusIntercept = _dereq_('../shared/focus-intercept').destroy;

var SAFARI_FOCUS_TIMEOUT = 5;

/**
 * @typedef {object} HostedFields~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {object} authenticationInsight Info about the [regulatory environment](https://developers.braintreepayments.com/guides/3d-secure/advanced-options/javascript/v3#authentication-insight) of the tokenized card. Only available if `authenticationInsight.merchantAccountId` is passed in the `tokenize` method options.
 * @property {string} authenticationInsight.regulationEnvironment The [regulation environment](https://developers.braintreepayments.com/guides/3d-secure/advanced-options/javascript/v3#authentication-insight) for the tokenized card.
 * @property {object} details Additional account details.
 * @property {string} details.bin The BIN number of the card.
 * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
 * @property {string} details.expirationMonth The expiration month of the card.
 * @property {string} details.expirationYear The expiration year of the card.
 * @property {string} details.lastFour Last four digits of card number.
 * @property {string} details.lastTwo Last two digits of card number.
 * @property {string} description A human-readable description.
 * @property {string} type The payment method type, always `CreditCard`.
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
 * @typedef {object} HostedFields~stateObject
 * @description The event payload sent from {@link HostedFields#on|on} or {@link HostedFields#getState|getState}.
 * @property {HostedFields~hostedFieldsCard[]} cards
 * This will return an array of potential {@link HostedFields~hostedFieldsCard|cards}. If the card type has been determined, the array will contain only one card.
 * Internally, Hosted Fields uses <a href="https://github.com/braintree/credit-card-type">credit-card-type</a>,
 * an open-source card detection library.
 * @property {string} emittedBy
 * The name of the field associated with an event. This will not be included if returned by {@link HostedFields#getState|getState}. It will be one of the following strings:<br>
 * - `"number"`
 * - `"cvv"`
 * - `"expirationDate"`
 * - `"expirationMonth"`
 * - `"expirationYear"`
 * - `"postalCode"`
 * @property {object} fields
 * @property {?HostedFields~hostedFieldsFieldData} fields.number {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the number field, if it is present.
 * @property {?HostedFields~hostedFieldsFieldData} fields.cvv {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the CVV field, if it is present.
 * @property {?HostedFields~hostedFieldsFieldData} fields.expirationDate {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the expiration date field, if it is present.
 * @property {?HostedFields~hostedFieldsFieldData} fields.expirationMonth {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the expiration month field, if it is present.
 * @property {?HostedFields~hostedFieldsFieldData} fields.expirationYear {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the expiration year field, if it is present.
 * @property {?HostedFields~hostedFieldsFieldData} fields.postalCode {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the postal code field, if it is present.
 */

/**
 * @typedef {object} HostedFields~binPayload
 * @description The event payload sent from {@link HostedFields#on|on} when the {@link HostedFields#event:binAvailable|binAvailable} event is emitted.
 * @property {string} bin The first 6 digits of the card number.
 */

/**
 * @typedef {object} HostedFields~hostedFieldsFieldData
 * @description Data about Hosted Fields fields, sent in {@link HostedFields~stateObject|stateObjects}.
 * @property {HTMLElement} container Reference to the container DOM element on your page associated with the current event.
 * @property {boolean} isFocused Whether or not the input is currently focused.
 * @property {boolean} isEmpty Whether or not the user has entered a value in the input.
 * @property {boolean} isPotentiallyValid
 * A determination based on the future validity of the input value.
 * This is helpful when a user is entering a card number and types <code>"41"</code>.
 * While that value is not valid for submission, it is still possible for
 * it to become a fully qualified entry. However, if the user enters <code>"4x"</code>
 * it is clear that the card number can never become valid and isPotentiallyValid will
 * return false.
 * @property {boolean} isValid Whether or not the value of the associated input is <i>fully</i> qualified for submission.
 */

/**
 * @typedef {object} HostedFields~hostedFieldsCard
 * @description Information about the card type, sent in {@link HostedFields~stateObject|stateObjects}.
 * @property {string} type The code-friendly representation of the card type. It will be one of the following strings:
 * - `american-express`
 * - `diners-club`
 * - `discover`
 * - `jcb`
 * - `maestro`
 * - `master-card`
 * - `unionpay`
 * - `visa`
 * @property {string} niceType The pretty-printed card type. It will be one of the following strings:
 * - `American Express`
 * - `Diners Club`
 * - `Discover`
 * - `JCB`
 * - `Maestro`
 * - `MasterCard`
 * - `UnionPay`
 * - `Visa`
 * @property {object} code
 * This object contains data relevant to the security code requirements of the card brand.
 * For example, on a Visa card there will be a <code>CVV</code> of 3 digits, whereas an
 * American Express card requires a 4-digit <code>CID</code>.
 * @property {string} code.name <code>"CVV"</code> <code>"CID"</code> <code>"CVC"</code>
 * @property {number} code.size The expected length of the security code. Typically, this is 3 or 4.
 */

/**
 * @name HostedFields#on
 * @function
 * @param {string} event The name of the event to which you are subscribing.
 * @param {function} handler A callback to handle the event.
 * @description Subscribes a handler function to a named event.
 *
 * **Events that emit a {@link HostedFields~stateObject|stateObject}.**
 * * {@link HostedFields#event:blur|blur}
 * * {@link HostedFields#event:focus|focus}
 * * {@link HostedFields#event:empty|empty}
 * * {@link HostedFields#event:notEmpty|notEmpty}
 * * {@link HostedFields#event:cardTypeChange|cardTypeChange}
 * * {@link HostedFields#event:validityChange|validityChange}
 * * {@link HostedFields#event:inputSubmitRequest|inputSubmitRequest}
 *
 * **Other Events**
 * * {@link HostedFields#event:binAvailable|binAvailable} - emits a {@link HostedFields~binPayload|bin payload}
 * @example
 * <caption>Listening to a Hosted Field event, in this case 'focus'</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('focus', function (event) {
 *     console.log(event.emittedBy, 'has been focused');
 *   });
 * });
 * @returns {void}
 */

/**
 * @name HostedFields#off
 * @function
 * @param {string} event The name of the event to which you are unsubscribing.
 * @param {function} handler The callback for the event you are unsubscribing from.
 * @description Unsubscribes the handler function to a named event.
 * @example
 * <caption>Subscribing and then unsubscribing from a Hosted Field event, in this case 'focus'</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   var callback = function (event) {
 *     console.log(event.emittedBy, 'has been focused');
 *   };
 *   hostedFieldsInstance.on('focus', callback);
 *
 *   // later on
 *   hostedFieldsInstance.off('focus', callback);
 * });
 * @returns {void}
 */

/**
 * This event is emitted when the user requests submission of an input field, such as by pressing the Enter or Return key on their keyboard, or mobile equivalent.
 * @event HostedFields#inputSubmitRequest
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Clicking a submit button upon hitting Enter (or equivalent) within a Hosted Field</caption>
 * var hostedFields = require('braintree-web/hosted-fields');
 * var submitButton = document.querySelector('input[type="submit"]');
 *
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('inputSubmitRequest', function () {
 *     // User requested submission, e.g. by pressing Enter or equivalent
 *     submitButton.click();
 *   });
 * });
 */

/**
 * This event is emitted when a field transitions from having data to being empty.
 * @event HostedFields#empty
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to an empty event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('empty', function (event) {
 *     console.log(event.emittedBy, 'is now empty');
 *   });
 * });
 */

/**
 * This event is emitted when a field transitions from being empty to having data.
 * @event HostedFields#notEmpty
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to an notEmpty event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('notEmpty', function (event) {
 *     console.log(event.emittedBy, 'is now not empty');
 *   });
 * });
 */

/**
 * This event is emitted when a field loses focus.
 * @event HostedFields#blur
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to a blur event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('blur', function (event) {
 *     console.log(event.emittedBy, 'lost focus');
 *   });
 * });
 */

/**
 * This event is emitted when a field gains focus.
 * @event HostedFields#focus
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to a focus event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('focus', function (event) {
 *     console.log(event.emittedBy, 'gained focus');
 *   });
 * });
 */

/**
 * This event is emitted when activity within the number field has changed such that the possible card type has changed.
 * @event HostedFields#cardTypeChange
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to a cardTypeChange event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('cardTypeChange', function (event) {
 *     if (event.cards.length === 1) {
 *       console.log(event.cards[0].type);
 *     } else {
 *       console.log('Type of card not yet known');
 *     }
 *   });
 * });
 */

/**
 * This event is emitted when the validity of a field has changed. Validity is represented in the {@link HostedFields~stateObject|stateObject} as two booleans: `isValid` and `isPotentiallyValid`.
 * @event HostedFields#validityChange
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to a validityChange event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('validityChange', function (event) {
 *     var field = event.fields[event.emittedBy];
 *
 *     if (field.isValid) {
 *       console.log(event.emittedBy, 'is fully valid');
 *     } else if (field.isPotentiallyValid) {
 *       console.log(event.emittedBy, 'is potentially valid');
 *     } else {
 *       console.log(event.emittedBy, 'is not valid');
 *     }
 *   });
 * });
 */

/**
 * This event is emitted when the first 6 digits of the card number have been entered by the customer.
 * @event HostedFields#binAvailable
 * @type {string}
 * @example
 * <caption>Listening to a `binAvailable` event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('binAvailable', function (event) {
 *     event.bin // send bin to 3rd party bin service
 *   });
 * });
 */

function createInputEventHandler(fields) {
  return function (eventData) {
    var field;
    var merchantPayload = eventData.merchantPayload;
    var emittedBy = merchantPayload.emittedBy;
    var container = fields[emittedBy].containerElement;

    Object.keys(merchantPayload.fields).forEach(function (key) {
      merchantPayload.fields[key].container = fields[key].containerElement;
    });

    field = merchantPayload.fields[emittedBy];

    if (eventData.type === 'blur') {
      performBlurFixForIos(container);
    }

    classList.toggle(container, constants.externalClasses.FOCUSED, field.isFocused);
    classList.toggle(container, constants.externalClasses.VALID, field.isValid);
    classList.toggle(container, constants.externalClasses.INVALID, !field.isPotentiallyValid);

    this._state = {// eslint-disable-line no-invalid-this
      cards: merchantPayload.cards,
      fields: merchantPayload.fields
    };

    this._emit(eventData.type, merchantPayload); // eslint-disable-line no-invalid-this
  };
}

// iOS Safari has a bug where inputs in iframes
// will not dismiss the keyboard when they lose
// focus. We create a hidden button input that we
// can focus on and blur to force the keyboard to
// dismiss. See #229
function performBlurFixForIos(container) {
  var hiddenInput;

  if (!browserDetection.isIos()) {
    return;
  }

  if (document.activeElement === document.body) {
    hiddenInput = container.querySelector('input');

    if (!hiddenInput) {
      hiddenInput = document.createElement('input');

      hiddenInput.type = 'button';
      hiddenInput.style.height = '0px';
      hiddenInput.style.width = '0px';
      hiddenInput.style.opacity = '0';
      hiddenInput.style.padding = '0';
      hiddenInput.style.position = 'absolute';
      hiddenInput.style.left = '-200%';
      hiddenInput.style.top = '0px';

      container.insertBefore(hiddenInput, container.firstChild);
    }

    hiddenInput.focus();
    hiddenInput.blur();
  }
}

function isVisibleEnough(node) {
  var boundingBox = node.getBoundingClientRect();
  var verticalMidpoint = Math.floor(boundingBox.height / 2);
  var horizontalMidpoint = Math.floor(boundingBox.width / 2);

  return (
    boundingBox.top < (window.innerHeight - verticalMidpoint || document.documentElement.clientHeight - verticalMidpoint) &&
    boundingBox.right > horizontalMidpoint &&
    boundingBox.bottom > verticalMidpoint &&
    boundingBox.left < (window.innerWidth - horizontalMidpoint || document.documentElement.clientWidth - horizontalMidpoint)
  );
}

/**
 * @class HostedFields
 * @param {object} options The Hosted Fields {@link module:braintree-web/hosted-fields.create create} options.
 * @description <strong>Do not use this constructor directly. Use {@link module:braintree-web/hosted-fields.create|braintree-web.hosted-fields.create} instead.</strong>
 * @classdesc This class represents a Hosted Fields component produced by {@link module:braintree-web/hosted-fields.create|braintree-web/hosted-fields.create}. Instances of this class have methods for interacting with the input fields within Hosted Fields' iframes.
 */
function HostedFields(options) {
  var failureTimeout, clientConfig, assetsUrl, isDebug, hostedFieldsUrl;
  var self = this;
  var fields = {};
  var frameReadyPromiseResolveFunctions = {};
  var frameReadyPromises = [];
  var componentId = uuid();

  this._merchantConfigurationOptions = assign({}, options);

  if (options.client) {
    clientConfig = options.client.getConfiguration();
    assetsUrl = clientConfig.gatewayConfiguration.assetsUrl;
    isDebug = clientConfig.isDebug;
  } else {
    assetsUrl = createAssetsUrl.create(options.authorization);
    isDebug = Boolean(options.isDebug);
  }

  this._clientPromise = createDeferredClient.create({
    client: options.client,
    authorization: options.authorization,
    debug: isDebug,
    assetsUrl: assetsUrl,
    name: 'Hosted Fields'
  });

  hostedFieldsUrl = composeUrl(assetsUrl, componentId, isDebug);

  if (!options.fields || Object.keys(options.fields).length === 0) {
    throw new BraintreeError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.fields is required when instantiating Hosted Fields.'
    });
  }

  EventEmitter.call(this);

  this._injectedNodes = [];
  this._destructor = new Destructor();
  this._fields = fields;
  this._state = {
    fields: {},
    cards: getCardTypes('')
  };

  this._bus = new Bus({
    channel: componentId,
    merchantUrl: location.href
  });

  this._destructor.registerFunctionForTeardown(function () {
    self._bus.teardown();
  });

  // NEXT_MAJOR_VERSION analytics events should have present tense verbs
  if (!options.client) {
    analytics.sendEvent(this._clientPromise, 'custom.hosted-fields.initialized.deferred-client');
  } else {
    analytics.sendEvent(this._clientPromise, 'custom.hosted-fields.initialized');
  }

  Object.keys(options.fields).forEach(function (key) {
    var field, container, frame, frameReadyPromise;

    if (!constants.allowedFields.hasOwnProperty(key)) {
      throw new BraintreeError({
        type: errors.HOSTED_FIELDS_INVALID_FIELD_KEY.type,
        code: errors.HOSTED_FIELDS_INVALID_FIELD_KEY.code,
        message: '"' + key + '" is not a valid field.'
      });
    }

    field = options.fields[key];
    // NEXT_MAJOR_VERSION remove selector as an option
    // and simply make the API take a container
    container = field.container || field.selector;

    if (typeof container === 'string') {
      container = document.querySelector(container);
    }

    if (!container || container.nodeType !== 1) {
      throw new BraintreeError({
        type: errors.HOSTED_FIELDS_INVALID_FIELD_SELECTOR.type,
        code: errors.HOSTED_FIELDS_INVALID_FIELD_SELECTOR.code,
        message: errors.HOSTED_FIELDS_INVALID_FIELD_SELECTOR.message,
        details: {
          fieldSelector: field.selector,
          fieldContainer: field.container,
          fieldKey: key
        }
      });
    } else if (container.querySelector('iframe[name^="braintree-"]')) {
      throw new BraintreeError({
        type: errors.HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME.type,
        code: errors.HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME.code,
        message: errors.HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME.message,
        details: {
          fieldSelector: field.selector,
          fieldContainer: field.container,
          fieldKey: key
        }
      });
    }

    if (field.maxlength && typeof field.maxlength !== 'number') {
      throw new BraintreeError({
        type: errors.HOSTED_FIELDS_FIELD_PROPERTY_INVALID.type,
        code: errors.HOSTED_FIELDS_FIELD_PROPERTY_INVALID.code,
        message: 'The value for maxlength must be a number.',
        details: {
          fieldKey: key
        }
      });
    }

    if (field.minlength && typeof field.minlength !== 'number') {
      throw new BraintreeError({
        type: errors.HOSTED_FIELDS_FIELD_PROPERTY_INVALID.type,
        code: errors.HOSTED_FIELDS_FIELD_PROPERTY_INVALID.code,
        message: 'The value for minlength must be a number.',
        details: {
          fieldKey: key
        }
      });
    }

    frame = iFramer({
      type: key,
      name: 'braintree-hosted-field-' + key,
      style: constants.defaultIFrameStyle,
      title: 'Secure Credit Card Frame - ' + constants.allowedFields[key].label
    });

    this._injectedNodes.push.apply(this._injectedNodes, injectFrame(frame, container, function () {
      self._bus.emit(events.TRIGGER_INPUT_FOCUS, {
        field: key
      });
    }));

    this._setupLabelFocus(key, container);
    fields[key] = {
      frameElement: frame,
      containerElement: container
    };
    frameReadyPromise = new Promise(function (resolve) {
      frameReadyPromiseResolveFunctions[key] = resolve;
    });
    frameReadyPromises.push(frameReadyPromise);

    this._state.fields[key] = {
      isEmpty: true,
      isValid: false,
      isPotentiallyValid: true,
      isFocused: false,
      container: container
    };

    setTimeout(function () {
      // Edge has an intermittent issue where
      // the iframes load, but the JavaScript
      // can't message out to the parent page.
      // We can fix this by setting the src
      // to about:blank first followed by
      // the actual source. Both instances
      // of setting the src need to be in a
      // setTimeout to work.
      if (browserDetection.isIE() || browserDetection.isEdge()) {
        frame.src = 'about:blank';
        setTimeout(function () {
          frame.src = hostedFieldsUrl;
        }, 0);
      } else {
        frame.src = hostedFieldsUrl;
      }
    }, 0);
  }.bind(this));

  if (this._merchantConfigurationOptions.styles) {
    Object.keys(this._merchantConfigurationOptions.styles).forEach(function (selector) {
      var className = self._merchantConfigurationOptions.styles[selector];

      if (typeof className === 'string') {
        self._merchantConfigurationOptions.styles[selector] = getStylesFromClass(className);
      }
    });
  }

  this._bus.on(events.REMOVE_FOCUS_INTERCEPTS, function (data) {
    destroyFocusIntercept(data && data.id);
  });

  this._bus.on(events.TRIGGER_FOCUS_CHANGE, focusChange.createFocusChangeHandler({
    onRemoveFocusIntercepts: function (element) {
      self._bus.emit(events.REMOVE_FOCUS_INTERCEPTS, {
        id: element
      });
    },
    onTriggerInputFocus: function (targetType) {
      self._bus.emit(events.TRIGGER_INPUT_FOCUS, {
        field: targetType
      });
    }
  }));

  this._bus.on(events.READY_FOR_CLIENT, function (reply) {
    self._clientPromise.then(function (client) {
      reply(client);
    });
  });

  this._bus.on(events.CARD_FORM_ENTRY_HAS_BEGUN, function () {
    analytics.sendEvent(self._clientPromise, 'hosted-fields.input.started');
  });

  this._bus.on(events.BIN_AVAILABLE, function (bin) {
    self._emit('binAvailable', {
      bin: bin
    });
  });

  failureTimeout = setTimeout(function () {
    analytics.sendEvent(self._clientPromise, 'custom.hosted-fields.load.timed-out');
    self._emit('timeout');
  }, INTEGRATION_TIMEOUT_MS);

  Promise.all(frameReadyPromises).then(function (results) {
    var reply = results[0];

    clearTimeout(failureTimeout);
    reply(formatMerchantConfigurationForIframes(self._merchantConfigurationOptions));

    self._cleanUpFocusIntercepts();

    self._emit('ready');
  });

  this._bus.on(events.FRAME_READY, function (data, reply) {
    frameReadyPromiseResolveFunctions[data.field](reply);
  });

  this._bus.on(
    events.INPUT_EVENT,
    createInputEventHandler(fields).bind(this)
  );

  if (browserDetection.isIos()) {
    this._bus.on(events.TRIGGER_INPUT_FOCUS, function (data) {
      var container = fields[data.field].containerElement;

      // Inputs outside of the viewport don't always scroll into view on
      // focus in iOS Safari. 5ms timeout gives the browser a chance to
      // do the right thing and prevents stuttering.
      setTimeout(function () {
        if (!isVisibleEnough(container)) {
          container.scrollIntoView();
        }
      }, SAFARI_FOCUS_TIMEOUT);
    });
  }

  this._destructor.registerFunctionForTeardown(function () {
    var j, node, parent;

    for (j = 0; j < self._injectedNodes.length; j++) {
      node = self._injectedNodes[j];
      parent = node.parentNode;

      parent.removeChild(node);

      classList.remove(
        parent,
        constants.externalClasses.FOCUSED,
        constants.externalClasses.INVALID,
        constants.externalClasses.VALID
      );
    }
  });

  this._destructor.registerFunctionForTeardown(function () {
    destroyFocusIntercept();
  });

  this._destructor.registerFunctionForTeardown(function () {
    var methodNames = methods(HostedFields.prototype).concat(methods(EventEmitter.prototype));

    convertMethodsToError(self, methodNames);
  });
}

EventEmitter.createChild(HostedFields);

HostedFields.prototype._setupLabelFocus = function (type, container) {
  var labels, i;
  var shouldSkipLabelFocus = browserDetection.isIos();
  var bus = this._bus;

  if (shouldSkipLabelFocus) { return; }
  if (container.id == null) { return; }

  function triggerFocus() {
    bus.emit(events.TRIGGER_INPUT_FOCUS, {
      field: type
    });
  }

  labels = Array.prototype.slice.call(document.querySelectorAll('label[for="' + container.id + '"]'));
  labels = labels.concat(findParentTags(container, 'label'));

  for (i = 0; i < labels.length; i++) {
    labels[i].addEventListener('click', triggerFocus, false);
  }

  this._destructor.registerFunctionForTeardown(function () {
    for (i = 0; i < labels.length; i++) {
      labels[i].removeEventListener('click', triggerFocus, false);
    }
  });
};

HostedFields.prototype._getAnyFieldContainer = function () {
  var self = this;

  return Object.keys(this._fields).reduce(function (found, field) {
    return found || self._fields[field].containerElement;
  }, null);
};

HostedFields.prototype._cleanUpFocusIntercepts = function () {
  var iframeContainer, checkoutForm;

  if (document.forms.length < 1) {
    this._bus.emit(events.REMOVE_FOCUS_INTERCEPTS);
  } else {
    iframeContainer = this._getAnyFieldContainer();
    checkoutForm = findParentTags(iframeContainer, 'form')[0];

    if (checkoutForm) {
      focusChange.removeExtraFocusElements(checkoutForm, function (id) {
        this._bus.emit(events.REMOVE_FOCUS_INTERCEPTS, {
          id: id
        });
      }.bind(this));
    } else {
      this._bus.emit(events.REMOVE_FOCUS_INTERCEPTS);
    }
  }
};

HostedFields.prototype._attachInvalidFieldContainersToError = function (err) {
  if (!(err.details && err.details.invalidFieldKeys && err.details.invalidFieldKeys.length > 0)) {
    return;
  }
  err.details.invalidFields = {};
  err.details.invalidFieldKeys.forEach(function (field) {
    err.details.invalidFields[field] = this._fields[field].containerElement;
  }.bind(this));
};

/**
 * Get card verification challenges, such as requirements for cvv and postal code.
 * @public
 * @param {callback} [callback] Called on completion, containing an error if one occurred. If no callback is provided, `getChallenges` returns a promise.
 * @example
 * hostedFieldsInstance.getChallenges().then(function (challenges) {
 *   challenges // ['cvv', 'postal_code']
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
HostedFields.prototype.getChallenges = function () {
  return this._clientPromise.then(function (client) {
    return client.getConfiguration().gatewayConfiguration.challenges;
  });
};

/**
 * Get supported card types configured in the Braintree Control Panel
 * @public
 * @param {callback} [callback] Called on completion, containing an error if one occurred. If no callback is provided, `getSupportedCardTypes` returns a promise.
 * @example
 * hostedFieldsInstance.getSupportedCardTypes().then(function (cardTypes) {
 *   cardTypes // ['Visa', 'American Express', 'Mastercard']
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
HostedFields.prototype.getSupportedCardTypes = function () {
  return this._clientPromise.then(function (client) {
    var cards = client.getConfiguration().gatewayConfiguration.creditCards.supportedCardTypes.map(function (cardType) {
      if (cardType === 'MasterCard') {
        // Mastercard changed their branding. We can't update our
        // config without creating a breaking change, so we just
        // hard code the change here
        return 'Mastercard';
      }

      return cardType;
    });

    return cards;
  });
};

/**
 * Cleanly remove anything set up by {@link module:braintree-web/hosted-fields.create|create}.
 * @public
 * @param {callback} [callback] Called on completion, containing an error if one occurred. No data is returned if teardown completes successfully. If no callback is provided, `teardown` returns a promise.
 * @example
 * hostedFieldsInstance.teardown(function (teardownErr) {
 *   if (teardownErr) {
 *     console.error('Could not tear down Hosted Fields!');
 *   } else {
 *     console.info('Hosted Fields has been torn down!');
 *   }
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
HostedFields.prototype.teardown = function () {
  var self = this;

  return new Promise(function (resolve, reject) {
    self._destructor.teardown(function (err) {
      analytics.sendEvent(self._clientPromise, 'custom.hosted-fields.teardown-completed');

      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Tokenizes fields and returns a nonce payload.
 * @public
 * @param {object} [options] All tokenization options for the Hosted Fields component.
 * @param {boolean} [options.vault=false] When true, will vault the tokenized card. Cards will only be vaulted when using a client created with a client token that includes a customer ID. Note: merchants using Advanced Fraud Tools should not use this option, as device data will not be included.
 * @param {object} [options.authenticationInsight] Options for checking authentication insight - the [regulatory environment](https://developers.braintreepayments.com/guides/3d-secure/advanced-options/javascript/v3#authentication-insight) of the tokenized card.
 * @param {string} options.authenticationInsight.merchantAccountId The Braintree merchant account id to use to look up the authentication insight information.
 * @param {array} [options.fieldsToTokenize] By default, all fields will be tokenized. You may specify which fields specifically you wish to tokenize with this property. Valid options are `'number'`, `'cvv'`, `'expirationDate'`, `'expirationMonth'`, `'expirationYear'`, `'postalCode'`.
 * @param {string} [options.cardholderName] When supplied, the cardholder name to be tokenized with the contents of the fields.
 * @param {string} [options.billingAddress.postalCode] When supplied, this postal code will be tokenized along with the contents of the fields. If a postal code is provided as part of the Hosted Fields configuration, the value of the field will be tokenized and this value will be ignored.
 * @param {string} [options.billingAddress.firstName] When supplied, this customer first name will be tokenized along with the contents of the fields.
 * @param {string} [options.billingAddress.lastName] When supplied, this customer last name will be tokenized along with the contents of the fields.
 * @param {string} [options.billingAddress.company] When supplied, this company name will be tokenized along with the contents of the fields.
 * @param {string} [options.billingAddress.streetAddress] When supplied, this street address will be tokenized along with the contents of the fields.
 * @param {string} [options.billingAddress.extendedAddress] When supplied, this extended address will be tokenized along with the contents of the fields.
 * @param {string} [options.billingAddress.locality] When supplied, this locality (the city) will be tokenized along with the contents of the fields.
 * @param {string} [options.billingAddress.region] When supplied, this region (the state) will be tokenized along with the contents of the fields.
 * @param {string} [options.billingAddress.countryCodeNumeric] When supplied, this numeric country code will be tokenized along with the contents of the fields.
 * @param {string} [options.billingAddress.countryCodeAlpha2] When supplied, this alpha 2 representation of a country will be tokenized along with the contents of the fields.
 * @param {string} [options.billingAddress.countryCodeAlpha3] When supplied, this alpha 3 representation of a country will be tokenized along with the contents of the fields.
 * @param {string} [options.billingAddress.countryName] When supplied, this country name will be tokenized along with the contents of the fields.
 *
 * @param {callback} [callback] May be used as the only parameter of the function if no options are passed in. The second argument, <code>data</code>, is a {@link HostedFields~tokenizePayload|tokenizePayload}. If no callback is provided, `tokenize` returns a function that resolves with a {@link HostedFields~tokenizePayload|tokenizePayload}.
 * @example <caption>Tokenize a card</caption>
 * hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
 *   if (tokenizeErr) {
 *     switch (tokenizeErr.code) {
 *       case 'HOSTED_FIELDS_FIELDS_EMPTY':
 *         // occurs when none of the fields are filled in
 *         console.error('All fields are empty! Please fill out the form.');
 *         break;
 *       case 'HOSTED_FIELDS_FIELDS_INVALID':
 *         // occurs when certain fields do not pass client side validation
 *         console.error('Some fields are invalid:', tokenizeErr.details.invalidFieldKeys);
 *
 *         // you can also programtically access the field containers for the invalid fields
 *         tokenizeErr.details.invalidFields.forEach(function (fieldContainer) {
 *           fieldContainer.className = 'invalid';
 *         });
 *         break;
 *       case 'HOSTED_FIELDS_TOKENIZATION_FAIL_ON_DUPLICATE':
 *         // occurs when:
 *         //   * the client token used for client authorization was generated
 *         //     with a customer ID and the fail on duplicate payment method
 *         //     option is set to true
 *         //   * the card being tokenized has previously been vaulted (with any customer)
 *         // See: https://developers.braintreepayments.com/reference/request/client-token/generate/#options.fail_on_duplicate_payment_method
 *         console.error('This payment method already exists in your vault.');
 *         break;
 *       case 'HOSTED_FIELDS_TOKENIZATION_CVV_VERIFICATION_FAILED':
 *         // occurs when:
 *         //   * the client token used for client authorization was generated
 *         //     with a customer ID and the verify card option is set to true
 *         //     and you have credit card verification turned on in the Braintree
 *         //     control panel
 *         //   * the cvv does not pass verfication (https://developers.braintreepayments.com/reference/general/testing/#avs-and-cvv/cid-responses)
 *         // See: https://developers.braintreepayments.com/reference/request/client-token/generate/#options.verify_card
 *         console.error('CVV did not pass verification');
 *         break;
 *       case 'HOSTED_FIELDS_FAILED_TOKENIZATION':
 *         // occurs for any other tokenization error on the server
 *         console.error('Tokenization failed server side. Is the card valid?');
 *         break;
 *       case 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR':
 *         // occurs when the Braintree gateway cannot be contacted
 *         console.error('Network error occurred when tokenizing.');
 *         break;
 *       default:
 *         console.error('Something bad happened!', tokenizeErr);
 *     }
 *   } else {
 *     console.log('Got nonce:', payload.nonce);
 *   }
 * });
 * @example <caption>Tokenize and vault a card</caption>
 * hostedFieldsInstance.tokenize({
 *   vault: true
 * }, function (tokenizeErr, payload) {
 *   if (tokenizeErr) {
 *     console.error(tokenizeErr);
 *   } else {
 *     console.log('Got nonce:', payload.nonce);
 *   }
 * });
 * @example <caption>Tokenize a card with cardholder name</caption>
 * hostedFieldsInstance.tokenize({
 *   cardholderName: 'First Last'
 * }, function (tokenizeErr, payload) {
 *   if (tokenizeErr) {
 *     console.error(tokenizeErr);
 *   } else {
 *     console.log('Got nonce:', payload.nonce);
 *   }
 * });
 * @example <caption>Tokenize a card with the postal code option</caption>
 * hostedFieldsInstance.tokenize({
 *   billingAddress: {
 *     postalCode: '11111'
 *   }
 * }, function (tokenizeErr, payload) {
 *   if (tokenizeErr) {
 *     console.error(tokenizeErr);
 *   } else {
 *     console.log('Got nonce:', payload.nonce);
 *   }
 * });
 * @example <caption>Tokenize a card with additional billing address options</caption>
 * hostedFieldsInstance.tokenize({
 *   billingAddress: {
 *     firstName: 'First',
 *     lastName: 'Last',
 *     company: 'Company',
 *     streetAddress: '123 Street',
 *     extendedAddress: 'Unit 1',
 *     // passing just one of the country options is sufficient to
 *     // associate the card details with a particular country
 *     // valid country names and codes can be found here:
 *     // https://developers.braintreepayments.com/reference/general/countries/ruby#list-of-countries
 *     countryName: 'United States',
 *     countryCodeAlpha2: 'US',
 *     countryCodeAlpha3: 'USA',
 *     countryCodeNumeric: '840'
 *   }
 * }, function (tokenizeErr, payload) {
 *   if (tokenizeErr) {
 *     console.error(tokenizeErr);
 *   } else {
 *     console.log('Got nonce:', payload.nonce);
 *   }
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
HostedFields.prototype.tokenize = function (options) {
  var self = this;

  if (!options) {
    options = {};
  }

  return new Promise(function (resolve, reject) {
    self._bus.emit(events.TOKENIZATION_REQUEST, options, function (response) {
      var err = response[0];
      var payload = response[1];

      if (err) {
        self._attachInvalidFieldContainersToError(err);
        reject(new BraintreeError(err));
      } else {
        resolve(payload);
      }
    });
  });
};

/**
 * Add a class to a {@link module:braintree-web/hosted-fields~field field}. Useful for updating field styles when events occur elsewhere in your checkout.
 * @public
 * @param {string} field The field you wish to add a class to. Must be a valid {@link module:braintree-web/hosted-fields~fieldOptions fieldOption}.
 * @param {string} classname The class to be added.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the class is added successfully.
 *
 * @example
 * hostedFieldsInstance.addClass('number', 'custom-class', function (addClassErr) {
 *   if (addClassErr) {
 *     console.error(addClassErr);
 *   }
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
HostedFields.prototype.addClass = function (field, classname) {
  var err;

  if (!allowedFields.hasOwnProperty(field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_INVALID.code,
      message: '"' + field + '" is not a valid field. You must use a valid field option when adding a class.'
    });
  } else if (!this._fields.hasOwnProperty(field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,
      code: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,
      message: 'Cannot add class to "' + field + '" field because it is not part of the current Hosted Fields options.'
    });
  } else {
    this._bus.emit(events.ADD_CLASS, {
      field: field,
      classname: classname
    });
  }

  if (err) {
    return Promise.reject(err);
  }

  return Promise.resolve();
};

/**
 * Removes a class to a {@link module:braintree-web/hosted-fields~field field}. Useful for updating field styles when events occur elsewhere in your checkout.
 * @public
 * @param {string} field The field you wish to remove a class from. Must be a valid {@link module:braintree-web/hosted-fields~fieldOptions fieldOption}.
 * @param {string} classname The class to be removed.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the class is removed successfully.
 *
 * @example
 * hostedFieldsInstance.addClass('number', 'custom-class', function (addClassErr) {
 *   if (addClassErr) {
 *     console.error(addClassErr);
 *     return;
 *   }
 *
 *   // some time later...
 *   hostedFieldsInstance.removeClass('number', 'custom-class');
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
HostedFields.prototype.removeClass = function (field, classname) {
  var err;

  if (!allowedFields.hasOwnProperty(field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_INVALID.code,
      message: '"' + field + '" is not a valid field. You must use a valid field option when removing a class.'
    });
  } else if (!this._fields.hasOwnProperty(field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,
      code: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,
      message: 'Cannot remove class from "' + field + '" field because it is not part of the current Hosted Fields options.'
    });
  } else {
    this._bus.emit(events.REMOVE_CLASS, {
      field: field,
      classname: classname
    });
  }

  if (err) {
    return Promise.reject(err);
  }

  return Promise.resolve();
};

/**
 * Sets an attribute of a {@link module:braintree-web/hosted-fields~field field}.
 * Supported attributes are `aria-invalid`, `aria-required`, `disabled`, and `placeholder`.
 *
 * @public
 * @param {object} options The options for the attribute you wish to set.
 * @param {string} options.field The field to which you wish to add an attribute. Must be a valid {@link module:braintree-web/hosted-fields~fieldOptions fieldOption}.
 * @param {string} options.attribute The name of the attribute you wish to add to the field.
 * @param {string} options.value The value for the attribute.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the attribute is set successfully.
 *
 * @example <caption>Set the placeholder attribute of a field</caption>
 * hostedFieldsInstance.setAttribute({
 *   field: 'number',
 *   attribute: 'placeholder',
 *   value: '1111 1111 1111 1111'
 * }, function (attributeErr) {
 *   if (attributeErr) {
 *     console.error(attributeErr);
 *   }
 * });
 *
 * @example <caption>Set the aria-required attribute of a field</caption>
 * hostedFieldsInstance.setAttribute({
 *   field: 'number',
 *   attribute: 'aria-required',
 *   value: true
 * }, function (attributeErr) {
 *   if (attributeErr) {
 *     console.error(attributeErr);
 *   }
 * });
 *
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
HostedFields.prototype.setAttribute = function (options) {
  var attributeErr, err;

  if (!allowedFields.hasOwnProperty(options.field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_INVALID.code,
      message: '"' + options.field + '" is not a valid field. You must use a valid field option when setting an attribute.'
    });
  } else if (!this._fields.hasOwnProperty(options.field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,
      code: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,
      message: 'Cannot set attribute for "' + options.field + '" field because it is not part of the current Hosted Fields options.'
    });
  } else {
    attributeErr = attributeValidationError(options.attribute, options.value);

    if (attributeErr) {
      err = attributeErr;
    } else {
      this._bus.emit(events.SET_ATTRIBUTE, {
        field: options.field,
        attribute: options.attribute,
        value: options.value
      });
    }
  }

  if (err) {
    return Promise.reject(err);
  }

  return Promise.resolve();
};

/**
 * Sets the month options for the expiration month field when presented as a select element.
 *
 * @public
 * @param {array} options An array of 12 entries corresponding to the 12 months.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the options are updated succesfully. Errors if expirationMonth is not configured on the Hosted Fields instance or if the expirationMonth field is not configured to be a select input.
 *
 * @example <caption>Update the month options to spanish</caption>
 * hostedFieldsInstance.setMonthOptions([
 *   '01 - enero',
 *   '02 - febrero',
 *   '03 - marzo',
 *   '04 - abril',
 *   '05 - mayo',
 *   '06 - junio',
 *   '07 - julio',
 *   '08 - agosto',
 *   '09 - septiembre',
 *   '10 - octubre',
 *   '11 - noviembre',
 *   '12 - diciembre'
 * ]);
 *
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
HostedFields.prototype.setMonthOptions = function (options) {
  var self = this;
  var merchantOptions = this._merchantConfigurationOptions.fields;
  var errorMessage;

  if (!merchantOptions.expirationMonth) {
    errorMessage = 'Expiration month field must exist to use setMonthOptions.';
  } else if (!merchantOptions.expirationMonth.select) {
    errorMessage = 'Expiration month field must be a select element.';
  }

  if (errorMessage) {
    return Promise.reject(new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_PROPERTY_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_PROPERTY_INVALID.code,
      message: errorMessage
    }));
  }

  return new Promise(function (resolve) {
    self._bus.emit(events.SET_MONTH_OPTIONS, options, resolve);
  });
};

/**
 * Sets a visually hidden message (for screenreaders) on a {@link module:braintree-web/hosted-fields~field field}.
 *
 * @public
 * @param {object} options The options for the attribute you wish to set.
 * @param {string} options.field The field to which you wish to add an attribute. Must be a valid {@link module:braintree-web/hosted-fields~field field}.
 * @param {string} options.message The message to set.
 *
 * @example <caption>Set an error message on a field</caption>
 * hostedFieldsInstance.setMessage({
 *   field: 'number',
 *   message: 'Invalid card number'
 * });
 *
 * @example <caption>Remove the message on a field</caption>
 * hostedFieldsInstance.setMessage({
 *   field: 'number',
 *   message: ''
 * });
 *
 * @returns {void}
 */
HostedFields.prototype.setMessage = function (options) {
  this._bus.emit(events.SET_MESSAGE, {
    field: options.field,
    message: options.message
  });
};

/**
 * Removes a supported attribute from a {@link module:braintree-web/hosted-fields~field field}.
 *
 * @public
 * @param {object} options The options for the attribute you wish to remove.
 * @param {string} options.field The field from which you wish to remove an attribute. Must be a valid {@link module:braintree-web/hosted-fields~fieldOptions fieldOption}.
 * @param {string} options.attribute The name of the attribute you wish to remove from the field.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the attribute is removed successfully.
 *
 * @example <caption>Remove the placeholder attribute of a field</caption>
 * hostedFieldsInstance.removeAttribute({
 *   field: 'number',
 *   attribute: 'placeholder'
 * }, function (attributeErr) {
 *   if (attributeErr) {
 *     console.error(attributeErr);
 *   }
 * });
 *
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
HostedFields.prototype.removeAttribute = function (options) {
  var attributeErr, err;

  if (!allowedFields.hasOwnProperty(options.field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_INVALID.code,
      message: '"' + options.field + '" is not a valid field. You must use a valid field option when removing an attribute.'
    });
  } else if (!this._fields.hasOwnProperty(options.field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,
      code: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,
      message: 'Cannot remove attribute for "' + options.field + '" field because it is not part of the current Hosted Fields options.'
    });
  } else {
    attributeErr = attributeValidationError(options.attribute);

    if (attributeErr) {
      err = attributeErr;
    } else {
      this._bus.emit(events.REMOVE_ATTRIBUTE, {
        field: options.field,
        attribute: options.attribute
      });
    }
  }

  if (err) {
    return Promise.reject(err);
  }

  return Promise.resolve();
};

/**
 * @deprecated since version 3.8.0. Use {@link HostedFields#setAttribute|setAttribute} instead.
 *
 * @public
 * @param {string} field The field whose placeholder you wish to change. Must be a valid {@link module:braintree-web/hosted-fields~fieldOptions fieldOption}.
 * @param {string} placeholder Will be used as the `placeholder` attribute of the input.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the placeholder updated successfully.
 *
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
HostedFields.prototype.setPlaceholder = function (field, placeholder) {
  return this.setAttribute({
    field: field,
    attribute: 'placeholder',
    value: placeholder
  });
};

/**
 * Clear the value of a {@link module:braintree-web/hosted-fields~field field}.
 * @public
 * @param {string} field The field you wish to clear. Must be a valid {@link module:braintree-web/hosted-fields~fieldOptions fieldOption}.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the field cleared successfully.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * hostedFieldsInstance.clear('number', function (clearErr) {
 *   if (clearErr) {
 *     console.error(clearErr);
 *   }
 * });
 *
 * @example <caption>Clear several fields</caption>
 * hostedFieldsInstance.clear('number');
 * hostedFieldsInstance.clear('cvv');
 * hostedFieldsInstance.clear('expirationDate');
 */
HostedFields.prototype.clear = function (field) {
  var err;

  if (!allowedFields.hasOwnProperty(field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_INVALID.code,
      message: '"' + field + '" is not a valid field. You must use a valid field option when clearing a field.'
    });
  } else if (!this._fields.hasOwnProperty(field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,
      code: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,
      message: 'Cannot clear "' + field + '" field because it is not part of the current Hosted Fields options.'
    });
  } else {
    this._bus.emit(events.CLEAR_FIELD, {
      field: field
    });
  }

  if (err) {
    return Promise.reject(err);
  }

  return Promise.resolve();
};

/**
 * Programmatically focus a {@link module:braintree-web/hosted-fields~field field}.
 * @public
 * @param {string} field The field you want to focus. Must be a valid {@link module:braintree-web/hosted-fields~fieldOptions fieldOption}.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the field focused successfully.
 * @returns {void}
 * @example
 * hostedFieldsInstance.focus('number', function (focusErr) {
 *   if (focusErr) {
 *     console.error(focusErr);
 *   }
 * });
 * @example <caption>Using an event listener</caption>
 * myElement.addEventListener('click', function (e) {
 *   // In Firefox, the focus method can be suppressed
 *   //   if the element has a tabindex property or the element
 *   //   is an anchor link with an href property.
 *   // In Mobile Safari, the focus method is unable to
 *   //   programatically open the keyboard, as only
 *   //   touch events are allowed to do so.
 *   e.preventDefault();
 *   hostedFieldsInstance.focus('number');
 * });
 */
HostedFields.prototype.focus = function (field) {
  var err;

  if (!allowedFields.hasOwnProperty(field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_INVALID.code,
      message: '"' + field + '" is not a valid field. You must use a valid field option when focusing a field.'
    });
  } else if (!this._fields.hasOwnProperty(field)) {
    err = new BraintreeError({
      type: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,
      code: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,
      message: 'Cannot focus "' + field + '" field because it is not part of the current Hosted Fields options.'
    });
  } else {
    this._bus.emit(events.TRIGGER_INPUT_FOCUS, {
      field: field
    });
  }

  if (err) {
    return Promise.reject(err);
  }

  return Promise.resolve();
};

/**
 * Returns an {@link HostedFields~stateObject|object} that includes the state of all fields and possible card types.
 * @public
 * @returns {object} {@link HostedFields~stateObject|stateObject}
 * @example <caption>Check if all fields are valid</caption>
 * var state = hostedFieldsInstance.getState();
 *
 * var formValid = Object.keys(state.fields).every(function (key) {
 *   return state.fields[key].isValid;
 * });
 */
HostedFields.prototype.getState = function () {
  return this._state;
};

// React adds decorations to DOM nodes that cause
// circular dependencies, so we remove them from the
// config before sending it to the iframes. However,
// we don't want to mutate the original object that
// was passed in, so we create fresh objects via assign
function formatMerchantConfigurationForIframes(config) {
  var formattedConfig = assign({}, config);

  formattedConfig.fields = assign({}, formattedConfig.fields);
  Object.keys(formattedConfig.fields).forEach(function (field) {
    formattedConfig.fields[field] = assign({}, formattedConfig.fields[field]);
    delete formattedConfig.fields[field].container;
  });

  return formattedConfig;
}

module.exports = wrapPromise.wrapPrototype(HostedFields);

},{"../../lib/analytics":107,"../../lib/assign":109,"../../lib/braintree-error":112,"../../lib/bus":115,"../../lib/constants":117,"../../lib/convert-methods-to-error":118,"../../lib/create-assets-url":120,"../../lib/create-deferred-client":122,"../../lib/destructor":124,"../../lib/errors":126,"../../lib/methods":144,"../../lib/promise":146,"../../lib/vendor/uuid":150,"../shared/browser-detection":99,"../shared/constants":100,"../shared/errors":101,"../shared/find-parent-tags":102,"../shared/focus-intercept":103,"../shared/get-card-types":104,"./attribute-validation-error":92,"./compose-url":93,"./focus-change":94,"./get-styles-from-class":95,"./inject-frame":97,"@braintree/class-list":20,"@braintree/event-emitter":21,"@braintree/iframer":23,"@braintree/wrap-promise":30}],97:[function(_dereq_,module,exports){
'use strict';

var focusIntercept = _dereq_('../shared/focus-intercept');
var directions = _dereq_('../shared/constants').navigationDirections;

module.exports = function injectFrame(frame, container, focusHandler) {
  var frameType = frame.getAttribute('type');
  var clearboth = document.createElement('div');
  var fragment = document.createDocumentFragment();
  var focusInterceptBefore = focusIntercept.generate(frameType, directions.BACK, focusHandler);
  var focusInterceptAfter = focusIntercept.generate(frameType, directions.FORWARD, focusHandler);

  clearboth.style.clear = 'both';

  fragment.appendChild(focusInterceptBefore);
  fragment.appendChild(frame);
  fragment.appendChild(focusInterceptAfter);
  fragment.appendChild(clearboth);

  container.appendChild(fragment);

  return [frame, clearboth];
};

},{"../shared/constants":100,"../shared/focus-intercept":103}],98:[function(_dereq_,module,exports){
'use strict';
/** @module braintree-web/hosted-fields */

var HostedFields = _dereq_('./external/hosted-fields');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var errors = _dereq_('./shared/errors');
var supportsInputFormatting = _dereq_('restricted-input/supports-input-formatting');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var BraintreeError = _dereq_('../lib/braintree-error');
var Promise = _dereq_('../lib/promise');
var VERSION = "3.63.0";

/**
 * Fields used in {@link module:braintree-web/hosted-fields~fieldOptions fields options}
 * @typedef {object} field
 * @property {string} selector Deprecated: Now an alias for `options.container`.
 * @property {(string|HTMLElement)} container A DOM node or CSS selector to find the container where the hosted field will be inserted.
 * @property {string} [placeholder] Will be used as the `placeholder` attribute of the input. If `placeholder` is not natively supported by the browser, it will be polyfilled.
 * @property {string} [type] Will be used as the `type` attribute of the input. To mask `cvv` input, for instance, `type: "password"` can be used.
 * @property {boolean} [formatInput=true] Enable or disable automatic formatting on this field.
 * @property {(object|boolean)} [maskInput=false] Enable or disable input masking when input is not focused. If set to `true` instead of an object, the defaults for the `maskInput` parameters will be used.
 * @property {string} [maskInput.character=•] The character to use when masking the input. The default character ('•') uses a unicode symbol, so the webpage must support UTF-8 characters when using the default.
 * @property {Boolean} [maskInput.showLastFour=false] Only applicable for the credit card field. Whether or not to show the last 4 digits of the card when masking.
 * @property {(object|boolean)} [select] If truthy, this field becomes a `<select>` dropdown list. This can only be used for `expirationMonth` and `expirationYear` fields. If you do not use a `placeholder` property for the field, the current month/year will be the default selected value.
 * @property {string[]} [select.options] An array of 12 strings, one per month. This can only be used for the `expirationMonth` field. For example, the array can look like `['01 - January', '02 - February', ...]`.
 * @property {number} [maxCardLength] This option applies only to the number field. Allows a limit to the length of the card number, even if the card brand may support numbers of a greater length. If the value passed is greater than the max length for a card brand, the smaller number of the 2 values will be used. For example, is `maxCardLength` is set to 16, but an American Express card is entered (which has a max card length of 15), a max card length of 15 will be used.
 * @property {number} [maxlength] This option applies only to the CVV and postal code fields. Will be used as the `maxlength` attribute of the input if it is less than the default. The primary use cases for the `maxlength` option are: limiting the length of the CVV input for CVV-only verifications when the card type is known and limiting the length of the postal code input when cards are coming from a known region.
 * @property {number} [minlength=3] This option applies only to the cvv and postal code fields. Will be used as the `minlength` attribute of the input.
 * For postal code fields, the default value is 3, representing the Icelandic postal code length. This option's primary use case is to increase the `minlength`, e.g. for US customers, the postal code `minlength` can be set to 5.
 * For cvv fields, the default value is 3. The `minlength` attribute only applies to integrations capturing a cvv without a number field.
 * @property {string} [prefill] A value to prefill the field with. For example, when creating an update card form, you can prefill the expiration date fields with the old expiration date data.
 * @property {boolean} [rejectUnsupportedCards=false] Deprecated since version 3.46.0, use `supportedCardBrands` instead. Only allow card types that your merchant account is able to process. Unsupported card types will invalidate the card form. e.g. if you only process Visa cards, a customer entering a American Express card would get an invalid card field. This can only be used for the `number` field.
 * @property {object} [supportedCardBrands] Override card brands that are supported by the card form. Pass `'card-brand-id': true` to override the default in the merchant configuration and enable a card brand. Pass `'card-brand-id': false` to disable a card brand. Unsupported card types will invalidate the card form. e.g. if you only process Visa cards, a customer entering an American Express card would get an invalid card field. This can only be used for the  `number` field. (Note: only allow card types that your merchant account is actually able to process.)
 *
 * Valid card brand ids are:
 * * visa
 * * mastercard
 * * american-express
 * * diners-club
 * * discover
 * * jcb
 * * union-pay
 * * maestro
 * * elo
 * * mir
 * * hiper
 * * hipercard
 */

/**
 * An object that has {@link module:braintree-web/hosted-fields~field field objects} for each field. Used in {@link module:braintree-web/hosted-fields~create create}.
 * @typedef {object} fieldOptions
 * @property {field} [number] A field for card number.
 * @property {field} [expirationDate] A field for expiration date in `MM/YYYY` or `MM/YY` format. This should not be used with the `expirationMonth` and `expirationYear` properties.
 * @property {field} [expirationMonth] A field for expiration month in `MM` format. This should be used with the `expirationYear` property.
 * @property {field} [expirationYear] A field for expiration year in `YYYY` or `YY` format. This should be used with the `expirationMonth` property.
 * @property {field} [cvv] A field for 3 or 4 digit card verification code (like CVV or CID). If you wish to create a CVV-only payment method nonce to verify a card already stored in your Vault, omit all other fields to only collect CVV.
 * @property {field} [postalCode] A field for postal or region code.
 */

/**
 * An object that represents CSS that will be applied in each hosted field. This object looks similar to CSS. Typically, these styles involve fonts (such as `font-family` or `color`).
 *
 * You may also pass the name of a class on your site that contains the styles you would like to apply. The style properties will be automatically pulled off the class and applied to the Hosted Fields inputs. Note: this is recomended for `input` elements only. If using a `select` for the expiration date, unexpected styling may occur.
 *
 * These are the CSS properties that Hosted Fields supports. Any other CSS should be specified on your page and outside of any Braintree configuration. Trying to set unsupported properties will fail and put a warning in the console.
 *
 * Supported CSS properties are:
 * `appearance`
 * `color`
 * `direction`
 * `font-family`
 * `font-size-adjust`
 * `font-size`
 * `font-stretch`
 * `font-style`
 * `font-variant-alternates`
 * `font-variant-caps`
 * `font-variant-east-asian`
 * `font-variant-ligatures`
 * `font-variant-numeric`
 * `font-variant`
 * `font-weight`
 * `font`
 * `letter-spacing`
 * `line-height`
 * `opacity`
 * `outline`
 * `margin`
 * `padding`
 * `text-shadow`
 * `transition`
 * `-moz-appearance`
 * `-moz-osx-font-smoothing`
 * `-moz-tap-highlight-color`
 * `-moz-transition`
 * `-webkit-appearance`
 * `-webkit-font-smoothing`
 * `-webkit-tap-highlight-color`
 * `-webkit-transition`
 * @typedef {object} styleOptions
 */

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {fieldOptions} options.fields A {@link module:braintree-web/hosted-fields~fieldOptions set of options for each field}.
 * @param {styleOptions} [options.styles] {@link module:braintree-web/hosted-fields~styleOptions Styles} applied to each field.
 * @param {callback} [callback] The second argument, `data`, is the {@link HostedFields} instance. If no callback is provided, `create` returns a promise that resolves with the {@link HostedFields} instance.
 * @returns {void}
 * @example
 * braintree.hostedFields.create({
 *   client: clientInstance,
 *   styles: {
 *     'input': {
 *       'font-size': '16pt',
 *       'color': '#3A3A3A'
 *     },
 *     '.number': {
 *       'font-family': 'monospace'
 *     },
 *     '.valid': {
 *       'color': 'green'
 *     }
 *   },
 *   fields: {
 *     number: {
 *       container: '#card-number'
 *     },
 *     cvv: {
 *       container: '#cvv',
 *       placeholder: '•••'
 *     },
 *     expirationDate: {
 *       container: '#expiration-date'
 *     }
 *   }
 * }, callback);
 * @example <caption>Applying styles with a class name</caption>
 * // in document head
 * <style>
 *   .braintree-input-class {
 *     color: black;
 *   }
 *   .braintree-valid-class {
 *     color: green;
 *   }
 *   .braintree-invalid-class {
 *     color: red;
 *   }
 * </style>
 * // in a script tag
 * braintree.hostedFields.create({
 *   client: clientInstance,
 *   styles: {
 *     'input': 'braintree-input-class',
 *     '.invalid': 'braintree-invalid-class',
 *     '.valid': {
 *       // you can also use the object syntax alongside
 *       // the class name syntax
 *       color: green;
 *     }
 *   },
 *   fields: {
 *     number: {
 *       container: '#card-number'
 *     },
 *     // etc...
 *   }
 * }, callback);
 * @example <caption>Right to Left Language Support</caption>
 * braintree.hostedFields.create({
 *   client: clientInstance,
 *   styles: {
 *     'input': {
 *       // other styles
 *       direction: 'rtl'
 *     },
 *   },
 *   fields: {
 *     number: {
 *       container: '#card-number',
 *       // Credit card formatting is not currently supported
 *       // with RTL languages, so we need to turn it off for the number input
 *       formatInput: false
 *     },
 *     cvv: {
 *       container: '#cvv',
 *       placeholder: '•••'
 *     },
 *     expirationDate: {
 *       container: '#expiration-date',
 *       type: 'month'
 *     }
 *   }
 * }, callback);
 * @example <caption>Setting up Hosted Fields to tokenize CVV only</caption>
 * braintree.hostedFields.create({
 *   client: clientInstance,
 *   fields: {
 *     // Only add the `cvv` option.
 *     cvv: {
 *       container: '#cvv',
 *       placeholder: '•••'
 *     }
 *   }
 * }, callback);
 * @example <caption>Creating an expiration date update form with prefilled data</caption>
 * var storedCreditCardInformation = {
 *   // get this info from your server
 *   // with a payment method lookup
 *   month: '09',
 *   year: '2017'
 * };
 *
 * braintree.hostedFields.create({
 *   client: clientInstance,
 *   fields: {
 *     expirationMonth: {
 *       container: '#expiration-month',
 *       prefill: storedCreditCardInformation.month
 *     },
 *     expirationYear: {
 *       container: '#expiration-year',
 *       prefill: storedCreditCardInformation.year
 *     }
 *   }
 * }, callback);
 * @example <caption>Validate the card form for supported card types</caption>
 * braintree.hostedFields.create({
 *   client: clientInstance,
 *   fields: {
 *     number: {
 *       container: '#card-number',
 *       supportedCardBrands: {
 *         visa: false, // prevents Visas from showing up as valid even when the Braintree control panel is configured to allow them
 *         'diners-club': true // allow Diners Club cards to be valid (processed as Discover cards on the Braintree backend)
 *       }
 *     },
 *     cvv: {
 *       container: '#cvv',
 *       placeholder: '•••'
 *     },
 *     expirationDate: {
 *       container: '#expiration-date',
 *       type: 'month'
 *     }
 *   },
 * }, callback);
 */
function create(options) {
  return basicComponentVerification.verify({
    name: 'Hosted Fields',
    authorization: options.authorization,
    client: options.client
  }).then(function () {
    var integration = new HostedFields(options);

    return new Promise(function (resolve, reject) {
      integration.on('ready', function () {
        resolve(integration);
      });
      integration.on('timeout', function () {
        reject(new BraintreeError(errors.HOSTED_FIELDS_TIMEOUT));
      });
    });
  });
}

module.exports = {
  /**
   * @static
   * @function supportsInputFormatting
   * @description Returns false if input formatting will be automatically disabled due to browser incompatibility. Otherwise, returns true. For a list of unsupported browsers, [go here](https://github.com/braintree/restricted-input/blob/master/README.md#browsers-where-formatting-is-turned-off-automatically).
   * @returns {Boolean} Returns false if input formatting will be automatically disabled due to browser incompatibility. Otherwise, returns true.
   * @example
   * <caption>Conditionally choosing split expiration date inputs if formatting is unavailable</caption>
   * var canFormat = braintree.hostedFields.supportsInputFormatting();
   * var fields = {
   *   number: {
   *     container: '#card-number'
   *   },
   *   cvv: {
   *     container: '#cvv'
   *   }
   * };
   *
   * if (canFormat) {
   *   fields.expirationDate = {
   *     selection: '#expiration-date'
   *   };
   *   functionToCreateAndInsertExpirationDateDivToForm();
   * } else {
   *   fields.expirationMonth = {
   *     selection: '#expiration-month'
   *   };
   *   fields.expirationYear = {
   *     selection: '#expiration-year'
   *   };
   *   functionToCreateAndInsertExpirationMonthAndYearDivsToForm();
   * }
   *
   * braintree.hostedFields.create({
   *   client: clientInstance,
   *   styles: {
   *     // Styles
   *   },
   *   fields: fields
   * }, callback);
   */
  supportsInputFormatting: supportsInputFormatting,
  create: wrapPromise(create),
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/promise":146,"./external/hosted-fields":96,"./shared/errors":101,"@braintree/wrap-promise":30,"restricted-input/supports-input-formatting":55}],99:[function(_dereq_,module,exports){
'use strict';

var isAndroid = _dereq_('@braintree/browser-detection/is-android');
var isChromeOS = _dereq_('@braintree/browser-detection/is-chrome-os');
var isIos = _dereq_('@braintree/browser-detection/is-ios');

function hasSoftwareKeyboard() {
  return isAndroid() || isChromeOS() || isIos();
}

module.exports = {
  isIE: _dereq_('@braintree/browser-detection/is-ie'),
  isEdge: _dereq_('@braintree/browser-detection/is-edge'),
  isIe9: _dereq_('@braintree/browser-detection/is-ie9'),
  isIe10: _dereq_('@braintree/browser-detection/is-ie10'),
  isAndroid: isAndroid,
  isChromeOS: isChromeOS,
  isFirefox: _dereq_('@braintree/browser-detection/is-firefox'),
  isIos: isIos,
  isIosWebview: _dereq_('@braintree/browser-detection/is-ios-webview'),
  hasSoftwareKeyboard: hasSoftwareKeyboard
};

},{"@braintree/browser-detection/is-android":3,"@braintree/browser-detection/is-chrome-os":4,"@braintree/browser-detection/is-edge":6,"@braintree/browser-detection/is-firefox":7,"@braintree/browser-detection/is-ie":8,"@braintree/browser-detection/is-ie10":9,"@braintree/browser-detection/is-ie9":11,"@braintree/browser-detection/is-ios":16,"@braintree/browser-detection/is-ios-webview":14}],100:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../../lib/enumerate');
var errors = _dereq_('./errors');
var VERSION = "3.63.0";

var constants = {
  VERSION: VERSION,
  maxExpirationYearAge: 19,
  externalEvents: {
    FOCUS: 'focus',
    BLUR: 'blur',
    EMPTY: 'empty',
    NOT_EMPTY: 'notEmpty',
    VALIDITY_CHANGE: 'validityChange',
    CARD_TYPE_CHANGE: 'cardTypeChange'
  },
  defaultMaxLengths: {
    number: 19,
    postalCode: 8,
    expirationDate: 7,
    expirationMonth: 2,
    expirationYear: 4,
    cvv: 3
  },
  externalClasses: {
    FOCUSED: 'braintree-hosted-fields-focused',
    INVALID: 'braintree-hosted-fields-invalid',
    VALID: 'braintree-hosted-fields-valid'
  },
  navigationDirections: {
    BACK: 'before',
    FORWARD: 'after'
  },
  defaultIFrameStyle: {
    border: 'none',
    width: '100%',
    height: '100%',
    'float': 'left'
  },
  tokenizationErrorCodes: {
    81724: errors.HOSTED_FIELDS_TOKENIZATION_FAIL_ON_DUPLICATE,
    // NEXT_MAJOR_VERSION this error triggers for both AVS and CVV errors
    // but the code name implies that it would only trigger for CVV verification
    // failures
    81736: errors.HOSTED_FIELDS_TOKENIZATION_CVV_VERIFICATION_FAILED
  },
  allowedStyles: [
    '-moz-appearance',
    '-moz-osx-font-smoothing',
    '-moz-tap-highlight-color',
    '-moz-transition',
    '-webkit-appearance',
    '-webkit-font-smoothing',
    '-webkit-tap-highlight-color',
    '-webkit-transition',
    'appearance',
    'color',
    'direction',
    'font',
    'font-family',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-variant',
    'font-variant-alternates',
    'font-variant-caps',
    'font-variant-east-asian',
    'font-variant-ligatures',
    'font-variant-numeric',
    'font-weight',
    'letter-spacing',
    'line-height',
    'margin',
    'opacity',
    'outline',
    'padding',
    'text-shadow',
    'transition'
  ],
  allowedFields: {
    number: {
      name: 'credit-card-number',
      label: 'Credit Card Number'
    },
    cvv: {
      name: 'cvv',
      label: 'CVV'
    },
    expirationDate: {
      name: 'expiration',
      label: 'Expiration Date'
    },
    expirationMonth: {
      name: 'expiration-month',
      label: 'Expiration Month'
    },
    expirationYear: {
      name: 'expiration-year',
      label: 'Expiration Year'
    },
    postalCode: {
      name: 'postal-code',
      label: 'Postal Code'
    }
  },
  allowedAttributes: {
    'aria-invalid': 'boolean',
    'aria-required': 'boolean',
    disabled: 'boolean',
    placeholder: 'string'
  },
  autocompleteMappings: {
    'credit-card-number': 'cc-number',
    expiration: 'cc-exp',
    'expiration-month': 'cc-exp-month',
    'expiration-year': 'cc-exp-year',
    cvv: 'cc-csc',
    'postal-code': 'billing postal-code'
  }
};

constants.events = enumerate([
  'ADD_CLASS',
  'AUTOFILL_EXPIRATION_DATE',
  'BIN_AVAILABLE',
  'CARD_FORM_ENTRY_HAS_BEGUN',
  'CLEAR_FIELD',
  'CONFIGURATION',
  'FRAME_READY',
  'INPUT_EVENT',
  'READY_FOR_CLIENT',
  'REMOVE_ATTRIBUTE',
  'REMOVE_CLASS',
  'REMOVE_FOCUS_INTERCEPTS',
  'SET_ATTRIBUTE',
  'SET_MESSAGE',
  'SET_MONTH_OPTIONS',
  'TOKENIZATION_REQUEST',
  'TRIGGER_FOCUS_CHANGE',
  'TRIGGER_INPUT_FOCUS',
  'VALIDATE_STRICT'
], 'hosted-fields:');

module.exports = constants;

},{"../../lib/enumerate":125,"./errors":101}],101:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Hosted Fields - Creation Error Codes
 * @description Errors that occur when [creating the Hosted Fields component](/current/module-braintree-web_hosted-fields.html#.create).
 * @property {UNKNOWN} HOSTED_FIELDS_TIMEOUT Occurs when Hosted Fields does not finish setting up within 60 seconds.
 * @property {MERCHANT} HOSTED_FIELDS_INVALID_FIELD_KEY Occurs when Hosted Fields is instantated with an invalid Field option.
 * @property {MERCHANT} HOSTED_FIELDS_INVALID_FIELD_SELECTOR Occurs when Hosted Fields given a field selector that is not valid.
 * @property {MERCHANT} HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME Occurs when Hosted Fields given a field selector that already contains an iframe.
 * @property {MERCHANT} HOSTED_FIELDS_FIELD_PROPERTY_INVALID Occurs when a field configuration option is not valid.
 */

/**
 * @name BraintreeError.Hosted Fields - Field Manipulation Error Codes
 * @description Errors that occur when modifying fields through [`addClass`](/current/HostedFields.html#addClass), [`removeClass`](/current/HostedFields.html#removeClass), [`setAttribute`](/current/HostedFields.html#setAttribute), [`removeAttribute`](/current/HostedFields.html#removeAttribute), [`clear`](/current/HostedFields.html#clear), [`focus`](/current/HostedFields.html#focus), and [`setMonthOptions`](/current/HostedFields.html#setMonthOptions).
 * @property {MERCHANT} HOSTED_FIELDS_FIELD_INVALID Occurs when attempting to modify a field that is not a valid Hosted Fields option.
 * @property {MERCHANT} HOSTED_FIELDS_FIELD_NOT_PRESENT Occurs when attempting to modify a field that is not configured with Hosted Fields.
 * @property {MERCHANT} HOSTED_FIELDS_FIELD_PROPERTY_INVALID Occurs when a field configuration option is not valid.
 */

/**
 * @name BraintreeError.Hosted Fields - Set Attribtue Error Codes
 * @description Errors that occur when using the [`setAttribtue` method](/current/HostedFields.html#setAttribute)
 * @property {MERCHANT} HOSTED_FIELDS_ATTRIBUTE_NOT_SUPPORTED Occurs when trying to set an attribtue that is not supported to be set.
 * @property {MERCHANT} HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED Occurs when the type of value for an attribue is not allowed to be set.
 */

/**
 * @name BraintreeError.Hosted Fields - Tokenize Error Codes
 * @description Errors that occur when [tokenizing the card details with Hosted Fields](/current/HostedFields.html#tokenize).
 * @property {NETWORK} HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR Occurs when the Braintree gateway cannot be contacted.
 * @property {CUSTOMER} HOSTED_FIELDS_TOKENIZATION_FAIL_ON_DUPLICATE Occurs when attempting to vault a card, but the client token being used is configured to fail if the card already exists in the vault.
 * @property {CUSTOMER} HOSTED_FIELDS_TOKENIZATION_CVV_VERIFICATION_FAILED Occurs when cvv verification is turned on in the Braintree control panel.
 * @property {CUSTOMER} HOSTED_FIELDS_FAILED_TOKENIZATION Occurs when the credit card details were sent to Braintree, but failed to tokenize.
 * @property {CUSTOMER} HOSTED_FIELDS_FIELDS_EMPTY Occurs when all the Hosted Fields inputs are empty.
 * @property {CUSTOMER} HOSTED_FIELDS_FIELDS_INVALID Occurs when one ore more fields are invalid.
 */

var BraintreeError = _dereq_('../../lib/braintree-error');

module.exports = {
  HOSTED_FIELDS_TIMEOUT: {
    type: BraintreeError.types.UNKNOWN,
    code: 'HOSTED_FIELDS_TIMEOUT',
    message: 'Hosted Fields timed out when attempting to set up.'
  },
  HOSTED_FIELDS_INVALID_FIELD_KEY: {
    type: BraintreeError.types.MERCHANT,
    code: 'HOSTED_FIELDS_INVALID_FIELD_KEY'
  },
  HOSTED_FIELDS_INVALID_FIELD_SELECTOR: {
    type: BraintreeError.types.MERCHANT,
    code: 'HOSTED_FIELDS_INVALID_FIELD_SELECTOR',
    message: 'Selector does not reference a valid DOM node.'
  },
  HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME: {
    type: BraintreeError.types.MERCHANT,
    code: 'HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME',
    message: 'Element already contains a Braintree iframe.'
  },
  HOSTED_FIELDS_FIELD_INVALID: {
    type: BraintreeError.types.MERCHANT,
    code: 'HOSTED_FIELDS_FIELD_INVALID'
  },
  HOSTED_FIELDS_FIELD_NOT_PRESENT: {
    type: BraintreeError.types.MERCHANT,
    code: 'HOSTED_FIELDS_FIELD_NOT_PRESENT'
  },
  HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR: {
    type: BraintreeError.types.NETWORK,
    code: 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR',
    message: 'A tokenization network error occurred.'
  },
  HOSTED_FIELDS_TOKENIZATION_FAIL_ON_DUPLICATE: {
    type: BraintreeError.types.CUSTOMER,
    code: 'HOSTED_FIELDS_TOKENIZATION_FAIL_ON_DUPLICATE',
    message: 'This credit card already exists in the merchant\'s vault.'
  },
  HOSTED_FIELDS_TOKENIZATION_CVV_VERIFICATION_FAILED: {
    type: BraintreeError.types.CUSTOMER,
    code: 'HOSTED_FIELDS_TOKENIZATION_CVV_VERIFICATION_FAILED',
    message: 'CVV verification failed during tokenization.'
  },
  HOSTED_FIELDS_FAILED_TOKENIZATION: {
    type: BraintreeError.types.CUSTOMER,
    code: 'HOSTED_FIELDS_FAILED_TOKENIZATION',
    message: 'The supplied card data failed tokenization.'
  },
  HOSTED_FIELDS_FIELDS_EMPTY: {
    type: BraintreeError.types.CUSTOMER,
    code: 'HOSTED_FIELDS_FIELDS_EMPTY',
    message: 'All fields are empty. Cannot tokenize empty card fields.'
  },
  HOSTED_FIELDS_FIELDS_INVALID: {
    type: BraintreeError.types.CUSTOMER,
    code: 'HOSTED_FIELDS_FIELDS_INVALID',
    message: 'Some payment input fields are invalid. Cannot tokenize invalid card fields.'
  },
  HOSTED_FIELDS_ATTRIBUTE_NOT_SUPPORTED: {
    type: BraintreeError.types.MERCHANT,
    code: 'HOSTED_FIELDS_ATTRIBUTE_NOT_SUPPORTED'
  },
  HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED: {
    type: BraintreeError.types.MERCHANT,
    code: 'HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED'
  },
  HOSTED_FIELDS_FIELD_PROPERTY_INVALID: {
    type: BraintreeError.types.MERCHANT,
    code: 'HOSTED_FIELDS_FIELD_PROPERTY_INVALID'
  }
};

},{"../../lib/braintree-error":112}],102:[function(_dereq_,module,exports){
'use strict';

function findParentTags(element, tag) {
  var parent = element.parentNode;
  var parents = [];

  while (parent != null) {
    if (parent.tagName != null && parent.tagName.toLowerCase() === tag) {
      parents.push(parent);
    }

    parent = parent.parentNode;
  }

  return parents;
}

module.exports = findParentTags;

},{}],103:[function(_dereq_,module,exports){
'use strict';

var browserDetection = _dereq_('./browser-detection');
var classList = _dereq_('@braintree/class-list');
var constants = _dereq_('./constants');
var allowedFields = Object.keys(constants.allowedFields);
var directions = constants.navigationDirections;

var focusIntercept = {
  generate: function (type, direction, handler) {
    var input = document.createElement('input');
    var focusInterceptStyles = {
      border: 'none !important',
      display: 'block !important',
      height: '1px !important',
      left: '-1px !important',
      opacity: '0 !important',
      position: 'absolute !important',
      top: '-1px !important',
      width: '1px !important'
    };
    var shouldCreateFocusIntercept = browserDetection.hasSoftwareKeyboard() ||
      browserDetection.isFirefox() || browserDetection.isIE();

    if (!shouldCreateFocusIntercept) { return document.createDocumentFragment(); }

    input.setAttribute('aria-hidden', 'true');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('data-braintree-direction', direction);
    input.setAttribute('data-braintree-type', type);
    input.setAttribute('id', 'bt-' + type + '-' + direction);
    input.setAttribute('style',
      JSON.stringify(focusInterceptStyles)
        .replace(/[{}"]/g, '')
        .replace(/,/g, ';'));

    classList.add(input, 'focus-intercept');

    input.addEventListener('focus', function (event) {
      handler(event);

      /*
        Certain browsers without software keyboards (Firefox, Internet
        Explorer) need the focus intercept inputs that get inserted
        around the actual input to blur themselves, otherwise the
        browser gets confused about what should have focus. Can't
        apply this to browsers with software keyboards however,
        because it blurs everything, and focus on the actual input is
        also lost.
      */
      if (!browserDetection.hasSoftwareKeyboard()) {
        input.blur();
      }
    });

    return input;
  },
  destroy: function (idString) {
    var focusInputs;

    if (!idString) {
      focusInputs = document.querySelectorAll('[data-braintree-direction]');
      focusInputs = [].slice.call(focusInputs);
    } else {
      focusInputs = [document.getElementById(idString)];
    }

    focusInputs.forEach(function (node) {
      if (node && node.nodeType === 1 && focusIntercept.matchFocusElement(node.getAttribute('id'))) {
        node.parentNode.removeChild(node);
      }
    });
  },
  matchFocusElement: function (idString) {
    var idComponents, hasBTPrefix, isAllowedType, isValidDirection;

    if (!idString) { return false; }

    idComponents = idString.split('-');

    if (idComponents.length !== 3) { return false; }

    hasBTPrefix = idComponents[0] === 'bt';
    isAllowedType = allowedFields.indexOf(idComponents[1]) > -1;
    isValidDirection = idComponents[2] === directions.BACK || idComponents[2] === directions.FORWARD;

    return Boolean(
      hasBTPrefix &&
      isAllowedType &&
      isValidDirection
    );
  }
};

module.exports = focusIntercept;

},{"./browser-detection":99,"./constants":100,"@braintree/class-list":20}],104:[function(_dereq_,module,exports){
'use strict';

var creditCardType = _dereq_('credit-card-type');

module.exports = function (number) {
  var results = creditCardType(number);

  results.forEach(function (card) {
    // NEXT_MAJOR_VERSION credit-card-type fixed the mastercard enum
    // but we still pass master-card in the braintree API
    // in a major version bump, we can remove this and
    // this will be mastercard instead of master-card
    if (card.type === 'mastercard') {
      card.type = 'master-card';
    }
  });

  return results;
};

},{"credit-card-type":31}],105:[function(_dereq_,module,exports){
'use strict';
/**
 * @module braintree-web
 * @description This is the top-level module exported by the Braintree JavaScript SDK. In a browser environment, this will be the global <code>braintree</code> object. In a CommonJS environment (like Browserify or Webpack), it will be the default export of the <code>braintree-web</code> package. In AMD environments (like RequireJS), it can be `require`d like other modules.
 * @example
 * <caption>CommonJS</caption>
 * var braintree = require('braintree-web');
 *
 * braintree.client.create(...);
 * @example
 * <caption>In the browser</caption>
 * <script src="https://js.braintreegateway.com/web/{@pkg version}/js/client.min.js"></script>
 * <script>
 *   window.braintree.client.create(...);
 * </script>
 * @example
 * <caption>AMD</caption>
 * // main.js
 * require.config({
 *   paths: {
 *     braintreeClient: 'https://js.braintreegateway.com/web/{@pkg version}/js/client.min'
 *   }
 * });
 *
 * require(['braintreeClient'], function (braintreeClient) {
 *   braintreeClient.create(...);
 * });
 */

/**
 * @global
 * @callback callback
 * @param {?BraintreeError} [err] `null` or `undefined` if there was no error.
 * @param {?any} [data] The successful result of the asynchronous function call (if data exists).
 * @description The Node.js-style callback pattern used throughout the SDK.
 * @returns {void}
 */

var americanExpress = _dereq_('./american-express');
var applePay = _dereq_('./apple-pay');
var client = _dereq_('./client');
var dataCollector = _dereq_('./data-collector');
var hostedFields = _dereq_('./hosted-fields');
var localPayment = _dereq_('./local-payment');
var masterpass = _dereq_('./masterpass');
var paymentRequest = _dereq_('./payment-request');
var paypal = _dereq_('./paypal');
var paypalCheckout = _dereq_('./paypal-checkout');
var googlePayment = _dereq_('./google-payment');
var threeDSecure = _dereq_('./three-d-secure');
var unionpay = _dereq_('./unionpay');
var usBankAccount = _dereq_('./us-bank-account');
var vaultManager = _dereq_('./vault-manager');
var venmo = _dereq_('./venmo');
var visaCheckout = _dereq_('./visa-checkout');
var preferredPaymentMethods = _dereq_('./preferred-payment-methods');
var VERSION = "3.63.0";

module.exports = {
  /** @type {module:braintree-web/american-express} */
  americanExpress: americanExpress,
  /** @type {module:braintree-web/apple-pay} */
  applePay: applePay,
  /** @type {module:braintree-web/client} */
  client: client,
  /** @type {module:braintree-web/data-collector} */
  dataCollector: dataCollector,
  /** @type {module:braintree-web/hosted-fields} */
  hostedFields: hostedFields,
  /** @type {module:braintree-web/local-payment} */
  localPayment: localPayment,
  /** @type {module:braintree-web/masterpass} */
  masterpass: masterpass,
  /** @type {module:braintree-web/google-payment} */
  googlePayment: googlePayment,
  /** @type {module:braintree-web/payment-request} */
  paymentRequest: paymentRequest,
  /** @type {module:braintree-web/paypal} */
  paypal: paypal,
  /** @type {module:braintree-web/paypal-checkout} */
  paypalCheckout: paypalCheckout,
  /** @type {module:braintree-web/three-d-secure} */
  threeDSecure: threeDSecure,
  /** @type {module:braintree-web/unionpay} */
  unionpay: unionpay,
  /** @type {module:braintree-web/us-bank-account} */
  usBankAccount: usBankAccount,
  /** @type {module:braintree-web/vault-manager} */
  vaultManager: vaultManager,
  /** @type {module:braintree-web/venmo} */
  venmo: venmo,
  /** @type {module:braintree-web/visa-checkout} */
  visaCheckout: visaCheckout,
  /** @type {module:braintree-web/preferred-payment-methods} */
  preferredPaymentMethods: preferredPaymentMethods,
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"./american-express":58,"./apple-pay":61,"./client":67,"./data-collector":86,"./google-payment":91,"./hosted-fields":98,"./local-payment":153,"./masterpass":156,"./payment-request":161,"./paypal":168,"./paypal-checkout":165,"./preferred-payment-methods":171,"./three-d-secure":181,"./unionpay":185,"./us-bank-account":191,"./vault-manager":194,"./venmo":196,"./visa-checkout":203}],106:[function(_dereq_,module,exports){
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

},{"./constants":117,"./create-authorization-data":121,"./json-clone":143}],107:[function(_dereq_,module,exports){
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

},{"./add-metadata":106,"./constants":117,"./promise":146}],108:[function(_dereq_,module,exports){
'use strict';

var loadScript = _dereq_('@braintree/asset-loader/load-script');

module.exports = {
  loadScript: loadScript
};

},{"@braintree/asset-loader/load-script":2}],109:[function(_dereq_,module,exports){
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

},{}],110:[function(_dereq_,module,exports){
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

},{"./braintree-error":112,"./errors":126,"./promise":146}],111:[function(_dereq_,module,exports){
'use strict';

var once = _dereq_('./once');

function call(fn, callback) {
  var isSync = fn.length === 0;

  if (isSync) {
    fn();
    callback(null);
  } else {
    fn(callback);
  }
}

module.exports = function (functions, cb) {
  var i;
  var length = functions.length;
  var remaining = length;
  var callback = once(cb);

  if (length === 0) {
    callback(null);

    return;
  }

  function finish(err) {
    if (err) {
      callback(err);

      return;
    }

    remaining -= 1;
    if (remaining === 0) {
      callback(null);
    }
  }

  for (i = 0; i < length; i++) {
    call(functions[i], finish);
  }
};

},{"./once":145}],112:[function(_dereq_,module,exports){
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

},{"./enumerate":125}],113:[function(_dereq_,module,exports){
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

},{"../is-verified-domain":142}],114:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../enumerate');

module.exports = enumerate([
  'CONFIGURATION_REQUEST'
], 'bus:');

},{"../enumerate":125}],115:[function(_dereq_,module,exports){
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

},{"../braintree-error":112,"./check-origin":113,"./events":114,"framebus":39}],116:[function(_dereq_,module,exports){
'use strict';

// Taken from https://github.com/sindresorhus/decamelize/blob/95980ab6fb44c40eaca7792bdf93aff7c210c805/index.js
function transformKey(key) {
  return key.replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1_$2')
    .toLowerCase();
}

module.exports = function (obj) {
  return Object.keys(obj).reduce(function (newObj, key) {
    var transformedKey = transformKey(key);

    newObj[transformedKey] = obj[key];

    return newObj;
  }, {});
};

},{}],117:[function(_dereq_,module,exports){
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

},{}],118:[function(_dereq_,module,exports){
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

},{"./braintree-error":112,"./errors":126}],119:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('./braintree-error');

function convertToBraintreeError(originalErr, btErrorObject) {
  if (originalErr instanceof BraintreeError) {
    return originalErr;
  }

  return new BraintreeError({
    type: btErrorObject.type,
    code: btErrorObject.code,
    message: btErrorObject.message,
    details: {
      originalError: originalErr
    }
  });
}

module.exports = convertToBraintreeError;

},{"./braintree-error":112}],120:[function(_dereq_,module,exports){
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

},{"./constants":117}],121:[function(_dereq_,module,exports){
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

},{"../lib/constants":117,"../lib/vendor/polyfill":149}],122:[function(_dereq_,module,exports){
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

},{"./assets":108,"./braintree-error":112,"./errors":126,"./promise":146}],123:[function(_dereq_,module,exports){
'use strict';

module.exports = function (fn) {
  return function () {
    // IE9 doesn't support passing arguments to setTimeout so we have to emulate it.
    var args = arguments;

    setTimeout(function () {
      fn.apply(null, args);
    }, 1);
  };
};

},{}],124:[function(_dereq_,module,exports){
'use strict';

var batchExecuteFunctions = _dereq_('./batch-execute-functions');

function Destructor() {
  this._teardownRegistry = [];

  this._isTearingDown = false;
}

Destructor.prototype.registerFunctionForTeardown = function (fn) {
  if (typeof fn === 'function') {
    this._teardownRegistry.push(fn);
  }
};

Destructor.prototype.teardown = function (callback) {
  if (this._isTearingDown) {
    callback(new Error('Destructor is already tearing down'));

    return;
  }

  this._isTearingDown = true;

  batchExecuteFunctions(this._teardownRegistry, function (err) {
    this._teardownRegistry = [];
    this._isTearingDown = false;

    if (typeof callback === 'function') {
      callback(err);
    }
  }.bind(this));
};

module.exports = Destructor;

},{"./batch-execute-functions":111}],125:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;

    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],126:[function(_dereq_,module,exports){
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

},{"./braintree-error":112}],127:[function(_dereq_,module,exports){
'use strict';

module.exports = function (array, key, value) {
  var i;

  for (i = 0; i < array.length; i++) {
    if (array[i].hasOwnProperty(key) && array[i][key] === value) {
      return array[i];
    }
  }

  return null;
};

},{}],128:[function(_dereq_,module,exports){
'use strict';

var Popup = _dereq_('./strategies/popup');
var PopupBridge = _dereq_('./strategies/popup-bridge');
var Modal = _dereq_('./strategies/modal');
var Bus = _dereq_('../../bus');
var events = _dereq_('../shared/events');
var errors = _dereq_('../shared/errors');
var constants = _dereq_('../shared/constants');
var uuid = _dereq_('../../vendor/uuid');
var iFramer = _dereq_('@braintree/iframer');
var BraintreeError = _dereq_('../../braintree-error');
var browserDetection = _dereq_('../shared/browser-detection');
var isHTTPS = _dereq_('../../is-https');
var assign = _dereq_('./../../assign').assign;

var REQUIRED_CONFIG_KEYS = [
  'name',
  'dispatchFrameUrl',
  'openFrameUrl'
];

function noop() {}

function _validateFrameConfiguration(options) {
  if (!options) {
    throw new Error('Valid configuration is required');
  }

  REQUIRED_CONFIG_KEYS.forEach(function (key) {
    if (!options.hasOwnProperty(key)) {
      throw new Error('A valid frame ' + key + ' must be provided');
    }
  });

  if (!/^[\w_]+$/.test(options.name)) {
    throw new Error('A valid frame name must be provided');
  }
}

function FrameService(options) {
  _validateFrameConfiguration(options);

  this._serviceId = uuid().replace(/-/g, '');

  this._options = {
    name: options.name + '_' + this._serviceId,
    dispatchFrameUrl: options.dispatchFrameUrl,
    openFrameUrl: options.openFrameUrl,
    height: options.height,
    width: options.width,
    top: options.top,
    left: options.left
  };
  this.state = options.state || {};

  this._bus = new Bus({channel: this._serviceId});
  this._setBusEvents();
}

FrameService.prototype.initialize = function (callback) {
  var dispatchFrameReadyHandler = function () {
    callback();
    this._bus.off(events.DISPATCH_FRAME_READY, dispatchFrameReadyHandler);
  }.bind(this);

  this._bus.on(events.DISPATCH_FRAME_READY, dispatchFrameReadyHandler);
  this._writeDispatchFrame();
};

FrameService.prototype._writeDispatchFrame = function () {
  var frameName = constants.DISPATCH_FRAME_NAME + '_' + this._serviceId;
  var frameSrc = this._options.dispatchFrameUrl;

  this._dispatchFrame = iFramer({
    'aria-hidden': true,
    name: frameName,
    title: frameName,
    src: frameSrc,
    'class': constants.DISPATCH_FRAME_CLASS,
    height: 0,
    width: 0,
    style: {
      position: 'absolute',
      left: '-9999px'
    }
  });

  document.body.appendChild(this._dispatchFrame);
};

FrameService.prototype._setBusEvents = function () {
  this._bus.on(events.DISPATCH_FRAME_REPORT, function (res, reply) {
    if (this._onCompleteCallback) {
      this._onCompleteCallback.call(null, res.err, res.payload);
    }
    this._frame.close();

    this._onCompleteCallback = null;

    if (reply) {
      reply();
    }
  }.bind(this));

  this._bus.on(Bus.events.CONFIGURATION_REQUEST, function (reply) {
    reply(this.state);
  }.bind(this));
};

FrameService.prototype.open = function (options, callback) {
  var error;

  options = options || {};
  this._frame = this._getFrameForEnvironment(options);

  this._frame.initialize(callback);

  if (this._frame instanceof PopupBridge) {
    return;
  }

  assign(this.state, options.state);

  this._onCompleteCallback = callback;
  this._frame.open();

  if (this.isFrameClosed()) {
    this._cleanupFrame();
    if (callback) {
      if (browserDetection.isIE() && !isHTTPS.isHTTPS()) {
        error = new BraintreeError(errors.FRAME_SERVICE_FRAME_OPEN_FAILED_IE_BUG);
      } else {
        error = new BraintreeError(errors.FRAME_SERVICE_FRAME_OPEN_FAILED);
      }
      callback(error);
    }

    return;
  }
  this._pollForPopupClose();
};

FrameService.prototype.redirect = function (url) {
  if (this._frame && !this.isFrameClosed()) {
    this._frame.redirect(url);
  }
};

FrameService.prototype.close = function () {
  if (!this.isFrameClosed()) {
    this._frame.close();
  }
};

FrameService.prototype.focus = function () {
  if (!this.isFrameClosed()) {
    this._frame.focus();
  }
};

FrameService.prototype.createHandler = function (options) {
  options = options || {};

  return {
    close: function () {
      if (options.beforeClose) {
        options.beforeClose();
      }

      this.close();
    }.bind(this),
    focus: function () {
      if (options.beforeFocus) {
        options.beforeFocus();
      }

      this.focus();
    }.bind(this)
  };
};

FrameService.prototype.createNoopHandler = function () {
  return {
    close: noop,
    focus: noop
  };
};

FrameService.prototype.teardown = function () {
  this.close();
  this._dispatchFrame.parentNode.removeChild(this._dispatchFrame);
  this._dispatchFrame = null;
  this._cleanupFrame();
};

FrameService.prototype.isFrameClosed = function () {
  return this._frame == null || this._frame.isClosed();
};

FrameService.prototype._cleanupFrame = function () {
  this._frame = null;
  clearInterval(this._popupInterval);
  this._popupInterval = null;
};

FrameService.prototype._pollForPopupClose = function () {
  this._popupInterval = setInterval(function () {
    if (this.isFrameClosed()) {
      this._cleanupFrame();
      if (this._onCompleteCallback) {
        this._onCompleteCallback(new BraintreeError(errors.FRAME_SERVICE_FRAME_CLOSED));
      }
    }
  }.bind(this), constants.POPUP_POLL_INTERVAL);

  return this._popupInterval;
};

FrameService.prototype._getFrameForEnvironment = function (options) {
  var usePopup = browserDetection.supportsPopups();
  var popupBridgeExists = Boolean(window.popupBridge);

  var initOptions = assign({}, this._options, options);

  if (popupBridgeExists) {
    return new PopupBridge(initOptions);
  } else if (usePopup) {
    return new Popup(initOptions);
  }

  return new Modal(initOptions);
};

module.exports = FrameService;

},{"../../braintree-error":112,"../../bus":115,"../../is-https":141,"../../vendor/uuid":150,"../shared/browser-detection":135,"../shared/constants":136,"../shared/errors":137,"../shared/events":138,"./../../assign":109,"./strategies/modal":130,"./strategies/popup":133,"./strategies/popup-bridge":131,"@braintree/iframer":23}],129:[function(_dereq_,module,exports){
'use strict';

var FrameService = _dereq_('./frame-service');

module.exports = {
  create: function createFrameService(options, callback) {
    var frameService = new FrameService(options);

    frameService.initialize(function () {
      callback(frameService);
    });
  }
};

},{"./frame-service":128}],130:[function(_dereq_,module,exports){
'use strict';

var iFramer = _dereq_('@braintree/iframer');
var assign = _dereq_('../../../assign').assign;
var browserDetection = _dereq_('../../shared/browser-detection');

var ELEMENT_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  padding: 0,
  margin: 0,
  border: 0,
  outline: 'none',
  zIndex: 20001,
  background: '#FFFFFF'
};

function noop() {}

function Modal(options) {
  this._closed = null;
  this._frame = null;
  this._options = options || {};
  this._container = this._options.container || document.body;
}

Modal.prototype.initialize = noop;

Modal.prototype.open = function () {
  var iframerConfig = {
    src: this._options.openFrameUrl,
    name: this._options.name,
    scrolling: 'yes',
    height: '100%',
    width: '100%',
    style: assign({}, ELEMENT_STYLES),
    title: 'Lightbox Frame'
  };

  if (browserDetection.isIos()) {
    // WKWebView has buggy behavior when scrolling a fixed position modal. The workaround is to lock scrolling in
    // the background. When modal is closed, we restore scrolling and return to the previous scroll position.
    if (browserDetection.isIosWKWebview()) {
      this._lockScrolling();
      // Allows WKWebView to scroll all the way down to bottom
      iframerConfig.style = {};
    }

    this._el = document.createElement('div');

    assign(this._el.style, ELEMENT_STYLES, {
      height: '100%',
      width: '100%',
      overflow: 'auto',
      '-webkit-overflow-scrolling': 'touch'
    });

    this._frame = iFramer(iframerConfig);
    this._el.appendChild(this._frame);
  } else {
    this._el = this._frame = iFramer(iframerConfig);
  }
  this._closed = false;

  this._container.appendChild(this._el);
};

Modal.prototype.focus = noop;

Modal.prototype.close = function () {
  this._container.removeChild(this._el);
  this._frame = null;
  this._closed = true;
  if (browserDetection.isIosWKWebview()) {
    this._unlockScrolling();
  }
};

Modal.prototype.isClosed = function () {
  return Boolean(this._closed);
};

Modal.prototype.redirect = function (redirectUrl) {
  this._frame.src = redirectUrl;
};

Modal.prototype._unlockScrolling = function () {
  document.body.style.overflow = this._savedBodyProperties.overflowStyle;
  document.body.style.position = this._savedBodyProperties.positionStyle;
  window.scrollTo(this._savedBodyProperties.left, this._savedBodyProperties.top);
  delete this._savedBodyProperties;
};

Modal.prototype._lockScrolling = function () {
  var doc = document.documentElement;

  // From https://stackoverflow.com/questions/9538868/prevent-body-from-scrolling-when-a-modal-is-opened#comment65626743_24727206
  this._savedBodyProperties = {
    left: (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
    top: (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
    overflowStyle: document.body.style.overflow,
    positionStyle: document.body.style.position
  };
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  window.scrollTo(0, 0);
};

module.exports = Modal;

},{"../../../assign":109,"../../shared/browser-detection":135,"@braintree/iframer":23}],131:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('../../../braintree-error');
var errors = _dereq_('../../shared/errors');

function noop() {}

function PopupBridge(options) {
  this._closed = null;
  this._options = options;
}

PopupBridge.prototype.initialize = function (callback) {
  var self = this;

  window.popupBridge.onComplete = function (err, payload) {
    var popupDismissed = !payload && !err;

    self._closed = true;

    if (err || popupDismissed) {
      // User clicked "Done" button of browser view
      callback(new BraintreeError(errors.FRAME_SERVICE_FRAME_CLOSED));

      return;
    }
    // User completed popup flow (includes success and cancel cases)
    callback(null, payload);
  };
};

PopupBridge.prototype.open = function (options) {
  var url;

  options = options || {};
  url = options.openFrameUrl || this._options.openFrameUrl;

  this._closed = false;
  window.popupBridge.open(url);
};

PopupBridge.prototype.focus = noop;

PopupBridge.prototype.close = noop;

PopupBridge.prototype.isClosed = function () {
  return Boolean(this._closed);
};

PopupBridge.prototype.redirect = function (redirectUrl) {
  this.open({openFrameUrl: redirectUrl});
};

module.exports = PopupBridge;

},{"../../../braintree-error":112,"../../shared/errors":137}],132:[function(_dereq_,module,exports){
'use strict';

var constants = _dereq_('../../../shared/constants');
var position = _dereq_('./position');

function calculatePosition(type, userDefinedPosition, size) {
  if (typeof userDefinedPosition !== 'undefined') {
    return userDefinedPosition;
  }

  return position[type](size);
}

module.exports = function composePopupOptions(options) {
  var height = options.height || constants.DEFAULT_POPUP_HEIGHT;
  var width = options.width || constants.DEFAULT_POPUP_WIDTH;
  var top = calculatePosition('top', options.top, height);
  var left = calculatePosition('left', options.left, width);

  return [
    constants.POPUP_BASE_OPTIONS,
    'height=' + height,
    'width=' + width,
    'top=' + top,
    'left=' + left
  ].join(',');
};

},{"../../../shared/constants":136,"./position":134}],133:[function(_dereq_,module,exports){
'use strict';

var composeOptions = _dereq_('./compose-options');

function noop() {}

function Popup(options) {
  this._frame = null;
  this._options = options || {};

  this.open();
}

Popup.prototype.initialize = noop;

Popup.prototype.open = function () {
  this._frame = window.open(
    this._options.openFrameUrl,
    this._options.name,
    composeOptions(this._options)
  );
};

Popup.prototype.focus = function () {
  this._frame.focus();
};

Popup.prototype.close = function () {
  if (this._frame.closed) {
    return;
  }
  this._frame.close();
};

Popup.prototype.isClosed = function () {
  return !this._frame || Boolean(this._frame.closed);
};

Popup.prototype.redirect = function (redirectUrl) {
  this._frame.location.href = redirectUrl;
};

module.exports = Popup;

},{"./compose-options":132}],134:[function(_dereq_,module,exports){
'use strict';

function top(height) {
  var windowHeight = window.outerHeight || document.documentElement.clientHeight;
  var windowTop = window.screenY == null ? window.screenTop : window.screenY;

  return center(windowHeight, height, windowTop);
}

function left(width) {
  var windowWidth = window.outerWidth || document.documentElement.clientWidth;
  var windowLeft = window.screenX == null ? window.screenLeft : window.screenX;

  return center(windowWidth, width, windowLeft);
}

function center(windowMetric, popupMetric, offset) {
  return ((windowMetric - popupMetric) / 2) + offset;
}

module.exports = {
  top: top,
  left: left,
  center: center
};

},{}],135:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  isIos: _dereq_('@braintree/browser-detection/is-ios'),
  isIosWKWebview: _dereq_('@braintree/browser-detection/is-ios-wkwebview'),
  isIE: _dereq_('@braintree/browser-detection/is-ie'),
  supportsPopups: _dereq_('@braintree/browser-detection/supports-popups')
};


},{"@braintree/browser-detection/is-ie":8,"@braintree/browser-detection/is-ios":16,"@braintree/browser-detection/is-ios-wkwebview":15,"@braintree/browser-detection/supports-popups":19}],136:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  DISPATCH_FRAME_NAME: 'dispatch',
  DISPATCH_FRAME_CLASS: 'braintree-dispatch-frame',
  POPUP_BASE_OPTIONS: 'resizable,scrollbars',
  DEFAULT_POPUP_WIDTH: 450,
  DEFAULT_POPUP_HEIGHT: 535,
  POPUP_POLL_INTERVAL: 100,
  POPUP_CLOSE_TIMEOUT: 100
};

},{}],137:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Popup Related Error Codes
 * @ignore
 * @description Errors that occur when using a component that opens a popup window.
 * @property {INTERNAL} FRAME_SERVICE_FRAME_CLOSED - Occurs when the frame is closed before tokenization can occur.
 * @property {INTERNAL} FRAME_SERVICE_FRAME_OPEN_FAILED - Occurs when the popup could not be opened.
 * @property {INTERNAL} FRAME_SERVICE_FRAME_OPEN_FAILED_IE_BUG - Occurs when the frame could not be opened because of a specific bug in Internet Explorer - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11324352/.
 */

var BraintreeError = _dereq_('../../braintree-error');

module.exports = {
  FRAME_SERVICE_FRAME_CLOSED: {
    type: BraintreeError.types.INTERNAL,
    code: 'FRAME_SERVICE_FRAME_CLOSED',
    message: 'Frame closed before tokenization could occur.'
  },
  FRAME_SERVICE_FRAME_OPEN_FAILED: {
    type: BraintreeError.types.INTERNAL,
    code: 'FRAME_SERVICE_FRAME_OPEN_FAILED',
    message: 'Frame failed to open.'
  },
  FRAME_SERVICE_FRAME_OPEN_FAILED_IE_BUG: {
    type: BraintreeError.types.INTERNAL,
    code: 'FRAME_SERVICE_FRAME_OPEN_FAILED_IE_BUG',
    message: 'Could not open frame. This may be due to a bug in IE browsers when attempting to open an HTTPS page from a HTTP page. https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11324352/'
  }
};

},{"../../braintree-error":112}],138:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../../enumerate');

module.exports = enumerate([
  'DISPATCH_FRAME_READY',
  'DISPATCH_FRAME_REPORT'
], 'frameService:');

},{"../../enumerate":125}],139:[function(_dereq_,module,exports){
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

},{"./assign":109}],140:[function(_dereq_,module,exports){
'use strict';

function convertDateStringToDate(dateString) {
  var splitDate = dateString.split('-');

  return new Date(splitDate[0], splitDate[1], splitDate[2]);
}

function isDateStringBeforeOrOn(firstDate, secondDate) {
  return convertDateStringToDate(firstDate) <= convertDateStringToDate(secondDate);
}

module.exports = isDateStringBeforeOrOn;

},{}],141:[function(_dereq_,module,exports){
'use strict';

function isHTTPS(protocol) {
  protocol = protocol || window.location.protocol;

  return protocol === 'https:';
}

module.exports = {
  isHTTPS: isHTTPS
};

},{}],142:[function(_dereq_,module,exports){
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

},{}],143:[function(_dereq_,module,exports){
'use strict';

module.exports = function (value) {
  return JSON.parse(JSON.stringify(value));
};

},{}],144:[function(_dereq_,module,exports){
'use strict';

module.exports = function (obj) {
  return Object.keys(obj).filter(function (key) {
    return typeof obj[key] === 'function';
  });
};

},{}],145:[function(_dereq_,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],146:[function(_dereq_,module,exports){
'use strict';

var PromisePolyfill = _dereq_('promise-polyfill');
var ExtendedPromise = _dereq_('@braintree/extended-promise');

// eslint-disable-next-line no-undef
var PromiseGlobal = typeof Promise !== 'undefined' ? Promise : PromisePolyfill;

ExtendedPromise.suppressUnhandledPromiseMessage = true;
ExtendedPromise.setPromise(PromiseGlobal);

module.exports = PromiseGlobal;

},{"@braintree/extended-promise":22,"promise-polyfill":53}],147:[function(_dereq_,module,exports){
'use strict';

function _notEmpty(obj) {
  var key;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) { return true; }
  }

  return false;
}

/* eslint-disable no-mixed-operators */
function _isArray(value) {
  return value && typeof value === 'object' && typeof value.length === 'number' &&
    Object.prototype.toString.call(value) === '[object Array]' || false;
}
/* eslint-enable no-mixed-operators */

function parse(url) {
  var query, params;

  url = url || window.location.href;

  if (!/\?/.test(url)) {
    return {};
  }

  query = url.replace(/#.*$/, '').replace(/^.*\?/, '').split('&');

  params = query.reduce(function (toReturn, keyValue) {
    var parts = keyValue.split('=');
    var key = decodeURIComponent(parts[0]);
    var value = decodeURIComponent(parts[1]);

    toReturn[key] = value;

    return toReturn;
  }, {});

  return params;
}

function stringify(params, namespace) {
  var k, v, p;
  var query = [];

  for (p in params) {
    if (!params.hasOwnProperty(p)) {
      continue;
    }

    v = params[p];

    if (namespace) {
      if (_isArray(params)) {
        k = namespace + '[]';
      } else {
        k = namespace + '[' + p + ']';
      }
    } else {
      k = p;
    }
    if (typeof v === 'object') {
      query.push(stringify(v, k));
    } else {
      query.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }

  return query.join('&');
}

function queryify(url, params) {
  url = url || '';

  if (params != null && typeof params === 'object' && _notEmpty(params)) {
    url += url.indexOf('?') === -1 ? '?' : '';
    url += url.indexOf('=') !== -1 ? '&' : '';
    url += stringify(params);
  }

  return url;
}

module.exports = {
  parse: parse,
  stringify: stringify,
  queryify: queryify
};

},{}],148:[function(_dereq_,module,exports){
'use strict';

function useMin(isDebug) {
  return isDebug ? '' : '.min';
}

module.exports = useMin;

},{}],149:[function(_dereq_,module,exports){
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

},{}],150:[function(_dereq_,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}],151:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  REQUIRED_OPTIONS_FOR_START_PAYMENT: ['onPaymentStart', 'paymentType', 'amount', 'fallback']
};

},{}],152:[function(_dereq_,module,exports){
'use strict';

var frameService = _dereq_('../../lib/frame-service/external');
var BraintreeError = _dereq_('../../lib/braintree-error');
var useMin = _dereq_('../../lib/use-min');
var VERSION = "3.63.0";
var INTEGRATION_TIMEOUT_MS = _dereq_('../../lib/constants').INTEGRATION_TIMEOUT_MS;
var analytics = _dereq_('../../lib/analytics');
var methods = _dereq_('../../lib/methods');
var convertMethodsToError = _dereq_('../../lib/convert-methods-to-error');
var convertToBraintreeError = _dereq_('../../lib/convert-to-braintree-error');
var Promise = _dereq_('../../lib/promise');
var querystring = _dereq_('../../lib/querystring');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var constants = _dereq_('./constants');
var errors = _dereq_('../shared/errors');

/**
 * @class
 * @param {object} options see {@link module:braintree-web/local-payment.create|local-payment.create}
 * @classdesc This class represents a LocalPayment component. Instances of this class can open a LocalPayment window for paying with alternate payments local to a specific country. Any additional UI, such as disabling the page while authentication is taking place, is up to the developer.
 *
 * @description <strong>Do not use this constructor directly. Use {@link module:braintree-web/local-payment.create|braintree-web.local-payment.create} instead.</strong>
 */
function LocalPayment(options) {
  this._client = options.client;
  this._assetsUrl = options.client.getConfiguration().gatewayConfiguration.assetsUrl + '/web/' + VERSION;
  this._isDebug = options.client.getConfiguration().isDebug;
  this._loadingFrameUrl = this._assetsUrl + '/html/local-payment-landing-frame' + useMin(this._isDebug) + '.html';
  this._authorizationInProgress = false;
  this._paymentType = 'unknown';
  this._merchantAccountId = options.merchantAccountId;
}

LocalPayment.prototype._initialize = function () {
  var self = this;
  var client = this._client;
  var failureTimeout = setTimeout(function () {
    analytics.sendEvent(client, 'local-payment.load.timed-out');
  }, INTEGRATION_TIMEOUT_MS);

  return new Promise(function (resolve) {
    frameService.create({
      name: 'localpaymentlandingpage',
      dispatchFrameUrl: self._assetsUrl + '/html/dispatch-frame' + useMin(self._isDebug) + '.html',
      openFrameUrl: self._loadingFrameUrl
    }, function (service) {
      self._frameService = service;
      clearTimeout(failureTimeout);
      analytics.sendEvent(client, 'local-payment.load.succeeded');
      resolve(self);
    });
  });
};

/**
 * Launches the local payment flow and returns a nonce payload. Only one local payment flow should be active at a time. One way to achieve this is to disable your local payment button while the flow is open.
 * @public
 * @function
 * @param {object} options All options for initiating the local payment payment flow.
 * @param {object} options.fallback Configuration for what to do when app switching back from a Bank app on a mobile device.
 * @param {string} options.fallback.buttonText The text to insert into a button to redirect back to the merchant page.
 * @param {string} options.fallback.url The url to redirect to when the redirect button is activated. Query params will be added to the url to process the data returned from the bank.
 * @param {string} options.amount The amount to authorize for the transaction.
 * @param {string} options.currencyCode The currency to process the payment.
 * @param {string} options.paymentType The type of local payment.
 * @param {string} options.email Payer email of the customer.
 * @param {string} options.givenName First name of the customer.
 * @param {string} options.surname Last name of the customer.
 * @param {string} options.phone Phone number of the customer.
 * @param {boolean} options.shippingAddressRequired Indicates whether or not the payment needs to be shipped. For digital goods, this should be false. Defaults to false.
 * @param {string} options.address.streetAddress Line 1 of the Address (eg. number, street, etc). An error will occur if this address is not valid.
 * @param {string} options.address.extendedAddress Line 2 of the Address (eg. suite, apt #, etc.). An error will occur if this address is not valid.
 * @param {string} options.address.locality Customer's city.
 * @param {string} options.address.region Customer's region or state.
 * @param {string} options.address.postalCode Customer's postal code.
 * @param {string} options.address.countryCode Customer's country code.
 * @param {function} options.onPaymentStart A function that will be called with two parameters: an object containing the  `paymentId` and a `continueCallback` that must be called to launch the flow. You can use method to do any preprocessing on your server before the flow begins..
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link LocalPayment~startPaymentPayload|startPaymentPayload}. If no callback is provided, the method will return a Promise that resolves with a {@link LocalPayment~startPaymentPayload|startPaymentPayload}.
 * @example
 * button.addEventListener('click', function () {
 *   // Disable the button when local payment is in progress
 *   button.setAttribute('disabled', 'disabled');
 *
 *   // Because startPayment opens a new window, this must be called
 *   // as a result of a user action, such as a button click.
 *   localPaymentInstance.startPayment({
 *     paymentType: 'ideal',
 *     fallback: {
 *       buttonText: 'Return to Merchant',
 *       url: 'https://example.com/my-checkout-page'
 *     },
 *     amount: '10.00',
 *     currencyCode: 'EUR',
 *     onPaymentStart: function (data, continueCallback) {
 *       // Do any preprocessing before starting the flow
 *       // data.paymentId is the ID of the localPayment
 *       continueCallback();
 *     }
 *   }).then(function (payload) {
 *     button.removeAttribute('disabled');
 *     // Submit payload.nonce to your server
 *   }).catch(function (startPaymentError) {
 *     button.removeAttribute('disabled');
 *     // Handle flow errors or premature flow closure
 *     console.error('Error!', startPaymentError);
 *   });
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
LocalPayment.prototype.startPayment = function (options) {
  var address, params;
  var self = this; // eslint-disable-line no-invalid-this
  var serviceId = this._frameService._serviceId; // eslint-disable-line no-invalid-this

  if (hasMissingOption(options)) {
    return Promise.reject(new BraintreeError(errors.LOCAL_PAYMENT_START_PAYMENT_MISSING_REQUIRED_OPTION));
  }

  address = options.address || {};
  params = {
    intent: 'sale',
    returnUrl: querystring.queryify(self._assetsUrl + '/html/local-payment-redirect-frame' + useMin(self._isDebug) + '.html', {
      channel: serviceId,
      r: options.fallback.url,
      t: options.fallback.buttonText
    }),
    cancelUrl: querystring.queryify(self._assetsUrl + '/html/cancel-frame' + useMin(self._isDebug) + '.html', {
      channel: serviceId
    }),
    experienceProfile: {
      noShipping: !options.shippingAddressRequired
    },
    fundingSource: options.paymentType,
    amount: options.amount,
    currencyIsoCode: options.currencyCode,
    firstName: options.givenName,
    lastName: options.surname,
    payerEmail: options.email,
    phone: options.phone,
    line1: address.streetAddress,
    line2: address.extendedAddress,
    city: address.locality,
    state: address.region,
    postalCode: address.postalCode,
    countryCode: address.countryCode,
    merchantAccountId: self._merchantAccountId
  };

  self._paymentType = options.paymentType.toLowerCase();
  if (self._authorizationInProgress) {
    analytics.sendEvent(self._client, self._paymentType + '.local-payment.start-payment.error.already-opened');

    return Promise.reject(new BraintreeError(errors.LOCAL_PAYMENT_ALREADY_IN_PROGRESS));
  }

  self._authorizationInProgress = true;

  return new Promise(function (resolve, reject) {
    self._startPaymentCallback = self._createStartPaymentCallback(resolve, reject);

    self._frameService.open({}, self._startPaymentCallback);

    self._client.request({
      method: 'post',
      endpoint: 'local_payments/create',
      data: params
    }).then(function (response) {
      analytics.sendEvent(self._client, self._paymentType + '.local-payment.start-payment.opened');
      self._startPaymentOptions = options;
      options.onPaymentStart({paymentId: response.paymentResource.paymentToken}, function () {
        self._frameService.redirect(response.paymentResource.redirectUrl);
      });
    }).catch(function (err) {
      var status = err.details && err.details.httpStatus;

      self._frameService.close();
      self._authorizationInProgress = false;

      if (status === 422) {
        reject(new BraintreeError({
          type: errors.LOCAL_PAYMENT_INVALID_PAYMENT_OPTION.type,
          code: errors.LOCAL_PAYMENT_INVALID_PAYMENT_OPTION.code,
          message: errors.LOCAL_PAYMENT_INVALID_PAYMENT_OPTION.message,
          details: {
            originalError: err
          }
        }));

        return;
      }

      reject(convertToBraintreeError(err, {
        type: errors.LOCAL_PAYMENT_START_PAYMENT_FAILED.type,
        code: errors.LOCAL_PAYMENT_START_PAYMENT_FAILED.code,
        message: errors.LOCAL_PAYMENT_START_PAYMENT_FAILED.message
      }));
    });
  });
};

/**
 * Manually tokenizes params for a local payment received from PayPal.When app switching back from a mobile application (such as a bank application for an iDEAL payment), the window may lose context with the parent page. In that case, a fallback url is used, and this method can be used to finish the flow.
 * @public
 * @function
 * @param {object} [params] All options for tokenizing local payment parameters. If no params are passed in, the params will be pulled off of the query string of the page.
 * @param {string} params.btLpToken The token representing the local payment. Aliased to `token` if `btLpToken` is not present.
 * @param {string} params.btLpPaymentId The payment id for the local payment. Aliased to `paymentId` if `btLpPaymentId` is not present.
 * @param {string} params.btLpPayerId The payer id for the local payment. Aliased to `PayerID` if `btLpPayerId` is not present.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link LocalPayment~startPaymentPayload|startPaymentPayload}. If no callback is provided, the method will return a Promise that resolves with a {@link LocalPayment~startPaymentPayload|startPaymentPayload}.
 * @example
 * localPaymentInstance.tokenize().then(function (payload) {
 *   // send payload.nonce to your server
 * }).catch(function (err) {
 *   // handle tokenization error
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
LocalPayment.prototype.tokenize = function (params) {
  var self = this;
  var client = this._client;

  params = params || querystring.parse();

  return client.request({
    endpoint: 'payment_methods/paypal_accounts',
    method: 'post',
    data: this._formatTokenizeData(params)
  }).then(function (response) {
    var payload = self._formatTokenizePayload(response);

    if (window.popupBridge) {
      analytics.sendEvent(client, self._paymentType + '.local-payment.tokenization.success-popupbridge');
    } else {
      analytics.sendEvent(client, self._paymentType + '.local-payment.tokenization.success');
    }

    return payload;
  }).catch(function (err) {
    analytics.sendEvent(client, self._paymentType + '.local-payment.tokenization.failed');

    return Promise.reject(convertToBraintreeError(err, {
      type: errors.LOCAL_PAYMENT_TOKENIZATION_FAILED.type,
      code: errors.LOCAL_PAYMENT_TOKENIZATION_FAILED.code,
      message: errors.LOCAL_PAYMENT_TOKENIZATION_FAILED.message
    }));
  });
};

/**
 * Closes the LocalPayment window if it is open.
 * @public
 * @example
 * localPaymentInstance.closeWindow();
 * @returns {void}
 */
LocalPayment.prototype.closeWindow = function () {
  if (this._authoriztionInProgress) {
    analytics.sendEvent(this._client, this._paymentType + '.local-payment.start-payment.closed.by-merchant');
  }
  this._frameService.close();
};

/**
 * Focuses the LocalPayment window if it is open.
 * @public
 * @example
 * localPaymentInstance.focusWindow();
 * @returns {void}
 */
LocalPayment.prototype.focusWindow = function () {
  this._frameService.focus();
};

LocalPayment.prototype._createStartPaymentCallback = function (resolve, reject) {
  var self = this;
  var client = this._client;

  return function (err, params) {
    self._authorizationInProgress = false;
    if (err) {
      if (err.code === 'FRAME_SERVICE_FRAME_CLOSED') {
        analytics.sendEvent(client, self._paymentType + '.local-payment.tokenization.closed.by-user');
        reject(new BraintreeError(errors.LOCAL_PAYMENT_WINDOW_CLOSED));
      } else if (err.code && err.code.indexOf('FRAME_SERVICE_FRAME_OPEN_FAILED') > -1) {
        reject(new BraintreeError({
          code: errors.LOCAL_PAYMENT_WINDOW_OPEN_FAILED.code,
          type: errors.LOCAL_PAYMENT_WINDOW_OPEN_FAILED.type,
          message: errors.LOCAL_PAYMENT_WINDOW_OPEN_FAILED.message,
          details: {
            originalError: err
          }
        }));
      }
    } else if (params) {
      if (!window.popupBridge) {
        self._frameService.redirect(self._loadingFrameUrl);
      }

      self.tokenize(params).then(resolve).catch(reject).then(function () {
        self._frameService.close();
      });
    }
  };
};

LocalPayment.prototype._formatTokenizePayload = function (response) {
  var payload;
  var account = {};

  if (response.paypalAccounts) {
    account = response.paypalAccounts[0];
  }

  payload = {
    nonce: account.nonce,
    details: {},
    type: account.type
  };

  if (account.details) {
    if (account.details.payerInfo) {
      payload.details = account.details.payerInfo;
    }
    if (account.details.correlationId) {
      payload.correlationId = account.details.correlationId;
    }
  }

  return payload;
};

/**
 * Checks if required tokenizaiton parameters are available in querystring for manual toenization requests.
 * @public
 * @function
 * @example
 * // if query string contains
 * // ?btLpToken=token&btLpPaymentId=payment-id&btLpPayerId=payer-id
 * localPaymentInstance.hasTokenizationParams(); // true
 *
 * // if query string is missing required params
 * localPaymentInstance.hasTokenizationParams(); // false
 *
 * if (localPaymentInstance.hasTokenizationParams()) {
 *   localPaymentInstance.tokenize();
 * }
 * @returns {Boolean} Returns a Boolean value for the state of the query string.
 */
LocalPayment.prototype.hasTokenizationParams = function () {
  var params = querystring.parse();

  return Boolean(params.btLpToken && params.btLpPaymentId && params.btLpPayerId);
};

LocalPayment.prototype._formatTokenizeData = function (params) {
  var clientConfiguration = this._client.getConfiguration();
  var gatewayConfiguration = clientConfiguration.gatewayConfiguration;
  var data = {
    merchantAccountId: this._merchantAccountId,
    paypalAccount: {
      correlationId: params.btLpToken || params.token,
      paymentToken: params.btLpPaymentId || params.paymentId,
      payerId: params.btLpPayerId || params.PayerID,
      unilateral: gatewayConfiguration.paypal.unvettedMerchant,
      intent: 'sale'
    }
  };

  return data;
};

function hasMissingOption(options) {
  var i, option;

  if (!options) {
    return true;
  }

  for (i = 0; i < constants.REQUIRED_OPTIONS_FOR_START_PAYMENT.length; i++) {
    option = constants.REQUIRED_OPTIONS_FOR_START_PAYMENT[i];

    if (!options.hasOwnProperty(option)) {
      return true;
    }
  }

  if (!(options.fallback.url && options.fallback.buttonText)) {
    return true;
  }

  return false;
}

/**
 * Cleanly remove anything set up by {@link module:braintree-web/local-payment.create|create}.
 * @public
 * @param {callback} [callback] Called on completion.
 * @example
 * localPaymentInstance.teardown();
 * @example <caption>With callback</caption>
 * localPaymentInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
LocalPayment.prototype.teardown = function () {
  var self = this; // eslint-disable-line no-invalid-this

  self._frameService.teardown();

  convertMethodsToError(self, methods(LocalPayment.prototype));

  analytics.sendEvent(self._client, 'local-payment.teardown-completed');

  return Promise.resolve();
};

module.exports = wrapPromise.wrapPrototype(LocalPayment);

},{"../../lib/analytics":107,"../../lib/braintree-error":112,"../../lib/constants":117,"../../lib/convert-methods-to-error":118,"../../lib/convert-to-braintree-error":119,"../../lib/frame-service/external":129,"../../lib/methods":144,"../../lib/promise":146,"../../lib/querystring":147,"../../lib/use-min":148,"../shared/errors":154,"./constants":151,"@braintree/wrap-promise":30}],153:[function(_dereq_,module,exports){
'use strict';
/**
 * @module braintree-web/local-payment
 * @description A component to integrate with local payment methods. *This component is currently in beta and is subject to change.*
 */

var analytics = _dereq_('../lib/analytics');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var LocalPayment = _dereq_('./external/local-payment');
var VERSION = "3.63.0";
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var BraintreeError = _dereq_('../lib/braintree-error');
var errors = _dereq_('./shared/errors');

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {string} [options.merchantAccountId] A non-default merchant account ID to use for tokenization and creation of the authorizing transaction. Braintree strongly recommends specifying this parameter.
 * @param {callback} callback The second argument, `data`, is the {@link LocalPayment} instance.
 * @example <caption>Using the local payment component to set up an iDEAL button</caption>
 * var idealButton = document.querySelector('.ideal-button');
 *
 * braintree.client.create({
 *   authorization: CLIENT_AUTHORIZATION
 * }, function (clientErr, clientInstance) {
 *   if (clientErr) {
 *     console.error('Error creating client:', clientErr);
 *     return;
 *   }
 *
 *   braintree.localPayment.create({
 *     client: clientInstance,
 *     merchantAccountId: 'merchantAccountEUR',
 *   }, function (localPaymentErr, localPaymentInstance) {
 *     if (localPaymentErr) {
 *       console.error('Error creating local payment component:', localPaymentErr);
 *       return;
 *     }
 *
 *     idealButton.removeAttribute('disabled');
 *
 *     // When the button is clicked, attempt to start the payment flow.
 *     idealButton.addEventListener('click', function (event) {
 *       // Because this opens a popup, this has to be called as a result of
 *       // customer action, like clicking a button. You cannot call this at any time.
 *       localPaymentInstance.startPayment({
 *         paymentType: 'ideal',
 *         amount: '10.67',
 *         city: 'Den Haag',
 *         countryCode: 'NL',
 *         firstName: 'Test',
 *         lastName: 'McTester',
 *         line1: '123 of 456 Fake Lane',
 *         line2: 'Apartment 789',
 *         payerEmail: 'payer@example.com',
 *         phone: '123456789',
 *         postalCode: '1234 AA',
 *         currencyCode: 'EUR',
 *         onPaymentStart: function (data, continueCallback) {
 *           // Do any preprocessing to store the ID and setup webhook
 *           // Call start to initiate the popup
 *           continueCallback();
 *         }
 **       }, function (startPaymentErr, payload) {
 *         if (startPaymentErr) {
 *           if (startPaymentErr.type !== 'CUSTOMER') {
 *             console.error('Error starting payment:', startPaymentErr);
 *           }
 *           return;
 *         }
 *
 *         idealButton.setAttribute('disabled', true);
 *
 *         console.log(payload.paymentId);
 *       });
 *     }, false);
 *   });
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
function create(options) {
  var name = 'Local Payment';

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
    var localPaymentInstance;
    var config = client.getConfiguration();

    options.client = client;

    if (config.gatewayConfiguration.paypalEnabled !== true) {
      return Promise.reject(new BraintreeError(errors.LOCAL_PAYMENT_NOT_ENABLED));
    }

    analytics.sendEvent(client, 'local-payment.initialized');

    localPaymentInstance = new LocalPayment(options);

    return localPaymentInstance._initialize();
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

},{"../lib/analytics":107,"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/promise":146,"./external/local-payment":152,"./shared/errors":154,"@braintree/wrap-promise":30}],154:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.LocalPayment - Creation Error Codes
 * @description Errors that occur when [creating the Local Payment component](/current/module-braintree-web_local-payment.html#.create).
 * @property {MERCHANT} LOCAL_PAYMENT_NOT_ENABLED Occurs when Local Payment is not enabled on the Braintree control panel.
 */

/**
 * @name BraintreeError.LocalPayment - startPayment Error Codes
 * @description Errors that occur when using the [`startPayment` method](/current/LocalPayment.html#startPayment).
 * @property {MERCHANT} LOCAL_PAYMENT_START_PAYMENT_MISSING_REQUIRED_OPTION Occurs when a startPayment is missing a required option.
 * @property {MERCHANT} LOCAL_PAYMENT_ALREADY_IN_PROGRESS Occurs when a startPayment call is already in progress.
 * @property {MERCHANT} LOCAL_PAYMENT_INVALID_PAYMENT_OPTION Occurs when a startPayment call has an invalid option.
 * @property {NETWORK} LOCAL_PAYMENT_START_PAYMENT_FAILED Occurs when a startPayment call fails.
 * @property {NETWORK} LOCAL_PAYMENT_TOKENIZATION_FAILED Occurs when a startPayment call fails to tokenize the result from authorization.
 * @property {CUSTOMER} LOCAL_PAYMENT_WINDOW_CLOSED Occurs when the customer closes the Local Payment window.
 * @property {MERCHANT} LOCAL_PAYMENT_WINDOW_OPEN_FAILED Occurs when the Local Payment window fails to open. Usualy because `startPayment` was not called as a direct result of a user action.
 */

var BraintreeError = _dereq_('../../lib/braintree-error');

module.exports = {
  LOCAL_PAYMENT_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'LOCAL_PAYMENT_NOT_ENABLED',
    message: 'LocalPayment is not enabled for this merchant.'
  },
  LOCAL_PAYMENT_ALREADY_IN_PROGRESS: {
    type: BraintreeError.types.MERCHANT,
    code: 'LOCAL_PAYMENT_ALREADY_IN_PROGRESS',
    message: 'LocalPayment payment is already in progress.'
  },
  LOCAL_PAYMENT_WINDOW_CLOSED: {
    type: BraintreeError.types.CUSTOMER,
    code: 'LOCAL_PAYMENT_WINDOW_CLOSED',
    message: 'Customer closed LocalPayment window before authorizing.'
  },
  LOCAL_PAYMENT_WINDOW_OPEN_FAILED: {
    type: BraintreeError.types.MERCHANT,
    code: 'LOCAL_PAYMENT_WINDOW_OPEN_FAILED',
    message: 'LocalPayment window failed to open; make sure startPayment was called in response to a user action.'
  },
  LOCAL_PAYMENT_START_PAYMENT_FAILED: {
    type: BraintreeError.types.NETWORK,
    code: 'LOCAL_PAYMENT_START_PAYMENT_FAILED',
    message: 'LocalPayment startPayment failed.'
  },
  LOCAL_PAYMENT_START_PAYMENT_MISSING_REQUIRED_OPTION: {
    type: BraintreeError.types.MERCHANT,
    code: 'LOCAL_PAYMENT_START_PAYMENT_MISSING_REQUIRED_OPTION',
    message: 'Missing required option for startPayment.'
  },
  LOCAL_PAYMENT_TOKENIZATION_FAILED: {
    type: BraintreeError.types.NETWORK,
    code: 'LOCAL_PAYMENT_TOKENIZATION_FAILED',
    message: 'Could not tokenize user\'s local payment method.'
  },
  LOCAL_PAYMENT_INVALID_PAYMENT_OPTION: {
    type: BraintreeError.types.MERCHANT,
    code: 'LOCAL_PAYMENT_INVALID_PAYMENT_OPTION',
    message: 'Local payment options are invalid.'
  }
};

},{"../../lib/braintree-error":112}],155:[function(_dereq_,module,exports){
'use strict';

var Promise = _dereq_('../../lib/promise');
var frameService = _dereq_('../../lib/frame-service/external');
var BraintreeError = _dereq_('../../lib/braintree-error');
var errors = _dereq_('../shared/errors');
var VERSION = "3.63.0";
var methods = _dereq_('../../lib/methods');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var analytics = _dereq_('../../lib/analytics');
var convertMethodsToError = _dereq_('../../lib/convert-methods-to-error');
var convertToBraintreeError = _dereq_('../../lib/convert-to-braintree-error');
var constants = _dereq_('../shared/constants');

var INTEGRATION_TIMEOUT_MS = _dereq_('../../lib/constants').INTEGRATION_TIMEOUT_MS;

/**
 * Masterpass Address object.
 * @typedef {object} Masterpass~Address
 * @property {string} countryCodeAlpha2 The customer's country code.
 * @property {string} extendedAddress The customer's extended address.
 * @property {string} locality The customer's locality.
 * @property {string} postalCode The customer's postal code.
 * @property {string} region The customer's region.
 * @property {string} streetAddress The customer's street address.
 */

/**
 * @typedef {object} Masterpass~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {string} description The human readable description.
 * @property {string} type The payment method type, always `MasterpassCard`.
 * @property {object} details Additional account details.
 * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
 * @property {string} details.lastFour Last four digits of card number.
 * @property {string} details.lastTwo Last two digits of card number.
 * @property {object} contact The customer's contact information.
 * @property {string} contact.firstName The customer's first name.
 * @property {string} contact.lastName The customer's last name.
 * @property {string} contact.phoneNumber The customer's phone number.
 * @property {string} contact.emailAddress The customer's email address.
 * @property {Masterpass~Address} billingAddress The customer's billing address.
 * @property {Masterpass~Address} shippingAddress The customer's shipping address.
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
 * @class
 * @param {object} options see {@link module:braintree-web/masterpass.create|masterpass.create}
 * @description <strong>You cannot use this constructor directly. Use {@link module:braintree-web/masterpass.create|braintree.masterpass.create} instead.</strong>
 * @classdesc This class represents an Masterpass component. Instances of this class have methods for launching a new window to process a transaction with Masterpass.
 */
function Masterpass(options) {
  var configuration = options.client.getConfiguration();

  this._client = options.client;
  this._assetsUrl = configuration.gatewayConfiguration.assetsUrl + '/web/' + VERSION;
  this._isDebug = configuration.isDebug;
  this._authInProgress = false;
  if (window.popupBridge && typeof window.popupBridge.getReturnUrlPrefix === 'function') {
    this._callbackUrl = window.popupBridge.getReturnUrlPrefix() + 'return';
  } else {
    this._callbackUrl = this._assetsUrl + '/html/redirect-frame' + (this._isDebug ? '' : '.min') + '.html';
  }
}

Masterpass.prototype._initialize = function () {
  var self = this;

  return new Promise(function (resolve) {
    var failureTimeout = setTimeout(function () {
      analytics.sendEvent(self._client, 'masterpass.load.timed-out');
    }, INTEGRATION_TIMEOUT_MS);

    frameService.create({
      name: constants.LANDING_FRAME_NAME,
      height: constants.POPUP_HEIGHT,
      width: constants.POPUP_WIDTH,
      dispatchFrameUrl: self._assetsUrl + '/html/dispatch-frame' + (self._isDebug ? '' : '.min') + '.html',
      openFrameUrl: self._assetsUrl + '/html/masterpass-landing-frame' + (self._isDebug ? '' : '.min') + '.html'
    }, function (service) {
      self._frameService = service;
      clearTimeout(failureTimeout);
      analytics.sendEvent(self._client, 'masterpass.load.succeeded');
      resolve(self);
    });
  });
};

/**
 * Launches the Masterpass flow and returns a nonce payload. Only one Masterpass flow should be active at a time. One way to achieve this is to disable your Masterpass button while the flow is open.
 *
 * Braintree will apply these properties in `options.config`. Merchants should not override these values, except for advanced usage.
 *  - `environment`
 *  - `requestToken`
 *  - `callbackUrl`
 *  - `merchantCheckoutId`
 *  - `allowedCardTypes`
 *  - `version`
 *
 * @public
 * @param {object} options All options for initiating the Masterpass payment flow.
 * @param {string} options.currencyCode The currency code to process the payment.
 * @param {string} options.subtotal The amount to authorize for the transaction.
 * @param {object} [options.config] All configuration parameters accepted by Masterpass lightbox, except `function` data type. These options will override the values set by Braintree server. Please see {@link Masterpass Lightbox Parameters|https://developer.mastercard.com/page/masterpass-lightbox-parameters} for more information.
 * @param {object} [options.frameOptions] Used to configure the window that contains the Masterpass login.
 * @param {number} [options.frameOptions.width] Popup width to be used instead of default value (450px).
 * @param {number} [options.frameOptions.height] Popup height to be used instead of default value (660px).
 * @param {number} [options.frameOptions.top] The top position of the popup window to be used instead of default value, that is calculated based on provided height, and parent window size.
 * @param {number} [options.frameOptions.left] The left position to the popup window to be used instead of default value, that is calculated baed on provided width, and parent window size.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link Masterpass~tokenizePayload|tokenizePayload}. If no callback is provided, the method will return a Promise that resolves with a {@link Masterpass~tokenizePayload|tokenizePayload}.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * button.addEventListener('click', function () {
 *   // Disable the button so that we don't attempt to open multiple popups.
 *   button.setAttribute('disabled', 'disabled');
 *
 *   // Because tokenize opens a new window, this must be called
 *   // as a result of a user action, such as a button click.
 *   masterpassInstance.tokenize({
 *     currencyCode: 'USD',
 *     subtotal: '10.00'
 *   }).then(function (payload) {
 *     button.removeAttribute('disabled');
 *     // Submit payload.nonce to your server
 *   }).catch(function (tokenizeError) {
 *     button.removeAttribute('disabled');
 *     // Handle flow errors or premature flow closure
 *
 *     switch (tokenizeErr.code) {
 *       case 'MASTERPASS_POPUP_CLOSED':
 *         console.error('Customer closed Masterpass popup.');
 *         break;
 *       case 'MASTERPASS_ACCOUNT_TOKENIZATION_FAILED':
 *         console.error('Masterpass tokenization failed. See details:', tokenizeErr.details);
 *         break;
 *       case 'MASTERPASS_FLOW_FAILED':
 *         console.error('Unable to initialize Masterpass flow. Are your options correct?', tokenizeErr.details);
 *         break;
 *       default:
 *         console.error('Error!', tokenizeErr);
 *     }
 *   });
 * });
 */
Masterpass.prototype.tokenize = function (options) {
  var self = this;

  if (!options || hasMissingOption(options)) {
    return Promise.reject(new BraintreeError(errors.MASTERPASS_TOKENIZE_MISSING_REQUIRED_OPTION));
  }

  if (self._authInProgress) {
    return Promise.reject(new BraintreeError(errors.MASTERPASS_TOKENIZATION_ALREADY_IN_PROGRESS));
  }

  return new Promise(function (resolve, reject) {
    self._navigateFrameToLoadingPage(options).catch(reject);
    // This MUST happen after _navigateFrameToLoadingPage for Metro browsers to work.
    self._frameService.open(options.frameOptions, self._createFrameOpenHandler(resolve, reject));
  });
};

Masterpass.prototype._navigateFrameToLoadingPage = function (options) {
  var self = this;

  this._authInProgress = true;

  return this._client.request({
    method: 'post',
    endpoint: 'masterpass/request_token',
    data: {
      requestToken: {
        originUrl: window.location.protocol + '//' + window.location.hostname,
        subtotal: options.subtotal,
        currencyCode: options.currencyCode,
        callbackUrl: this._callbackUrl
      }
    }
  }).then(function (response) {
    var redirectUrl = self._assetsUrl + '/html/masterpass-loading-frame' + (self._isDebug ? '' : '.min') + '.html?';
    var gatewayConfiguration = self._client.getConfiguration().gatewayConfiguration;
    var config = options.config || {};
    var queryParams;

    queryParams = {
      environment: gatewayConfiguration.environment,
      requestToken: response.requestToken,
      callbackUrl: self._callbackUrl,
      merchantCheckoutId: gatewayConfiguration.masterpass.merchantCheckoutId,
      allowedCardTypes: gatewayConfiguration.masterpass.supportedNetworks,
      version: constants.MASTERPASS_VERSION
    };

    Object.keys(config).forEach(function (key) {
      if (typeof config[key] !== 'function') {
        queryParams[key] = config[key];
      }
    });

    redirectUrl += Object.keys(queryParams).map(function (key) {
      return key + '=' + queryParams[key];
    }).join('&');

    self._frameService.redirect(redirectUrl);
  }).catch(function (err) {
    var status = err.details && err.details.httpStatus;

    self._closeWindow();

    if (status === 422) {
      return Promise.reject(convertToBraintreeError(err, errors.MASTERPASS_INVALID_PAYMENT_OPTION));
    }

    return Promise.reject(convertToBraintreeError(err, errors.MASTERPASS_FLOW_FAILED));
  });
};

Masterpass.prototype._createFrameOpenHandler = function (resolve, reject) {
  var self = this;

  if (window.popupBridge) {
    return function (popupBridgeErr, payload) {
      self._authInProgress = false;

      if (popupBridgeErr) {
        analytics.sendEvent(self._client, 'masterpass.tokenization.closed-popupbridge.by-user');
        reject(convertToBraintreeError(popupBridgeErr, errors.MASTERPASS_POPUP_CLOSED));

        return;
      } else if (!payload.queryItems) {
        analytics.sendEvent(self._client, 'masterpass.tokenization.failed-popupbridge');
        reject(new BraintreeError(errors.MASTERPASS_FLOW_FAILED));

        return;
      }

      self._tokenizeMasterpass(payload.queryItems).then(resolve).catch(reject);
    };
  }

  return function (frameServiceErr, payload) {
    if (frameServiceErr) {
      self._authInProgress = false;

      if (frameServiceErr.code === 'FRAME_SERVICE_FRAME_CLOSED') {
        analytics.sendEvent(self._client, 'masterpass.tokenization.closed.by-user');
        reject(new BraintreeError(errors.MASTERPASS_POPUP_CLOSED));

        return;
      }

      if (frameServiceErr.code && frameServiceErr.code.indexOf('FRAME_SERVICE_FRAME_OPEN_FAILED') > -1) {
        analytics.sendEvent(self._client, 'masterpass.tokenization.failed.to-open');
        reject(new BraintreeError({
          code: errors.MASTERPASS_POPUP_OPEN_FAILED.code,
          type: errors.MASTERPASS_POPUP_OPEN_FAILED.type,
          message: errors.MASTERPASS_POPUP_OPEN_FAILED.message,
          details: {
            originalError: frameServiceErr
          }
        }));

        return;
      }

      analytics.sendEvent(self._client, 'masterpass.tokenization.failed');
      self._closeWindow();
      reject(convertToBraintreeError(frameServiceErr, errors.MASTERPASS_FLOW_FAILED));

      return;
    }

    self._tokenizeMasterpass(payload).then(resolve).catch(reject);
  };
};

Masterpass.prototype._tokenizeMasterpass = function (payload) {
  var self = this;

  if (payload.mpstatus !== 'success') {
    analytics.sendEvent(self._client, 'masterpass.tokenization.closed.by-user');
    self._closeWindow();

    return Promise.reject(new BraintreeError(errors.MASTERPASS_POPUP_CLOSED));
  }

  if (isMissingRequiredPayload(payload)) {
    analytics.sendEvent(self._client, 'masterpass.tokenization.closed.missing-payload');
    self._closeWindow();

    return Promise.reject(new BraintreeError(errors.MASTERPASS_POPUP_MISSING_REQUIRED_PARAMETERS));
  }

  return self._client.request({
    endpoint: 'payment_methods/masterpass_cards',
    method: 'post',
    data: {
      masterpassCard: {
        checkoutResourceUrl: payload.checkout_resource_url,
        requestToken: payload.oauth_token,
        verifierToken: payload.oauth_verifier
      }
    }
  }).then(function (response) {
    self._closeWindow();
    if (window.popupBridge) {
      analytics.sendEvent(self._client, 'masterpass.tokenization.success-popupbridge');
    } else {
      analytics.sendEvent(self._client, 'masterpass.tokenization.success');
    }

    return response.masterpassCards[0];
  }).catch(function (tokenizeErr) {
    self._closeWindow();
    if (window.popupBridge) {
      analytics.sendEvent(self._client, 'masterpass.tokenization.failed-popupbridge');
    } else {
      analytics.sendEvent(self._client, 'masterpass.tokenization.failed');
    }

    return Promise.reject(convertToBraintreeError(tokenizeErr, errors.MASTERPASS_ACCOUNT_TOKENIZATION_FAILED));
  });
};

function isMissingRequiredPayload(payload) {
  return [
    payload.oauth_verifier,
    payload.oauth_token,
    payload.checkout_resource_url
  ].some(function (element) {
    return element == null || element === 'null';
  });
}

Masterpass.prototype._closeWindow = function () {
  this._authInProgress = false;
  this._frameService.close();
};

/**
 * Cleanly tear down anything set up by {@link module:braintree-web/masterpass.create|create}.
 * @public
 * @param {callback} [callback] Called on completion. If no callback is provided, `teardown` returns a promise.
 * @example
 * masterpassInstance.teardown();
 * @example <caption>With callback</caption>
 * masterpassInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
Masterpass.prototype.teardown = function () {
  var self = this;

  return new Promise(function (resolve) {
    self._frameService.teardown();

    convertMethodsToError(self, methods(Masterpass.prototype));

    analytics.sendEvent(self._client, 'masterpass.teardown-completed');

    resolve();
  });
};

function hasMissingOption(options) {
  var i, option;

  for (i = 0; i < constants.REQUIRED_OPTIONS_FOR_TOKENIZE.length; i++) {
    option = constants.REQUIRED_OPTIONS_FOR_TOKENIZE[i];

    if (!options.hasOwnProperty(option)) {
      return true;
    }
  }

  return false;
}

module.exports = wrapPromise.wrapPrototype(Masterpass);

},{"../../lib/analytics":107,"../../lib/braintree-error":112,"../../lib/constants":117,"../../lib/convert-methods-to-error":118,"../../lib/convert-to-braintree-error":119,"../../lib/frame-service/external":129,"../../lib/methods":144,"../../lib/promise":146,"../shared/constants":158,"../shared/errors":159,"@braintree/wrap-promise":30}],156:[function(_dereq_,module,exports){
'use strict';
/** @module braintree-web/masterpass
 * @description Processes Masterpass. *This component is currently in beta and is subject to change.*
 */

var BraintreeError = _dereq_('../lib/braintree-error');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var browserDetection = _dereq_('./shared/browser-detection');
var Masterpass = _dereq_('./external/masterpass');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var VERSION = "3.63.0";
var errors = _dereq_('./shared/errors');
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {callback} [callback] The second argument, `data`, is the {@link Masterpass} instance. If no callback is passed in, the create function returns a promise that resolves the {@link Masterpass} instance.
 * @example
 * braintree.masterpass.create({
 *   client: clientInstance
 * }, function (createErr, masterpassInstance) {
 *   if (createErr) {
 *     if (createErr.code === 'MASTERPASS_BROWSER_NOT_SUPPORTED') {
 *       console.error('This browser is not supported.');
 *     } else {
 *       console.error('Error!', createErr);
 *     }
 *     return;
 *   }
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
function create(options) {
  var name = 'Masterpass';

  return basicComponentVerification.verify({
    name: name,
    client: options.client,
    authorization: options.authorization
  }).then(function () {
    if (!isSupported()) {
      return Promise.reject(new BraintreeError(errors.MASTERPASS_BROWSER_NOT_SUPPORTED));
    }

    return Promise.resolve();
  }).then(function () {
    return createDeferredClient.create({
      authorization: options.authorization,
      client: options.client,
      debug: options.debug,
      assetsUrl: createAssetsUrl.create(options.authorization),
      name: name
    });
  }).then(function (client) {
    var masterpassInstance, configuration;

    options.client = client;
    configuration = options.client.getConfiguration().gatewayConfiguration;

    if (!configuration.masterpass) {
      return Promise.reject(new BraintreeError(errors.MASTERPASS_NOT_ENABLED));
    }

    masterpassInstance = new Masterpass(options);

    return masterpassInstance._initialize();
  });
}

/**
 * @static
 * @function isSupported
 * @description Returns true if Masterpass supports this browser.
 * @example
 * if (braintree.masterpass.isSupported()) {
 *   // Add Masterpass button to the page
 * } else {
 *   // Hide Masterpass payment option
 * }
 * @returns {Boolean} Returns true if Masterpass supports this browser.
 */
function isSupported() {
  return Boolean(window.popupBridge || browserDetection.supportsPopups());
}

module.exports = {
  create: wrapPromise(create),
  isSupported: isSupported,
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/promise":146,"./external/masterpass":155,"./shared/browser-detection":157,"./shared/errors":159,"@braintree/wrap-promise":30}],157:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  supportsPopups: _dereq_('@braintree/browser-detection/supports-popups')
};


},{"@braintree/browser-detection/supports-popups":19}],158:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  LANDING_FRAME_NAME: 'braintreemasterpasslanding',
  POPUP_WIDTH: 450,
  POPUP_HEIGHT: 660,
  MASTERPASS_VERSION: 'v6',
  REQUIRED_OPTIONS_FOR_TOKENIZE: [
    'subtotal',
    'currencyCode'
  ]
};

},{}],159:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Masterpass - Creation Error Codes
 * @description Errors that occur when [creating the Masterpass component](/current/module-braintree-web_masterpass#.create).
 * @property {CUSTOMER} MASTERPASS_BROWSER_NOT_SUPPORTED Occurs when browser is not a supported browser for Masterpass.
 * @property {MERCHANT} MASTERPASS_NOT_ENABLED Occurs when Masterpass is not enabled in the Braintree contorl panel.
 */

/**
 * @name BraintreeError.Masterpass - Tokenize Error Codes
 * @description Errors that occur when [tokenizing](/current/Masterpass.html#tokenize).
 * @property {MERCHANT} MASTERPASS_TOKENIZE_MISSING_REQUIRED_OPTION Occurs when tokenize is called without a required option.
 * @property {MERCHANT} MASTERPASS_TOKENIZATION_ALREADY_IN_PROGRESS Occurs if tokenization flow is intialized while another flow is already in progress.
 * @property {NETWORK} MASTERPASS_ACCOUNT_TOKENIZATION_FAILED Occurs when tokenization of Masterpass details fails.
 * @property {MERCHANT} MASTERPASS_POPUP_OPEN_FAILED Occurs when the popup fails to open.
 * @property {MERCHANT} MASTERPASS_POPUP_MISSING_REQUIRED_PARAMETERS Occurs when Masterpass is missing required parameters for tokenization.
 * @property {CUSTOMER} MASTERPASS_POPUP_CLOSED Occurs when the popup is closed by the customer.
 * @property {MERCHANT} MASTERPASS_INVALID_PAYMENT_OPTION Occurs when an invalid payment option is used to tokenize Masterpass.
 * @property {NETWORK} MASTERPASS_FLOW_FAILED Occurs when an error is returned from request to tokenize.
 */

var BraintreeError = _dereq_('../../lib/braintree-error');

module.exports = {
  MASTERPASS_BROWSER_NOT_SUPPORTED: {
    type: BraintreeError.types.CUSTOMER,
    code: 'MASTERPASS_BROWSER_NOT_SUPPORTED',
    message: 'Browser is not supported.'
  },
  MASTERPASS_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'MASTERPASS_NOT_ENABLED',
    message: 'Masterpass is not enabled for this merchant.'
  },
  MASTERPASS_TOKENIZE_MISSING_REQUIRED_OPTION: {
    type: BraintreeError.types.MERCHANT,
    code: 'MASTERPASS_TOKENIZE_MISSING_REQUIRED_OPTION',
    message: 'Missing required option for tokenize.'
  },
  MASTERPASS_TOKENIZATION_ALREADY_IN_PROGRESS: {
    type: BraintreeError.types.MERCHANT,
    code: 'MASTERPASS_TOKENIZATION_ALREADY_IN_PROGRESS',
    message: 'Masterpass tokenization is already in progress.'
  },
  MASTERPASS_ACCOUNT_TOKENIZATION_FAILED: {
    type: BraintreeError.types.NETWORK,
    code: 'MASTERPASS_ACCOUNT_TOKENIZATION_FAILED',
    message: 'Could not tokenize user\'s Masterpass account.'
  },
  MASTERPASS_POPUP_OPEN_FAILED: {
    type: BraintreeError.types.MERCHANT,
    code: 'MASTERPASS_POPUP_OPEN_FAILED',
    message: 'Masterpass popup failed to open. Make sure to tokenize in response to a user action, such as a click.'
  },
  MASTERPASS_POPUP_MISSING_REQUIRED_PARAMETERS: {
    type: BraintreeError.types.MERCHANT,
    code: 'MASTERPASS_POPUP_MISSING_REQUIRED_PARAMETERS',
    message: 'Masterpass popup failed to return all required parameters needed to continue tokenization.'
  },
  MASTERPASS_POPUP_CLOSED: {
    type: BraintreeError.types.CUSTOMER,
    code: 'MASTERPASS_POPUP_CLOSED',
    message: 'Customer closed Masterpass popup before authorizing.'
  },
  MASTERPASS_INVALID_PAYMENT_OPTION: {
    type: BraintreeError.types.MERCHANT,
    code: 'MASTERPASS_INVALID_PAYMENT_OPTION',
    message: 'Masterpass payment options are invalid.'
  },
  MASTERPASS_FLOW_FAILED: {
    type: BraintreeError.types.NETWORK,
    code: 'MASTERPASS_FLOW_FAILED',
    message: 'Could not initialize Masterpass flow.'
  }
};


},{"../../lib/braintree-error":112}],160:[function(_dereq_,module,exports){
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

},{"../../lib/analytics":107,"../../lib/assign":109,"../../lib/braintree-error":112,"../../lib/bus":115,"../../lib/convert-methods-to-error":118,"../../lib/generate-google-pay-configuration":139,"../../lib/methods":144,"../../lib/promise":146,"../../lib/use-min":148,"../../lib/vendor/uuid":150,"../shared/constants":162,"@braintree/event-emitter":21,"@braintree/iframer":23,"@braintree/wrap-promise":30}],161:[function(_dereq_,module,exports){
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

},{"../lib/basic-component-verification":110,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"./external/payment-request":160,"@braintree/wrap-promise":30}],162:[function(_dereq_,module,exports){
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

},{"../../lib/enumerate":125,"./errors":163}],163:[function(_dereq_,module,exports){
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

},{"../../lib/braintree-error":112}],164:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.PayPal Checkout - Creation Error Codes
 * @description Errors that occur when [creating the PayPal Checkout component](/current/module-braintree-web_paypal-checkout.html#.create).
 * @property {MERCHANT} PAYPAL_NOT_ENABLED Occurs when PayPal is not enabled on the Braintree control panel.
 * @property {MERCHANT} PAYPAL_SANDBOX_ACCOUNT_NOT_LINKED Occurs only when testing in Sandbox, when a PayPal sandbox account is not linked to the merchant account in the Braintree control panel.
 */

/**
 * @name BraintreeError.PayPal Checkout - createPayment Error Codes
 * @description Errors that occur when using the [`createPayment` method](/current/PayPalCheckout.html#createPayment).
 * @property {MERCHANT} PAYPAL_FLOW_OPTION_REQUIRED Occurs when a required option is missing.
 * @property {MERCHANT} PAYPAL_INVALID_PAYMENT_OPTION Occurs when an option contains an invalid value.
 * @property {NETWORK} PAYPAL_FLOW_FAILED Occurs when something goes wrong when initializing the flow.
 */

/**
 * @name BraintreeError.PayPal Checkout - startVaultInitiatedCheckout Error Codes
 * @description Errors that occur when using the [`startVaultInitiatedCheckout` method](/current/PayPalCheckout.html#startVaultInitiatedCheckout).
 * @property {MERCHANT} PAYPAL_START_VAULT_INITIATED_CHECKOUT_PARAM_REQUIRED Occurs when a required param is missing when calling the method.
 * @property {MERCHANT} PAYPAL_START_VAULT_INITIATED_CHECKOUT_POPUP_OPEN_FAILED Occurs when PayPal window could not be opened. This often occurs because the call to start the vault initiated flow was not triggered from a click event.
 * @property {CUSTOMER} PAYPAL_START_VAULT_INITIATED_CHECKOUT_CANCELED Occurs when a customer closes the PayPal flow before completion.
 * @property {MERCHANT} PAYPAL_START_VAULT_INITIATED_CHECKOUT_IN_PROGRESS Occurs when the flow is initialized while an authorization is already in progress.
 * @property {NETWORK} PAYPAL_START_VAULT_INITIATED_CHECKOUT_SETUP_FAILED Occurs when something went wrong setting up the flow.
 */

/**
 * @name BraintreeError.PayPal Checkout - tokenizePayment Error Codes
 * @description Errors that occur when using the [`tokenizePayment` method](/current/PayPalCheckout.html#tokenizePayment).
 * @property {NETWORK} PAYPAL_ACCOUNT_TOKENIZATION_FAILED Occurs when PayPal account could not be tokenized.
 */

var BraintreeError = _dereq_('../lib/braintree-error');

module.exports = {
  PAYPAL_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_NOT_ENABLED',
    message: 'PayPal is not enabled for this merchant.'
  },
  PAYPAL_SANDBOX_ACCOUNT_NOT_LINKED: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_SANDBOX_ACCOUNT_NOT_LINKED',
    message: 'A linked PayPal Sandbox account is required to use PayPal Checkout in Sandbox. See https://developers.braintreepayments.com/guides/paypal/testing-go-live/#linked-paypal-testing for details on linking your PayPal sandbox with Braintree.'
  },
  PAYPAL_ACCOUNT_TOKENIZATION_FAILED: {
    type: BraintreeError.types.NETWORK,
    code: 'PAYPAL_ACCOUNT_TOKENIZATION_FAILED',
    message: 'Could not tokenize user\'s PayPal account.'
  },
  PAYPAL_FLOW_FAILED: {
    type: BraintreeError.types.NETWORK,
    code: 'PAYPAL_FLOW_FAILED',
    message: 'Could not initialize PayPal flow.'
  },
  PAYPAL_FLOW_OPTION_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_FLOW_OPTION_REQUIRED',
    message: 'PayPal flow property is invalid or missing.'
  },
  PAYPAL_START_VAULT_INITIATED_CHECKOUT_PARAM_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_START_VAULT_INITIATED_CHECKOUT_PARAM_REQUIRED'
  },
  PAYPAL_START_VAULT_INITIATED_CHECKOUT_SETUP_FAILED: {
    type: BraintreeError.types.NETWORK,
    code: 'PAYPAL_START_VAULT_INITIATED_CHECKOUT_SETUP_FAILED',
    message: 'Something went wrong when setting up the checkout workflow.'
  },
  PAYPAL_START_VAULT_INITIATED_CHECKOUT_POPUP_OPEN_FAILED: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_START_VAULT_INITIATED_CHECKOUT_POPUP_OPEN_FAILED',
    message: 'PayPal popup failed to open, make sure to initiate the vault checkout in response to a user action.'
  },
  PAYPAL_START_VAULT_INITIATED_CHECKOUT_CANCELED: {
    type: BraintreeError.types.CUSTOMER,
    code: 'PAYPAL_START_VAULT_INITIATED_CHECKOUT_CANCELED',
    message: 'Customer closed PayPal popup before authorizing.'
  },
  PAYPAL_START_VAULT_INITIATED_CHECKOUT_IN_PROGRESS: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_START_VAULT_INITIATED_CHECKOUT_IN_PROGRESS',
    message: 'Vault initiated checkout already in progress.'
  },
  PAYPAL_INVALID_PAYMENT_OPTION: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_INVALID_PAYMENT_OPTION',
    message: 'PayPal payment options are invalid.'
  }
};

},{"../lib/braintree-error":112}],165:[function(_dereq_,module,exports){
'use strict';
/**
 * @module braintree-web/paypal-checkout
 * @description A component to integrate with the [PayPal Checkout.js library](https://github.com/paypal/paypal-checkout).
 */

var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var PayPalCheckout = _dereq_('./paypal-checkout');
var VERSION = "3.63.0";

/**
 * @static
 * @function create
 * @description There are two ways to integrate the PayPal Checkout component. See the [PayPal Checkout constructor documentation](PayPalCheckout.html#PayPalCheckout) for more information and examples.
 *
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {string} [options.merchantAccountId] A non-default merchant account ID to use for tokenization.
 * @param {callback} [callback] The second argument, `data`, is the {@link PayPalCheckout} instance.
 * @example
 * braintree.client.create({
 *   authorization: 'authorization'
 * }).then(function (clientInstance) {
 *   return braintree.paypalCheckout.create({
 *     client: clientInstance
 *   });
 * }).then(function (paypalCheckoutInstance) {
 *   // set up checkout.js
 * }).catch(function (err) {
 *   console.error('Error!', err);
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
function create(options) {
  var name = 'PayPal Checkout';

  return basicComponentVerification.verify({
    name: name,
    client: options.client,
    authorization: options.authorization
  }).then(function () {
    var instance = new PayPalCheckout(options);

    return instance._initialize(options);
  });
}

/**
 * @static
 * @function isSupported
 * @description Returns true if PayPal Checkout [supports this browser](index.html#browser-support-webviews).
 * @deprecated Previously, this method checked for Popup support in the browser. Checkout.js now falls back to a modal if popups are not supported.
 * @returns {Boolean} Returns true if PayPal Checkout supports this browser.
 */
function isSupported() {
  return true;
}

module.exports = {
  create: wrapPromise(create),
  isSupported: isSupported,
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"../lib/basic-component-verification":110,"./paypal-checkout":166,"@braintree/wrap-promise":30}],166:[function(_dereq_,module,exports){
'use strict';

var analytics = _dereq_('../lib/analytics');
var assign = _dereq_('../lib/assign').assign;
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var Promise = _dereq_('../lib/promise');
var ExtendedPromise = _dereq_('@braintree/extended-promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var BraintreeError = _dereq_('../lib/braintree-error');
var convertToBraintreeError = _dereq_('../lib/convert-to-braintree-error');
var errors = _dereq_('./errors');
var constants = _dereq_('../paypal/shared/constants');
var frameService = _dereq_('../lib/frame-service/external');
var methods = _dereq_('../lib/methods');
var useMin = _dereq_('../lib/use-min');
var convertMethodsToError = _dereq_('../lib/convert-methods-to-error');
var querystring = _dereq_('../lib/querystring');
var VERSION = "3.63.0";
var INTEGRATION_TIMEOUT_MS = _dereq_('../lib/constants').INTEGRATION_TIMEOUT_MS;

var REQUIRED_PARAMS_FOR_START_VAULT_INITIATED_CHECKOUT = [
  'amount',
  'currency',
  'vaultInitiatedCheckoutPaymentMethodToken'
];

/**
 * PayPal Checkout tokenized payload. Returned in {@link PayPalCheckout#tokenizePayment}'s callback as the second argument, `data`.
 * @typedef {object} PayPalCheckout~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {string} type The payment method type, always `PayPalAccount`.
 * @property {object} details Additional PayPal account details.
 * @property {string} details.email User's email address.
 * @property {string} details.payerId User's payer ID, the unique identifier for each PayPal account.
 * @property {string} details.firstName User's given name.
 * @property {string} details.lastName User's surname.
 * @property {?string} details.countryCode User's 2 character country code.
 * @property {?string} details.phone User's phone number (e.g. 555-867-5309).
 * @property {?object} details.shippingAddress User's shipping address details, only available if shipping address is enabled.
 * @property {string} details.shippingAddress.recipientName Recipient of postage.
 * @property {string} details.shippingAddress.line1 Street number and name.
 * @property {string} details.shippingAddress.line2 Extended address.
 * @property {string} details.shippingAddress.city City or locality.
 * @property {string} details.shippingAddress.state State or region.
 * @property {string} details.shippingAddress.postalCode Postal code.
 * @property {string} details.shippingAddress.countryCode 2 character country code (e.g. US).
 * @property {?object} details.billingAddress User's billing address details.
 * Not available to all merchants; [contact PayPal](https://developers.braintreepayments.com/support/guides/paypal/setup-guide#contacting-paypal-support) for details on eligibility and enabling this feature.
 * Alternatively, see `shippingAddress` above as an available client option.
 * @property {string} details.billingAddress.line1 Street number and name.
 * @property {string} details.billingAddress.line2 Extended address.
 * @property {string} details.billingAddress.city City or locality.
 * @property {string} details.billingAddress.state State or region.
 * @property {string} details.billingAddress.postalCode Postal code.
 * @property {string} details.billingAddress.countryCode 2 character country code (e.g. US).
 * @property {?object} creditFinancingOffered This property will only be present when the customer pays with PayPal Credit.
 * @property {object} creditFinancingOffered.totalCost This is the estimated total payment amount including interest and fees the user will pay during the lifetime of the loan.
 * @property {string} creditFinancingOffered.totalCost.value An amount defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm) for the given currency.
 * @property {string} creditFinancingOffered.totalCost.currency 3 letter currency code as defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm).
 * @property {number} creditFinancingOffered.term Length of financing terms in months.
 * @property {object} creditFinancingOffered.monthlyPayment This is the estimated amount per month that the customer will need to pay including fees and interest.
 * @property {string} creditFinancingOffered.monthlyPayment.value An amount defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm) for the given currency.
 * @property {string} creditFinancingOffered.monthlyPayment.currency 3 letter currency code as defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm).
 * @property {object} creditFinancingOffered.totalInterest Estimated interest or fees amount the payer will have to pay during the lifetime of the loan.
 * @property {string} creditFinancingOffered.totalInterest.value An amount defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm) for the given currency.
 * @property {string} creditFinancingOffered.totalInterest.currency 3 letter currency code as defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm).
 * @property {boolean} creditFinancingOffered.payerAcceptance Status of whether the customer ultimately was approved for and chose to make the payment using the approved installment credit.
 * @property {boolean} creditFinancingOffered.cartAmountImmutable Indicates whether the cart amount is editable after payer's acceptance on PayPal side.
 */

/**
 * @class
 * @param {object} options see {@link module:braintree-web/paypal-checkout.create|paypal-checkout.create}
 * @classdesc This class represents a PayPal Checkout component that coordinates with the {@link https://developer.paypal.com/docs/checkout/integrate/#2-add-the-paypal-script-to-your-web-page|PayPal SDK}. Instances of this class can generate payment data and tokenize authorized payments.
 *
 * All UI (such as preventing actions on the parent page while authentication is in progress) is managed by the {@link https://developer.paypal.com/docs/checkout/integrate/#2-add-the-paypal-script-to-your-web-page|PayPal SDK}. You must provide your PayPal `client-id` as a query parameter. You can [retrieve this value from the PayPal Dashboard](https://developer.paypal.com/docs/checkout/integrate/#1-get-paypal-rest-api-credentials).
 * @description <strong>Do not use this constructor directly. Use {@link module:braintree-web/paypal-checkout.create|braintree-web.paypal-checkout.create} instead.</strong>
 *
 * #### Integrate Checkout Flow with PayPal SDK
 *
 * You must have [PayPal's script, configured with various query parameters](https://developer.paypal.com/docs/checkout/integrate/#2-add-the-paypal-script-to-your-web-page), loaded on your page:
 *
 * ```html
 * <script src="https://www.paypal.com/sdk/js?client-id=your-sandbox-or-prod-client-id"></script>
 * <div id="paypal-button"></div>
 * ```
 *
 * When passing values in the `createPayment` method, make sure they match the [corresponding parameters in the query parameters for the PayPal SDK script](https://developer.paypal.com/docs/checkout/reference/customize-sdk/).
 *
 * ```javascript
 * braintree.client.create({
 *   authorization: 'authorization'
 * }).then(function (clientInstance) {
 *   return braintree.paypalCheckout.create({
 *     client: clientInstance
 *   });
 * }).then(function (paypalCheckoutInstance) {
 *   return paypal.Buttons({
 *     createOrder: function () {
 *       return paypalCheckoutInstance.createPayment({
 *         flow: 'checkout',
 *         currency: 'USD',
 *         amount: '10.00',
 *         intent: 'capture' // this value must either be `capture` or match the intent passed into the PayPal SDK intent query parameter
 *         // your other createPayment options here
 *       });
 *     },
 *
 *     onApprove: function (data, actions) {
 *       // some logic here before tokenization happens below
 *       return paypalCheckoutInstance.tokenizePayment(data).then(function (payload) {
 *         // Submit payload.nonce to your server
 *       });
 *     },
 *
 *     onCancel: function () {
 *       // handle case where user cancels
 *     },
 *
 *     onError: function (err) {
 *       // handle case where error occurs
 *     }
 *   }).render('#paypal-button');
 * }).catch(function (err) {
 *  console.error('Error!', err);
 * });
 * ```
 *
 * #### Integrate Vault Flow with PayPal SDK
 *
 * You must have [PayPal's script, configured with various query parameters](https://developer.paypal.com/docs/checkout/integrate/#2-add-the-paypal-script-to-your-web-page), loaded on your page:
 *
 * ```html
 * <script src="https://www.paypal.com/sdk/js?client-id=your-sandbox-or-prod-client-id&vault=true"></script>
 * <div id="paypal-button"></div>
 * ```
 *
 * When passing values in the `createPayment` method, make sure they match the [corresponding parameters in the query parameters for the PayPal SDK script](https://developer.paypal.com/docs/checkout/reference/customize-sdk/).
 *
 * ```javascript
 * braintree.client.create({
 *   authorization: 'authorization'
 * }).then(function (clientInstance) {
 *   return braintree.paypalCheckout.create({
 *     client: clientInstance
 *   });
 * }).then(function (paypalCheckoutInstance) {
 *   return paypal.Buttons({
 *     createBillingAgreement: function () {
 *       return paypalCheckoutInstance.createPayment({
 *         flow: 'vault'
 *         // your other createPayment options here
 *       });
 *     },
 *
 *     onApprove: function (data, actions) {
 *       // some logic here before tokenization happens below
 *       return paypalCheckoutInstance.tokenizePayment(data).then(function (payload) {
 *         // Submit payload.nonce to your server
 *       });
 *     },
 *
 *     onCancel: function () {
 *       // handle case where user cancels
 *     },
 *
 *     onError: function (err) {
 *       // handle case where error occurs
 *     }
 *   }).render('#paypal-button');
 * }).catch(function (err) {
 *  console.error('Error!', err);
 * });
 * ```
 *
 * #### Integrate with Checkout.js (deprecated PayPal SDK)
 *
 * You must have PayPal's checkout.js script loaded on your page. You can either use the [paypal-checkout package on npm](https://www.npmjs.com/package/paypal-checkout) with a build tool or use a script hosted by PayPal:
 *
 * ```html
 * <script src="https://www.paypalobjects.com/api/checkout.js" data-version-4 log-level="warn"></script>
 * ```
 *
 * ```javascript
 * braintree.client.create({
 *   authorization: 'authorization'
 * }).then(function (clientInstance) {
 *   return braintree.paypalCheckout.create({
 *     client: clientInstance
 *   });
 * }).then(function (paypalCheckoutInstance) {
 *   return paypal.Button.render({
 *     env: 'production', // or 'sandbox'
 *
 *     payment: function () {
 *       return paypalCheckoutInstance.createPayment({
 *         // your createPayment options here
 *       });
 *     },
 *
 *     onAuthorize: function (data, actions) {
 *       // some logic here before tokenization happens below
 *       return paypalCheckoutInstance.tokenizePayment(data).then(function (payload) {
 *         // Submit payload.nonce to your server
 *       });
 *     }
 *   }, '#paypal-button');
 * }).catch(function (err) {
 *  console.error('Error!', err);
 * });
 * ```
 */
function PayPalCheckout(options) {
  this._merchantAccountId = options.merchantAccountId;
}

PayPalCheckout.prototype._initialize = function (options) {
  this._clientPromise = createDeferredClient.create({
    authorization: options.authorization,
    client: options.client,
    debug: options.debug,
    assetsUrl: createAssetsUrl.create(options.authorization),
    name: 'PayPal Checkout'
  }).then(function (client) {
    this._configuration = client.getConfiguration();

    // we skip these checks if a merchant account id is
    // passed in, because the default merchant account
    // may not have paypal enabled
    if (!this._merchantAccountId) {
      if (!this._configuration.gatewayConfiguration.paypalEnabled) {
        this._setupError = new BraintreeError(errors.PAYPAL_NOT_ENABLED);
      } else if (this._configuration.gatewayConfiguration.paypal.environmentNoNetwork === true) {
        this._setupError = new BraintreeError(errors.PAYPAL_SANDBOX_ACCOUNT_NOT_LINKED);
      }
    }

    if (this._setupError) {
      return Promise.reject(this._setupError);
    }

    analytics.sendEvent(client, 'paypal-checkout.initialized');
    this._frameServicePromise = this._setupFrameService(client);

    return client;
  }.bind(this));

  // if client was passed in, let config checks happen before
  // resolving the instance. Otherwise, just resolve the instance
  if (options.client) {
    return this._clientPromise.then(function () {
      return this;
    }.bind(this));
  }

  return Promise.resolve(this);
};

PayPalCheckout.prototype._setupFrameService = function (client) {
  var frameServicePromise = new ExtendedPromise();
  var config = client.getConfiguration();
  var timeoutRef = setTimeout(function () {
    analytics.sendEvent(client, 'paypal-checkout.frame-service.timed-out');
    frameServicePromise.reject(new BraintreeError(errors.PAYPAL_START_VAULT_INITIATED_CHECKOUT_SETUP_FAILED));
  }, INTEGRATION_TIMEOUT_MS);

  this._assetsUrl = config.gatewayConfiguration.paypal.assetsUrl + '/web/' + VERSION;
  this._isDebug = config.isDebug;
  // Note: this is using the static landing frame that the deprecated PayPal component builds and uses
  this._loadingFrameUrl = this._assetsUrl + '/html/paypal-landing-frame' + useMin(this._isDebug) + '.html';

  frameService.create({
    name: 'braintreepaypallanding',
    dispatchFrameUrl: this._assetsUrl + '/html/dispatch-frame' + useMin(this._isDebug) + '.html',
    openFrameUrl: this._loadingFrameUrl
  }, function (service) {
    this._frameService = service;
    clearTimeout(timeoutRef);

    frameServicePromise.resolve();
  }.bind(this));

  return frameServicePromise;
};

/**
 * @typedef {object} PayPalCheckout~lineItem
 * @property {string} quantity Number of units of the item purchased. This value must be a whole number and can't be negative or zero.
 * @property {string} unitAmount Per-unit price of the item. Can include up to 2 decimal places. This value can't be negative or zero.
 * @property {string} name Item name. Maximum 127 characters.
 * @property {string} kind Indicates whether the line item is a debit (sale) or credit (refund) to the customer. Accepted values: `debit` and `credit`.
 * @property {?string} unitTaxAmount Per-unit tax price of the item. Can include up to 2 decimal places. This value can't be negative or zero.
 * @property {?string} description Item description. Maximum 127 characters.
 * @property {?string} productCode Product or UPC code for the item. Maximum 127 characters.
 * @property {?string} url The URL to product information.
 */

/**
 * @typedef {object} PayPalCheckout~shippingOption
 * @property {string} id A unique ID that identifies a payer-selected shipping option.
 * @property {string} label A description that the payer sees, which helps them choose an appropriate shipping option. For example, `Free Shipping`, `USPS Priority Shipping`, `Expédition prioritaire USPS`, or `USPS yōuxiān fā huò`. Localize this description to the payer's locale.
 * @property {boolean} selected If `selected = true` is specified as part of the API request it represents the shipping option that the payee/merchant expects to be pre-selected for the payer when they first view the shipping options within the PayPal checkout experience. As part of the response if a shipping option has `selected = true` it represents the shipping option that the payer selected during the course of checkout with PayPal. Only 1 `shippingOption` can be set to `selected = true`.
 * @property {string} type The method by which the payer wants to get their items. The possible values are:
 * * `SHIPPING` - The payer intends to receive the items at a specified address.
 * * `PICKUP` - The payer intends to pick up the items at a specified address. For example, a store address.
 * @property {object} amount The shipping cost for the selected option.
 * @property {string} amount.currency The three-character ISO-4217 currency code. PayPal does not support all currencies.
 * @property {string} amount.value The amount the shipping option will cost. Includes the specified number of digits after decimal separator for the ISO-4217 currency code.
 */

/**
 * Creates a PayPal payment ID or billing token using the given options. This is meant to be passed to PayPal's checkout.js library.
 * When a {@link callback} is defined, the function returns undefined and invokes the callback with the id to be used with the checkout.js library. Otherwise, it returns a Promise that resolves with the id.
 * @public
 * @param {object} options All options for the PayPalCheckout component.
 * @param {string} options.flow Set to 'checkout' for one-time payment flow, or 'vault' for Vault flow. If 'vault' is used with a client token generated with a customer ID, the PayPal account will be added to that customer as a saved payment method.
 * @param {string} [options.intent=authorize]
 * * `authorize` - Submits the transaction for authorization but not settlement.
 * * `order` - Validates the transaction without an authorization (i.e. without holding funds). Useful for authorizing and capturing funds up to 90 days after the order has been placed. Only available for Checkout flow.
 * * `capture` - Payment will be immediately submitted for settlement upon creating a transaction. `sale` can be used as an alias for this value.
 * @param {boolean} [options.offerCredit=false] Offers PayPal Credit as the default funding instrument for the transaction. If the customer isn't pre-approved for PayPal Credit, they will be prompted to apply for it.
 * @param {(string|number)} [options.amount] The amount of the transaction. Required when using the Checkout flow.
 * @param {string} [options.currency] The currency code of the amount, such as 'USD'. Required when using the Checkout flow.
 * @param {string} [options.displayName] The merchant name displayed inside of the PayPal lightbox; defaults to the company name on your Braintree account
 * @param {string} [options.locale=en_US] Use this option to change the language, links, and terminology used in the PayPal flow. This locale will be used unless the buyer has set a preferred locale for their account. If an unsupported locale is supplied, a fallback locale (determined by buyer preference or browser data) will be used and no error will be thrown.
 * @param {string} [options.vaultInitiatedCheckoutPaymentMethodToken] Use the payment method nonce representing a PayPal account with a Billing Agreement ID to create the payment and redirect the customer to select a new financial instrument. This option is only applicable to the `checkout` flow.
 *
 * Supported locales are:
 * `da_DK`,
 * `de_DE`,
 * `en_AU`,
 * `en_GB`,
 * `en_US`,
 * `es_ES`,
 * `fr_CA`,
 * `fr_FR`,
 * `id_ID`,
 * `it_IT`,
 * `ja_JP`,
 * `ko_KR`,
 * `nl_NL`,
 * `no_NO`,
 * `pl_PL`,
 * `pt_BR`,
 * `pt_PT`,
 * `ru_RU`,
 * `sv_SE`,
 * `th_TH`,
 * `zh_CN`,
 * `zh_HK`,
 * and `zh_TW`.
 *
 * @param {shippingOption[]} [options.shippingOptions] List of shipping options offered by the payee or merchant to the payer to ship or pick up their items.
 * @param {boolean} [options.enableShippingAddress=false] Returns a shipping address object in {@link PayPal#tokenize}.
 * @param {object} [options.shippingAddressOverride] Allows you to pass a shipping address you have already collected into the PayPal payment flow.
 * @param {string} options.shippingAddressOverride.line1 Street address.
 * @param {string} [options.shippingAddressOverride.line2] Street address (extended).
 * @param {string} options.shippingAddressOverride.city City.
 * @param {string} options.shippingAddressOverride.state State.
 * @param {string} options.shippingAddressOverride.postalCode Postal code.
 * @param {string} options.shippingAddressOverride.countryCode Country.
 * @param {string} [options.shippingAddressOverride.phone] Phone number.
 * @param {string} [options.shippingAddressOverride.recipientName] Recipient's name.
 * @param {boolean} [options.shippingAddressEditable=true] Set to false to disable user editing of the shipping address.
 * @param {string} [options.billingAgreementDescription] Use this option to set the description of the preapproved payment agreement visible to customers in their PayPal profile during Vault flows. Max 255 characters.
 * @param {string} [options.landingPageType] Use this option to specify the PayPal page to display when a user lands on the PayPal site to complete the payment.
 * * `login` - A PayPal account login page is used.
 * * `billing` - A non-PayPal account landing page is used.
* @property {lineItem[]} [options.lineItems] The line items for this transaction. It can include up to 249 line items.
 * @param {callback} [callback] The second argument is a PayPal `paymentId` or `billingToken` string, depending on whether `options.flow` is `checkout` or `vault`. This is also what is resolved by the promise if no callback is provided.
 * @example
 * // this paypal object is created by checkout.js
 * // see https://github.com/paypal/paypal-checkout
 * paypal.Buttons({
 *   createOrder: function () {
 *     // when createPayment resolves, it is automatically passed to checkout.js
 *     return paypalCheckoutInstance.createPayment({
 *       flow: 'checkout',
 *       amount: '10.00',
 *       currency: 'USD',
 *       intent: 'capture' // this value must either be `capture` or match the intent passed into the PayPal SDK intent query parameter
 *     });
 *   },
 *   // Add other options, e.g. onApproved, onCancel, onError
 * }).render('#paypal-button');
 *
 * @example
 * // shippingOptions are passed to createPayment. You can review the result from onAuthorize to determine which shipping option id was selected.
 * ```javascript
 * braintree.client.create({
 *   authorization: 'authorization'
 * }).then(function (clientInstance) {
 *   return braintree.paypalCheckout.create({
 *     client: clientInstance
 *   });
 * }).then(function (paypalCheckoutInstance) {
 *   return paypal.Button.render({
 *     env: 'production'
 *
 *     payment: function () {
 *       return paypalCheckoutInstance.createPayment({
 *         flow: 'checkout',
 *         amount: '10.00',
 *         currency: 'USD',
 *         shippingOptions: [
 *           {
 *             id: 'UUID-9',
 *             type: 'PICKUP',
 *             label: 'Store Location Five',
 *             selected: true,
 *             amount: {
 *               value: '1.00',
 *               currency: 'USD'
 *             }
 *           },
 *           {
 *             id: 'shipping-speed-fast',
 *             type: 'SHIPPING',
 *             label: 'Fast Shipping',
 *             selected: false,
 *             amount: {
 *               value: '1.00',
 *               currency: 'USD'
 *             }
 *           },
 *           {
 *             id: 'shipping-speed-slow',
 *             type: 'SHIPPING',
 *             label: 'Slow Shipping',
 *             selected: false,
 *             amount: {
 *               value: '1.00',
 *               currency: 'USD'
 *             }
 *           }
 *         ]
 *       });
 *     },
 *
 *     onAuthorize: function (data, actions) {
 *       return paypalCheckoutInstance.tokenizePayment(data).then(function (payload) {
 *         // Submit payload.nonce to your server
 *       });
 *     }
 *   }, '#paypal-button');
 * }).catch(function (err) {
 *  console.error('Error!', err);
 * });
 * ```
 *
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
PayPalCheckout.prototype.createPayment = function (options) {
  if (!options || !constants.FLOW_ENDPOINTS.hasOwnProperty(options.flow)) {
    return Promise.reject(new BraintreeError(errors.PAYPAL_FLOW_OPTION_REQUIRED));
  }

  analytics.sendEvent(this._clientPromise, 'paypal-checkout.createPayment');

  return this._createPaymentResource(options).then(function (response) {
    var flowToken;

    if (options.flow === 'checkout') {
      flowToken = response.paymentResource.redirectUrl.match(/EC-\w+/)[0];
    } else {
      flowToken = response.agreementSetup.tokenId;
    }

    return flowToken;
  });
};

PayPalCheckout.prototype._createPaymentResource = function (options, config) {
  var self = this;
  var endpoint = 'paypal_hermes/' + constants.FLOW_ENDPOINTS[options.flow];

  config = config || {};

  if (options.offerCredit === true) {
    analytics.sendEvent(this._clientPromise, 'paypal-checkout.credit.offered');
  }

  return this._clientPromise.then(function (client) {
    return client.request({
      endpoint: endpoint,
      method: 'post',
      data: self._formatPaymentResourceData(options, config)
    });
  }).catch(function (err) {
    var status;

    if (self._setupError) {
      return Promise.reject(self._setupError);
    }

    status = err.details && err.details.httpStatus;

    if (status === 422) {
      return Promise.reject(new BraintreeError({
        type: errors.PAYPAL_INVALID_PAYMENT_OPTION.type,
        code: errors.PAYPAL_INVALID_PAYMENT_OPTION.code,
        message: errors.PAYPAL_INVALID_PAYMENT_OPTION.message,
        details: {
          originalError: err
        }
      }));
    }

    return Promise.reject(convertToBraintreeError(err, {
      type: errors.PAYPAL_FLOW_FAILED.type,
      code: errors.PAYPAL_FLOW_FAILED.code,
      message: errors.PAYPAL_FLOW_FAILED.message
    }));
  });
};

/**
 * Initializes the PayPal checkout flow with a payment method nonce that represents a vaulted PayPal account.
 * When a {@link callback} is defined, the function returns undefined and invokes the callback with the id to be used with the checkout.js library. Otherwise, it returns a Promise that resolves with the id.
 * @public
 * @ignore
 * @param {object} options These options are identical to the {@link PayPalCheckout#createPayment|options for creating a payment resource}, except for the following:
 * * `flow` cannot be set (will always be `'checkout'`)
 * * `amount`, `currency`, and `vaultInitiatedCheckoutPaymentMethodToken` are required instead of optional
 * * Additional configuration is available (listed below)
 * @param {boolean} [options.optOutOfModalBackdrop=false] By default, the webpage will darken and become unusable while the PayPal window is open. For full control of the UI, pass `true` for this option.
 * @param {callback} [callback] The second argument, <code>payload</code>, is a {@link PayPalCheckout~tokenizePayload|tokenizePayload}. If no callback is provided, the promise resolves with a {@link PayPalCheckout~tokenizePayload|tokenizePayload}.
 * @example
 * paypalCheckoutInstance.startVaultInitiatedCheckout({
 *   vaultInitiatedCheckoutPaymentMethodToken: 'nonce-that-represents-a-vaulted-paypal-account',
 *   amount: '10.00',
 *   currency: 'USD'
 * }).then(function (payload) {
 *   // send payload.nonce to your server
 * }).catch(function (err) {
 *   if (err.code === 'PAYPAL_POPUP_CLOSED') {
 *     // indicates that customer canceled by
 *     // manually closing the PayPal popup
 *   }
 *
 *   // handle other errors
 * });
 *
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
PayPalCheckout.prototype.startVaultInitiatedCheckout = function (options) {
  var missingRequiredParam;
  var self = this;

  if (this._vaultInitiatedCheckoutInProgress) {
    analytics.sendEvent(this._clientPromise, 'paypal-checkout.startVaultInitiatedCheckout.error.already-in-progress');

    return Promise.reject(new BraintreeError(errors.PAYPAL_START_VAULT_INITIATED_CHECKOUT_IN_PROGRESS));
  }

  REQUIRED_PARAMS_FOR_START_VAULT_INITIATED_CHECKOUT.forEach(function (param) {
    if (!options.hasOwnProperty(param)) {
      missingRequiredParam = param;
    }
  });

  if (missingRequiredParam) {
    return Promise.reject(new BraintreeError({
      type: errors.PAYPAL_START_VAULT_INITIATED_CHECKOUT_PARAM_REQUIRED.type,
      code: errors.PAYPAL_START_VAULT_INITIATED_CHECKOUT_PARAM_REQUIRED.code,
      message: 'Required param ' + missingRequiredParam + ' is missing.'
    }));
  }

  this._vaultInitiatedCheckoutInProgress = true;
  this._addModalBackdrop(options);

  options = assign({}, options, {
    flow: 'checkout'
  });

  analytics.sendEvent(this._clientPromise, 'paypal-checkout.startVaultInitiatedCheckout.started');

  return this._waitForVaultInitiatedCheckoutDependencies().then(function () {
    var frameCommunicationPromise = new ExtendedPromise();
    var startVaultInitiatedCheckoutPromise = self._createPaymentResource(options, {
      returnUrl: self._constructVaultCheckutUrl('redirect-frame'),
      cancelUrl: self._constructVaultCheckutUrl('cancel-frame')
    }).then(function (response) {
      var redirectUrl = response.paymentResource.redirectUrl;

      self._frameService.redirect(redirectUrl);

      return frameCommunicationPromise;
    });

    self._frameService.open({}, self._createFrameServiceCallback(frameCommunicationPromise));

    return startVaultInitiatedCheckoutPromise;
  }).catch(function (err) {
    self._vaultInitiatedCheckoutInProgress = false;
    self._removeModalBackdrop();

    if (err.code === 'FRAME_SERVICE_FRAME_CLOSED') {
      analytics.sendEvent(self._clientPromise, 'paypal-checkout.startVaultInitiatedCheckout.canceled.by-customer');

      return Promise.reject(new BraintreeError(errors.PAYPAL_START_VAULT_INITIATED_CHECKOUT_CANCELED));
    }

    if (self._frameService) {
      self._frameService.close();
    }

    if (err.code && err.code.indexOf('FRAME_SERVICE_FRAME_OPEN_FAILED') > -1) {
      analytics.sendEvent(self._clientPromise, 'paypal-checkout.startVaultInitiatedCheckout.failed.popup-not-opened');

      return Promise.reject(new BraintreeError({
        code: errors.PAYPAL_START_VAULT_INITIATED_CHECKOUT_POPUP_OPEN_FAILED.code,
        type: errors.PAYPAL_START_VAULT_INITIATED_CHECKOUT_POPUP_OPEN_FAILED.type,
        message: errors.PAYPAL_START_VAULT_INITIATED_CHECKOUT_POPUP_OPEN_FAILED.message,
        details: {
          originalError: err
        }
      }));
    }

    return Promise.reject(err);
  }).then(function (response) {
    self._frameService.close();
    self._vaultInitiatedCheckoutInProgress = false;
    self._removeModalBackdrop();
    analytics.sendEvent(self._clientPromise, 'paypal-checkout.startVaultInitiatedCheckout.succeeded');

    return Promise.resolve(response);
  });
};

PayPalCheckout.prototype._addModalBackdrop = function (options) {
  if (options.optOutOfModalBackdrop) {
    return;
  }

  if (!this._modalBackdrop) {
    this._modalBackdrop = document.createElement('div');
    this._modalBackdrop.setAttribute('data-braintree-paypal-vault-initiated-checkout-modal', true);
    this._modalBackdrop.style.position = 'fixed';
    this._modalBackdrop.style.top = 0;
    this._modalBackdrop.style.bottom = 0;
    this._modalBackdrop.style.left = 0;
    this._modalBackdrop.style.right = 0;
    this._modalBackdrop.style.zIndex = 9999;
    this._modalBackdrop.style.background = 'black';
    this._modalBackdrop.style.opacity = '0.7';
    this._modalBackdrop.addEventListener('click', function () {
      this.focusVaultInitiatedCheckoutWindow();
    }.bind(this));
  }

  document.body.appendChild(this._modalBackdrop);
};

PayPalCheckout.prototype._removeModalBackdrop = function () {
  if (!(this._modalBackdrop && this._modalBackdrop.parentNode)) {
    return;
  }

  this._modalBackdrop.parentNode.removeChild(this._modalBackdrop);
};

/**
 * Closes the PayPal window if it is opened via `startVaultInitiatedCheckout`.
 * @public
 * @ignore
 * @param {callback} [callback] Gets called when window is closed.
 * @example
 * paypalCheckoutInstance.closeVaultInitiatedCheckoutWindow();
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
PayPalCheckout.prototype.closeVaultInitiatedCheckoutWindow = function () {
  if (this._vaultInitiatedCheckoutInProgress) {
    analytics.sendEvent(this._clientPromise, 'paypal-checkout.startVaultInitiatedCheckout.canceled.by-merchant');
  }

  return this._waitForVaultInitiatedCheckoutDependencies().then(function () {
    this._frameService.close();
  }.bind(this));
};

/**
 * Focuses the PayPal window if it is opened via `startVaultInitiatedCheckout`.
 * @public
 * @ignore
 * @param {callback} [callback] Gets called when window is focused.
 * @example
 * paypalCheckoutInstance.focusVaultInitiatedCheckoutWindow();
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
PayPalCheckout.prototype.focusVaultInitiatedCheckoutWindow = function () {
  return this._waitForVaultInitiatedCheckoutDependencies().then(function () {
    this._frameService.focus();
  }.bind(this));
};

PayPalCheckout.prototype._createFrameServiceCallback = function (frameCommunicationPromise) {
  var self = this;

  // TODO when a merchant integrates an iOS or Android integration
  // with a webview using the web SDK, we will have to add popupbridge
  // support
  return function (err, payload) {
    if (err) {
      frameCommunicationPromise.reject(err);
    } else if (payload) {
      self._frameService.redirect(self._loadingFrameUrl);
      self.tokenizePayment({
        paymentToken: payload.token,
        payerID: payload.PayerID,
        paymentID: payload.paymentId
      }).then(function (res) {
        frameCommunicationPromise.resolve(res);
      }).catch(function (tokenizationError) {
        frameCommunicationPromise.reject(tokenizationError);
      });
    }
  };
};

PayPalCheckout.prototype._waitForVaultInitiatedCheckoutDependencies = function () {
  var self = this;

  return this._clientPromise.then(function () {
    return self._frameServicePromise;
  });
};

PayPalCheckout.prototype._constructVaultCheckutUrl = function (frameName) {
  var serviceId = this._frameService._serviceId;

  return this._assetsUrl + '/html/' + frameName + useMin(this._isDebug) + '.html?channel=' + serviceId;
};

/**
 * Tokenizes the authorize data from PayPal's checkout.js library when completing a buyer approval flow.
 * When a {@link callback} is defined, invokes the callback with {@link PayPalCheckout~tokenizePayload|tokenizePayload} and returns undefined. Otherwise, returns a Promise that resolves with a {@link PayPalCheckout~tokenizePayload|tokenizePayload}.
 * @public
 * @param {object} tokenizeOptions Tokens and IDs required to tokenize the payment.
 * @param {string} tokenizeOptions.payerId Payer ID returned by PayPal `onApproved` callback.
 * @param {string} [tokenizeOptions.paymentId] Payment ID returned by PayPal `onApproved` callback.
 * @param {string} [tokenizeOptions.billingToken] Billing Token returned by PayPal `onApproved` callback.
 * @param {boolean} [tokenizeOptions.vault=true] Whether or not to vault the resulting PayPal account (if using a client token generated with a customer id and the vault flow).
 * @param {callback} [callback] The second argument, <code>payload</code>, is a {@link PayPalCheckout~tokenizePayload|tokenizePayload}. If no callback is provided, the promise resolves with a {@link PayPalCheckout~tokenizePayload|tokenizePayload}.
 * @example <caption>Opt out of auto-vaulting behavior</caption>
 * // create the paypalCheckoutInstance with a client token generated with a customer id
 * paypal.Buttons({
 *   createBillingAgreement: function () {
 *     return paypalCheckoutInstance.createPayment({
 *       flow: 'vault'
 *       // your other createPayment options here
 *     });
 *   },
 *   onApproved: function (data) {
 *     data.vault = false;
 *
 *     return paypalCheckoutInstance.tokenizePayment(data);
 *   },
 *   // Add other options, e.g. onCancel, onError
 * }).render('#paypal-button');
 *
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
PayPalCheckout.prototype.tokenizePayment = function (tokenizeOptions) {
  var self = this;
  var shouldVault = true;
  var payload;
  var options = {
    flow: tokenizeOptions.billingToken ? 'vault' : 'checkout',
    intent: tokenizeOptions.intent
  };
  var params = {
    // The paymentToken provided by Checkout.js v4 is the ECToken
    ecToken: tokenizeOptions.paymentToken,
    billingToken: tokenizeOptions.billingToken,
    payerId: tokenizeOptions.payerID,
    paymentId: tokenizeOptions.paymentID,
    shippingOptionsId: tokenizeOptions.shippingOptionsId
  };

  if (tokenizeOptions.hasOwnProperty('vault')) {
    shouldVault = tokenizeOptions.vault;
  }

  options.vault = shouldVault;

  analytics.sendEvent(this._clientPromise, 'paypal-checkout.tokenization.started');

  return this._clientPromise.then(function (client) {
    return client.request({
      endpoint: 'payment_methods/paypal_accounts',
      method: 'post',
      data: self._formatTokenizeData(options, params)
    });
  }).then(function (response) {
    payload = self._formatTokenizePayload(response);

    analytics.sendEvent(self._clientPromise, 'paypal-checkout.tokenization.success');
    if (payload.creditFinancingOffered) {
      analytics.sendEvent(self._clientPromise, 'paypal-checkout.credit.accepted');
    }

    return payload;
  }).catch(function (err) {
    if (self._setupError) {
      return Promise.reject(self._setupError);
    }

    analytics.sendEvent(self._clientPromise, 'paypal-checkout.tokenization.failed');

    return Promise.reject(convertToBraintreeError(err, {
      type: errors.PAYPAL_ACCOUNT_TOKENIZATION_FAILED.type,
      code: errors.PAYPAL_ACCOUNT_TOKENIZATION_FAILED.code,
      message: errors.PAYPAL_ACCOUNT_TOKENIZATION_FAILED.message
    }));
  });
};

/**
 * Resolves with the PayPal client id to be used when loading the PayPal SDK.
 * @public
 * @param {callback} [callback] The second argument, <code>id</code>, is a the PayPal client id. If no callback is provided, the promise resolves with the PayPal client id.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * paypalCheckoutInstance.getClientId().then(function (id) {
 *  var script = document.createElement('script');
 *
 *  script.src = 'https://www.paypal.com/sdk/js?client-id=' + id;
 *  script.onload = function () {
 *    // setup the PayPal SDK
 *  };
 *
 *  document.body.appendChild(script);
 * });
 */
PayPalCheckout.prototype.getClientId = function () {
  return this._clientPromise.then(function (client) {
    return client.getConfiguration().gatewayConfiguration.paypal.clientId;
  });
};

/**
 * Resolves when the PayPal SDK has been succesfully loaded onto the page.
 * @public
 * @param {object} [options] A configuration object to modify the query params on the PayPal SDK. A subset of the parameters are listed below. For a full list of query params, see the [PayPal docs](https://developer.paypal.com/docs/checkout/reference/customize-sdk/?mark=query#query-parameters).
 * @param {string} [options.client-id] By default, this will be the client id associated with the authorization used to create the Braintree component. When used in conjunction with passing `authorization` when creating the PayPal Checkotu componet, you can speed up the loading of the PayPal SDK.
 * @param {string} [options.intent="authorize"] By default, the PayPal SDK defaults to an intent of `capture`. Since the default intent when calling {@link PayPalCheckout#createPayment|`createPayment`} is `authorize`, the PayPal SDK will be loaded with `intent=authorize`. If you wish to use a different intent when calling {@link PayPalCheckout#createPayment|`createPayment`}, make sure it matches here. If `sale` is used, it will be converted to `capture` for the PayPal SDK. If the `vault: true` param is used, no default intent will be passed.
 * @param {string} [options.currency="USD"] If a currency is passed in {@link PayPalCheckout#createPayment|`createPayment`}, it must match the currency passed here.
 * @param {boolean} [options.vault] Must be `true` when using `flow: vault` in {@link PayPalCheckout#createPayment|`createPayment`}.
 * @param {string} [options.components=buttons] By default, the Braintree SDK will only load the PayPal smart buttons component. If you would like to load just the [messages component](https://developer.paypal.com/docs/business/checkout/add-capabilities/credit-messaging/), pass `messages`. If you would like to load both, pass `buttons,messages`
 * @param {callback} [callback] Called when the PayPal SDK has been loaded onto the page. The second argument is the PayPal Checkout instance. If no callback is provided, the promise resolves with the PayPal Checkout instance when the PayPal SDK has been loaded onto the page.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example <caption>Without options</caption>
 * paypalCheckoutInstance.loadPayPalSDK().then(function () {
 *   // window.paypal.Buttons is now available to use
 * });
 * @example <caption>With options</caption>
 * paypalCheckoutInstance.loadPayPalSDK({
 *   'client-id': 'PayPal Client Id', // Can speed up rendering time to hardcode this value
 *
 *   intent: 'capture', // Make sure this value matches the value in createPayment
 *   currency: 'USD', // Make sure this value matches the value in createPayment
 * }).then(function () {
 *   // window.paypal.Buttons is now available to use
 * });
 * @example <caption>With Vaulting</caption>
 * paypalCheckoutInstance.loadPayPalSDK({
 *   vault: true
 * }).then(function () {
 *   // window.paypal.Buttons is now available to use
 * });
 */
PayPalCheckout.prototype.loadPayPalSDK = function (options) {
  var idPromise, src;
  var loadPromise = new ExtendedPromise();

  this._paypalScript = document.createElement('script');

  options = assign({}, {
    components: 'buttons'
  }, options);

  if (!options.vault) {
    options.intent = options.intent || 'authorize';
    options.currency = options.currency || 'USD';
  }

  src = 'https://www.paypal.com/sdk/js?';
  this._paypalScript.onload = function () {
    loadPromise.resolve();
  };

  if (options['client-id']) {
    idPromise = Promise.resolve(options['client-id']);
  } else {
    idPromise = this.getClientId().then(function (id) {
      if (this._configuration.gatewayConfiguration.environment !== 'production') {
        return 'sb';
      }

      return id;
    }.bind(this));
  }

  idPromise.then(function (id) {
    options['client-id'] = id;

    this._paypalScript.src = querystring.queryify(src, options);
    document.body.appendChild(this._paypalScript);
  }.bind(this));

  return loadPromise.then(function () {
    return this;
  }.bind(this));
};

PayPalCheckout.prototype._formatPaymentResourceData = function (options, config) {
  var key;
  var gatewayConfiguration = this._configuration.gatewayConfiguration;
  // NEXT_MAJOR_VERSION default value for intent in PayPal SDK is capture
  // but our integrations default value is authorize. Default this to capture
  // in the next major version.
  var intent = options.intent;
  var paymentResource = {
    // returnUrl and cancelUrl are required in hermes create_payment_resource route
    // but are not used by the PayPal sdk, except to redirect to an error page
    returnUrl: config.returnUrl || 'https://www.paypal.com/checkoutnow/error',
    cancelUrl: config.cancelUrl || 'https://www.paypal.com/checkoutnow/error',
    offerPaypalCredit: options.offerCredit === true,
    merchantAccountId: this._merchantAccountId,
    experienceProfile: {
      brandName: options.displayName || gatewayConfiguration.paypal.displayName,
      localeCode: options.locale,
      noShipping: (!options.enableShippingAddress).toString(),
      addressOverride: options.shippingAddressEditable === false,
      landingPageType: options.landingPageType
    },
    shippingOptions: options.shippingOptions
  };

  if (options.flow === 'checkout') {
    paymentResource.amount = options.amount;
    paymentResource.currencyIsoCode = options.currency;

    if (intent) {
      // 'sale' has been changed to 'capture' in PayPal's backend, but
      // we use an old version with 'sale'. We provide capture as an alias
      // to match the PayPal SDK
      if (intent === 'capture') {
        intent = 'sale';
      }
      paymentResource.intent = intent;
    }

    if (options.hasOwnProperty('lineItems')) {
      paymentResource.lineItems = options.lineItems;
    }

    if (options.hasOwnProperty('vaultInitiatedCheckoutPaymentMethodToken')) {
      paymentResource.vaultInitiatedCheckoutPaymentMethodToken = options.vaultInitiatedCheckoutPaymentMethodToken;
    }

    if (options.hasOwnProperty('shippingOptions')) {
      paymentResource.shippingOptions = options.shippingOptions;
    }

    for (key in options.shippingAddressOverride) {
      if (options.shippingAddressOverride.hasOwnProperty(key)) {
        paymentResource[key] = options.shippingAddressOverride[key];
      }
    }
  } else {
    paymentResource.shippingAddress = options.shippingAddressOverride;

    if (options.billingAgreementDescription) {
      paymentResource.description = options.billingAgreementDescription;
    }
  }

  return paymentResource;
};

PayPalCheckout.prototype._formatTokenizeData = function (options, params) {
  var clientConfiguration = this._configuration;
  var gatewayConfiguration = clientConfiguration.gatewayConfiguration;
  var isTokenizationKey = clientConfiguration.authorizationType === 'TOKENIZATION_KEY';
  var data = {
    paypalAccount: {
      correlationId: params.billingToken || params.ecToken,
      options: {
        validate: options.flow === 'vault' && !isTokenizationKey && options.vault
      }
    }
  };

  if (params.billingToken) {
    data.paypalAccount.billingAgreementToken = params.billingToken;
  } else {
    data.paypalAccount.paymentToken = params.paymentId;
    data.paypalAccount.payerId = params.payerId;
    data.paypalAccount.unilateral = gatewayConfiguration.paypal.unvettedMerchant;

    if (options.intent) {
      data.paypalAccount.intent = options.intent;
    }
  }

  if (this._merchantAccountId) {
    data.merchantAccountId = this._merchantAccountId;
  }

  return data;
};

PayPalCheckout.prototype._formatTokenizePayload = function (response) {
  var payload;
  var account = {};

  if (response.paypalAccounts) {
    account = response.paypalAccounts[0];
  }

  payload = {
    nonce: account.nonce,
    details: {},
    type: account.type
  };

  if (account.details && account.details.payerInfo) {
    payload.details = account.details.payerInfo;
  }

  if (account.details && account.details.creditFinancingOffered) {
    payload.creditFinancingOffered = account.details.creditFinancingOffered;
  }

  if (account.details && account.details.shippingOptionId) {
    payload.shippingOptionId = account.details.shippingOptionId;
  }

  if (account.details && account.details.cobrandedCardLabel) {
    payload.cobrandedCardLabel = account.details.cobrandedCardLabel;
  }

  return payload;
};

/**
 * Cleanly tear down anything set up by {@link module:braintree-web/paypal-checkout.create|create}.
 * @public
 * @param {callback} [callback] Called once teardown is complete. No data is returned if teardown completes successfully.
 * @example
 * paypalCheckoutInstance.teardown();
 * @example <caption>With callback</caption>
 * paypalCheckoutInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
PayPalCheckout.prototype.teardown = function () {
  convertMethodsToError(this, methods(PayPalCheckout.prototype));

  if (this._paypalScript && this._paypalScript.parentNode) {
    this._paypalScript.parentNode.removeChild(this._paypalScript);
  }

  return Promise.resolve();
};

module.exports = wrapPromise.wrapPrototype(PayPalCheckout);

},{"../lib/analytics":107,"../lib/assign":109,"../lib/braintree-error":112,"../lib/constants":117,"../lib/convert-methods-to-error":118,"../lib/convert-to-braintree-error":119,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/frame-service/external":129,"../lib/methods":144,"../lib/promise":146,"../lib/querystring":147,"../lib/use-min":148,"../paypal/shared/constants":169,"./errors":164,"@braintree/extended-promise":22,"@braintree/wrap-promise":30}],167:[function(_dereq_,module,exports){
'use strict';

var frameService = _dereq_('../../lib/frame-service/external');
var BraintreeError = _dereq_('../../lib/braintree-error');
var convertToBraintreeError = _dereq_('../../lib/convert-to-braintree-error');
var useMin = _dereq_('../../lib/use-min');
var once = _dereq_('../../lib/once');
var VERSION = "3.63.0";
var constants = _dereq_('../shared/constants');
var INTEGRATION_TIMEOUT_MS = _dereq_('../../lib/constants').INTEGRATION_TIMEOUT_MS;
var analytics = _dereq_('../../lib/analytics');
var methods = _dereq_('../../lib/methods');
var deferred = _dereq_('../../lib/deferred');
var errors = _dereq_('../shared/errors');
var convertMethodsToError = _dereq_('../../lib/convert-methods-to-error');
var querystring = _dereq_('../../lib/querystring');
var Promise = _dereq_('../../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @typedef {object} PayPal~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {string} type The payment method type, always `PayPalAccount`.
 * @property {object} details Additional PayPal account details.
 * @property {string} details.email User's email address.
 * @property {string} details.payerId User's payer ID, the unique identifier for each PayPal account.
 * @property {string} details.firstName User's given name.
 * @property {string} details.lastName User's surname.
 * @property {?string} details.countryCode User's 2 character country code.
 * @property {?string} details.phone User's phone number (e.g. 555-867-5309).
 * @property {?object} details.shippingAddress User's shipping address details, only available if shipping address is enabled.
 * @property {string} details.shippingAddress.recipientName Recipient of postage.
 * @property {string} details.shippingAddress.line1 Street number and name.
 * @property {string} details.shippingAddress.line2 Extended address.
 * @property {string} details.shippingAddress.city City or locality.
 * @property {string} details.shippingAddress.state State or region.
 * @property {string} details.shippingAddress.postalCode Postal code.
 * @property {string} details.shippingAddress.countryCode 2 character country code (e.g. US).
 * @property {?object} details.billingAddress User's billing address details.
 * Not available to all merchants; [contact PayPal](https://developers.braintreepayments.com/support/guides/paypal/setup-guide#contacting-paypal-support) for details on eligibility and enabling this feature.
 * Alternatively, see `shippingAddress` above as an available client option.
 * @property {string} details.billingAddress.line1 Street number and name.
 * @property {string} details.billingAddress.line2 Extended address.
 * @property {string} details.billingAddress.city City or locality.
 * @property {string} details.billingAddress.state State or region.
 * @property {string} details.billingAddress.postalCode Postal code.
 * @property {string} details.billingAddress.countryCode 2 character country code (e.g. US).
 * @property {?object} creditFinancingOffered This property will only be present when the customer pays with PayPal Credit.
 * @property {object} creditFinancingOffered.totalCost This is the estimated total payment amount including interest and fees the user will pay during the lifetime of the loan.
 * @property {string} creditFinancingOffered.totalCost.value An amount defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm) for the given currency.
 * @property {string} creditFinancingOffered.totalCost.currency 3 letter currency code as defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm).
 * @property {number} creditFinancingOffered.term Length of financing terms in months.
 * @property {object} creditFinancingOffered.monthlyPayment This is the estimated amount per month that the customer will need to pay including fees and interest.
 * @property {string} creditFinancingOffered.monthlyPayment.value An amount defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm) for the given currency.
 * @property {string} creditFinancingOffered.monthlyPayment.currency 3 letter currency code as defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm).
 * @property {object} creditFinancingOffered.totalInterest Estimated interest or fees amount the payer will have to pay during the lifetime of the loan.
 * @property {string} creditFinancingOffered.totalInterest.value An amount defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm) for the given currency.
 * @property {string} creditFinancingOffered.totalInterest.currency 3 letter currency code as defined by [ISO 4217](https://www.iso.org/iso/home/standards/currency_codes.htm).
 * @property {boolean} creditFinancingOffered.payerAcceptance Status of whether the customer ultimately was approved for and chose to make the payment using the approved installment credit.
 * @property {boolean} creditFinancingOffered.cartAmountImmutable Indicates whether the cart amount is editable after payer's acceptance on PayPal side.
 *
 */

/**
 * @typedef {object} PayPal~tokenizeReturn
 * @property {Function} close A handle to close the PayPal checkout flow.
 * @property {Function} focus A handle to focus the PayPal checkout flow. Note that some browsers (notably iOS Safari) do not support focusing popups. Firefox requires the focus call to occur as the result of a user interaction, such as a button click.
 */

/**
 * @class
 * @param {object} options see {@link module:braintree-web/paypal.create|paypal.create}
 * @classdesc This class represents a PayPal component. Instances of this class can open a PayPal window for authenticating a PayPal account. Any additional UI, such as disabling the page while authentication is taking place, is up to the developer.
 *
 * This component has been deprecated in favor of the {@link PayPalCheckout|PayPal Checkout component}, which provides a fully managed UI. New features will not be added to this component.
 * @description <strong>Do not use this constructor directly. Use {@link module:braintree-web/paypal.create|braintree-web.paypal.create} instead.</strong>
 */
function PayPal(options) {
  this._client = options.client;
  this._assetsUrl = options.client.getConfiguration().gatewayConfiguration.paypal.assetsUrl + '/web/' + VERSION;
  this._isDebug = options.client.getConfiguration().isDebug;
  this._loadingFrameUrl = this._assetsUrl + '/html/paypal-landing-frame' + useMin(this._isDebug) + '.html';
  this._authorizationInProgress = false;
}

PayPal.prototype._initialize = function () {
  var self = this;
  var client = this._client;
  var failureTimeout = setTimeout(function () {
    analytics.sendEvent(client, 'paypal.load.timed-out');
  }, INTEGRATION_TIMEOUT_MS);

  return new Promise(function (resolve) {
    frameService.create({
      name: constants.LANDING_FRAME_NAME,
      dispatchFrameUrl: self._assetsUrl + '/html/dispatch-frame' + useMin(self._isDebug) + '.html',
      openFrameUrl: self._loadingFrameUrl
    }, function (service) {
      self._frameService = service;
      clearTimeout(failureTimeout);
      analytics.sendEvent(client, 'paypal.load.succeeded');
      resolve(self);
    });
  });
};

/**
 * Launches the PayPal login flow and returns a nonce payload. Only one PayPal login flow should be active at a time. One way to achieve this is to disable your PayPal button while the flow is open.
 * @public
 * @param {object} options All tokenization options for the PayPal component.
 * @param {string} options.flow Set to 'checkout' for one-time payment flow, or 'vault' for Vault flow. If 'vault' is used with a client token generated with a customer id, the PayPal account will be added to that customer as a saved payment method.
 * @param {string} [options.intent=authorize]
 * * `authorize` - Submits the transaction for authorization but not settlement.
 * * `order` - Validates the transaction without an authorization (i.e. without holding funds). Useful for authorizing and capturing funds up to 90 days after the order has been placed. Only available for Checkout flow.
 * * `sale` - Payment will be immediately submitted for settlement upon creating a transaction.
 * @param {boolean} [options.offerCredit=false] Offers PayPal Credit as the default funding instrument for the transaction. If the customer isn't pre-approved for PayPal Credit, they will be prompted to apply for it.
 * @param {string} [options.useraction]
 * Changes the call-to-action in the PayPal flow. By default the final button will show the localized
 * word for "Continue" and implies that the final amount billed is not yet known.
 *
 * Setting this option to `commit` changes the button text to "Pay Now" and page text will convey to
 * the user that billing will take place immediately.
 * @param {(string|number)} [options.amount] The amount of the transaction. Required when using the Checkout flow.
 * @param {string} [options.currency] The currency code of the amount, such as 'USD'. Required when using the Checkout flow.
 * @param {string} [options.displayName] The merchant name displayed inside of the PayPal lightbox; defaults to the company name on your Braintree account
 * @param {string} [options.locale=en_US] Use this option to change the language, links, and terminology used in the PayPal flow. This locale will be used unless the buyer has set a preferred locale for their account. If an unsupported locale is supplied, a fallback locale (determined by buyer preference or browser data) will be used and no error will be thrown.
 *
 * Supported locales are:
 * `da_DK`,
 * `de_DE`,
 * `en_AU`,
 * `en_GB`,
 * `en_US`,
 * `es_ES`,
 * `fr_CA`,
 * `fr_FR`,
 * `id_ID`,
 * `it_IT`,
 * `ja_JP`,
 * `ko_KR`,
 * `nl_NL`,
 * `no_NO`,
 * `pl_PL`,
 * `pt_BR`,
 * `pt_PT`,
 * `ru_RU`,
 * `sv_SE`,
 * `th_TH`,
 * `zh_CN`,
 * `zh_HK`,
 * and `zh_TW`.
 *
 * @param {boolean} [options.enableShippingAddress=false] Returns a shipping address object in {@link PayPal#tokenize}.
 * @param {object} [options.shippingAddressOverride] Allows you to pass a shipping address you have already collected into the PayPal payment flow.
 * @param {string} options.shippingAddressOverride.line1 Street address.
 * @param {string} [options.shippingAddressOverride.line2] Street address (extended).
 * @param {string} options.shippingAddressOverride.city City.
 * @param {string} options.shippingAddressOverride.state State.
 * @param {string} options.shippingAddressOverride.postalCode Postal code.
 * @param {string} options.shippingAddressOverride.countryCode Country.
 * @param {string} [options.shippingAddressOverride.phone] Phone number.
 * @param {string} [options.shippingAddressOverride.recipientName] Recipient's name.
 * @param {boolean} [options.shippingAddressEditable=true] Set to false to disable user editing of the shipping address.
 * @param {string} [options.billingAgreementDescription] Use this option to set the description of the preapproved payment agreement visible to customers in their PayPal profile during Vault flows. Max 255 characters.
 * @param {string} [options.landingPageType] Use this option to specify the PayPal page to display when a user lands on the PayPal site to complete the payment.
 * * `login` - A PayPal account login page is used.
 * * `billing` - A non-PayPal account landing page is used.
 * @param {callback} callback The second argument, <code>data</code>, is a {@link PayPal~tokenizePayload|tokenizePayload}.
 * @example
 * <caption>Tokenizing with the vault flow</caption>
 * button.addEventListener('click', function () {
 *   // Disable the button so that we don't attempt to open multiple popups.
 *   button.setAttribute('disabled', 'disabled');
 *
 *   // if there is any other part of the page that must be disabled
 *   // while authentication is in progress, do so now
 *
 *   // Because PayPal tokenization opens a popup, this must be called
 *   // as a result of a user action, such as a button click.
 *   paypalInstance.tokenize({
 *     flow: 'vault' // Required
 *     // Any other tokenization options
 *   }, function (tokenizeErr, payload) {
 *     button.removeAttribute('disabled');
 *
 *     // if any other part of the page was disabled, re-enable now
 *
 *     if (tokenizeErr) {
 *       // Handle tokenization errors or premature flow closure
 *
 *       switch (tokenizeErr.code) {
 *         case 'PAYPAL_POPUP_CLOSED':
 *           console.error('Customer closed PayPal popup.');
 *           break;
 *         case 'PAYPAL_ACCOUNT_TOKENIZATION_FAILED':
 *           console.error('PayPal tokenization failed. See details:', tokenizeErr.details);
 *           break;
 *         case 'PAYPAL_FLOW_FAILED':
 *           console.error('Unable to initialize PayPal flow. Are your options correct?', tokenizeErr.details);
 *           break;
 *         default:
 *           console.error('Error!', tokenizeErr);
 *       }
 *     } else {
 *       // Submit payload.nonce to your server
 *     }
 *   });
 * });

 * @example
 * <caption>Tokenizing with the checkout flow</caption>
 * button.addEventListener('click', function () {
 *   // Disable the button so that we don't attempt to open multiple popups.
 *   button.setAttribute('disabled', 'disabled');
 *
 *   // Because PayPal tokenization opens a popup, this must be called
 *   // as a result of a user action, such as a button click.
 *   paypalInstance.tokenize({
 *     flow: 'checkout', // Required
 *     amount: '10.00', // Required
 *     currency: 'USD' // Required
 *     // Any other tokenization options
 *   }, function (tokenizeErr, payload) {
 *     button.removeAttribute('disabled');
 *
 *     if (tokenizeErr) {
 *       // Handle tokenization errors or premature flow closure
 *
 *       switch (tokenizeErr.code) {
 *         case 'PAYPAL_POPUP_CLOSED':
 *           console.error('Customer closed PayPal popup.');
 *           break;
 *         case 'PAYPAL_ACCOUNT_TOKENIZATION_FAILED':
 *           console.error('PayPal tokenization failed. See details:', tokenizeErr.details);
 *           break;
 *         case 'PAYPAL_FLOW_FAILED':
 *           console.error('Unable to initialize PayPal flow. Are your options correct?', tokenizeErr.details);
 *           break;
 *         default:
 *           console.error('Error!', tokenizeErr);
 *       }
 *     } else {
 *       // Submit payload.nonce to your server
 *     }
 *   });
 * });
 * @returns {Promise|PayPal~tokenizeReturn} A handle to manage the PayPal checkout frame. If no callback is provided, returns a promise.
 */
PayPal.prototype.tokenize = function (options, callback) {
  var self = this;
  var client = this._client;
  var tokenizePromise, optionError;

  if (callback) {
    callback = once(deferred(callback));
  }

  if (!options || !constants.FLOW_ENDPOINTS.hasOwnProperty(options.flow)) {
    optionError = new BraintreeError(errors.PAYPAL_FLOW_OPTION_REQUIRED);

    if (callback) {
      callback(optionError);

      return this._frameService.createNoopHandler();
    }

    return Promise.reject(optionError);
  }

  tokenizePromise = new Promise(function (resolve, reject) {
    if (self._authorizationInProgress) {
      analytics.sendEvent(client, 'paypal.tokenization.error.already-opened');

      reject(new BraintreeError(errors.PAYPAL_TOKENIZATION_REQUEST_ACTIVE));
    } else {
      self._authorizationInProgress = true;

      if (!window.popupBridge) {
        analytics.sendEvent(client, 'paypal.tokenization.opened');
      }

      if (options.offerCredit === true) {
        analytics.sendEvent(client, 'paypal.credit.offered');
      }

      self._navigateFrameToAuth(options).catch(reject);
      // self MUST happen after _navigateFrameToAuth for Metro browsers to work.
      self._frameService.open({}, self._createFrameServiceCallback(options, resolve, reject));
    }
  });

  if (callback) {
    tokenizePromise.then(function (res) {
      callback(null, res);
    }).catch(callback);

    return this._frameService.createHandler({
      beforeClose: function () {
        analytics.sendEvent(client, 'paypal.tokenization.closed.by-merchant');
      }
    });
  }

  return tokenizePromise;
};

PayPal.prototype._createFrameServiceCallback = function (options, resolve, reject) {
  var self = this;
  var client = this._client;

  if (window.popupBridge) {
    return function (err, payload) {
      var canceled = payload && payload.path && payload.path.substring(0, 7) === '/cancel';

      self._authorizationInProgress = false;

      // `err` exists when the user clicks "Done" button of browser view
      if (err || canceled) {
        analytics.sendEvent(client, 'paypal.tokenization.closed-popupbridge.by-user');
        // Call merchant's tokenize callback with an error
        reject(new BraintreeError(errors.PAYPAL_POPUP_CLOSED));
      } else if (payload) {
        self._tokenizePayPal(options, payload.queryItems).then(resolve).catch(reject);
      }
    };
  }

  return function (err, params) {
    self._authorizationInProgress = false;

    if (err) {
      if (err.code === 'FRAME_SERVICE_FRAME_CLOSED') {
        analytics.sendEvent(client, 'paypal.tokenization.closed.by-user');
        reject(new BraintreeError(errors.PAYPAL_POPUP_CLOSED));
      } else if (err.code && err.code.indexOf('FRAME_SERVICE_FRAME_OPEN_FAILED') > -1) {
        reject(new BraintreeError({
          code: errors.PAYPAL_POPUP_OPEN_FAILED.code,
          type: errors.PAYPAL_POPUP_OPEN_FAILED.type,
          message: errors.PAYPAL_POPUP_OPEN_FAILED.message,
          details: {
            originalError: err
          }
        }));
      }
    } else if (params) {
      self._tokenizePayPal(options, params).then(resolve).catch(reject);
    }
  };
};

PayPal.prototype._tokenizePayPal = function (options, params) {
  var self = this;
  var client = this._client;

  if (!window.popupBridge) {
    this._frameService.redirect(this._loadingFrameUrl);
  }

  return client.request({
    endpoint: 'payment_methods/paypal_accounts',
    method: 'post',
    data: this._formatTokenizeData(options, params)
  }).then(function (response) {
    var payload = self._formatTokenizePayload(response);

    if (window.popupBridge) {
      analytics.sendEvent(client, 'paypal.tokenization.success-popupbridge');
    } else {
      analytics.sendEvent(client, 'paypal.tokenization.success');
    }

    if (payload.creditFinancingOffered) {
      analytics.sendEvent(client, 'paypal.credit.accepted');
    }

    self._frameService.close();

    return payload;
  }).catch(function (err) {
    if (window.popupBridge) {
      analytics.sendEvent(client, 'paypal.tokenization.failed-popupbridge');
    } else {
      analytics.sendEvent(client, 'paypal.tokenization.failed');
    }

    self._frameService.close();

    return Promise.reject(convertToBraintreeError(err, {
      type: errors.PAYPAL_ACCOUNT_TOKENIZATION_FAILED.type,
      code: errors.PAYPAL_ACCOUNT_TOKENIZATION_FAILED.code,
      message: errors.PAYPAL_ACCOUNT_TOKENIZATION_FAILED.message
    }));
  });
};

PayPal.prototype._formatTokenizePayload = function (response) {
  var payload;
  var account = {};

  if (response.paypalAccounts) {
    account = response.paypalAccounts[0];
  }

  payload = {
    nonce: account.nonce,
    details: {},
    type: account.type
  };

  if (account.details && account.details.payerInfo) {
    payload.details = account.details.payerInfo;
  }

  if (account.details && account.details.creditFinancingOffered) {
    payload.creditFinancingOffered = account.details.creditFinancingOffered;
  }

  return payload;
};

PayPal.prototype._formatTokenizeData = function (options, params) {
  var clientConfiguration = this._client.getConfiguration();
  var gatewayConfiguration = clientConfiguration.gatewayConfiguration;
  var isTokenizationKey = clientConfiguration.authorizationType === 'TOKENIZATION_KEY';
  var data = {
    paypalAccount: {
      correlationId: params.ba_token || params.token,
      options: {
        validate: options.flow === 'vault' && !isTokenizationKey
      }
    }
  };

  if (params.ba_token) {
    data.paypalAccount.billingAgreementToken = params.ba_token;
  } else {
    data.paypalAccount.paymentToken = params.paymentId;
    data.paypalAccount.payerId = params.PayerID;
    data.paypalAccount.unilateral = gatewayConfiguration.paypal.unvettedMerchant;

    if (options.hasOwnProperty('intent')) {
      data.paypalAccount.intent = options.intent;
    }
  }

  return data;
};

PayPal.prototype._navigateFrameToAuth = function (options) {
  var self = this;
  var client = this._client;
  var endpoint = 'paypal_hermes/' + constants.FLOW_ENDPOINTS[options.flow];

  return client.request({
    endpoint: endpoint,
    method: 'post',
    data: this._formatPaymentResourceData(options)
  }).then(function (response) {
    var redirectUrl;

    if (options.flow === 'checkout') {
      redirectUrl = response.paymentResource.redirectUrl;
    } else {
      redirectUrl = response.agreementSetup.approvalUrl;
    }

    if (options.useraction === 'commit') {
      redirectUrl = querystring.queryify(redirectUrl, {useraction: 'commit'});
    }

    if (window.popupBridge) {
      analytics.sendEvent(client, 'paypal.tokenization.opened-popupbridge');
    }

    self._frameService.redirect(redirectUrl);
  }).catch(function (err) {
    var status = err.details && err.details.httpStatus;

    self._frameService.close();
    self._authorizationInProgress = false;

    if (status === 422) {
      return Promise.reject(new BraintreeError({
        type: errors.PAYPAL_INVALID_PAYMENT_OPTION.type,
        code: errors.PAYPAL_INVALID_PAYMENT_OPTION.code,
        message: errors.PAYPAL_INVALID_PAYMENT_OPTION.message,
        details: {
          originalError: err
        }
      }));
    }

    return Promise.reject(convertToBraintreeError(err, {
      type: errors.PAYPAL_FLOW_FAILED.type,
      code: errors.PAYPAL_FLOW_FAILED.code,
      message: errors.PAYPAL_FLOW_FAILED.message
    }));
  });
};

PayPal.prototype._formatPaymentResourceData = function (options) {
  var key;
  var gatewayConfiguration = this._client.getConfiguration().gatewayConfiguration;
  var serviceId = this._frameService._serviceId;
  var paymentResource = {
    returnUrl: gatewayConfiguration.paypal.assetsUrl + '/web/' + VERSION + '/html/redirect-frame' + useMin(this._isDebug) + '.html?channel=' + serviceId,
    cancelUrl: gatewayConfiguration.paypal.assetsUrl + '/web/' + VERSION + '/html/cancel-frame' + useMin(this._isDebug) + '.html?channel=' + serviceId,
    offerPaypalCredit: options.offerCredit === true,
    experienceProfile: {
      brandName: options.displayName || gatewayConfiguration.paypal.displayName,
      localeCode: options.locale,
      noShipping: (!options.enableShippingAddress).toString(),
      addressOverride: options.shippingAddressEditable === false,
      landingPageType: options.landingPageType
    }
  };

  if (window.popupBridge && typeof window.popupBridge.getReturnUrlPrefix === 'function') {
    paymentResource.returnUrl = window.popupBridge.getReturnUrlPrefix() + 'return';
    paymentResource.cancelUrl = window.popupBridge.getReturnUrlPrefix() + 'cancel';
  }

  if (options.flow === 'checkout') {
    paymentResource.amount = options.amount;
    paymentResource.currencyIsoCode = options.currency;

    if (options.hasOwnProperty('intent')) {
      paymentResource.intent = options.intent;
    }

    for (key in options.shippingAddressOverride) {
      if (options.shippingAddressOverride.hasOwnProperty(key)) {
        paymentResource[key] = options.shippingAddressOverride[key];
      }
    }
  } else {
    paymentResource.shippingAddress = options.shippingAddressOverride;

    if (options.billingAgreementDescription) {
      paymentResource.description = options.billingAgreementDescription;
    }
  }

  return paymentResource;
};

/**
 * Closes the PayPal window if it is open.
 * @public
 * @example
 * paypalInstance.closeWindow();
 * @returns {void}
 */
PayPal.prototype.closeWindow = function () {
  if (this._authorizationInProgress) {
    analytics.sendEvent(this._client, 'paypal.tokenize.closed.by-merchant');
  }
  this._frameService.close();
};

/**
 * Focuses the PayPal window if it is open.
 * @public
 * @example
 * paypalInstance.focusWindow();
 * @returns {void}
 */
PayPal.prototype.focusWindow = function () {
  this._frameService.focus();
};

/**
 * Cleanly remove anything set up by {@link module:braintree-web/paypal.create|create}.
 * @public
 * @param {callback} [callback] Called on completion.
 * @example
 * paypalInstance.teardown();
 * @example <caption>With callback</caption>
 * paypalInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
PayPal.prototype.teardown = wrapPromise(function () {
  var self = this; // eslint-disable-line no-invalid-this

  self._frameService.teardown();

  convertMethodsToError(self, methods(PayPal.prototype));

  analytics.sendEvent(self._client, 'paypal.teardown-completed');

  return Promise.resolve();
});

module.exports = PayPal;

},{"../../lib/analytics":107,"../../lib/braintree-error":112,"../../lib/constants":117,"../../lib/convert-methods-to-error":118,"../../lib/convert-to-braintree-error":119,"../../lib/deferred":123,"../../lib/frame-service/external":129,"../../lib/methods":144,"../../lib/once":145,"../../lib/promise":146,"../../lib/querystring":147,"../../lib/use-min":148,"../shared/constants":169,"../shared/errors":170,"@braintree/wrap-promise":30}],168:[function(_dereq_,module,exports){
'use strict';
/**
 * @module braintree-web/paypal
 * @description A component to integrate with PayPal.
 * @deprecated Use the {@link PayPalCheckout|PayPal Checkout component} instead.
 */

var analytics = _dereq_('../lib/analytics');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var BraintreeError = _dereq_('../lib/braintree-error');
var errors = _dereq_('./shared/errors');
var PayPal = _dereq_('./external/paypal');
var VERSION = "3.63.0";
var wrapPromise = _dereq_('@braintree/wrap-promise');
var Promise = _dereq_('../lib/promise');

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {callback} callback The second argument, `data`, is the {@link PayPal} instance.
 * @example
 * // We recomend creating your PayPal button with button.js
 * // For an example, see https://codepen.io/braintree/pen/LNKJWa
 * var paypalButton = document.querySelector('.paypal-button');
 *
 * braintree.client.create({
 *   authorization: CLIENT_AUTHORIZATION
 * }, function (clientErr, clientInstance) {
 *   if (clientErr) {
 *     console.error('Error creating client:', clientErr);
 *     return;
 *   }
 *
 *   braintree.paypal.create({
 *     client: clientInstance
 *   }, function (paypalErr, paypalInstance) {
 *     if (paypalErr) {
 *       console.error('Error creating PayPal:', paypalErr);
 *       return;
 *     }
 *
 *     paypalButton.removeAttribute('disabled');
 *
 *     // When the button is clicked, attempt to tokenize.
 *     paypalButton.addEventListener('click', function (event) {
 *       // Because tokenization opens a popup, this has to be called as a result of
 *       // customer action, like clicking a button. You cannot call this at any time.
 *       paypalInstance.tokenize({
 *         flow: 'vault'
 *         // For more tokenization options, see the full PayPal tokenization documentation
 *         // https://braintree.github.io/braintree-web/current/PayPal.html#tokenize
 *       }, function (tokenizeErr, payload) {
 *         if (tokenizeErr) {
 *           if (tokenizeErr.type !== 'CUSTOMER') {
 *             console.error('Error tokenizing:', tokenizeErr);
 *           }
 *           return;
 *         }
 *
 *         // Tokenization succeeded
 *         paypalButton.setAttribute('disabled', true);
 *         console.log('Got a nonce! You should submit this to your server.');
 *         console.log(payload.nonce);
 *       });
 *     }, false);
 *   });
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
function create(options) {
  var name = 'PayPal';

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
    var pp;
    var config = client.getConfiguration();

    options.client = client;

    if (config.gatewayConfiguration.paypalEnabled !== true) {
      return Promise.reject(new BraintreeError(errors.PAYPAL_NOT_ENABLED));
    }

    analytics.sendEvent(options.client, 'paypal.initialized');

    pp = new PayPal(options);

    return pp._initialize();
  });
}

/**
 * @static
 * @function isSupported
 * @description Returns true if PayPal [supports this browser](index.html#browser-support-webviews).
 * @example
 * if (braintree.paypal.isSupported()) {
 *   // Add PayPal button to the page
 * } else {
 *   // Hide PayPal payment option
 * }
 * @returns {Boolean} Returns true if PayPal supports this browser.
 */
function isSupported() {
  return true;
}

module.exports = {
  create: wrapPromise(create),
  isSupported: isSupported,
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"../lib/analytics":107,"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/promise":146,"./external/paypal":167,"./shared/errors":170,"@braintree/wrap-promise":30}],169:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  LANDING_FRAME_NAME: 'braintreepaypallanding',
  FLOW_ENDPOINTS: {
    checkout: 'create_payment_resource',
    vault: 'setup_billing_agreement'
  }
};

},{}],170:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.PayPal - Creation Error Codes
 * @description Errors that occur when [creating the PayPal component](/current/module-braintree-web_paypal.html#.create).
 * @property {MERCHANT} PAYPAL_NOT_ENABLED Occurs when PayPal is not enabled on the Braintree control panel.
 */

/**
 * @name BraintreeError.PayPal - tokenize Error Codes
 * @description Errors that occur when using the [`tokenize` method](/current/PayPal.html#tokenize).
 * @property {MERCHANT} PAYPAL_TOKENIZATION_REQUEST_ACTIVE Occurs when a tokenization request is already in progress.
 * @property {MERCHANT} PAYPAL_FLOW_OPTION_REQUIRED Occurs when flow option is not provdided.
 * @property {NETWORK} PAYPAL_ACCOUNT_TOKENIZATION_FAILED Occurs when PayPal account could not be tokenized.
 * @property {NETWORK} PAYPAL_FLOW_FAILED Occurs when PayPal flow could not be initiated.
 * @property {MERCHANT} PAYPAL_POPUP_OPEN_FAILED Occurs when PayPal window could not be opened.
 * @property {CUSTOMER} PAYPAL_POPUP_CLOSED Occurs when customer closes the PayPal window before completing the flow.
 * @property {MERCHANT} PAYPAL_INVALID_PAYMENT_OPTION Occurs when an invalid payment option is passed.
 */

var BraintreeError = _dereq_('../../lib/braintree-error');

module.exports = {
  PAYPAL_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_NOT_ENABLED',
    message: 'PayPal is not enabled for this merchant.'
  },
  PAYPAL_TOKENIZATION_REQUEST_ACTIVE: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_TOKENIZATION_REQUEST_ACTIVE',
    message: 'Another tokenization request is active.'
  },
  PAYPAL_ACCOUNT_TOKENIZATION_FAILED: {
    type: BraintreeError.types.NETWORK,
    code: 'PAYPAL_ACCOUNT_TOKENIZATION_FAILED',
    message: 'Could not tokenize user\'s PayPal account.'
  },
  PAYPAL_FLOW_FAILED: {
    type: BraintreeError.types.NETWORK,
    code: 'PAYPAL_FLOW_FAILED',
    message: 'Could not initialize PayPal flow.'
  },
  PAYPAL_FLOW_OPTION_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_FLOW_OPTION_REQUIRED',
    message: 'PayPal flow property is invalid or missing.'
  },
  PAYPAL_POPUP_OPEN_FAILED: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_POPUP_OPEN_FAILED',
    message: 'PayPal popup failed to open, make sure to tokenize in response to a user action.'
  },
  PAYPAL_POPUP_CLOSED: {
    type: BraintreeError.types.CUSTOMER,
    code: 'PAYPAL_POPUP_CLOSED',
    message: 'Customer closed PayPal popup before authorizing.'
  },
  PAYPAL_INVALID_PAYMENT_OPTION: {
    type: BraintreeError.types.MERCHANT,
    code: 'PAYPAL_INVALID_PAYMENT_OPTION',
    message: 'PayPal payment options are invalid.'
  }
};

},{"../../lib/braintree-error":112}],171:[function(_dereq_,module,exports){
'use strict';
/** @module braintree-web/preferred-payment-methods */

var wrapPromise = _dereq_('@braintree/wrap-promise');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var PreferredPaymentMethods = _dereq_('./preferred-payment-methods');
var VERSION = "3.63.0";

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {callback} [callback] The second argument, `data`, is the {@link PreferredPaymentMethods} instance.
 * @example
 * braintree.preferredPaymentMethods.create({
 *   client: clientInstance
 * }).then(function (preferredPaymentMethodsInstance) {
 *   // preferredPaymentMethodsInstance is ready to be used.
 * }).catch(function (error) {
 *   // handle creation error
 * });
 * @returns {Promise|void} Returns a Promise with resolves with the PreferredPaymentMethods instance.
 */
function create(options) {
  var name = 'PreferredPaymentMethods';

  return basicComponentVerification.verify({
    name: name,
    client: options.client,
    authorization: options.authorization
  }).then(function () {
    var instance = new PreferredPaymentMethods();

    return instance.initialize(options);
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


},{"../lib/basic-component-verification":110,"./preferred-payment-methods":172,"@braintree/wrap-promise":30}],172:[function(_dereq_,module,exports){
'use strict';

var wrapPromise = _dereq_('@braintree/wrap-promise');
var analytics = _dereq_('../lib/analytics');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var Promise = _dereq_('../lib/promise');

/**
 * @class
 * @param {object} options See {@link module:braintree-web/preferred-payment-methods.create|preferred-payment-methods.create}
 */
function PreferredPaymentMethods() {
}

PreferredPaymentMethods.prototype.initialize = function (options) {
  var self = this;

  this._clientPromise = createDeferredClient.create({
    authorization: options.authorization,
    client: options.client,
    debug: options.debug,
    assetsUrl: createAssetsUrl.create(options.authorization),
    name: 'PreferredPaymentMethods'
  }).catch(function (err) {
    self._setupError = err;

    return Promise.reject(err);
  });

  analytics.sendEvent(this._clientPromise, 'preferred-payment-methods.initialized');

  return Promise.resolve(this);
};

/**
 * Fetches information about which payment methods are preferred on the device.
 * Used to determine which payment methods are given preference in your UI,
 * not whether they are presented entirely.
 *
 * This class is currently in beta and may change in future releases.
 * @public
 * @returns {Promise|void} Returns a promise if no callback is provided.
 * @example
 * <caption>Preferred Payment Methods</caption>
 * preferredPaymentMethodsInstance.fetchPreferredPaymentMethods().then(function (result) {
 *   if (result.paypalPreferred) {
 *     // PayPal preferred
 *   } else {
 *     // PayPal not preferred
 *   }
 *
 *   if (result.venmoPreferred) {
 *     // Venmo preferred
 *   } else {
 *     // Venmo not preferred
 *   }
 * });
 */
PreferredPaymentMethods.prototype.fetchPreferredPaymentMethods = function () {
  var client;
  var self = this;

  return this._clientPromise.then(function (clientInstance) {
    client = clientInstance;

    return client.request({
      api: 'graphQLApi',
      data: {
        query: 'query PreferredPaymentMethods { ' +
          'preferredPaymentMethods { ' +
            'paypalPreferred ' +
            'venmoPreferred ' +
          '} ' +
        '}'
      }
    });
  }).then(function (result) {
    var paypalPreferred = result.data.preferredPaymentMethods.paypalPreferred;
    var venmoPreferred = result.data.preferredPaymentMethods.venmoPreferred;

    analytics.sendEvent(client, 'preferred-payment-methods.paypal.api-detected.' + paypalPreferred);
    analytics.sendEvent(client, 'preferred-payment-methods.venmo.api-detected.' + venmoPreferred);

    return {
      paypalPreferred: paypalPreferred,
      venmoPreferred: venmoPreferred
    };
  }).catch(function () {
    if (self._setupError) {
      return Promise.reject(self._setupError);
    }

    analytics.sendEvent(client, 'preferred-payment-methods.api-error');

    return {
      paypalPreferred: false,
      venmoPreferred: false
    };
  });
};

module.exports = wrapPromise.wrapPrototype(PreferredPaymentMethods);

},{"../lib/analytics":107,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/promise":146,"@braintree/wrap-promise":30}],173:[function(_dereq_,module,exports){
'use strict';

var assign = _dereq_('../../../lib/assign').assign;
var analytics = _dereq_('../../../lib/analytics');
var BraintreeError = _dereq_('../../../lib/braintree-error');
var Promise = _dereq_('../../../lib/promise');
var ExtendedPromise = _dereq_('@braintree/extended-promise');
var EventEmitter = _dereq_('@braintree/event-emitter');
var errors = _dereq_('../../shared/errors');
var iFramer = _dereq_('@braintree/iframer');
var Bus = _dereq_('../../../lib/bus');
var constants = _dereq_('../../shared/constants');
var uuid = _dereq_('../../../lib/vendor/uuid');
var events = _dereq_('../../shared/events');
var useMin = _dereq_('../../../lib/use-min');

var VERSION = "3.63.0";
var IFRAME_HEIGHT = 400;
var IFRAME_WIDTH = 400;

function BaseFramework(options) {
  EventEmitter.call(this);

  this._client = options.client;
  this._createPromise = options.createPromise;
  this._createOptions = options;

  if (this._client) {
    this._isDebug = this._client.getConfiguration().isDebug;
    this._assetsUrl = this._client.getConfiguration().gatewayConfiguration.assetsUrl;
  } else {
    this._isDebug = Boolean(options.isDebug);
    this._assetsUrl = options.assetsUrl;
  }
  this._assetsUrl = this._assetsUrl + '/web/' + VERSION;
}

EventEmitter.createChild(BaseFramework);

BaseFramework.prototype._waitForClient = function () {
  if (this._client) {
    return Promise.resolve();
  }

  return this._createPromise.then(function (client) {
    this._client = client;
  }.bind(this));
};

BaseFramework.prototype.setUpEventListeners = function () {
  throw new BraintreeError(errors.THREEDS_FRAMEWORK_METHOD_NOT_IMPLEMENTED);
};

BaseFramework.prototype.verifyCard = function (options, privateOptions) {
  var formattedOptions, error;
  var self = this;

  privateOptions = privateOptions || {};

  error = this._checkForVerifyCardError(options, privateOptions);

  if (error) {
    return Promise.reject(error);
  }

  this._verifyCardInProgress = true;

  formattedOptions = this._formatVerifyCardOptions(options);

  return this._formatLookupData(formattedOptions).then(function (data) {
    analytics.sendEvent(self._createPromise, 'three-d-secure.verification-flow.started');

    return self._performLookup(formattedOptions.nonce, data);
  }).then(function (response) {
    analytics.sendEvent(self._createPromise, 'three-d-secure.verification-flow.3ds-version.' + response.lookup.threeDSecureVersion);

    return self._onLookupComplete(response, formattedOptions);
  }).then(function (response) {
    return self.initializeChallengeWithLookupResponse(response, formattedOptions);
  }).then(function (payload) {
    self._resetVerificationState();

    analytics.sendEvent(self._createPromise, 'three-d-secure.verification-flow.completed');

    return payload;
  }).catch(function (err) {
    self._resetVerificationState();

    analytics.sendEvent(self._createPromise, 'three-d-secure.verification-flow.failed');

    return Promise.reject(err);
  });
};

BaseFramework.prototype._checkForFrameworkSpecificVerifyCardErrors = function () {
  throw new BraintreeError(errors.THREEDS_FRAMEWORK_METHOD_NOT_IMPLEMENTED);
};

BaseFramework.prototype._presentChallenge = function () {
  throw new BraintreeError(errors.THREEDS_FRAMEWORK_METHOD_NOT_IMPLEMENTED);
};

BaseFramework.prototype.prepareLookup = function () {
  throw new BraintreeError(errors.THREEDS_FRAMEWORK_METHOD_NOT_IMPLEMENTED);
};

BaseFramework.prototype._resetVerificationState = function () {
  this._verifyCardInProgress = false;
  this._verifyCardPromisePlus = null;
};

BaseFramework.prototype._performLookup = function (nonce, data) {
  var self = this;
  var url = 'payment_methods/' + nonce + '/three_d_secure/lookup';

  return this._waitForClient().then(function () {
    return self._client.request({
      endpoint: url,
      method: 'post',
      data: data
    }).catch(function (err) {
      var status = err && err.details && err.details.httpStatus;
      var analyticsMessage = 'three-d-secure.verification-flow.lookup-failed';
      var lookupError;

      if (status === 404) {
        lookupError = errors.THREEDS_LOOKUP_TOKENIZED_CARD_NOT_FOUND_ERROR;
        analyticsMessage += '.404';
      } else if (status === 422) {
        lookupError = errors.THREEDS_LOOKUP_VALIDATION_ERROR;
        analyticsMessage += '.422';
      } else {
        lookupError = errors.THREEDS_LOOKUP_ERROR;
      }

      analytics.sendEvent(self._createPromise, analyticsMessage);

      return Promise.reject(new BraintreeError({
        type: lookupError.type,
        code: lookupError.code,
        message: lookupError.message,
        details: {
          originalError: err
        }
      }));
    });
  });
};

BaseFramework.prototype._checkForVerifyCardError = function (options, privateOptions) {
  var errorOption;

  if (this._verifyCardInProgress === true) {
    return new BraintreeError(errors.THREEDS_AUTHENTICATION_IN_PROGRESS);
  } else if (!options.nonce) {
    errorOption = 'a nonce';
  } else if (!options.amount) {
    errorOption = 'an amount';
  }

  if (!errorOption) {
    errorOption = this._checkForFrameworkSpecificVerifyCardErrors(options, privateOptions);
  }

  if (errorOption) {
    return new BraintreeError({
      type: errors.THREEDS_MISSING_VERIFY_CARD_OPTION.type,
      code: errors.THREEDS_MISSING_VERIFY_CARD_OPTION.code,
      message: 'verifyCard options must include ' + errorOption + '.'
    });
  }

  return null;
};

BaseFramework.prototype.initializeChallengeWithLookupResponse = function (lookupResponse, options) {
  var self = this;

  options = options || {};

  this._lookupPaymentMethod = lookupResponse.paymentMethod;

  // sets this in the case that initializeChallengeWithLookupResponse is
  // called as a standalone method from a server side lookup. In a normal
  // verifyCard flow, this promise will already exist
  self._verifyCardPromisePlus = self._verifyCardPromisePlus || new ExtendedPromise();
  self._handleLookupResponse(lookupResponse, options);

  return self._verifyCardPromisePlus.then(function (payload) {
    analytics.sendEvent(self._createPromise, 'three-d-secure.verification-flow.liability-shifted.' + String(payload.liabilityShifted));
    analytics.sendEvent(self._createPromise, 'three-d-secure.verification-flow.liability-shift-possible.' + String(payload.liabilityShiftPossible));

    return payload;
  });
};

BaseFramework.prototype._handleLookupResponse = function (lookupResponse, options) {
  var challengeShouldBePresented = Boolean(lookupResponse.lookup && lookupResponse.lookup.acsUrl);
  var details;

  analytics.sendEvent(this._createPromise, 'three-d-secure.verification-flow.challenge-presented.' + String(challengeShouldBePresented));

  if (challengeShouldBePresented) {
    this._presentChallenge(lookupResponse, options);
  } else {
    details = this._formatAuthResponse(lookupResponse.paymentMethod, lookupResponse.threeDSecureInfo);
    details.verificationDetails = lookupResponse.threeDSecureInfo;

    this._verifyCardPromisePlus.resolve(details);
  }
};

BaseFramework.prototype._onLookupComplete = function (response) {
  this._lookupPaymentMethod = response.paymentMethod;
  this._verifyCardPromisePlus = new ExtendedPromise();

  return Promise.resolve(response);
};

BaseFramework.prototype._formatAuthResponse = function (paymentMethod, threeDSecureInfo) {
  return {
    nonce: paymentMethod.nonce,
    binData: paymentMethod.binData,
    details: paymentMethod.details,
    description: paymentMethod.description && paymentMethod.description.replace(/\+/g, ' '),
    liabilityShifted: threeDSecureInfo && threeDSecureInfo.liabilityShifted,
    liabilityShiftPossible: threeDSecureInfo && threeDSecureInfo.liabilityShiftPossible,
    threeDSecureInfo: paymentMethod.threeDSecureInfo
  };
};

BaseFramework.prototype._formatVerifyCardOptions = function (options) {
  return assign({}, options);
};

BaseFramework.prototype._formatLookupData = function (options) {
  var data = {
    amount: options.amount
  };

  return Promise.resolve(data);
};

BaseFramework.prototype._handleV1AuthResponse = function (data) {
  var authResponse = JSON.parse(data.auth_response);

  if (authResponse.success) {
    this._verifyCardPromisePlus.resolve(this._formatAuthResponse(authResponse.paymentMethod, authResponse.threeDSecureInfo));
  } else if (authResponse.threeDSecureInfo && authResponse.threeDSecureInfo.liabilityShiftPossible) {
    this._verifyCardPromisePlus.resolve(this._formatAuthResponse(this._lookupPaymentMethod, authResponse.threeDSecureInfo));
  } else {
    this._verifyCardPromisePlus.reject(new BraintreeError({
      type: BraintreeError.types.UNKNOWN,
      code: 'UNKNOWN_AUTH_RESPONSE',
      message: authResponse.error.message
    }));
  }
};

BaseFramework.prototype.cancelVerifyCard = function () {
  var response, threeDSecureInfo;

  this._verifyCardInProgress = false;

  if (!this._lookupPaymentMethod) {
    return Promise.reject(new BraintreeError(errors.THREEDS_NO_VERIFICATION_PAYLOAD));
  }

  threeDSecureInfo = this._lookupPaymentMethod.threeDSecureInfo;

  response = assign({}, this._lookupPaymentMethod, {
    liabilityShiftPossible: threeDSecureInfo && threeDSecureInfo.liabilityShiftPossible,
    liabilityShifted: threeDSecureInfo && threeDSecureInfo.liabilityShifted,
    verificationDetails: threeDSecureInfo && threeDSecureInfo.verificationDetails
  });

  return Promise.resolve(response);
};

BaseFramework.prototype._setupV1Bus = function (options) {
  var parentURL = window.location.href.split('#')[0];
  var lookupResponse = options.lookupResponse;
  var bus = new Bus({
    channel: uuid(),
    merchantUrl: window.location.href
  });
  var authenticationCompleteBaseUrl = this._assetsUrl + '/html/three-d-secure-authentication-complete-frame.html?channel=' + encodeURIComponent(bus.channel) + '&';

  bus.on(Bus.events.CONFIGURATION_REQUEST, function (reply) {
    reply({
      acsUrl: lookupResponse.acsUrl,
      pareq: lookupResponse.pareq,
      termUrl: lookupResponse.termUrl + '&three_d_secure_version=' + VERSION + '&authentication_complete_base_url=' + encodeURIComponent(authenticationCompleteBaseUrl),
      md: lookupResponse.md,
      parentUrl: parentURL
    });
  });

  bus.on(events.AUTHENTICATION_COMPLETE, options.handleAuthResponse);

  return bus;
};

BaseFramework.prototype._setupV1Iframe = function (options) {
  var url = this._assetsUrl + '/html/three-d-secure-bank-frame' + useMin(this._isDebug) + '.html?showLoader=' + options.showLoader;
  var bankIframe = iFramer({
    src: url,
    height: IFRAME_HEIGHT,
    width: IFRAME_WIDTH,
    name: constants.LANDING_FRAME_NAME + '_' + this._v1Bus.channel,
    title: '3D Secure Authorization Frame'
  });

  return bankIframe;
};

BaseFramework.prototype._setupV1Elements = function (options) {
  this._v1Bus = this._setupV1Bus(options);
  this._v1Iframe = this._setupV1Iframe(options);
};

BaseFramework.prototype._teardownV1Elements = function () {
  if (this._v1Bus) {
    this._v1Bus.teardown();
    this._v1Bus = null;
  }

  if (this._v1Iframe && this._v1Iframe.parentNode) {
    this._v1Iframe.parentNode.removeChild(this._v1Iframe);
    this._v1Iframe = null;
  }

  if (this._onV1Keyup) {
    document.removeEventListener('keyup', this._onV1Keyup);
    this._onV1Keyup = null;
  }
};

BaseFramework.prototype.teardown = function () {
  analytics.sendEvent(this._createPromise, 'three-d-secure.teardown-completed');

  this._teardownV1Elements();

  return Promise.resolve();
};

module.exports = BaseFramework;

},{"../../../lib/analytics":107,"../../../lib/assign":109,"../../../lib/braintree-error":112,"../../../lib/bus":115,"../../../lib/promise":146,"../../../lib/use-min":148,"../../../lib/vendor/uuid":150,"../../shared/constants":182,"../../shared/errors":183,"../../shared/events":184,"@braintree/event-emitter":21,"@braintree/extended-promise":22,"@braintree/iframer":23}],174:[function(_dereq_,module,exports){
'use strict';
// NEXT_MAJOR_VERSION drop support for Bootstrap framework,
// recomend using inline frame version and putting it in
// the merchant's own bootstrap modal

var SongbirdFramework = _dereq_('./songbird');

function Bootstrap3ModalFramework(options) {
  SongbirdFramework.call(this, options);
}

Bootstrap3ModalFramework.prototype = Object.create(SongbirdFramework.prototype, {
  constructor: SongbirdFramework
});

Bootstrap3ModalFramework.prototype._createV1IframeModalElement = function (iframe) {
  var modal = document.createElement('div');

  modal.innerHTML = '<div class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="CCAFrameModal-label" aria-hidden="true" style="display: block;">' +
    '<div class="modal-dialog" style="width:440px;z-index:999999;">' +
      '<div class="modal-content">' +
        '<div class="modal-body" data-braintree-v1-fallback-iframe-container>' +
          '<button type="button" data-braintree-v1-fallback-close-button class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div data-braintree-v1-fallback-backdrop style="' +
      'position: fixed;' +
      'cursor: pointer;' +
      'z-index: 999998;' +
      'top: 0;' +
      'left: 0;' +
      'width: 100%;' +
      'height: 100%;' +
    '"></div>' +
  '</div>';

  modal.querySelector('[data-braintree-v1-fallback-iframe-container]').appendChild(iframe);

  return modal;
};

Bootstrap3ModalFramework.prototype._createCardinalConfigurationOptions = function (setupOptions) {
  var options = SongbirdFramework.prototype._createCardinalConfigurationOptions.call(this, setupOptions);

  options.payment.framework = 'bootstrap3';

  return options;
};

module.exports = Bootstrap3ModalFramework;

},{"./songbird":179}],175:[function(_dereq_,module,exports){
'use strict';

var SongbirdFramework = _dereq_('./songbird');

function CardinalModalFramework(options) {
  SongbirdFramework.call(this, options);
}

CardinalModalFramework.prototype = Object.create(SongbirdFramework.prototype, {
  constructor: SongbirdFramework
});

CardinalModalFramework.prototype._createV1IframeModalElement = function (iframe) {
  var modal = document.createElement('div');
  var addCloseButton = Boolean(this._createOptions &&
    this._createOptions.cardinalSDKConfig &&
    this._createOptions.cardinalSDKConfig.payment &&
    this._createOptions.cardinalSDKConfig.payment.displayExitButton);

  modal.innerHTML = '<div style="' +
    'position: fixed;' +
    'z-index: 999999;' +
    'top: 50%;' +
    'left: 50%;' +
    'padding: 24px 20px;' +
    'transform: translate(-50%,-50%);' +
    'border-radius: 2px;' +
    'background: #fff;' +
    'max-width: 100%;' +
    'overflow: auto;' +
  '">' +
    '<div>' +
      '<button data-braintree-v1-fallback-close-button ' +
        'style="' +
          'font-family: Helvetica,Arial,sans-serif;' +
          'font-size: 25px;' +
          'line-height: 12px;' +
          'position: absolute;' +
          'top: 2px;' +
          'right: 0px;' +
          'cursor: pointer;' +
          'color: #999;' +
          'border: 0;' +
          'outline: none;' +
          'background: none;' +
        '" ' +
        'onMouseOver="this.style.color=\'#000\'" ' +
        'onMouseOut="this.style.color=\'#999\'"' +
      '>×</button>' +
    '</div>' +
    // iframe container
    '<div data-braintree-v1-fallback-iframe-container style="' +
      'height: 400px;' +
    '"></div>' +
  '</div>' +
  // modal backdrop
  '<div data-braintree-v1-fallback-backdrop style="' +
    'position: fixed;' +
    'z-index: 999998;' +
    'cursor: pointer;' +
    'top: 0;' +
    'left: 0;' +
    'width: 100%;' +
    'height: 100%;' +
    'transition: opacity 1ms ease;' +
    'background: rgba(0,0,0,.6);' +
  '"></div>';

  if (!addCloseButton) {
    modal.querySelector('[data-braintree-v1-fallback-close-button]').style.display = 'none';
  }
  modal.querySelector('[data-braintree-v1-fallback-iframe-container]').appendChild(iframe);

  return modal;
};

module.exports = CardinalModalFramework;

},{"./songbird":179}],176:[function(_dereq_,module,exports){
'use strict';

var LegacyFramework = _dereq_('./legacy');
var CardinalModalFramework = _dereq_('./cardinal-modal');
var Bootstrap3ModalFramework = _dereq_('./bootstrap3-modal');
var InlineIframeFramework = _dereq_('./inline-iframe');

module.exports = {
  legacy: LegacyFramework,
  'cardinal-modal': CardinalModalFramework,
  'bootstrap3-modal': Bootstrap3ModalFramework,
  'inline-iframe': InlineIframeFramework
};

},{"./bootstrap3-modal":174,"./cardinal-modal":175,"./inline-iframe":177,"./legacy":178}],177:[function(_dereq_,module,exports){
'use strict';

var SongbirdFramework = _dereq_('./songbird');
var BraintreeError = _dereq_('../../../lib/braintree-error');
var errors = _dereq_('../../shared/errors');
var enumerate = _dereq_('../../../lib/enumerate');

function InlineIframeFramework(options) {
  SongbirdFramework.call(this, options);
}

InlineIframeFramework.prototype = Object.create(SongbirdFramework.prototype, {
  constructor: SongbirdFramework
});

InlineIframeFramework.events = enumerate([
  'AUTHENTICATION_IFRAME_AVAILABLE'
], 'inline-iframe-framework:');

InlineIframeFramework.prototype.setUpEventListeners = function (reply) {
  SongbirdFramework.prototype.setUpEventListeners.call(this, reply);

  this.on(InlineIframeFramework.events.AUTHENTICATION_IFRAME_AVAILABLE, function (payload, next) {
    reply('authentication-iframe-available', payload, next);
  });
};

InlineIframeFramework.prototype._createCardinalConfigurationOptions = function (setupOptions) {
  var options = SongbirdFramework.prototype._createCardinalConfigurationOptions.call(this, setupOptions);

  options.payment.framework = 'inline';

  return options;
};

InlineIframeFramework.prototype._addV1IframeToPage = function () {
  this._emit(InlineIframeFramework.events.AUTHENTICATION_IFRAME_AVAILABLE, {
    element: this._v1Modal
  }, function () {
    // NOOP
  });
};

InlineIframeFramework.prototype._setupFrameworkSpecificListeners = function () {
  this.setCardinalListener('ui.inline.setup', this._onInlineSetup.bind(this));
};

InlineIframeFramework.prototype._onInlineSetup = function (htmlTemplate, details, resolve, reject) {
  var container, hasError;

  if (!htmlTemplate || !details) {
    hasError = true;
  } else if (details.paymentType !== 'CCA') {
    hasError = true;
  } else if (!(details.data.mode === 'suppress' || details.data.mode === 'static')) {
    hasError = true;
  }

  if (hasError) {
    reject(new BraintreeError(errors.THREEDS_INLINE_IFRAME_DETAILS_INCORRECT));

    return;
  }

  container = document.createElement('div');
  container.innerHTML = htmlTemplate;

  if (details.data.mode === 'suppress') {
    container.style.display = 'none';
    document.body.appendChild(container);
    resolve();
  } else if (details.data.mode === 'static') {
    this._emit(InlineIframeFramework.events.AUTHENTICATION_IFRAME_AVAILABLE, {
      element: container
    }, function () {
      resolve();
    });
  }
};

module.exports = InlineIframeFramework;

},{"../../../lib/braintree-error":112,"../../../lib/enumerate":125,"../../shared/errors":183,"./songbird":179}],178:[function(_dereq_,module,exports){
'use strict';

var BaseFramework = _dereq_('./base');
var deferred = _dereq_('../../../lib/deferred');

function LegacyFramework(options) {
  BaseFramework.call(this, options);
}

LegacyFramework.prototype = Object.create(BaseFramework.prototype, {
  constructor: LegacyFramework
});

LegacyFramework.prototype.setUpEventListeners = function () {
  // noop
};

LegacyFramework.prototype.transformV1CustomerBillingAddress = function (customer) {
  customer.billingAddress.line1 = customer.billingAddress.streetAddress;
  customer.billingAddress.line2 = customer.billingAddress.extendedAddress;
  customer.billingAddress.city = customer.billingAddress.locality;
  customer.billingAddress.state = customer.billingAddress.region;
  customer.billingAddress.countryCode = customer.billingAddress.countryCodeAlpha2;
  delete customer.billingAddress.streetAddress;
  delete customer.billingAddress.extendedAddress;
  delete customer.billingAddress.locality;
  delete customer.billingAddress.region;
  delete customer.billingAddress.countryCodeAlpha2;

  return customer;
};

LegacyFramework.prototype._createIframe = function (options) {
  var self = this;

  this._setupV1Elements({
    lookupResponse: options.lookupResponse,
    showLoader: options.showLoader,
    handleAuthResponse: function (data) {
      self._handleAuthResponse(data, options);
    }
  });

  return this._v1Iframe;
};

LegacyFramework.prototype._handleAuthResponse = function (data, options) {
  this._v1Bus.teardown();

  options.removeFrame();

  // This also has to be in a setTimeout so it executes after the `removeFrame`.
  deferred(function () {
    this._handleV1AuthResponse(data);
  }.bind(this))();
};

LegacyFramework.prototype._checkForFrameworkSpecificVerifyCardErrors = function (options) {
  var errorOption;

  if (typeof options.addFrame !== 'function') {
    errorOption = 'an addFrame function';
  } else if (typeof options.removeFrame !== 'function') {
    errorOption = 'a removeFrame function';
  }

  return errorOption;
};

LegacyFramework.prototype._formatVerifyCardOptions = function (options) {
  var modifiedOptions = BaseFramework.prototype._formatVerifyCardOptions.call(this, options);

  modifiedOptions.addFrame = deferred(options.addFrame);
  modifiedOptions.removeFrame = deferred(options.removeFrame);
  modifiedOptions.showLoader = options.showLoader !== false;

  return modifiedOptions;
};

LegacyFramework.prototype._formatLookupData = function (options) {
  var self = this;

  return BaseFramework.prototype._formatLookupData.call(this, options).then(function (data) {
    if (options.customer && options.customer.billingAddress) {
      data.customer = self.transformV1CustomerBillingAddress(options.customer);
    }

    return data;
  });
};

LegacyFramework.prototype._presentChallenge = function (lookupResponse, options) {
  options.addFrame(null, this._createIframe({
    showLoader: options.showLoader,
    lookupResponse: lookupResponse.lookup,
    removeFrame: options.removeFrame
  }));
};

module.exports = LegacyFramework;

},{"../../../lib/deferred":123,"./base":173}],179:[function(_dereq_,module,exports){
'use strict';

var BaseFramework = _dereq_('./base');
var assign = _dereq_('../../../lib/assign').assign;
var deferred = _dereq_('../../../lib/deferred');
var BraintreeError = _dereq_('../../../lib/braintree-error');
var convertToBraintreeError = _dereq_('../../../lib/convert-to-braintree-error');
var analytics = _dereq_('../../../lib/analytics');
var assets = _dereq_('../../../lib/assets');
var errors = _dereq_('../../shared/errors');
var enumerate = _dereq_('../../../lib/enumerate');
var constants = _dereq_('../../shared/constants');
var Promise = _dereq_('../../../lib/promise');
var ExtendedPromise = _dereq_('@braintree/extended-promise');

var INTEGRATION_TIMEOUT_MS = _dereq_('../../../lib/constants').INTEGRATION_TIMEOUT_MS;
var PLATFORM = _dereq_('../../../lib/constants').PLATFORM;
var VERSION = "3.63.0";

function SongbirdFramework(options) {
  BaseFramework.call(this, options);

  this._useV1Fallback = false;
  this._clientMetadata = {
    requestedThreeDSecureVersion: '2',
    sdkVersion: PLATFORM + '/' + VERSION
  };
  this._getDfReferenceIdPromisePlus = new ExtendedPromise();
  this.setupSongbird(options);
  this._cardinalEvents = [];
}

SongbirdFramework.prototype = Object.create(BaseFramework.prototype, {
  constructor: SongbirdFramework
});

SongbirdFramework.events = enumerate([
  'ON_LOOKUP_COMPLETE'
], 'songbird-framework:');

SongbirdFramework.prototype.setUpEventListeners = function (reply) {
  this.on(SongbirdFramework.events.ON_LOOKUP_COMPLETE, function (data, next) {
    reply('lookup-complete', data, next);
  });
};

SongbirdFramework.prototype.prepareLookup = function (options) {
  var data = assign({}, options);
  var self = this;

  return this.getDfReferenceId().then(function (id) {
    data.dfReferenceId = id;
  }).then(function () {
    return self._triggerCardinalBinProcess(options.bin);
  }).catch(function () {
    // catch and ignore errors from looking up
    // df reference and Cardinal bin process
  }).then(function () {
    return self._waitForClient();
  }).then(function () {
    data.clientMetadata = self._clientMetadata;
    data.authorizationFingerprint = self._client.getConfiguration().authorizationFingerprint;
    data.braintreeLibraryVersion = 'braintree/web/' + VERSION;

    return data;
  });
};

SongbirdFramework.prototype.initializeChallengeWithLookupResponse = function (lookupResponse, options) {
  return this.setupSongbird().then(function () {
    return BaseFramework.prototype.initializeChallengeWithLookupResponse.call(this, lookupResponse, options);
  }.bind(this));
};

SongbirdFramework.prototype._initiateV1Fallback = function (errorType) {
  this._useV1Fallback = true;
  analytics.sendEvent(this._createPromise, 'three-d-secure.v1-fallback.' + errorType);
  this._songbirdPromise.resolve();
};

SongbirdFramework.prototype._triggerCardinalBinProcess = function (bin) {
  var self = this;
  var issuerStartTime = Date.now();

  if (!bin) {
    // skip bin lookup because bin wasn't passed in
    return Promise.resolve();
  }

  return window.Cardinal.trigger('bin.process', bin).then(function (binResults) {
    self._clientMetadata.issuerDeviceDataCollectionTimeElapsed = Date.now() - issuerStartTime;
    self._clientMetadata.issuerDeviceDataCollectionResult = binResults && binResults.Status;
  });
};

SongbirdFramework.prototype.transformBillingAddress = function (additionalInformation, billingAddress) {
  if (billingAddress) {
    // map from public API to the API that the Gateway expects
    extractAddressData(billingAddress, additionalInformation, 'billing');
    additionalInformation.billingPhoneNumber = billingAddress.phoneNumber;
    additionalInformation.billingGivenName = billingAddress.givenName;
    additionalInformation.billingSurname = billingAddress.surname;
  }

  return additionalInformation;
};

SongbirdFramework.prototype.transformShippingAddress = function (additionalInformation) {
  var shippingAddress = additionalInformation.shippingAddress;

  if (shippingAddress) {
    // map from public API to the API that the Gateway expects
    extractAddressData(shippingAddress, additionalInformation, 'shipping');

    delete additionalInformation.shippingAddress;
  }

  return additionalInformation;
};

SongbirdFramework.prototype._createV1IframeModalElement = function (iframe) {
  var modal = document.createElement('div');

  modal.innerHTML = '<div data-braintree-v1-fallback-iframe-container="true" style="' +
    'height: 400px;' +
  '"></div>';
  modal.querySelector('[data-braintree-v1-fallback-iframe-container="true"]').appendChild(iframe);

  return modal;
};

SongbirdFramework.prototype._createV1IframeModal = function (iframe) {
  var modal = this._createV1IframeModalElement(iframe);
  var btn = modal.querySelector('[data-braintree-v1-fallback-close-button]');
  var backdrop = modal.querySelector('[data-braintree-v1-fallback-backdrop]');
  var self = this;

  function closeHandler() {
    modal.parentNode.removeChild(modal);
    self.cancelVerifyCard(errors.THREEDS_CARDINAL_SDK_CANCELED);
    document.removeEventListener('keyup', self._onV1Keyup);
    self._onV1Keyup = null;
  }

  this._onV1Keyup = function (e) {
    if (e.key !== 'Escape') {
      return;
    }

    if (!modal.parentNode) {
      // modal not on page
      return;
    }

    closeHandler();
  };

  if (btn) {
    btn.addEventListener('click', closeHandler);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeHandler);
  }

  document.addEventListener('keyup', this._onV1Keyup);

  return modal;
};

SongbirdFramework.prototype._addV1IframeToPage = function () {
  document.body.appendChild(this._v1Modal);
};

SongbirdFramework.prototype._handleAuthResponseFromV1Fallback = function (data) {
  this._teardownV1Elements();
  this._v1Modal.parentNode.removeChild(this._v1Modal);
  this._handleV1AuthResponse(data);
};

SongbirdFramework.prototype._presentChallengeWithV1Fallback = function (lookupResponse) {
  var self = this;

  this._setupV1Elements({
    lookupResponse: lookupResponse,
    showLoader: true,
    handleAuthResponse: function (data) {
      self._handleAuthResponseFromV1Fallback(data);
    }
  });
  this._v1Modal = this._createV1IframeModal(this._v1Iframe);
  this._addV1IframeToPage();
};

SongbirdFramework.prototype.setupSongbird = function (setupOptions) {
  var self = this;
  var startTime = Date.now();

  if (this._songbirdPromise) {
    return this._songbirdPromise;
  }

  setupOptions = setupOptions || {};

  this._songbirdPromise = new ExtendedPromise();
  this._v2SetupFailureReason = 'reason-unknown';

  self._loadCardinalScript(setupOptions).then(function () {
    if (!window.Cardinal) {
      self._v2SetupFailureReason = 'cardinal-global-unavailable';

      return Promise.reject(new BraintreeError(errors.THREEDS_CARDINAL_SDK_SETUP_FAILED));
    }

    return self._configureCardinalSdk({
      setupOptions: setupOptions,
      setupStartTime: startTime
    });
  }).catch(function (err) {
    var error = convertToBraintreeError(err, {
      type: errors.THREEDS_CARDINAL_SDK_SETUP_FAILED.type,
      code: errors.THREEDS_CARDINAL_SDK_SETUP_FAILED.code,
      message: errors.THREEDS_CARDINAL_SDK_SETUP_FAILED.message
    });

    self._getDfReferenceIdPromisePlus.reject(error);

    window.clearTimeout(self._songbirdSetupTimeoutReference);
    analytics.sendEvent(self._client, 'three-d-secure.cardinal-sdk.init.setup-failed');
    self._initiateV1Fallback('cardinal-sdk-setup-failed.' + self._v2SetupFailureReason);
  });

  return this._songbirdPromise;
};

SongbirdFramework.prototype._configureCardinalSdk = function (config) {
  var self = this;

  return this._waitForClient().then(function () {
    var jwt = self._client.getConfiguration().gatewayConfiguration.threeDSecure.cardinalAuthenticationJWT;
    var setupOptions = config.setupOptions;
    var setupStartTime = config.setupStartTime;
    var cardinalConfiguration = self._createCardinalConfigurationOptions(setupOptions);

    self.setCardinalListener('payments.setupComplete', self._createPaymentsSetupCompleteCallback());

    self._setupFrameworkSpecificListeners();

    window.Cardinal.configure(cardinalConfiguration);

    window.Cardinal.setup('init', {
      jwt: jwt
    });

    self._clientMetadata.cardinalDeviceDataCollectionTimeElapsed = Date.now() - setupStartTime;

    self.setCardinalListener('payments.validated', self._createPaymentsValidatedCallback());
  }).catch(function (err) {
    self._v2SetupFailureReason = 'cardinal-configuration-threw-error';

    return Promise.reject(err);
  });
};

SongbirdFramework.prototype.setCardinalListener = function (eventName, cb) {
  this._cardinalEvents.push(eventName);
  window.Cardinal.on(eventName, cb);
};

SongbirdFramework.prototype._setupFrameworkSpecificListeners = function () {
  // noop
};

SongbirdFramework.prototype._createCardinalConfigurationOptions = function (setupOptions) {
  var cardinalConfiguration = setupOptions.cardinalSDKConfig || {};
  var paymentSettings = cardinalConfiguration.payment || {};

  if (!cardinalConfiguration.logging && setupOptions.loggingEnabled) {
    cardinalConfiguration.logging = {
      level: 'verbose'
    };
  }

  cardinalConfiguration.payment = {};

  if (paymentSettings.hasOwnProperty('displayLoading')) {
    cardinalConfiguration.payment.displayLoading = paymentSettings.displayLoading;
  }
  if (paymentSettings.hasOwnProperty('displayExitButton')) {
    cardinalConfiguration.payment.displayExitButton = paymentSettings.displayExitButton;
  }

  return cardinalConfiguration;
};

SongbirdFramework.prototype._loadCardinalScript = function (setupOptions) {
  var self = this;
  var scriptSource = constants.CARDINAL_SCRIPT_SOURCE.sandbox;

  return this._waitForClient().then(function () {
    var isProduction = self._client.getConfiguration().gatewayConfiguration.environment === 'production';

    self._songbirdSetupTimeoutReference = window.setTimeout(function () {
      analytics.sendEvent(self._client, 'three-d-secure.cardinal-sdk.init.setup-timeout');
      self._initiateV1Fallback('cardinal-sdk-setup-timeout');
    }, setupOptions.timeout || INTEGRATION_TIMEOUT_MS);

    if (isProduction) {
      scriptSource = constants.CARDINAL_SCRIPT_SOURCE.production;
    }

    return assets.loadScript({src: scriptSource});
  }).catch(function (err) {
    self._v2SetupFailureReason = 'songbird-js-failed-to-load';

    return Promise.reject(convertToBraintreeError(err, errors.THREEDS_CARDINAL_SDK_SCRIPT_LOAD_FAILED));
  });
};

SongbirdFramework.prototype._createPaymentsSetupCompleteCallback = function () {
  var self = this;

  return function (data) {
    self._getDfReferenceIdPromisePlus.resolve(data.sessionId);

    window.clearTimeout(self._songbirdSetupTimeoutReference);
    analytics.sendEvent(self._createPromise, 'three-d-secure.cardinal-sdk.init.setup-completed');

    self._songbirdPromise.resolve();
  };
};

SongbirdFramework.prototype.getDfReferenceId = function () {
  return this._getDfReferenceIdPromisePlus;
};

SongbirdFramework.prototype._performJWTValidation = function (jwt) {
  var nonce = this._lookupPaymentMethod.nonce;
  var url = 'payment_methods/' + nonce + '/three_d_secure/authenticate_from_jwt';
  var self = this;

  analytics.sendEvent(self._createPromise, 'three-d-secure.verification-flow.upgrade-payment-method.started');

  return this._waitForClient().then(function () {
    return self._client.request({
      method: 'post',
      endpoint: url,
      data: {
        jwt: jwt,
        paymentMethodNonce: nonce
      }
    });
  }).then(function (response) {
    var paymentMethod = response.paymentMethod || self._lookupPaymentMethod;
    var formattedResponse = self._formatAuthResponse(paymentMethod, response.threeDSecureInfo);

    analytics.sendEvent(self._client, 'three-d-secure.verification-flow.upgrade-payment-method.succeeded');

    return Promise.resolve(formattedResponse);
  }).catch(function (err) {
    var error = new BraintreeError({
      type: errors.THREEDS_JWT_AUTHENTICATION_FAILED.type,
      code: errors.THREEDS_JWT_AUTHENTICATION_FAILED.code,
      message: errors.THREEDS_JWT_AUTHENTICATION_FAILED.message,
      details: {
        originalError: err
      }
    });

    analytics.sendEvent(self._client, 'three-d-secure.verification-flow.upgrade-payment-method.errored');

    return Promise.reject(error);
  });
};

SongbirdFramework.prototype._createPaymentsValidatedCallback = function () {
  var self = this;

  /**
   * @param {object} data Response Data
   * @see {@link https://cardinaldocs.atlassian.net/wiki/spaces/CC/pages/98315/Response+Objects#ResponseObjects-ObjectDefinition}
   * @param {string} data.ActionCode The resulting state of the transaction.
   * @param {boolean} data.Validated Represents whether transaction was successfully or not.
   * @param {number} data.ErrorNumber A non-zero value represents the error encountered while attempting the process the message request.
   * @param {string} data.ErrorDescription Application error description for the associated error number.
   * @param {string} validatedJwt Response JWT
   * @returns {void}
   * */
  return function (data, validatedJwt) {
    var formattedError;

    analytics.sendEvent(self._createPromise, 'three-d-secure.verification-flow.cardinal-sdk.action-code.' + data.ActionCode.toLowerCase());

    if (!self._verifyCardPromisePlus) {
      self._initiateV1Fallback('cardinal-sdk-setup-error.number-' + data.ErrorNumber);

      return;
    }

    switch (data.ActionCode) {
      // Handle these scenarios based on liability shift information in the response.
      case 'SUCCESS':
      case 'NOACTION':
      case 'FAILURE':
        self._performJWTValidation(validatedJwt)
          .then(function (result) {
            self._verifyCardPromisePlus.resolve(result);
          })
          .catch(function (err) {
            self._verifyCardPromisePlus.reject(err);
          });
        break;

      case 'ERROR':
        analytics.sendEvent(self._createPromise, 'three-d-secure.verification-flow.cardinal-sdk-error.' + data.ErrorNumber);

        switch (data.ErrorNumber) {
          case 10001: // Cardinal Docs: Timeout when sending an /Init message
          case 10002: // Cardinal Docs: Timeout when sending an /Start message
            formattedError = new BraintreeError(errors.THREEDS_CARDINAL_SDK_SETUP_TIMEDOUT);
            break;
          case 10003: // Cardinal Docs: Timeout when sending an /Validate message. Although this code exists we do not yet have a flow where a validate message is sent to Midas. This error should not yet be triggered
          case 10007: // Cardinal Docs: Timeout when sending an /Confirm message
          case 10009: // Cardinal Docs: Timeout when sending an /Continue message
            formattedError = new BraintreeError(errors.THREEDS_CARDINAL_SDK_RESPONSE_TIMEDOUT);
            break;
          case 10005: // Cardinal Docs: Songbird was started without a request jwt.
          case 10006: // Cardinal Docs: This is a general configuration error. The description is populated by the specific configuration error that caused the error.
            formattedError = new BraintreeError(errors.THREEDS_CARDINAL_SDK_BAD_CONFIG);
            break;
          case 10008: // Cardinal Docs: Songbird was initialized without a merchant JWT.
          case 10010: // Cardinal Docs: The response JWT was
            formattedError = new BraintreeError(errors.THREEDS_CARDINAL_SDK_BAD_JWT);
            break;
          case 10011:
            // This may never get called, according to the Cardinal docs:
            // The user has canceled the transaction. This is generally found in alternative
            // payments that supply a cancel button on the payment brand side.
            analytics.sendEvent(self._createPromise, 'three-d-secure.verification-flow.canceled');
            formattedError = new BraintreeError(errors.THREEDS_CARDINAL_SDK_CANCELED);
            break;
          default:
            formattedError = new BraintreeError(errors.THREEDS_CARDINAL_SDK_ERROR);
        }

        formattedError.details = {
          originalError: {
            code: data.ErrorNumber,
            description: data.ErrorDescription
          }
        };

        self._verifyCardPromisePlus.reject(formattedError);
        break;

      default:
    }
  };
};

SongbirdFramework.prototype._checkForVerifyCardError = function (options, privateOptions) {
  return BaseFramework.prototype._checkForVerifyCardError.call(this, options, privateOptions);
};

SongbirdFramework.prototype._checkForFrameworkSpecificVerifyCardErrors = function (options, privateOptions) {
  var errorOption;

  if (typeof options.onLookupComplete !== 'function' && !privateOptions.ignoreOnLookupCompleteRequirement) {
    errorOption = 'an onLookupComplete function';
  }

  return errorOption;
};

SongbirdFramework.prototype._formatVerifyCardOptions = function (options) {
  var modifiedOptions = BaseFramework.prototype._formatVerifyCardOptions.call(this, options);
  var additionalInformation = modifiedOptions.additionalInformation || {};

  additionalInformation = this.transformBillingAddress(additionalInformation, options.billingAddress);
  additionalInformation = this.transformShippingAddress(additionalInformation);

  if (options.onLookupComplete) {
    modifiedOptions.onLookupComplete = deferred(options.onLookupComplete);
  }
  if (options.email) {
    additionalInformation.email = options.email;
  }
  if (options.mobilePhoneNumber) {
    additionalInformation.mobilePhoneNumber = options.mobilePhoneNumber;
  }

  modifiedOptions.additionalInformation = additionalInformation;

  return modifiedOptions;
};

SongbirdFramework.prototype._onLookupComplete = function (lookupResponse, options) {
  var self = this;

  return BaseFramework.prototype._onLookupComplete.call(this, lookupResponse).then(function (response) {
    return new Promise(function (resolve, reject) {
      // NEXT_MAJOR_VERSION format this response object to look like the mobile sdk response
      // which is basically the lookup param at the top level with some additional accessors
      response.requiresUserAuthentication = Boolean(response.lookup && response.lookup.acsUrl);

      function next() {
        resolve(response);
      }

      self._verifyCardPromisePlus.catch(reject);

      // prefer the callback when it is passed into the verifyCard options
      if (options.onLookupComplete) {
        options.onLookupComplete(response, next);
      } else {
        self._emit(SongbirdFramework.events.ON_LOOKUP_COMPLETE, response, next);
      }
    });
  });
};

SongbirdFramework.prototype._presentChallenge = function (lookupResponse) {
  if (this._useV1Fallback) {
    this._presentChallengeWithV1Fallback(lookupResponse.lookup);

    return;
  }

  // set up listener for ref id to call out to bt before calling verify callback
  window.Cardinal.continue('cca',
    {
      AcsUrl: lookupResponse.lookup.acsUrl,
      Payload: lookupResponse.lookup.pareq
    },
    {
      OrderDetails: {TransactionId: lookupResponse.lookup.transactionId}
    }
  );
};

SongbirdFramework.prototype._formatLookupData = function (options) {
  var self = this;

  return BaseFramework.prototype._formatLookupData.call(this, options).then(function (data) {
    data.additionalInfo = options.additionalInformation;

    if (options.challengeRequested) {
      data.challengeRequested = options.challengeRequested;
    }
    if (options.exemptionRequested) {
      data.exemptionRequested = options.exemptionRequested;
    }
    if (options.bin) {
      data.bin = options.bin;
    }

    return self.prepareLookup(data);
  });
};

SongbirdFramework.prototype.cancelVerifyCard = function (verifyCardError) {
  var self = this;

  return BaseFramework.prototype.cancelVerifyCard.call(this).then(function (response) {
    if (self._verifyCardPromisePlus) {
      verifyCardError = verifyCardError || new BraintreeError(errors.THREEDS_VERIFY_CARD_CANCELED_BY_MERCHANT);

      self._verifyCardPromisePlus.reject(verifyCardError);
    }

    return response;
  });
};

SongbirdFramework.prototype.teardown = function () {
  if (window.Cardinal) {
    this._cardinalEvents.forEach(function (eventName) {
      window.Cardinal.off(eventName);
    });
  }

  // we intentionally do not remove the Cardinal SDK
  // from the page when tearing down. Subsequent
  // component creations will be faster because
  // the asset is already on the page

  return BaseFramework.prototype.teardown.call(this);
};

function extractAddressData(source, target, prefix) {
  target[prefix + 'Line1'] = source.streetAddress;
  target[prefix + 'Line2'] = source.extendedAddress;
  target[prefix + 'Line3'] = source.line3;
  target[prefix + 'City'] = source.locality;
  target[prefix + 'State'] = source.region;
  target[prefix + 'PostalCode'] = source.postalCode;
  target[prefix + 'CountryCode'] = source.countryCodeAlpha2;
}

module.exports = SongbirdFramework;

},{"../../../lib/analytics":107,"../../../lib/assets":108,"../../../lib/assign":109,"../../../lib/braintree-error":112,"../../../lib/constants":117,"../../../lib/convert-to-braintree-error":119,"../../../lib/deferred":123,"../../../lib/enumerate":125,"../../../lib/promise":146,"../../shared/constants":182,"../../shared/errors":183,"./base":173,"@braintree/extended-promise":22}],180:[function(_dereq_,module,exports){
'use strict';

var wrapPromise = _dereq_('@braintree/wrap-promise');
var methods = _dereq_('../../lib/methods');
var convertMethodsToError = _dereq_('../../lib/convert-methods-to-error');
var EventEmitter = _dereq_('@braintree/event-emitter');
var FRAMEWORKS = _dereq_('./frameworks');

/**
 * @deprecated
 * @callback ThreeDSecure~addFrameCallback
 * @param {?BraintreeError} [err] `null` or `undefined` if there was no error.
 * @param {HTMLIFrameElement} iframe An iframe element containing the bank's authentication page that you must put on your page.
 * @description **Deprecated** The callback used for options.addFrame in 3DS 1.0's {@link ThreeDSecure#verifyCard|verifyCard}.
 * @returns {void}
 */

/**
 * @deprecated
 * @callback ThreeDSecure~removeFrameCallback
 * @description **Deprecated** The callback used for options.removeFrame in 3DS 1.0's {@link ThreeDSecure#verifyCard|verifyCard}.
 * @returns {void}
 */

/**
 * @deprecated
 * @typedef {object} ThreeDSecure~verifyCardCustomerObject
 * @property {string} [customer.mobilePhoneNumber] The mobile phone number used for verification. Only numbers; remove dashes, parenthesis and other characters.
 * @property {string} [customer.email] The email used for verification.
 * @property {string} [customer.shippingMethod] The 2-digit string indicating the shipping method chosen for the transaction.
 * @property {string} [customer.billingAddress.firstName] The first name associated with the address.
 * @property {string} [customer.billingAddress.lastName] The last name associated with the address.
 * @property {string} [customer.billingAddress.streetAddress] Line 1 of the Address (eg. number, street, etc).
 * @property {string} [customer.billingAddress.extendedAddress] Line 2 of the Address (eg. suite, apt #, etc.).
 * @property {string} [customer.billingAddress.locality] The locality (city) name associated with the address.
 * @property {string} [customer.billingAddress.region] The 2 letter code for US states, and the equivalent for other countries.
 * @property {string} [customer.billingAddress.postalCode] The zip code or equivalent for countries that have them.
 * @property {string} [customer.billingAddress.countryCodeAlpha2] The 2 character country code.
 * @property {string} [customer.billingAddress.phoneNumber] The phone number associated with the address. Only numbers; remove dashes, parenthesis and other characters.
 * @description **Deprecated** Optional customer information to be passed to 3DS 1.0 for verification.
 */

/**
 * @typedef {object} ThreeDSecure~verifyPayload
 * @property {string} nonce The new payment method nonce produced by the 3D Secure lookup. The original nonce passed into {@link ThreeDSecure#verifyCard|verifyCard} was consumed. This new nonce should be used to transact on your server.
 * @property {object} details Additional account details.
 * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
 * @property {string} details.lastFour Last four digits of card number.
 * @property {string} details.lastTwo Last two digits of card number.
 * @property {string} description A human-readable description.
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
 * @property {boolean} liabilityShiftPossible *Deprecated:* Use `threeDSecureInfo.liabilityShiftPossible` instead.
 * @property {boolean} liabilityShifted *Deprecated:* Use `threeDSecureInfo.liabilityShifted` instead.
 * @property {object} threeDSecureInfo 3DS information about the card.
 * @property {boolean} threeDSecureInfo.liabilityShiftPossible Indicates whether the card was eligible for 3D Secure.
 * @property {boolean} threeDSecureInfo.liabilityShifted Indicates whether the liability for fraud has been shifted away from the merchant.
 */

/**
 * @typedef {string} ThreeDSecure~prepareLookupPayload The client data to pass on when doing a server side lookup call.
 */

/**
 * @typedef {object} ThreeDSecure~verificationData
 * @property {boolean} requiresUserAuthentication When `true`, the user will be presented with a 3D Secure challenge when calling `next` in the {@link ThreeDSecure#event:lookup-complete|`lookup-complete` event}.
 * @property {object} threeDSecureInfo Contains liability shift details.
 * @property {boolean} threeDSecureInfo.liabilityShiftPossible Indicates whether the card was eligible for 3D Secure.
 * @property {boolean} threeDSecureInfo.liabilityShifted Indicates whether the liability for fraud has been shifted away from the merchant.
 * @property {object} paymentMethod A {@link ThreeDSecure~verifyPayload|verifyPayload} object.
 * @property {object} lookup Details about the 3D Secure lookup.
 * @property {string} lookup.threeDSecureVersion The version of 3D Secure that will be used for the 3D Secure challenge.
*/

/**
 * @typedef {object} ThreeDSecure~billingAddress
 * @property {string} [givenName] The first name associated with the billing address.
 * @property {string} [surname] The last name associated with the billing address.
 * @property {string} [phoneNumber] The phone number associated with the billing address. Only numbers; remove dashes, parenthesis and other characters.
 * @property {string} [streetAddress] Line 1 of the billing address (eg. number, street, etc).
 * @property {string} [extendedAddress] Line 2 of the billing address (eg. suite, apt #, etc.).
 * @property {string} [line3] Line 3 of the billing address if needed (eg. suite, apt #, etc).
 * @property {string} [locality] The locality (city) name associated with the billing address.
 * @property {string} [region] The 2 letter code for US states, and the equivalent for other countries.
 * @property {string} [postalCode] The zip code or equivalent for countries that have them.
 * @property {string} [countryCodeAlpha2] The 2 character country code.
*/

/**
 * @typedef {object} ThreeDSecure~additionalInformation
 * @property {string} [workPhoneNumber] The work phone number used for verification. Only numbers; remove dashes, parenthesis and other characters.
 * @property {string} [shippingGivenName] The first name associated with the shipping address.
 * @property {string} [shippingSurname] The last name associated with the shipping address.
 * @property {object} [shippingAddress]
 * @property {string} [shippingAddress.streetAddress] The first name associated with the shipping address.
 * @property {string} [shippingAddress.extendedAddress] The last name associated with the shipping address.
 * @property {string} [shippingAddress.line3] Line 3 of the shipping address if needed (eg. suite, apt #, etc).
 * @property {string} [shippingAddress.locality] The locality (city) name associated with the shipping address.
 * @property {string} [shippingAddress.region] The 2 letter code for US states, and the equivalent for other countries.
 * @property {string} [shippingAddress.postalCode] The zip code or equivalent for countries that have them.
 * @property {string} [shippingAddress.countryCodeAlpha2] The 2 character country code.
 * @property {string} [shippingPhone] The phone number associated with the shipping address. Only numbers; remove dashes, parenthesis and other characters.
 * @property {string} [shippingMethod] The 2-digit string indicating the name of the shipping method chosen for the transaction. Possible values:
 * - `01` Same Day
 * - `02` Overnight / Expedited
 * - `03` Priority (2-3 Days)
 * - `04` Ground
 * - `05` Electronic Delivery
 * - `06` Ship to Store
 * @property {string} [shippingMethodIndicator] The 2-digit string indicating the shipping method chosen for the transaction Possible values.
 * - `01` Ship to cardholder billing address
 * - `02` Ship to another verified address on file with merchant
 * - `03` Ship to address that is different from billing address
 * - `04` Ship to store (store address should be populated on request)
 * - `05` Digital goods
 * - `06` Travel and event tickets, not shipped
 * - `07` Other
 * @property {string} [productCode] The 3-letter string representing the merchant product code. Possible values:
 * - `AIR` Airline
 * - `GEN` General Retail
 * - `DIG` Digital Goods
 * - `SVC` Services
 * - `RES` Restaurant
 * - `TRA` Travel
 * - `DSP` Cash Dispensing
 * - `REN` Car Rental
 * - `GAS` Fuel
 * - `LUX` Luxury Retail
 * - `ACC` Accommodation Retail
 * - `TBD` Other
 * @property {string} [deliveryTimeframe] The 2-digit number indicating the delivery time frame. Possible values:
 * - `01` Electronic delivery
 * - `02` Same day shipping
 * - `03` Overnight shipping
 * - `04` Two or more day shipping
 * @property {string} [deliveryEmail] For electronic delivery, email address to which the merchandise was delivered.
 * @property {string} [reorderindicator] The 2-digit number indicating whether the cardholder is reordering previously purchased merchandise. possible values:
 * - `01` First time ordered
 * - `02` Reordered
 * @property {string} [preorderIndicator] The 2-digit number indicating whether cardholder is placing an order with a future availability or release date. possible values:
 * - `01` Merchandise available
 * - `02` Future availability
 * @property {string} [preorderDate] The 8-digit number (format: YYYYMMDD) indicating expected date that a pre-ordered purchase will be available.
 * @property {string} [giftCardAmount] The purchase amount total for prepaid gift cards in major units.
 * @property {string} [giftCardCurrencyCode] ISO 4217 currency code for the gift card purchased.
 * @property {string} [giftCardCount] Total count of individual prepaid gift cards purchased.
 * @property {string} [accountAgeIndicator] The 2-digit value representing the length of time cardholder has had account. Possible values:
 * - `01` No Account
 * - `02` Created during transaction
 * - `03` Less than 30 days
 * - `04` 30-60 days
 * - `05` More than 60 days
 * @property {string} [accountCreateDate] The 8-digit number (format: YYYYMMDD) indicating the date the cardholder opened the account.
 * @property {string} [accountChangeIndicator] The 2-digit value representing the length of time since the last change to the cardholder account. This includes shipping address, new payment account or new user added. Possible values:
 * - `01` Changed during transaction
 * - `02` Less than 30 days
 * - `03` 30-60 days
 * - `04` More than 60 days
 * @property {string} [accountChangeDate] The 8-digit number (format: YYYYMMDD) indicating the date the cardholder's account was last changed. This includes changes to the billing or shipping address, new payment accounts or new users added.
 * @property {string} [accountPwdChangeIndicator] The 2-digit value representing the length of time since the cardholder changed or reset the password on the account. Possible values:
 * - `01` No change
 * - `02` Changed during transaction
 * - `03` Less than 30 days
 * - `04` 30-60 days
 * - `05` More than 60 days
 * @property {string} [accountPwdChangeDate] The 8-digit number (format: YYYYMMDD) indicating the date the cardholder last changed or reset password on account.
 * @property {string} [shippingAddressUsageIndicator] The 2-digit value indicating when the shipping address used for transaction was first used. Possible values:
 * - `01` This transaction
 * - `02` Less than 30 days
 * - `03` 30-60 days
 * - `04` More than 60 days
 * @property {string} [shippingAddressUsageDate] The 8-digit number (format: YYYYMMDD) indicating the date when the shipping address used for this transaction was first used.
 * @property {string} [transactionCountDay] Number of transactions (successful or abandoned) for this cardholder account within the last 24 hours.
 * @property {string} [transactionCountYear] Number of transactions (successful or abandoned) for this cardholder account within the last year.
 * @property {string} [addCardAttempts] Number of add card attempts in the last 24 hours.
 * @property {string} [accountPurchases] Number of purchases with this cardholder account during the previous six months.
 * @property {string} [fraudActivity] The 2-digit value indicating whether the merchant experienced suspicious activity (including previous fraud) on the account. Possible values:
 * - `01` No suspicious activity
 * - `02` Suspicious activity observed
 * @property {string} [shippingNameIndicator] The 2-digit value indicating if the cardholder name on the account is identical to the shipping name used for the transaction. Possible values:
 * - `01` Account and shipping name identical
 * - `02` Account and shipping name differ
 * @property {string} [paymentAccountIndicator] The 2-digit value indicating the length of time that the payment account was enrolled in the merchant account. Possible values:
 * - `01` No account (guest checkout)
 * - `02` During the transaction
 * - `03` Less than 30 days
 * - `04` 30-60 days
 * - `05` More than 60 days
 * @property {string} [paymentAccountAge] The 8-digit number (format: YYYYMMDD) indicating the date the payment account was added to the cardholder account.
 * @property {string} [acsWindowSize] The 2-digit number to set the challenge window size to display to the end cardholder.  The ACS will reply with content that is formatted appropriately to this window size to allow for the best user experience.  The sizes are width x height in pixels of the window displayed in the cardholder browser window. Possible values:
 * - `01` 250x400
 * - `02` 390x400
 * - `03` 500x600
 * - `04` 600x400
 * - `05` Full page
 * @property {string} [sdkMaxTimeout] The 2-digit number of minutes (minimum 05) to set the maximum amount of time for all 3DS 2.0 messages to be communicated between all components.
 * @property {string} [addressMatch] The 1-character value (Y/N) indicating whether cardholder billing and shipping addresses match.
 * @property {string} [accountId] Additional cardholder account information.
 * @property {string} [ipAddress] The IP address of the consumer. IPv4 and IPv6 are supported.
 * @property {string} [orderDescription] Brief description of items purchased.
 * @property {string} [taxAmount] Unformatted tax amount without any decimalization (ie. $123.67 = 12367).
 * @property {string} [userAgent] The exact content of the HTTP user agent header.
 * @property {string} [authenticationIndicator] The 2-digit number indicating the type of authentication request. Possible values:
 *  - `02` Recurring
 *  - `03` Installment
 * @property {string} [installment] An integer value greater than 1 indicating the maximum number of permitted authorizations for installment payments.
 * @property {string} [purchaseDate] The 14-digit number (format: YYYYMMDDHHMMSS) indicating the date in UTC of original purchase.
 * @property {string} [recurringEnd] The 8-digit number (format: YYYYMMDD) indicating the date after which no further recurring authorizations should be performed.
 * @property {string} [recurringFrequency] Integer value indicating the minimum number of days between recurring authorizations. A frequency of monthly is indicated by the value 28. Multiple of 28 days will be used to indicate months (ex. 6 months = 168).
 */

/**
 * @name ThreeDSecure#on
 * @function
 * @param {string} event The name of the event to which you are subscribing.
 * @param {function} handler A callback to handle the event.
 * @description Subscribes a handler function to a named event.
 * @example
 * <caption>Listening to a 3D Secure event</caption>
 * braintree.threeDSecure.create({ ... }, function (createErr, threeDSecureInstance) {
 *   threeDSecureInstance.on('lookup-complete', function (data, next) {
 *     console.log(event);
 *     next();
 *   });
 * });
 * @returns {void}
 */

/**
 * @name ThreeDSecure#off
 * @function
 * @param {string} event The name of the event to which you are unsubscribing.
 * @param {function} handler The callback for the event you are unsubscribing from.
 * @description Unsubscribes the handler function to a named event.
 * @example
 * <caption>Subscribing and then unsubscribing from a 3D Secure eld event</caption>
 * braintree.threeDSecure.create({ ... }, function (createErr, threeDSecureInstance) {
 *   var callback = function (data, next) {
 *     console.log(data);
 *     next();
 *   };
 *
 *   threeDSecureInstance.on('lookup-complete', callback);
 *
 *   // later on
 *   threeDSecureInstance.off('lookup-complete', callback);
 * });
 * @returns {void}
 */

/**
 * This event is emitted when the `2-inline-iframe` version is specified when creating the 3D Secure instance and the authentication iframe becomes available.
 * @event ThreeDSecure#authentication-iframe-available
 * @type {object}
 * @example
 * <caption>Listening for the authentication iframe to be available</caption>
 *   threeDSecureInstance.on('authentication-iframe-available', function (event, next) {
 *     document.body.appendChild(event.element); // add iframe element to page
 *
 *     next(); // let the SDK know the iframe is ready
 *   });
 * });
 */

/**
 * This event is emitted when using the 3D Secure 2.0 flow and the initial lookup request completes. If this is not used, a `onLookupComplete` callback must be passed into the `verifyCard` method.
 * @event ThreeDSecure#lookup-complete
 * @type {object}
 * @example
 * <caption>Listening for when the lookup request is complete</caption>
 * braintree.threeDSecure.create({
 *   client: clientInstance,
 *   version: '2-inline-iframe'
 * }, function (createErr, threeDSecureInstance) {
 *   threeDSecureInstance.on('lookup-complete', function (data, next) {
 *     // inspect the data
 *
 *     // call next when ready to proceed with the challenge
 *     next();
 *   });
 * });
 */

/**
 * @class
 * @param {object} options 3D Secure {@link module:braintree-web/three-d-secure.create create} options
 * @description <strong>Do not use this constructor directly. Use {@link module:braintree-web/three-d-secure.create|braintree.threeDSecure.create} instead.</strong>
 * @classdesc This class represents a ThreeDSecure component produced by {@link module:braintree-web/three-d-secure.create|braintree.threeDSecure.create}. Instances of this class have a method for launching a 3D Secure authentication flow.
 *
 * **Note**: 3D Secure 2.0 is documented below and will become the default integration method in a future version of Braintree-web. Until then, version 1.0 will continue to be supported. To view 3D Secure 1.0 documentation, look at Braintree-web documentation from version [3.40.0](https://braintree.github.io/braintree-web/3.40.0/ThreeDSecure.html) and earlier, or upgrade your integration by referring to the [3D Secure 2.0 adoption guide](https://developers.braintreepayments.com/guides/3d-secure/migration/javascript/v3).
 */
function ThreeDSecure(options) {
  var self = this;
  var Framework = FRAMEWORKS[options.framework];

  EventEmitter.call(this);

  this._framework = new Framework(options);
  this._framework.setUpEventListeners(function () {
    self._emit.apply(self, arguments);
  });
}

EventEmitter.createChild(ThreeDSecure);

/**
 * Launch the 3D Secure login flow, returning a nonce payload.
 *
 * @public
 * @param {object} options Options for card verification.
 * @param {string} options.nonce The nonce representing the card from a tokenization payload. For example, this can be a {@link HostedFields~tokenizePayload|tokenizePayload} returned by Hosted Fields under `payload.nonce`.
 * @param {string} options.bin The numeric Bank Identification Number (bin) of the card from a tokenization payload. For example, this can be a {@link HostedFields~tokenizePayload|tokenizePayload} returned by Hosted Fields under `payload.details.bin`.
 * @param {string} options.amount The amount of the transaction in the current merchant account's currency. This must be expressed in numbers with an optional decimal (using `.`) and precision up to the hundredths place. For example, if you're processing a transaction for 1.234,56 € then `amount` should be `1234.56`.
 * @param {boolean} [options.challengeRequested] If set to true, an authentication challenge will be forced if possible.
 * @param {boolean} [options.exemptionRequested] If set to true, an exemption to the authentication challenge will be requested.
 * @param {function} [options.onLookupComplete] *Deprecated:* Use {@link ThreeDSecure#event:lookup-complete|`threeDSecureInstance.on('lookup-complete')`} instead. Function to execute when lookup completes. The first argument, `data`, is a {@link ThreeDSecure~verificationData|verificationData} object, and the second argument, `next`, is a callback. `next` must be called to continue.
 * @param {string} [options.email] The email used for verification.
 * @param {string} [options.mobilePhoneNumber] The mobile phone number used for verification. Only numbers; remove dashes, parenthesis and other characters.
 * @param {object} [options.billingAddress] An {@link ThreeDSecure~billingAddress|billingAddress} object for verification.
 * @param {object} [options.additionalInformation] An {@link ThreeDSecure~additionalInformation|additionalInformation} object for verification.
 * @param {object} [options.customer] **Deprecated** Customer information for use in 3DS 1.0 verifications. Can contain any subset of a {@link ThreeDSecure~verifyCardCustomerObject|verifyCardCustomerObject}. Only to be used for 3DS 1.0 integrations.
 * @param {callback} options.addFrame **Deprecated** This {@link ThreeDSecure~addFrameCallback|addFrameCallback} will be called when the bank frame needs to be added to your page. Only to be used for 3DS 1.0 integrations.
 * @param {callback} options.removeFrame **Deprecated** For use in 3DS 1.0 Flows. This {@link ThreeDSecure~removeFrameCallback|removeFrameCallback} will be called when the bank frame needs to be removed from your page. Only to be used in 3DS 1.0 integrations.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link ThreeDSecure~verifyPayload|verifyPayload}. If no callback is provided, it will return a promise that resolves {@link ThreeDSecure~verifyPayload|verifyPayload}.

 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * <caption>Verifying a payment method nonce with 3DS 2.0</caption>
 * var my3DSContainer;
 *
 * // set up listener after initialization
 * threeDSecure.on(('lookup-complete', function (data, next) {
 *   // use `data` here, then call `next()`
 *   next();
 * });
 *
 * // call verifyCard after tokenizing a card
 * threeDSecure.verifyCard({
 *   amount: '123.45',
 *   nonce: hostedFieldsTokenizationPayload.nonce,
 *   bin: hostedFieldsTokenizationPayload.details.bin,
 *   email: 'test@example.com'
 *   billingAddress: {
 *     givenName: 'Jill',
 *     surname: 'Doe',
 *     phoneNumber: '8101234567',
 *     streetAddress: '555 Smith St.',
 *     extendedAddress: '#5',
 *     locality: 'Oakland',
 *     region: 'CA',
 *     postalCode: '12345',
 *     countryCodeAlpha2: 'US'
 *   },
 *   additionalInformation: {
 *     workPhoneNumber: '5555555555',
 *     shippingGivenName: 'Jill',
 *     shippingSurname: 'Doe',
 *     shippingAddress: {
 *       streetAddress: '555 Smith st',
 *       extendedAddress: '#5',
 *       locality: 'Oakland',
 *       region: 'CA',
 *       postalCode: '12345',
 *       countryCodeAlpha2: 'US'
 *     }
 *     shippingPhone: '8101234567'
 *   }
 * }, function (err, payload) {
 *   if (err) {
 *     console.error(err);
 *     return;
 *   }
 *
 *   if (payload.liabilityShifted) {
 *     // Liability has shifted
 *     submitNonceToServer(payload.nonce);
 *   } else if (payload.liabilityShiftPossible) {
 *     // Liability may still be shifted
 *     // Decide if you want to submit the nonce
 *   } else {
 *     // Liability has not shifted and will not shift
 *     // Decide if you want to submit the nonce
 *   }
 * });
 * <caption>Verifying a payment method nonce with 3DS 2.0 with onLookupComplete callback</caption>
 * var my3DSContainer;
 *
 * threeDSecure.verifyCard({
 *   amount: '123.45',
 *   nonce: hostedFieldsTokenizationPayload.nonce,
 *   bin: hostedFieldsTokenizationPayload.details.bin,
 *   email: 'test@example.com'
 *   billingAddress: {
 *     givenName: 'Jill',
 *     surname: 'Doe',
 *     phoneNumber: '8101234567',
 *     streetAddress: '555 Smith St.',
 *     extendedAddress: '#5',
 *     locality: 'Oakland',
 *     region: 'CA',
 *     postalCode: '12345',
 *     countryCodeAlpha2: 'US'
 *   },
 *   additionalInformation: {
 *     workPhoneNumber: '5555555555',
 *     shippingGivenName: 'Jill',
 *     shippingSurname: 'Doe',
 *     shippingAddress: {
 *       streetAddress: '555 Smith st',
 *       extendedAddress: '#5',
 *       locality: 'Oakland',
 *       region: 'CA',
 *       postalCode: '12345',
 *       countryCodeAlpha2: 'US'
 *     }
 *     shippingPhone: '8101234567'
 *   },
 *   onLookupComplete: function (data, next) {
 *     // use `data` here, then call `next()`
 *     next();
 *   }
 * }, function (err, payload) {
 *   if (err) {
 *     console.error(err);
 *     return;
 *   }
 *
 *   if (payload.liabilityShifted) {
 *     // Liability has shifted
 *     submitNonceToServer(payload.nonce);
 *   } else if (payload.liabilityShiftPossible) {
 *     // Liability may still be shifted
 *     // Decide if you want to submit the nonce
 *   } else {
 *     // Liability has not shifted and will not shift
 *     // Decide if you want to submit the nonce
 *   }
 * });
 * @example
 * <caption>Handling 3DS lookup errors</caption>
 * var my3DSContainer;
 *
 * // set up listener after initialization
 * threeDSecure.on(('lookup-complete', function (data, next) {
 *   // use `data` here, then call `next()`
 *   next();
 * });
 *
 * // call verifyCard after tokenizing a card
 * threeDSecure.verifyCard({
 *   amount: '123.45',
 *   nonce: hostedFieldsTokenizationPayload.nonce,
 *   bin: hostedFieldsTokenizationPayload.details.bin,
 *   email: 'test@example.com',
 *   billingAddress: billingAddressFromCustomer,
 *   additionalInformation: additionalInfoFromCustomer
 * }, function (err, payload) {
 *   if (err) {
 *     if (err.code.indexOf('THREEDS_LOOKUP') === 0) {
 *       // an error occurred during the initial lookup request
 *
 *       if (err.code === 'THREEDS_LOOKUP_TOKENIZED_CARD_NOT_FOUND_ERROR') {
 *         // either the passed payment method nonce does not exist
 *         // or it was already consumed before the lookup call was made
 *       } else if (err.code.indexOf('THREEDS_LOOKUP_VALIDATION') === 0) {
 *         // a validation error occurred
 *         // likely some non-ascii characters were included in the billing
 *         // address given name or surname fields, or the cardholdername field
 *
 *         // Instruct your user to check their data and try again
 *       } else {
 *         // an unknown lookup error occurred
 *       }
 *     } else {
 *       // some other kind of error
 *     }
 *     return;
 *   }
 *
 *   // handle success
 * });
 * @example
 * <caption>Deprecated: Verifying an existing nonce with 3DS 1.0</caption>
 * var my3DSContainer;
 *
 * threeDSecure.verifyCard({
 *   nonce: existingNonce,
 *   amount: 123.45,
 *   addFrame: function (err, iframe) {
 *     // Set up your UI and add the iframe.
 *     my3DSContainer = document.createElement('div');
 *     my3DSContainer.appendChild(iframe);
 *     document.body.appendChild(my3DSContainer);
 *   },
 *   removeFrame: function () {
 *     // Remove UI that you added in addFrame.
 *     document.body.removeChild(my3DSContainer);
 *   }
 * }, function (err, payload) {
 *   if (err) {
 *     console.error(err);
 *     return;
 *   }
 *
 *   if (payload.liabilityShifted) {
 *     // Liability has shifted
 *     submitNonceToServer(payload.nonce);
 *   } else if (payload.liabilityShiftPossible) {
 *     // Liability may still be shifted
 *     // Decide if you want to submit the nonce
 *   } else {
 *     // Liability has not shifted and will not shift
 *     // Decide if you want to submit the nonce
 *   }
 * });
 */
ThreeDSecure.prototype.verifyCard = function (options) {
  var privateOptions;

  if (this.hasListener('lookup-complete')) {
    privateOptions = {
      ignoreOnLookupCompleteRequirement: true
    };
  }

  return this._framework.verifyCard(options, privateOptions);
};

/* eslint-disable-next-line valid-jsdoc */
/**
 * Launch the iframe challenge using a 3D Secure lookup response from a server side lookup.
 *
 * @public
 * @param {(object|string)} lookupResponse The lookup response from the server side call to lookup the 3D Secure information. The raw string or a parsed object can be passed.
 * @returns {Promise} Returns a promise.
 * @example
 * var my3DSContainer;
 *
 * threeDSecure.initializeChallengeWithLookupResponse(lookupResponseFromServer).then(function (payload) {
 *   if (payload.liabilityShifted) {
 *     // Liability has shifted
 *     submitNonceToServer(payload.nonce);
 *   } else if (payload.liabilityShiftPossible) {
 *     // Liability may still be shifted
 *     // Decide if you want to submit the nonce
 *   } else {
 *     // Liability has not shifted and will not shift
 *     // Decide if you want to submit the nonce
 *   }
 * });
 */
ThreeDSecure.prototype.initializeChallengeWithLookupResponse = function (lookupResponse) {
  if (typeof lookupResponse === 'string') {
    lookupResponse = JSON.parse(lookupResponse);
  }

  return this._framework.initializeChallengeWithLookupResponse(lookupResponse);
};

/**
 * Gather the data needed for a 3D Secure lookup call.
 *
 * @public
 * @param {object} options Options for 3D Secure lookup.
 * @param {string} options.nonce The nonce representing the card from a tokenization payload. For example, this can be a {@link HostedFields~tokenizePayload|tokenizePayload} returned by Hosted Fields under `payload.nonce`.
 * @param {string} [options.bin] The numeric Bank Identification Number (bin) of the card from a tokenization payload. For example, this can be a {@link HostedFields~tokenizePayload|tokenizePayload} returned by Hosted Fields under `payload.details.bin`. Though not required to start the verification, it is required to receive a 3DS 2.0 lookup response.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link ThreeDSecure~prepareLookupPayload|prepareLookupPayload}. If no callback is provided, it will return a promise that resolves {@link ThreeDSecure~prepareLookupPayload|prepareLookupPayload}.

 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * <caption>Preparing data for a 3D Secure lookup</caption>
 * threeDSecure.prepareLookup({
 *   nonce: hostedFieldsTokenizationPayload.nonce,
 *   bin: hostedFieldsTokenizationPayload.details.bin
 * }, function (err, payload) {
 *   if (err) {
 *     console.error(err);
 *     return;
 *   }
 *
 *   // send payload to server to do server side lookup
 * });
 */
ThreeDSecure.prototype.prepareLookup = function (options) {
  return this._framework.prepareLookup(options).then(function (data) {
    return JSON.stringify(data);
  });
};

/**
 * Cancel the 3DS flow and return the verification payload if available. If using 3D Secure version 2, this will not close the UI of the authentication modal. It is recommended that this method only be used in the {@link ThreeDSecure#event:lookup-complete|`lookup-complete`} event or the `onLookupComplete` callback.
 * @public
 * @param {callback} [callback] The second argument is a {@link ThreeDSecure~verifyPayload|verifyPayload}. If there is no verifyPayload (the initial lookup did not complete), an error will be returned. If no callback is passed, `cancelVerifyCard` will return a promise.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example <caption>Cancel the verification in `lookup-complete` event</caption>
 * // set up listener after instantiation
 * threeDSecure.on('lookup-complete', function (data, next) {
 *   // determine if you want to call next to start the challenge,
 *   // if not, call cancelVerifyCard
 *   threeDSecure.cancelVerifyCard(function (err, verifyPayload) {
 *     if (err) {
 *       // Handle error
 *       console.log(err.message); // No verification payload available
 *       return;
 *     }
 *
 *     verifyPayload.nonce; // The nonce returned from the 3ds lookup call
 *     verifyPayload.liabilityShifted; // boolean
 *     verifyPayload.liabilityShiftPossible; // boolean
 *   });
 * });
 *
 * // after tokenizing a credit card
 * threeDSecure.verifyCard({
 *   amount: '100.00',
 *   nonce: nonceFromTokenizationPayload,
 *   bin: binFromTokenizationPayload
 *   // other fields such as billing address
 * }, function (verifyError, payload) {
 *   if (verifyError) {
 *     if (verifyError.code === 'THREEDS_VERIFY_CARD_CANCELED_BY_MERCHANT ') {
 *       // flow was cancelled by merchant, 3ds info can be found in the payload
 *       // for cancelVerifyCard
 *     }
 *   }
 * });
 * @example <caption>Cancel the verification in onLookupComplete callback</caption>
 * threeDSecure.verifyCard({
 *   amount: '100.00',
 *   nonce: nonceFromTokenizationPayload,
 *   bin: binFromTokenizationPayload,
 *   // other fields such as billing address
 *   onLookupComplete: function (data, next) {
 *     // determine if you want to call next to start the challenge,
 *     // if not, call cancelVerifyCard
 *     threeDSecure.cancelVerifyCard(function (err, verifyPayload) {
 *       if (err) {
 *         // Handle error
 *         console.log(err.message); // No verification payload available
 *         return;
 *       }
 *
 *       verifyPayload.nonce; // The nonce returned from the 3ds lookup call
 *       verifyPayload.liabilityShifted; // boolean
 *       verifyPayload.liabilityShiftPossible; // boolean
 *     });
 *   }
 * }, function (verifyError, payload) {
 *   if (verifyError) {
 *     if (verifyError.code === 'THREEDS_VERIFY_CARD_CANCELED_BY_MERCHANT ') {
 *       // flow was cancelled by merchant, 3ds info can be found in the payload
 *       // for cancelVerifyCard
 *     }
 *   }
 * });
 * @example <caption>Cancel the verification in 3D Secure version 1</caption>
 * // unlike with v2, this will not cause `verifyCard` to error, it will simply
 * // never call the callback
 * threeDSecure.cancelVerifyCard(function (err, verifyPayload) {
 *   if (err) {
 *     // Handle error
 *     console.log(err.message); // No verification payload available
 *     return;
 *   }
 *
 *   verifyPayload.nonce; // The nonce returned from the 3ds lookup call
 *   verifyPayload.liabilityShifted; // boolean
 *   verifyPayload.liabilityShiftPossible; // boolean
 * });
 */
ThreeDSecure.prototype.cancelVerifyCard = function () {
  return this._framework.cancelVerifyCard();
};

/**
 * Cleanly remove anything set up by {@link module:braintree-web/three-d-secure.create|create}.
 * @public
 * @param {callback} [callback] Called on completion. If no callback is passed, `teardown` will return a promise.
 * @example
 * threeDSecure.teardown();
 * @example <caption>With callback</caption>
 * threeDSecure.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
ThreeDSecure.prototype.teardown = function () {
  var methodNames = methods(ThreeDSecure.prototype).concat(methods(EventEmitter.prototype));

  convertMethodsToError(this, methodNames);

  return this._framework.teardown();
};

module.exports = wrapPromise.wrapPrototype(ThreeDSecure);

},{"../../lib/convert-methods-to-error":118,"../../lib/methods":144,"./frameworks":176,"@braintree/event-emitter":21,"@braintree/wrap-promise":30}],181:[function(_dereq_,module,exports){
'use strict';
/** @module braintree-web/three-d-secure */

var ThreeDSecure = _dereq_('./external/three-d-secure');
var isHTTPS = _dereq_('../lib/is-https').isHTTPS;
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var BraintreeError = _dereq_('../lib/braintree-error');
var analytics = _dereq_('../lib/analytics');
var errors = _dereq_('./shared/errors');
var VERSION = "3.63.0";
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {object} [options.cardinalSDKConfig] A config for the underlying Cardinal SDK.
 * @param {object} [options.cardinalSDKConfig.logging] The logging configuration for the Cardinal SDK. See [Cardinal's documentation for the logging object](https://cardinaldocs.atlassian.net/wiki/spaces/CC/pages/1409568/Configurations#Configurations-Logging) for more information.
 * @param {number} [options.cardinalSDKConfig.timeout] The time in milliseconds to wait before a request to Cardinal's API times out. See [Cardinal's documentation for root level configuration](https://cardinaldocs.atlassian.net/wiki/spaces/CC/pages/1409568/Configurations#Configurations-RootLevelConfiguration) for more information.
 * @param {number} [options.cardinalSDKConfig.maxRequestRetries] How many times a request should be re-attempted to Cardinal's API before giving up as a failure. See [Cardinal's documentation for root level configuration](https://cardinaldocs.atlassian.net/wiki/spaces/CC/pages/1409568/Configurations#Configurations-RootLevelConfiguration) for more information.
 * @param {object} [options.cardinalSDKConfig.payment] An object to describe how you want the user interactions to behave. Only a subset of the [Cardinal SDK payment configuration object](https://cardinaldocs.atlassian.net/wiki/spaces/CC/pages/1409568/Configurations#Configurations-Payment) are supported: `displayLoading` and `displayExitButton`.
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {(number|string)} [options.version=1] The version of 3D Secure to use. Possible options:
 * * 1 - The legacy 3D Secure v1.0 integration.
 * * 2 - A 3D Secure v2.0 integration that uses a modal to host the 3D Secure iframe.
 * * 2-bootstrap3-modal - A 3D Secure v2.0 integration that uses a modal styled with Bootstrap 3 styles to host the 3D Secure iframe. Requires having the Bootstrap 3 script files and stylesheets on your page.
 * * 2-inline-iframe - A 3D Secure v2.0 integration that provides the authentication iframe directly to the merchant.
 * @param {callback} [callback] The second argument, `data`, is the {@link ThreeDSecure} instance. If no callback is provided, it returns a promise that resolves the {@link ThreeDSecure} instance.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
@example
 * <caption>Creating a v2 3D Secure component using 2 version (Cardinal modal)</caption>
 * braintree.threeDSecure.create({
 *   client: clientInstance,
 *   version: '2'
 * }, function (createError, threeDSecure) {
 *   // set up lookup-complete listener
 *   threeDSecure.on('lookup-complete', function (data, next) {
 *     // check lookup data
 *
 *     next();
 *   });
 *
 *   // using Hosted Fields, use `tokenize` to get back a credit card nonce
 *
 *   threeDSecure.verifyCard({
 *     nonce: nonceFromTokenizationPayload,,
 *     bin: binFromTokenizationPayload,
 *     amount: '100.00'
 *   }, function (verifyError, payload) {
 *     // inspect payload
 *     // send payload.nonce to your server
 *   });
 * });
 * @example
 * <caption>Creating a v2 3D Secure component using 2-bootstrap3-modal version</caption>
 * // must have the boostrap js, css and jquery files on your page
 * braintree.threeDSecure.create({
 *   client: clientInstance,
 *   version: '2-bootstrap3-modal'
 * }, function (createError, threeDSecure) {
 *   // set up lookup-complete listener
 *   threeDSecure.on('lookup-complete', function (data, next) {
 *     // check lookup data
 *
 *     next();
 *   });
 *
 *   // using Hosted Fields, use `tokenize` to get back a credit card nonce
 *
 *   // challenge will be presented in a bootstrap 3 modal
 *   threeDSecure.verifyCard({
 *     nonce: nonceFromTokenizationPayload,
 *     bin: binFromTokenizationPayload,
 *     amount: '100.00'
 *   }, function (verifyError, payload) {
 *     // inspect payload
 *     // send payload.nonce to your server
 *   });
 * });
 * @example
 * <caption>Creating a v2 3D Secure component using 2-inline-iframe version</caption>
 * braintree.threeDSecure.create({
 *   client: clientInstance,
 *   version: '2-inline-iframe'
 * }, function (createError, threeDSecure) {
 *   // set up lookup-complete listener
 *   threeDSecure.on('lookup-complete', function (data, next) {
 *     // check lookup data
 *
 *     next();
 *   });
 *   // set up iframe listener
 *   threeDSecure.on('authentication-iframe-available', function (event, next) {
 *     var element = event.element; // an html element that contains the iframe
 *
 *     document.body.appendChild(element); // put it on your page
 *
 *     next(); // let the sdk know the element has been added to the page
 *   });
 *
 *   // using Hosted Fields, use `tokenize` to get back a credit card nonce
 *
 *   threeDSecure.verifyCard({
 *     nonce: nonceFromTokenizationPayload,,
 *     bin: binFromTokenizationPayload,
 *     amount: '100.00'
 *   }, function (verifyError, payload) {
 *     // inspect payload
 *     // send payload.nonce to your server
 *   });
 * });
 */
function create(options) {
  var name = '3D Secure';

  return basicComponentVerification.verify({
    name: name,
    client: options.client,
    authorization: options.authorization
  }).then(function () {
    var assetsUrl = createAssetsUrl.create(options.authorization);
    var framework = getFramework(options);
    var createPromise = createDeferredClient.create({
      authorization: options.authorization,
      client: options.client,
      debug: options.debug,
      assetsUrl: assetsUrl,
      name: name
    }).then(function (client) {
      var error, isProduction;
      var config = client.getConfiguration();
      var gwConfig = config.gatewayConfiguration;

      options.client = client;

      if (!gwConfig.threeDSecureEnabled) {
        error = errors.THREEDS_NOT_ENABLED;
      }

      if (config.authorizationType === 'TOKENIZATION_KEY') {
        error = errors.THREEDS_CAN_NOT_USE_TOKENIZATION_KEY;
      }

      isProduction = gwConfig.environment === 'production';

      if (isProduction && !isHTTPS()) {
        error = errors.THREEDS_HTTPS_REQUIRED;
      }

      if (framework !== 'legacy' && !(gwConfig.threeDSecure && gwConfig.threeDSecure.cardinalAuthenticationJWT)) {
        analytics.sendEvent(options.client, 'three-d-secure.initialization.failed.missing-cardinalAuthenticationJWT');
        error = errors.THREEDS_NOT_ENABLED_FOR_V2;
      }

      if (error) {
        return Promise.reject(new BraintreeError(error));
      }

      analytics.sendEvent(options.client, 'three-d-secure.initialized');

      return client;
    });
    var instance = new ThreeDSecure({
      client: options.client,
      assetsUrl: assetsUrl,
      createPromise: createPromise,
      loggingEnabled: options.loggingEnabled,
      cardinalSDKConfig: options.cardinalSDKConfig,
      framework: framework
    });

    if (options.client) {
      return createPromise.then(function () {
        return instance;
      });
    }

    return instance;
  });
}

function getFramework(options) {
  var version = String(options.version || '');

  if (!version || version === '1') {
    return 'legacy';
  }

  switch (version) {
    case '2':
    case '2-cardinal-modal':
      return 'cardinal-modal';
    case '2-bootstrap3-modal':
      return 'bootstrap3-modal';
    case '2-inline-iframe':
      return 'inline-iframe';
    default:
      throw new BraintreeError({
        code: errors.THREEDS_UNRECOGNIZED_VERSION.code,
        type: errors.THREEDS_UNRECOGNIZED_VERSION.type,
        message: 'Version `' + options.version + '` is not a recognized version. You may need to update the version of your Braintree SDK to support this version.'
      });
  }
}

module.exports = {
  create: wrapPromise(create),
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"../lib/analytics":107,"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/is-https":141,"../lib/promise":146,"./external/three-d-secure":180,"./shared/errors":183,"@braintree/wrap-promise":30}],182:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  LANDING_FRAME_NAME: 'braintreethreedsecurelanding',
  CARDINAL_SCRIPT_SOURCE: {
    production: 'https://songbird.cardinalcommerce.com/edge/v1/songbird.js',
    sandbox: 'https://songbirdstag.cardinalcommerce.com/edge/v1/songbird.js'
  }
};

},{}],183:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.3D Secure - Creation Error Codes
 * @description Errors that occur when [creating the 3D Secure component](/current/module-braintree-web_three-d-secure.html#.create).
 * @property {MERCHANT} THREEDS_NOT_ENABLED Occurs when 3D Secure is not enabled in the Braintree control panel.
 * @property {MERCHANT} THREEDS_CAN_NOT_USE_TOKENIZATION_KEY Occurs when 3D Secure component is created without a Client Token.
 * @property {MERCHANT} THREEDS_HTTPS_REQUIRED Occurs when 3D Secure component is created in production over HTTPS.
 * @property {MERCHANT} THREEDS_NOT_ENABLED_FOR_V2 Occurs when 3D Secure component is created with version 2 parameter, but merchant is not enabled to use version 2.
 * @property {MERCHANT} THREEDS_UNRECOGNIZED_VERSION Occurs when unrecognized version enum is passed into the create call.
 * @property {UNKNOWN} THREEDS_CARDINAL_SDK_SETUP_FAILED Occurs when Cardinal's Songbird.js library fails to setup for an unknown reason.
 * @property {NETWORK} THREEDS_CARDINAL_SDK_SCRIPT_LOAD_FAILED Occurs when using version 2 and Cardinal's Songbird.js script could not be loaded.
 * @property {UNKNOWN} THREEDS_CARDINAL_SDK_SETUP_TIMEDOUT Occurs when Cardinal's Songbird.js library takes longer than 60 seconds to set up.
 * @property {UNKNOWN} THREEDS_CARDINAL_SDK_RESPONSE_TIMEDOUT Occurs when Cardinal sends a response indicating a timeout on /Validate, /Confirm, or /Continue.
 * @property {MERCHANT} THREEDS_CARDINAL_SDK_BAD_CONFIG Occurs when there is no JWT in the request. Also when there's some other malformed aspect of config.
 * @property {MERCHANT} THREEDS_CARDINAL_SDK_BAD_JWT Occus when a malformed config causes a either a missing response JWT or a malformed Cardinal response.
 * @property {UNKNOWN} THREEDS_CARDINAL_SDK_ERROR Occurs when a "general error" or a Cardinal hosted fields error happens. Description contains more details.
 * @property {CUSTOMER} THREEDS_CARDINAL_SDK_CANCELED Occurs when customer cancels the transaction mid-flow, usually with alt-pays that have their own cancel buttons.
*/

/**
 * @name BraintreeError.3D Secure - verifyCard Error Codes
 * @description Errors that occur when using the [`verifyCard` method](/current/ThreeDSecure.html#verifyCard).
 * @property {MERCHANT} THREEDS_AUTHENTICATION_IN_PROGRESS Occurs when another verification is already in progress.
 * @property {MERCHANT} THREEDS_MISSING_VERIFY_CARD_OPTION Occurs when a required option is missing.
 * @property {UNKNOWN} THREEDS_JWT_AUTHENTICATION_FAILED Occurs when something went wrong authenticating the JWT from the Cardinal SDK.
 * @property {MERCHANT} THREEDS_LOOKUP_TOKENIZED_CARD_NOT_FOUND_ERROR Occurs when the supplied payment method nonce does not exist or the payment method nonce has already been consumed.
 * @property {CUSTOMER} THREEDS_LOOKUP_VALIDATION_ERROR Occurs when a validation error occurs during the 3D Secure lookup.
 * @property {UNKNOWN} THREEDS_LOOKUP_ERROR An unknown error occurred while attempting the 3D Secure lookup.
 * @property {MERCHANT} THREEDS_VERIFY_CARD_CANCELED_BY_MERCHANT Occurs when the 3D Secure flow is canceled by the merchant using `cancelVerifyCard` (3D Secure v2 flows only).
 * @property {UNKNOWN} THREEDS_INLINE_IFRAME_DETAILS_INCORRECT An unknown error occurred while attempting to use the inline iframe framework.
 */

/**
 * @name BraintreeError.3D Secure - cancelVerifyCard Error Codes
 * @description Errors that occur when using the [`cancelVerifyCard` method](/current/ThreeDSecure.html#cancelVerifyCard).
 * @property {MERCHANT} THREEDS_NO_VERIFICATION_PAYLOAD Occurs when the 3D Secure flow is canceled, but there is no 3D Secure information available.
 */

/**
 * @name BraintreeError.3D Secure - Internal Error Codes
 * @ignore
 * @description Errors that occur internally
 * @property {INTERNAL} THREEDS_TERM_URL_REQUIRES_BRAINTREE_DOMAIN Occurs when iframe is initialized on a non-verified domain.
 * @property {INTERNAL} THREEDS_FRAMEWORK_METHOD_NOT_IMPLEMENTED Occurs when a 3D Secure framwork method is not implemented.
 */

var BraintreeError = _dereq_('../../lib/braintree-error');

module.exports = {
  THREEDS_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_NOT_ENABLED',
    message: '3D Secure is not enabled for this merchant.'
  },
  THREEDS_CAN_NOT_USE_TOKENIZATION_KEY: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_CAN_NOT_USE_TOKENIZATION_KEY',
    message: '3D Secure can not use a tokenization key for authorization.'
  },
  THREEDS_HTTPS_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_HTTPS_REQUIRED',
    message: '3D Secure requires HTTPS.'
  },
  THREEDS_NOT_ENABLED_FOR_V2: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_NOT_ENABLED_FOR_V2',
    message: '3D Secure version 2 is not enabled for this merchant. Contact Braintree Support for assistance at https://help.braintreepayments.com/'
  },
  THREEDS_UNRECOGNIZED_VERSION: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_UNRECOGNIZED_VERSION'
  },
  THREEDS_CARDINAL_SDK_SETUP_FAILED: {
    type: BraintreeError.types.UNKNOWN,
    code: 'THREEDS_CARDINAL_SDK_SETUP_FAILED',
    message: 'Something went wrong setting up Cardinal\'s Songbird.js library.'
  },
  THREEDS_CARDINAL_SDK_SCRIPT_LOAD_FAILED: {
    type: BraintreeError.types.NETWORK,
    code: 'THREEDS_CARDINAL_SDK_SCRIPT_LOAD_FAILED',
    message: 'Cardinal\'s Songbird.js library could not be loaded.'
  },
  THREEDS_CARDINAL_SDK_SETUP_TIMEDOUT: {
    type: BraintreeError.types.UNKNOWN,
    code: 'THREEDS_CARDINAL_SDK_SETUP_TIMEDOUT',
    message: 'Cardinal\'s Songbird.js took too long to setup.'
  },
  THREEDS_CARDINAL_SDK_RESPONSE_TIMEDOUT: {
    type: BraintreeError.types.UNKNOWN,
    code: 'THREEDS_CARDINAL_SDK_RESPONSE_TIMEDOUT',
    message: 'Cardinal\'s API took too long to respond.'
  },
  THREEDS_CARDINAL_SDK_BAD_CONFIG: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_CARDINAL_SDK_BAD_CONFIG',
    message: 'JWT or other required field missing. Please check your setup configuration.'
  },
  THREEDS_CARDINAL_SDK_BAD_JWT: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_CARDINAL_SDK_BAD_JWT',
    message: 'Cardinal JWT missing or malformed. Please check your setup configuration.'
  },
  THREEDS_CARDINAL_SDK_ERROR: {
    type: BraintreeError.types.UNKNOWN,
    code: 'THREEDS_CARDINAL_SDK_ERROR',
    message: 'A general error has occurred with Cardinal. See description for more information.'
  },
  THREEDS_CARDINAL_SDK_CANCELED: {
    type: BraintreeError.types.CUSTOMER,
    code: 'THREEDS_CARDINAL_SDK_CANCELED',
    message: 'Canceled by user.'
  },
  THREEDS_VERIFY_CARD_CANCELED_BY_MERCHANT: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_VERIFY_CARD_CANCELED_BY_MERCHANT',
    message: '3D Secure verfication canceled by merchant.'
  },
  THREEDS_AUTHENTICATION_IN_PROGRESS: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_AUTHENTICATION_IN_PROGRESS',
    message: 'Cannot call verifyCard while existing authentication is in progress.'
  },
  THREEDS_MISSING_VERIFY_CARD_OPTION: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_MISSING_VERIFY_CARD_OPTION'
  },
  THREEDS_JWT_AUTHENTICATION_FAILED: {
    type: BraintreeError.types.UNKNOWN,
    code: 'THREEDS_JWT_AUTHENTICATION_FAILED',
    message: 'Something went wrong authenticating the JWT from Cardinal'
  },
  THREEDS_LOOKUP_TOKENIZED_CARD_NOT_FOUND_ERROR: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_LOOKUP_TOKENIZED_CARD_NOT_FOUND_ERROR',
    message: 'Either the payment method nonce passed to `verifyCard` does not exist, or it was already consumed'
  },
  THREEDS_LOOKUP_VALIDATION_ERROR: {
    type: BraintreeError.types.CUSTOMER,
    code: 'THREEDS_LOOKUP_VALIDATION_ERROR',
    message: 'The data passed in `verifyCard` did not pass validation checks. See details for more info'
  },
  THREEDS_LOOKUP_ERROR: {
    type: BraintreeError.types.UNKNOWN,
    code: 'THREEDS_LOOKUP_ERROR',
    message: 'Something went wrong during the 3D Secure lookup'
  },
  THREEDS_INLINE_IFRAME_DETAILS_INCORRECT: {
    type: BraintreeError.types.UNKNOWN,
    code: 'THREEDS_INLINE_IFRAME_DETAILS_INCORRECT',
    message: 'Something went wrong when attempting to add the authentication iframe to the page.'
  },
  THREEDS_NO_VERIFICATION_PAYLOAD: {
    type: BraintreeError.types.MERCHANT,
    code: 'THREEDS_NO_VERIFICATION_PAYLOAD',
    message: 'No verification payload available.'
  },
  THREEDS_TERM_URL_REQUIRES_BRAINTREE_DOMAIN: {
    type: BraintreeError.types.INTERNAL,
    code: 'THREEDS_TERM_URL_REQUIRES_BRAINTREE_DOMAIN',
    message: 'Term Url must be on a Braintree domain.'
  },
  THREEDS_FRAMEWORK_METHOD_NOT_IMPLEMENTED: {
    type: BraintreeError.types.INTERNAL,
    code: 'THREEDS_FRAMEWORK_METHOD_NOT_IMPLEMENTED',
    message: 'Method not implemented for this framework.'
  }
};

},{"../../lib/braintree-error":112}],184:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../../lib/enumerate');

module.exports = enumerate([
  'AUTHENTICATION_COMPLETE'
], 'threedsecure:');

},{"../../lib/enumerate":125}],185:[function(_dereq_,module,exports){
'use strict';
/**
 * @module braintree-web/unionpay
 * @description This module allows you to accept UnionPay payments. *It is currently in beta and is subject to change.*
 */

var UnionPay = _dereq_('./shared/unionpay');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var BraintreeError = _dereq_('../lib/braintree-error');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var analytics = _dereq_('../lib/analytics');
var errors = _dereq_('./shared/errors');
var VERSION = "3.63.0";
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
* @static
* @function create
* @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
* @param {callback} [callback] The second argument, `data`, is the {@link UnionPay} instance. If no callback is provided, `create` returns a promise that resolves with the {@link UnionPay} instance.
* @returns {(Promise|void)} Returns a promise if no callback is provided.
* @example
* braintree.unionpay.create({ client: clientInstance }, function (createErr, unionpayInstance) {
*   if (createErr) {
*     console.error(createErr);
*     return;
*   }
*   // ...
* });
*/
function create(options) {
  var name = 'UnionPay';

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
    var config = client.getConfiguration();

    options.client = client;

    if (!config.gatewayConfiguration.unionPay || config.gatewayConfiguration.unionPay.enabled !== true) {
      return Promise.reject(new BraintreeError(errors.UNIONPAY_NOT_ENABLED));
    }

    analytics.sendEvent(options.client, 'unionpay.initialized');

    return new UnionPay(options);
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

},{"../lib/analytics":107,"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/promise":146,"./shared/errors":187,"./shared/unionpay":188,"@braintree/wrap-promise":30}],186:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../../lib/enumerate');

module.exports = {
  events: enumerate([
    'HOSTED_FIELDS_FETCH_CAPABILITIES',
    'HOSTED_FIELDS_ENROLL',
    'HOSTED_FIELDS_TOKENIZE'
  ], 'union-pay:'),
  HOSTED_FIELDS_FRAME_NAME: 'braintreeunionpayhostedfields'
};

},{"../../lib/enumerate":125}],187:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Union Pay - Creation Error Codes
 * @description Errors that occur when [creating the Union Pay component](/current/module-braintree-web_union-pay.html#.create).
 * @property {MERCHANT} UNIONPAY_NOT_ENABLED Occurs when Union Pay is not enabled on the Braintree control panel.
 */

/**
 * @name BraintreeError.Union Pay - Shared Error Codes
 * @description Errors that occur when starting the Union Pay Flow
 * @property {MERCHANT} UNIONPAY_CARD_AND_HOSTED_FIELDS_INSTANCES Occurs when a method is used with both card details and a Hosted Fields instance.
 * @property {MERCHANT} UNIONPAY_HOSTED_FIELDS_INSTANCE_INVALID Occurs when Hosted Fields instance used is not a valid Hosted Fields instance.
 * @property {MERCHANT} UNIONPAY_CARD_OR_HOSTED_FIELDS_INSTANCE_REQUIRED Occurs when neither card detals or Hosted Fields are used.
 * @property {MERCHANT} UNIONPAY_HOSTED_FIELDS_INSTANCE_REQUIRED Occurs when Hosted Fields cannot be found on the page.
 */

/**
 * @name BraintreeError.Union Pay - fetchCapabilities Error Codes
 * @description Errors that occur when using the [`fetchCapabilities` method](/current/UnionPay.html#fetchCapabilities).
 * @property {NETWORK} UNIONPAY_FETCH_CAPABILITIES_NETWORK_ERROR Occurs when there is an error looking up the Union Pay capabilities.
 */

/**
 * @name BraintreeError.Union Pay - enroll Error Codes
 * @description Errors that occur when using the [`enroll` method](/current/UnionPay.html#enroll).
 * @property {MERCHANT} UNIONPAY_MISSING_MOBILE_PHONE_DATA Occurs when no mobile phone data is provided.
 * @property {MERCHANT} UNIONPAY_EXPIRATION_DATE_INCOMPLETE Occurs when expiration date is incomplete.
 * @property {CUSTOMER} UNIONPAY_ENROLLMENT_CUSTOMER_INPUT_INVALID Occurs when customer enrollment input is invalid.
 * @property {NETWORK} UNIONPAY_ENROLLMENT_NETWORK_ERROR Occurs when there is an error during enrollment.
 */

/**
 * @name BraintreeError.Union Pay - tokenize Error Codes
 * @description Errors that occur when using the [`tokenize` method](/current/UnionPay.html#tokenize).
 * @property {CUSTOMER} UNIONPAY_FAILED_TOKENIZATION Occurs when data cannot be tokenized.
 * @property {NETWORK} UNIONPAY_TOKENIZATION_NETWORK_ERROR Occurs when the Braintree gateway cannot be reached.
 */

var BraintreeError = _dereq_('../../lib/braintree-error');

module.exports = {
  UNIONPAY_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'UNIONPAY_NOT_ENABLED',
    message: 'UnionPay is not enabled for this merchant.'
  },
  UNIONPAY_HOSTED_FIELDS_INSTANCE_INVALID: {
    type: BraintreeError.types.MERCHANT,
    code: 'UNIONPAY_HOSTED_FIELDS_INSTANCE_INVALID',
    message: 'Found an invalid Hosted Fields instance. Please use a valid Hosted Fields instance.'
  },
  UNIONPAY_HOSTED_FIELDS_INSTANCE_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'UNIONPAY_HOSTED_FIELDS_INSTANCE_REQUIRED',
    message: 'Could not find the Hosted Fields instance.'
  },
  UNIONPAY_CARD_OR_HOSTED_FIELDS_INSTANCE_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'UNIONPAY_CARD_OR_HOSTED_FIELDS_INSTANCE_REQUIRED',
    message: 'A card or a Hosted Fields instance is required. Please supply a card or a Hosted Fields instance.'
  },
  UNIONPAY_CARD_AND_HOSTED_FIELDS_INSTANCES: {
    type: BraintreeError.types.MERCHANT,
    code: 'UNIONPAY_CARD_AND_HOSTED_FIELDS_INSTANCES',
    message: 'Please supply either a card or a Hosted Fields instance, not both.'
  },
  UNIONPAY_EXPIRATION_DATE_INCOMPLETE: {
    type: BraintreeError.types.MERCHANT,
    code: 'UNIONPAY_EXPIRATION_DATE_INCOMPLETE',
    message: 'You must supply expiration month and year or neither.'
  },
  UNIONPAY_ENROLLMENT_CUSTOMER_INPUT_INVALID: {
    type: BraintreeError.types.CUSTOMER,
    code: 'UNIONPAY_ENROLLMENT_CUSTOMER_INPUT_INVALID',
    message: 'Enrollment failed due to user input error.'
  },
  UNIONPAY_ENROLLMENT_NETWORK_ERROR: {
    type: BraintreeError.types.NETWORK,
    code: 'UNIONPAY_ENROLLMENT_NETWORK_ERROR',
    message: 'Could not enroll UnionPay card.'
  },
  UNIONPAY_FETCH_CAPABILITIES_NETWORK_ERROR: {
    type: BraintreeError.types.NETWORK,
    code: 'UNIONPAY_FETCH_CAPABILITIES_NETWORK_ERROR',
    message: 'Could not fetch card capabilities.'
  },
  UNIONPAY_TOKENIZATION_NETWORK_ERROR: {
    type: BraintreeError.types.NETWORK,
    code: 'UNIONPAY_TOKENIZATION_NETWORK_ERROR',
    message: 'A tokenization network error occurred.'
  },
  UNIONPAY_MISSING_MOBILE_PHONE_DATA: {
    type: BraintreeError.types.MERCHANT,
    code: 'UNIONPAY_MISSING_MOBILE_PHONE_DATA',
    message: 'A `mobile` with `countryCode` and `number` is required.'
  },
  UNIONPAY_FAILED_TOKENIZATION: {
    type: BraintreeError.types.CUSTOMER,
    code: 'UNIONPAY_FAILED_TOKENIZATION',
    message: 'The supplied card data failed tokenization.'
  }
};

},{"../../lib/braintree-error":112}],188:[function(_dereq_,module,exports){
'use strict';

var analytics = _dereq_('../../lib/analytics');
var BraintreeError = _dereq_('../../lib/braintree-error');
var Bus = _dereq_('../../lib/bus');
var constants = _dereq_('./constants');
var useMin = _dereq_('../../lib/use-min');
var convertMethodsToError = _dereq_('../../lib/convert-methods-to-error');
var errors = _dereq_('./errors');
var events = constants.events;
var iFramer = _dereq_('@braintree/iframer');
var methods = _dereq_('../../lib/methods');
var VERSION = "3.63.0";
var uuid = _dereq_('../../lib/vendor/uuid');
var Promise = _dereq_('../../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @class
 * @param {object} options See {@link module:braintree-web/unionpay.create|unionpay.create}.
 * @description <strong>You cannot use this constructor directly. Use {@link module:braintree-web/unionpay.create|braintree-web.unionpay.create} instead.</strong>
 * @classdesc This class represents a UnionPay component. Instances of this class have methods for {@link UnionPay#fetchCapabilities fetching capabilities} of UnionPay cards, {@link UnionPay#enroll enrolling} a UnionPay card, and {@link UnionPay#tokenize tokenizing} a UnionPay card.
 */
function UnionPay(options) {
  this._options = options;
}

/**
 * @typedef {object} UnionPay~fetchCapabilitiesPayload
 * @property {boolean} isUnionPay Determines if this card is a UnionPay card.
 * @property {boolean} isDebit Determines if this card is a debit card. This property is only present if `isUnionPay` is `true`.
 * @property {object} unionPay UnionPay specific properties. This property is only present if `isUnionPay` is `true`.
 * @property {boolean} unionPay.supportsTwoStepAuthAndCapture Determines if the card allows for an authorization, but settling the transaction later.
 * @property {boolean} unionPay.isSupported Determines if Braintree can process this UnionPay card. When false, Braintree cannot process this card and the user should use a different card.
 */

/**
 * Fetches the capabilities of a card, including whether or not the SMS enrollment process is required.
 * @public
 * @param {object} options UnionPay {@link UnionPay#fetchCapabilities fetchCapabilities} options
 * @param {object} [options.card] The card from which to fetch capabilities. Note that this will only have one property, `number`. Required if you are not using the `hostedFields` option.
 * @param {string} options.card.number Card number.
 * @param {HostedFields} [options.hostedFields] The Hosted Fields instance used to collect card data. Required if you are not using the `card` option.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link UnionPay#fetchCapabilitiesPayload fetchCapabilitiesPayload}. If no callback is provided, `fetchCapabilities` returns a promise that resolves with a {@link UnionPay#fetchCapabilitiesPayload fetchCapabilitiesPayload}.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
UnionPay.prototype.fetchCapabilities = function (options) {
  var self = this;
  var client = this._options.client;
  var cardNumber = options.card ? options.card.number : null;
  var hostedFields = options.hostedFields;

  if (cardNumber && hostedFields) {
    return Promise.reject(new BraintreeError(errors.UNIONPAY_CARD_AND_HOSTED_FIELDS_INSTANCES));
  } else if (cardNumber) {
    return client.request({
      method: 'get',
      endpoint: 'payment_methods/credit_cards/capabilities',
      data: {
        _meta: {source: 'unionpay'},
        creditCard: {
          number: cardNumber
        }
      }
    }).then(function (response) {
      analytics.sendEvent(client, 'unionpay.capabilities-received');

      return response;
    }).catch(function (err) {
      var status = err.details && err.details.httpStatus;

      analytics.sendEvent(client, 'unionpay.capabilities-failed');

      if (status === 403) {
        return Promise.reject(err);
      }

      return Promise.reject(new BraintreeError({
        type: errors.UNIONPAY_FETCH_CAPABILITIES_NETWORK_ERROR.type,
        code: errors.UNIONPAY_FETCH_CAPABILITIES_NETWORK_ERROR.code,
        message: errors.UNIONPAY_FETCH_CAPABILITIES_NETWORK_ERROR.message,
        details: {
          originalError: err
        }
      }));
    });
  } else if (hostedFields) {
    if (!hostedFields._bus) {
      return Promise.reject(new BraintreeError(errors.UNIONPAY_HOSTED_FIELDS_INSTANCE_INVALID));
    }

    return self._initializeHostedFields().then(function () {
      return new Promise(function (resolve, reject) {
        self._bus.emit(events.HOSTED_FIELDS_FETCH_CAPABILITIES, {hostedFields: hostedFields}, function (response) {
          if (response.err) {
            reject(new BraintreeError(response.err));

            return;
          }

          resolve(response.payload);
        });
      });
    });
  }

  return Promise.reject(new BraintreeError(errors.UNIONPAY_CARD_OR_HOSTED_FIELDS_INSTANCE_REQUIRED));
};

/**
 * @typedef {object} UnionPay~enrollPayload
 * @property {string} enrollmentId UnionPay enrollment ID. This value should be passed to `tokenize`.
 * @property {boolean} smsCodeRequired UnionPay `smsCodeRequired` flag.
 * </p><b>true</b> - the user will receive an SMS code that needs to be supplied for tokenization.
 * </p><b>false</b> - the card can be immediately tokenized.
 */

/**
 * Enrolls a UnionPay card. Use {@link UnionPay#fetchCapabilities|fetchCapabilities} to determine if the SMS enrollment process is required.
 * @public
 * @param {object} options UnionPay enrollment options:
 * @param {object} [options.card] The card to enroll. Required if you are not using the `hostedFields` option.
 * @param {string} options.card.number The card number.
 * @param {string} [options.card.expirationDate] The card's expiration date. May be in the form `MM/YY` or `MM/YYYY`. When defined `expirationMonth` and `expirationYear` are ignored.
 * @param {string} [options.card.expirationMonth] The card's expiration month. This should be used with the `expirationYear` parameter. When `expirationDate` is defined this parameter is ignored.
 * @param {string} [options.card.expirationYear] The card's expiration year. This should be used with the `expirationMonth` parameter. When `expirationDate` is defined this parameter is ignored.
 * @param {HostedFields} [options.hostedFields] The Hosted Fields instance used to collect card data. Required if you are not using the `card` option.
 * @param {object} options.mobile The mobile information collected from the customer.
 * @param {string} options.mobile.countryCode The country code of the customer's mobile phone number.
 * @param {string} options.mobile.number The customer's mobile phone number.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link UnionPay~enrollPayload|enrollPayload}. If no callback is provided, `enroll` returns a promise that resolves with {@link UnionPay~enrollPayload|enrollPayload}.
 * @returns {void}
 */
UnionPay.prototype.enroll = function (options) {
  var self = this;
  var client = this._options.client;
  var card = options.card;
  var mobile = options.mobile;
  var hostedFields = options.hostedFields;
  var data;

  if (!mobile) {
    return Promise.reject(new BraintreeError(errors.UNIONPAY_MISSING_MOBILE_PHONE_DATA));
  }

  if (hostedFields) {
    if (!hostedFields._bus) {
      return Promise.reject(new BraintreeError(errors.UNIONPAY_HOSTED_FIELDS_INSTANCE_INVALID));
    } else if (card) {
      return Promise.reject(new BraintreeError(errors.UNIONPAY_CARD_AND_HOSTED_FIELDS_INSTANCES));
    }

    return new Promise(function (resolve, reject) {
      self._initializeHostedFields().then(function () {
        self._bus.emit(events.HOSTED_FIELDS_ENROLL, {hostedFields: hostedFields, mobile: mobile}, function (response) {
          if (response.err) {
            reject(new BraintreeError(response.err));

            return;
          }

          resolve(response.payload);
        });
      });
    });
  } else if (card && card.number) {
    data = {
      _meta: {source: 'unionpay'},
      unionPayEnrollment: {
        number: card.number,
        mobileCountryCode: mobile.countryCode,
        mobileNumber: mobile.number
      }
    };

    if (card.expirationDate) {
      data.unionPayEnrollment.expirationDate = card.expirationDate;
    } else if (card.expirationMonth || card.expirationYear) {
      if (card.expirationMonth && card.expirationYear) {
        data.unionPayEnrollment.expirationYear = card.expirationYear;
        data.unionPayEnrollment.expirationMonth = card.expirationMonth;
      } else {
        return Promise.reject(new BraintreeError(errors.UNIONPAY_EXPIRATION_DATE_INCOMPLETE));
      }
    }

    return client.request({
      method: 'post',
      endpoint: 'union_pay_enrollments',
      data: data
    }).then(function (response) {
      analytics.sendEvent(client, 'unionpay.enrollment-succeeded');

      return {
        enrollmentId: response.unionPayEnrollmentId,
        smsCodeRequired: response.smsCodeRequired
      };
    }).catch(function (err) {
      var error;
      var status = err.details && err.details.httpStatus;

      if (status === 403) {
        error = err;
      } else if (status < 500) {
        error = new BraintreeError(errors.UNIONPAY_ENROLLMENT_CUSTOMER_INPUT_INVALID);
        error.details = {originalError: err};
      } else {
        error = new BraintreeError(errors.UNIONPAY_ENROLLMENT_NETWORK_ERROR);
        error.details = {originalError: err};
      }

      analytics.sendEvent(client, 'unionpay.enrollment-failed');

      return Promise.reject(error);
    });
  }

  return Promise.reject(new BraintreeError(errors.UNIONPAY_CARD_OR_HOSTED_FIELDS_INSTANCE_REQUIRED));
};

/**
 * @typedef {object} UnionPay~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {string} type Always <code>CreditCard</code>.
 * @property {object} details Additional account details:
 * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
 * @property {string} details.lastFour Last four digits of card number.
 * @property {string} details.lastTwo Last two digits of card number.
 * @property {string} description A human-readable description.
 */

/**
 * Tokenizes a UnionPay card and returns a nonce payload.
 * @public
 * @param {object} options UnionPay tokenization options:
 * @param {object} [options.card] The card to enroll. Required if you are not using the `hostedFields` option.
 * @param {string} options.card.number The card number.
 * @param {string} [options.card.expirationDate] The card's expiration date. May be in the form `MM/YY` or `MM/YYYY`. When defined `expirationMonth` and `expirationYear` are ignored.
 * @param {string} [options.card.expirationMonth] The card's expiration month. This should be used with the `expirationYear` parameter. When `expirationDate` is defined this parameter is ignored.
 * @param {string} [options.card.expirationYear] The card's expiration year. This should be used with the `expirationMonth` parameter. When `expirationDate` is defined this parameter is ignored.
 * @param {string} [options.card.cvv] The card's security number.
 * @param {HostedFields} [options.hostedFields] The Hosted Fields instance used to collect card data. Required if you are not using the `card` option.
 * @param {string} options.enrollmentId The enrollment ID from {@link UnionPay#enroll}.
 * @param {string} [options.smsCode] The SMS code received from the user if {@link UnionPay#enroll} payload have `smsCodeRequired`. if `smsCodeRequired` is false, smsCode should not be passed.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link UnionPay~tokenizePayload|tokenizePayload}. If no callback is provided, `tokenize` returns a promise that resolves with a {@link UnionPay~tokenizePayload|tokenizePayload}.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
UnionPay.prototype.tokenize = function (options) {
  var data;
  var self = this;
  var client = this._options.client;
  var card = options.card;
  var hostedFields = options.hostedFields;

  if (card && hostedFields) {
    return Promise.reject(new BraintreeError(errors.UNIONPAY_CARD_AND_HOSTED_FIELDS_INSTANCES));
  } else if (card) {
    data = {
      _meta: {source: 'unionpay'},
      creditCard: {
        number: options.card.number,
        options: {
          unionPayEnrollment: {
            id: options.enrollmentId
          }
        }
      }
    };

    if (options.smsCode) {
      data.creditCard.options.unionPayEnrollment.smsCode = options.smsCode;
    }

    if (card.expirationDate) {
      data.creditCard.expirationDate = card.expirationDate;
    } else if (card.expirationMonth && card.expirationYear) {
      data.creditCard.expirationYear = card.expirationYear;
      data.creditCard.expirationMonth = card.expirationMonth;
    }

    if (options.card.cvv) {
      data.creditCard.cvv = options.card.cvv;
    }

    return client.request({
      method: 'post',
      endpoint: 'payment_methods/credit_cards',
      data: data
    }).then(function (response) {
      var tokenizedCard = response.creditCards[0];

      delete tokenizedCard.consumed;
      delete tokenizedCard.threeDSecureInfo;

      analytics.sendEvent(client, 'unionpay.nonce-received');

      return tokenizedCard;
    }).catch(function (err) {
      var error;
      var status = err.details && err.details.httpStatus;

      analytics.sendEvent(client, 'unionpay.nonce-failed');

      if (status === 403) {
        error = err;
      } else if (status < 500) {
        error = new BraintreeError(errors.UNIONPAY_FAILED_TOKENIZATION);
        error.details = {originalError: err};
      } else {
        error = new BraintreeError(errors.UNIONPAY_TOKENIZATION_NETWORK_ERROR);
        error.details = {originalError: err};
      }

      return Promise.reject(error);
    });
  } else if (hostedFields) {
    if (!hostedFields._bus) {
      return Promise.reject(new BraintreeError(errors.UNIONPAY_HOSTED_FIELDS_INSTANCE_INVALID));
    }

    return new Promise(function (resolve, reject) {
      self._initializeHostedFields().then(function () {
        self._bus.emit(events.HOSTED_FIELDS_TOKENIZE, options, function (response) {
          if (response.err) {
            reject(new BraintreeError(response.err));

            return;
          }

          resolve(response.payload);
        });
      });
    });
  }

  return Promise.reject(new BraintreeError(errors.UNIONPAY_CARD_OR_HOSTED_FIELDS_INSTANCE_REQUIRED));
};

/**
 * Cleanly remove anything set up by {@link module:braintree-web/unionpay.create|create}. This only needs to be called when using UnionPay with Hosted Fields.
 * @public
 * @param {callback} [callback] Called on completion. If no callback is provided, returns a promise.
 * @example
 * unionpayInstance.teardown();
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
UnionPay.prototype.teardown = function () {
  if (this._bus) {
    this._hostedFieldsFrame.parentNode.removeChild(this._hostedFieldsFrame);
    this._bus.teardown();
  }

  convertMethodsToError(this, methods(UnionPay.prototype));

  return Promise.resolve();
};

UnionPay.prototype._initializeHostedFields = function () {
  var assetsUrl, isDebug;
  var componentId = uuid();
  var self = this;

  if (this._hostedFieldsInitializePromise) {
    return this._hostedFieldsInitializePromise;
  }

  this._hostedFieldsInitializePromise = new Promise(function (resolve) {
    assetsUrl = self._options.client.getConfiguration().gatewayConfiguration.assetsUrl;
    isDebug = self._options.client.getConfiguration().isDebug;

    self._bus = new Bus({
      channel: componentId,
      merchantUrl: location.href
    });
    self._hostedFieldsFrame = iFramer({
      name: constants.HOSTED_FIELDS_FRAME_NAME + '_' + componentId,
      src: assetsUrl + '/web/' + VERSION + '/html/unionpay-hosted-fields-frame' + useMin(isDebug) + '.html',
      height: 0,
      width: 0
    });

    self._bus.on(Bus.events.CONFIGURATION_REQUEST, function (reply) {
      reply(self._options.client);

      resolve();
    });

    document.body.appendChild(self._hostedFieldsFrame);
  });

  return this._hostedFieldsInitializePromise;
};

module.exports = wrapPromise.wrapPrototype(UnionPay);

},{"../../lib/analytics":107,"../../lib/braintree-error":112,"../../lib/bus":115,"../../lib/convert-methods-to-error":118,"../../lib/methods":144,"../../lib/promise":146,"../../lib/use-min":148,"../../lib/vendor/uuid":150,"./constants":186,"./errors":187,"@braintree/iframer":23,"@braintree/wrap-promise":30}],189:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  PLAID_LINK_JS: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
};

},{}],190:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Us Bank Account - Creation Error Codes
 * @description Errors that occur when [creating the Us Bank Account component](/current/module-braintree-web_us-bank-account.html#.create).
 * @property {MERCHANT} US_BANK_ACCOUNT_NOT_ENABLED Occurs when US Bank Account is not enabled in the Braintree control panel.
 */

/**
 * @name BraintreeError.Us Bank Account - tokenize Error Codes
 * @description Errors that occur when using the [`tokenize` method](/current/UsBankAccount.html#tokenize).
 * @property {MERCHANT} US_BANK_ACCOUNT_OPTION_REQUIRED Occurs when a required option is not passed.
 * @property {MERCHANT} US_BANK_ACCOUNT_MUTUALLY_EXCLUSIVE_OPTIONS Occurs when 1 or more incompatible options are passsed.
 * @property {NETWORK} US_BANK_ACCOUNT_LOGIN_LOAD_FAILED Occurs when bank login flow fails.
 * @property {CUSTOMER} US_BANK_ACCOUNT_LOGIN_CLOSED Occurs when bank login window is closed.
 * @property {MERCHANT} US_BANK_ACCOUNT_LOGIN_REQUEST_ACTIVE Occurs when a bank login flow is already active.
 * @property {NETWORK} US_BANK_ACCOUNT_TOKENIZATION_NETWORK_ERROR Occurs when payment details could not be tokenized.
 * @property {CUSTOMER} US_BANK_ACCOUNT_FAILED_TOKENIZATION Occurs when payment details failed to be tokenized.
 * @property {MERCHANT} US_BANK_ACCOUNT_BANK_LOGIN_NOT_ENABLED Occurs when bank login flow is not enabled in the Braintree control panel.
 */

var BraintreeError = _dereq_('../lib/braintree-error');

module.exports = {
  US_BANK_ACCOUNT_OPTION_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'US_BANK_ACCOUNT_OPTION_REQUIRED'
  },
  US_BANK_ACCOUNT_MUTUALLY_EXCLUSIVE_OPTIONS: {
    type: BraintreeError.types.MERCHANT,
    code: 'US_BANK_ACCOUNT_MUTUALLY_EXCLUSIVE_OPTIONS'
  },
  US_BANK_ACCOUNT_LOGIN_LOAD_FAILED: {
    type: BraintreeError.types.NETWORK,
    code: 'US_BANK_ACCOUNT_LOGIN_LOAD_FAILED',
    message: 'Bank login flow failed to load.'
  },
  US_BANK_ACCOUNT_LOGIN_CLOSED: {
    type: BraintreeError.types.CUSTOMER,
    code: 'US_BANK_ACCOUNT_LOGIN_CLOSED',
    message: 'Customer closed bank login flow before authorizing.'
  },
  US_BANK_ACCOUNT_LOGIN_REQUEST_ACTIVE: {
    type: BraintreeError.types.MERCHANT,
    code: 'US_BANK_ACCOUNT_LOGIN_REQUEST_ACTIVE',
    message: 'Another bank login tokenization request is active.'
  },
  US_BANK_ACCOUNT_TOKENIZATION_NETWORK_ERROR: {
    type: BraintreeError.types.NETWORK,
    code: 'US_BANK_ACCOUNT_TOKENIZATION_NETWORK_ERROR',
    message: 'A tokenization network error occurred.'
  },
  US_BANK_ACCOUNT_FAILED_TOKENIZATION: {
    type: BraintreeError.types.CUSTOMER,
    code: 'US_BANK_ACCOUNT_FAILED_TOKENIZATION',
    message: 'The supplied data failed tokenization.'
  },
  US_BANK_ACCOUNT_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'US_BANK_ACCOUNT_NOT_ENABLED',
    message: 'US bank account is not enabled.'
  },
  US_BANK_ACCOUNT_BANK_LOGIN_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'US_BANK_ACCOUNT_BANK_LOGIN_NOT_ENABLED',
    message: 'Bank login is not enabled.'
  }
};

},{"../lib/braintree-error":112}],191:[function(_dereq_,module,exports){
'use strict';
/**
 * @module braintree-web/us-bank-account
 * @description This module is for accepting payments of US bank accounts.
 */

var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var BraintreeError = _dereq_('../lib/braintree-error');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var errors = _dereq_('./errors');
var USBankAccount = _dereq_('./us-bank-account');
var VERSION = "3.63.0";
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {callback} [callback] The second argument, `data`, is the {@link USBankAccount} instance. If no callback is provided, `create` returns a promise that resolves with the {@link USBankAccount} instance.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
function create(options) {
  var name = 'US Bank Account';

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
    var usBankAccount;

    options.client = client;

    usBankAccount = options.client.getConfiguration().gatewayConfiguration.usBankAccount;
    if (!usBankAccount) {
      return Promise.reject(new BraintreeError(errors.US_BANK_ACCOUNT_NOT_ENABLED));
    }

    return new USBankAccount(options);
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

},{"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/promise":146,"./errors":190,"./us-bank-account":192,"@braintree/wrap-promise":30}],192:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('../lib/braintree-error');
var constants = _dereq_('./constants');
var errors = _dereq_('./errors');
var sharedErrors = _dereq_('../lib/errors');
var analytics = _dereq_('../lib/analytics');
var once = _dereq_('../lib/once');
var convertMethodsToError = _dereq_('../lib/convert-methods-to-error');
var methods = _dereq_('../lib/methods');
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');

var TOKENIZE_BANK_DETAILS_MUTATION = createGraphQLMutation('UsBankAccount');
var TOKENIZE_BANK_LOGIN_MUTATION = createGraphQLMutation('UsBankLogin');

/**
 * @typedef {object} USBankAccount~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {string} type The payment method type, always `us_bank_account`.
 * @property {object} details Additional account details. Currently empty.
 */

/**
 * @class
 * @param {object} options See {@link module:braintree-web/us-bank-account.create|us-bank-account.create}.
 * @classdesc This class represents a US Bank Account component. Instances of this class can tokenize raw bank details or present a bank login. <strong>You cannot use this constructor directly. Use {@link module:braintree-web/us-bank-account.create|braintree.us-bank-account.create} instead.</strong>
 */
function USBankAccount(options) {
  this._client = options.client;

  this._isTokenizingBankLogin = false;

  analytics.sendEvent(this._client, 'usbankaccount.initialized');
}

/**
 * Tokenizes bank information to return a payment method nonce. You can tokenize bank details by providing information like account and routing numbers. You can also tokenize with a bank login UI that prompts the customer to log into their bank account.
 * @public
 * @param {object} options All tokenization options for the US Bank Account component.
 * @param {string} options.mandateText A string for proof of customer authorization. For example, `'I authorize Braintree to debit my bank account on behalf of My Online Store.'`.
 * @param {object} [options.bankDetails] Bank detail information (such as account and routing numbers). `bankDetails` or `bankLogin` option must be provided.
 * @param {string} options.bankDetails.routingNumber The customer's bank routing number, such as `'307075259'`.
 * @param {string} options.bankDetails.accountNumber The customer's bank account number, such as `'999999999'`.
 * @param {string} options.bankDetails.accountType The customer's bank account type. Must be `'checking'` or `'savings'`.
 * @param {string} options.bankDetails.ownershipType The customer's bank account ownership type. Must be `'personal'` or `'business'`.
 * @param {string} [options.bankDetails.firstName] The customer's first name. Required when account ownership type is `personal`.
 * @param {string} [options.bankDetails.lastName] The customer's last name. Required when account ownership type is `personal`.
 * @param {string} [options.bankDetails.businessName] The customer's business name. Required when account ownership type is `business`.
 * @param {object} options.bankDetails.billingAddress The customer's billing address.
 * @param {string} options.bankDetails.billingAddress.streetAddress The street address for the customer's billing address, such as `'123 Fake St'`.
 * @param {string} [options.bankDetails.billingAddress.extendedAddress] The extended street address for the customer's billing address, such as `'Apartment B'`.
 * @param {string} options.bankDetails.billingAddress.locality The locality for the customer's billing address. This is typically a city, such as `'San Francisco'`.
 * @param {string} options.bankDetails.billingAddress.region The region for the customer's billing address. This is typically a state, such as `'CA'`.
 * @param {string} options.bankDetails.billingAddress.postalCode The postal code for the customer's billing address. This is typically a ZIP code, such as `'94119'`.
 * @param {object} [options.bankLogin] Bank login information. `bankLogin` or `bankDetails` option must be provided.
 * @param {string} options.bankLogin.displayName Display name for the bank login UI, such as `'My Store'`.
 * @param {string} options.bankLogin.ownershipType The customer's bank account ownership type. Must be `'personal'` or `'business'`.
 * @param {string} [options.bankLogin.firstName] The customer's first name. Required when account ownership type is `personal`.
 * @param {string} [options.bankLogin.lastName] The customer's last name. Required when account ownership type is `personal`.
 * @param {string} [options.bankLogin.businessName] The customer's business name. Required when account ownership type is `business`.
 * @param {object} options.bankLogin.billingAddress The customer's billing address.
 * @param {string} options.bankLogin.billingAddress.streetAddress The street address for the customer's billing address, such as `'123 Fake St'`.
 * @param {string} [options.bankLogin.billingAddress.extendedAddress] The extended street address for the customer's billing address, such as `'Apartment B'`.
 * @param {string} options.bankLogin.billingAddress.locality The locality for the customer's billing address. This is typically a city, such as `'San Francisco'`.
 * @param {string} options.bankLogin.billingAddress.region The region for the customer's billing address. This is typically a state, such as `'CA'`.
 * @param {string} options.bankLogin.billingAddress.postalCode The postal code for the customer's billing address. This is typically a ZIP code, such as `'94119'`.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link USBankAccount~tokenizePayload|tokenizePayload}. If no callback is provided, `tokenize` returns a promise that resolves with {@link USBankAccount~tokenizePayload|tokenizePayload}.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * <caption>Tokenizing raw bank details</caption>
 * var routingNumberInput = document.querySelector('input[name="routing-number"]');
 * var accountNumberInput = document.querySelector('input[name="account-number"]');
 * var accountTypeInput = document.querySelector('input[name="account-type"]:checked');
 * var ownershipTypeInput = document.querySelector('input[name="ownership-type"]:checked');
 * var firstNameInput = document.querySelector('input[name="first-name"]');
 * var lastNameInput = document.querySelector('input[name="last-name"]');
 * var businessNameInput = document.querySelector('input[name="business-name"]');
 * var billingAddressStreetInput = document.querySelector('input[name="street-address"]');
 * var billingAddressExtendedInput = document.querySelector('input[name="extended-address"]');
 * var billingAddressLocalityInput = document.querySelector('input[name="locality"]');
 * var billingAddressRegionSelect = document.querySelector('select[name="region"]');
 * var billingAddressPostalInput = document.querySelector('input[name="postal-code"]');
 *
 * submitButton.addEventListener('click', function (event) {
 *   var bankDetails = {
 *     routingNumber: routingNumberInput.value,
 *     accountNumber: accountNumberInput.value,
 *     accountType: accountTypeInput.value,
 *     ownershipType: ownershipTypeInput.value,
 *     billingAddress: {
 *       streetAddress: billingAddressStreetInput.value,
 *       extendedAddress: billingAddressExtendedInput.value,
 *       locality: billingAddressLocalityInput.value,
 *       region: billingAddressRegionSelect.value,
 *       postalCode: billingAddressPostalInput.value
 *     }
 *   };
 *
 *   if (bankDetails.ownershipType === 'personal') {
 *     bankDetails.firstName = firstNameInput.value;
 *     bankDetails.lastName = lastNameInput.value;
 *   } else {
 *     bankDetails.businessName = businessNameInput.value;
 *   }
 *
 *   event.preventDefault();
 *
 *   usBankAccountInstance.tokenize({
 *     bankDetails: bankDetails,
 *     mandateText: 'I authorize Braintree to debit my bank account on behalf of My Online Store.'
 *   }, function (tokenizeErr, tokenizedPayload) {
 *     if (tokenizeErr) {
 *       console.error('There was an error tokenizing the bank details.');
 *       return;
 *     }
 *
 *     // Send tokenizePayload.nonce to your server here!
 *   });
 * });
 * @example
 * <caption>Tokenizing with bank login UI</caption>
 * var ownershipTypeInput = document.querySelector('input[name="ownership-type"]:checked');
 * var firstNameInput = document.querySelector('input[name="first-name"]');
 * var lastNameInput = document.querySelector('input[name="last-name"]');
 * var businessNameInput = document.querySelector('input[name="business-name"]');
 * var billingAddressStreetInput = document.querySelector('input[name="street-address"]');
 * var billingAddressExtendedInput = document.querySelector('input[name="extended-address"]');
 * var billingAddressLocalityInput = document.querySelector('input[name="locality"]');
 * var billingAddressRegionSelect = document.querySelector('select[name="region"]');
 * var billingAddressPostalInput = document.querySelector('input[name="postal-code"]');
 *
 * bankLoginButton.addEventListener('click', function (event) {
 *   var bankLogin = {
 *     displayName: 'My Online Store',
 *     ownershipType: ownershipTypeInput.value,
 *     billingAddress: {
 *       streetAddress: billingAddressStreetInput.value,
 *       extendedAddress: billingAddressExtendedInput.value,
 *       locality: billingAddressLocalityInput.value,
 *       region: billingAddressRegionSelect.value,
 *       postalCode: billingAddressPostalInput.value
 *     }
 *   }
 *   event.preventDefault();
 *
 *   if (bankLogin.ownershipType === 'personal') {
 *     bankLogin.firstName = firstNameInput.value;
 *     bankLogin.lastName = lastNameInput.value;
 *   } else {
 *     bankLogin.businessName = businessNameInput.value;
 *   }
 *
 *   usBankAccountInstance.tokenize({
 *     bankLogin: bankLogin,
 *     mandateText: 'I authorize Braintree to debit my bank account on behalf of My Online Store.'
 *   }, function (tokenizeErr, tokenizedPayload) {
 *     if (tokenizeErr) {
 *       console.error('There was an error tokenizing the bank details.');
 *       return;
 *     }
 *
 *     // Send tokenizePayload.nonce to your server here!
 *   });
 * });
 */
USBankAccount.prototype.tokenize = function (options) {
  options = options || {};

  if (!options.mandateText) {
    return Promise.reject(new BraintreeError({
      type: errors.US_BANK_ACCOUNT_OPTION_REQUIRED.type,
      code: errors.US_BANK_ACCOUNT_OPTION_REQUIRED.code,
      message: 'mandateText property is required.'
    }));
  }

  if (options.bankDetails && options.bankLogin) {
    return Promise.reject(new BraintreeError({
      type: errors.US_BANK_ACCOUNT_MUTUALLY_EXCLUSIVE_OPTIONS.type,
      code: errors.US_BANK_ACCOUNT_MUTUALLY_EXCLUSIVE_OPTIONS.code,
      message: 'tokenize must be called with bankDetails or bankLogin, not both.'
    }));
  } else if (options.bankDetails) {
    return this._tokenizeBankDetails(options);
  } else if (options.bankLogin) {
    return this._tokenizeBankLogin(options);
  }

  return Promise.reject(new BraintreeError({
    type: errors.US_BANK_ACCOUNT_OPTION_REQUIRED.type,
    code: errors.US_BANK_ACCOUNT_OPTION_REQUIRED.code,
    message: 'tokenize must be called with bankDetails or bankLogin.'
  }));
};

USBankAccount.prototype._tokenizeBankDetails = function (options) {
  var client = this._client;
  var bankDetails = options.bankDetails;
  var data = {
    achMandate: options.mandateText,
    routingNumber: bankDetails.routingNumber,
    accountNumber: bankDetails.accountNumber,
    accountType: bankDetails.accountType.toUpperCase(),
    billingAddress: formatBillingAddressForGraphQL(bankDetails.billingAddress || {})
  };

  formatDataForOwnershipType(data, bankDetails);

  return client.request({
    api: 'graphQLApi',
    data: {
      query: TOKENIZE_BANK_DETAILS_MUTATION,
      variables: {
        input: {
          usBankAccount: data
        }
      }
    }
  }).then(function (response) {
    analytics.sendEvent(client, 'usbankaccount.bankdetails.tokenization.succeeded');

    return Promise.resolve(formatTokenizeResponseFromGraphQL(response, 'tokenizeUsBankAccount'));
  }).catch(function (err) {
    var error = errorFrom(err);

    analytics.sendEvent(client, 'usbankaccount.bankdetails.tokenization.failed');

    return Promise.reject(error);
  });
};

USBankAccount.prototype._tokenizeBankLogin = function (options) {
  var self = this;
  var client = this._client;
  var gatewayConfiguration = client.getConfiguration().gatewayConfiguration;
  var isProduction = gatewayConfiguration.environment === 'production';
  var plaidConfig = gatewayConfiguration.usBankAccount.plaid;

  if (!options.bankLogin.displayName) {
    return Promise.reject(new BraintreeError({
      type: errors.US_BANK_ACCOUNT_OPTION_REQUIRED.type,
      code: errors.US_BANK_ACCOUNT_OPTION_REQUIRED.code,
      message: 'displayName property is required when using bankLogin.'
    }));
  }

  if (!plaidConfig) {
    return Promise.reject(new BraintreeError(errors.US_BANK_ACCOUNT_BANK_LOGIN_NOT_ENABLED));
  }

  if (this._isTokenizingBankLogin) {
    return Promise.reject(new BraintreeError(errors.US_BANK_ACCOUNT_LOGIN_REQUEST_ACTIVE));
  }
  this._isTokenizingBankLogin = true;

  return new Promise(function (resolve, reject) {
    self._loadPlaid(function (plaidLoadErr, plaid) {
      if (plaidLoadErr) {
        reject(plaidLoadErr);

        return;
      }

      plaid.create({
        clientName: options.bankLogin.displayName,
        apiVersion: 'v2',
        env: isProduction ? 'production' : 'sandbox',
        key: plaidConfig.publicKey,
        product: 'auth',
        selectAccount: true,
        onExit: function () {
          self._isTokenizingBankLogin = false;

          analytics.sendEvent(client, 'usbankaccount.banklogin.tokenization.closed.by-user');

          reject(new BraintreeError(errors.US_BANK_ACCOUNT_LOGIN_CLOSED));
        },
        onSuccess: function (publicToken, metadata) {
          var bankLogin = options.bankLogin;
          var data = {
            publicToken: publicToken,
            accountId: isProduction ? metadata.account_id : 'plaid_account_id',
            accountType: metadata.account.subtype.toUpperCase(),
            achMandate: options.mandateText,
            billingAddress: formatBillingAddressForGraphQL(bankLogin.billingAddress || {})
          };

          formatDataForOwnershipType(data, bankLogin);

          client.request({
            api: 'graphQLApi',
            data: {
              query: TOKENIZE_BANK_LOGIN_MUTATION,
              variables: {
                input: {
                  usBankLogin: data
                }
              }
            }
          }).then(function (response) {
            self._isTokenizingBankLogin = false;

            analytics.sendEvent(client, 'usbankaccount.banklogin.tokenization.succeeded');

            resolve(formatTokenizeResponseFromGraphQL(response, 'tokenizeUsBankLogin'));
          }).catch(function (tokenizeErr) {
            var error;

            self._isTokenizingBankLogin = false;
            error = errorFrom(tokenizeErr);

            analytics.sendEvent(client, 'usbankaccount.banklogin.tokenization.failed');

            reject(error);
          });
        }
      }).open();

      analytics.sendEvent(client, 'usbankaccount.banklogin.tokenization.started');
    });
  });
};

function errorFrom(err) {
  var error;
  var status = err.details && err.details.httpStatus;

  if (status === 401) {
    error = new BraintreeError(sharedErrors.BRAINTREE_API_ACCESS_RESTRICTED);
  } else if (status < 500) {
    error = new BraintreeError(errors.US_BANK_ACCOUNT_FAILED_TOKENIZATION);
  } else {
    error = new BraintreeError(errors.US_BANK_ACCOUNT_TOKENIZATION_NETWORK_ERROR);
  }
  error.details = {originalError: err};

  return error;
}

function formatTokenizeResponseFromGraphQL(response, type) {
  var data = response.data[type].paymentMethod;
  var last4 = data.details.last4;
  var description = 'US bank account ending in - ' + last4;

  return {
    nonce: data.id,
    details: {},
    description: description,
    type: 'us_bank_account'
  };
}

USBankAccount.prototype._loadPlaid = function (callback) {
  var existingScript, script;

  callback = once(callback);

  if (window.Plaid) {
    callback(null, window.Plaid);

    return;
  }

  existingScript = document.querySelector('script[src="' + constants.PLAID_LINK_JS + '"]');

  if (existingScript) {
    addLoadListeners(existingScript, callback);
  } else {
    script = document.createElement('script');

    script.src = constants.PLAID_LINK_JS;
    script.async = true;

    addLoadListeners(script, callback);

    document.body.appendChild(script);

    this._plaidScript = script;
  }
};

function addLoadListeners(script, callback) {
  function loadHandler() {
    var readyState = this.readyState; // eslint-disable-line no-invalid-this

    if (!readyState || readyState === 'loaded' || readyState === 'complete') {
      removeLoadListeners();
      callback(null, window.Plaid);
    }
  }

  function errorHandler() {
    script.parentNode.removeChild(script);

    callback(new BraintreeError(errors.US_BANK_ACCOUNT_LOGIN_LOAD_FAILED));
  }

  function removeLoadListeners() {
    script.removeEventListener('error', errorHandler);
    script.removeEventListener('load', loadHandler);
    script.removeEventListener('readystatechange', loadHandler);
  }

  script.addEventListener('error', errorHandler);
  script.addEventListener('load', loadHandler);
  script.addEventListener('readystatechange', loadHandler);
}

function formatBillingAddressForGraphQL(address) {
  return {
    streetAddress: address.streetAddress,
    extendedAddress: address.extendedAddress,
    city: address.locality,
    state: address.region,
    zipCode: address.postalCode
  };
}

function formatDataForOwnershipType(data, details) {
  if (details.ownershipType === 'personal') {
    data.individualOwner = {
      firstName: details.firstName,
      lastName: details.lastName
    };
  } else if (details.ownershipType === 'business') {
    data.businessOwner = {
      businessName: details.businessName
    };
  }
}

function createGraphQLMutation(type) {
  return '' +
    'mutation Tokenize' + type + '($input: Tokenize' + type + 'Input!) {' +
    '  tokenize' + type + '(input: $input) {' +
    '    paymentMethod {' +
    '      id' +
    '      details {' +
    '        ... on UsBankAccountDetails {' +
    '          last4' +
    '        }' +
    '      }' +
    '    }' +
    '  }' +
    '}';
}

/**
 * Cleanly tear down anything set up by {@link module:braintree-web/us-bank-account.create|create}.
 * @public
 * @param {callback} [callback] Called once teardown is complete. No data is returned if teardown completes successfully.
 * @example
 * usBankAccountInstance.teardown();
 * @example <caption>With callback</caption>
 * usBankAccountInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
USBankAccount.prototype.teardown = function () {
  if (this._plaidScript) {
    document.body.removeChild(this._plaidScript);
  }

  convertMethodsToError(this, methods(USBankAccount.prototype));

  return Promise.resolve();
};

module.exports = wrapPromise.wrapPrototype(USBankAccount);

},{"../lib/analytics":107,"../lib/braintree-error":112,"../lib/convert-methods-to-error":118,"../lib/errors":126,"../lib/methods":144,"../lib/once":145,"../lib/promise":146,"./constants":189,"./errors":190,"@braintree/wrap-promise":30}],193:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Vault Manager - deletePaymentMethod Error Codes
 * @description Errors that occur when using the [`deletePaymentMethod` method](/current/VaultManager.html#deletePaymentMethod).
 * @property {MERCHANT} VAULT_MANAGER_DELETE_PAYMENT_METHOD_NONCE_REQUIRES_CLIENT_TOKEN Occurs when vault manager is initalized with a tokenization key instead of a Client Token.
 * @property {MERCHANT} VAULT_MANAGER_PAYMENT_METHOD_NONCE_NOT_FOUND Occurs when the specified payment method can not be found.
 * @property {UNKNOWN} VAULT_MANAGER_DELETE_PAYMENT_METHOD_UNKNOWN_ERROR Occurs when there is an error attempting to delete the payment method.
 */

var BraintreeError = _dereq_('../lib/braintree-error');

module.exports = {
  VAULT_MANAGER_DELETE_PAYMENT_METHOD_NONCE_REQUIRES_CLIENT_TOKEN: {
    type: BraintreeError.types.MERCHANT,
    code: 'VAULT_MANAGER_DELETE_PAYMENT_METHOD_NONCE_REQUIRES_CLIENT_TOKEN',
    message: 'A client token with a customer id must be used to delete a payment method nonce.'
  },
  VAULT_MANAGER_PAYMENT_METHOD_NONCE_NOT_FOUND: {
    type: BraintreeError.types.MERCHANT,
    code: 'VAULT_MANAGER_PAYMENT_METHOD_NONCE_NOT_FOUND'
  },
  VAULT_MANAGER_DELETE_PAYMENT_METHOD_UNKNOWN_ERROR: {
    type: BraintreeError.types.UNKNOWN,
    code: 'VAULT_MANAGER_DELETE_PAYMENT_METHOD_UNKNOWN_ERROR'
  }
};

},{"../lib/braintree-error":112}],194:[function(_dereq_,module,exports){
'use strict';
/**
 * @module braintree-web/vault-manager
 * @description Manages customer's payment methods.
 */

var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var VaultManager = _dereq_('./vault-manager');
var VERSION = "3.63.0";
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {callback} callback The second argument, `data`, is the {@link VaultManager} instance.
 * @returns {void}
 */
function create(options) {
  var name = 'Vault Manager';

  return basicComponentVerification.verify({
    name: name,
    client: options.client,
    authorization: options.authorization
  }).then(function () {
    return new VaultManager({
      createPromise: createDeferredClient.create({
        authorization: options.authorization,
        client: options.client,
        debug: options.debug,
        assetsUrl: createAssetsUrl.create(options.authorization),
        name: name
      })
    });
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

},{"../lib/basic-component-verification":110,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"./vault-manager":195,"@braintree/wrap-promise":30}],195:[function(_dereq_,module,exports){
'use strict';

var analytics = _dereq_('../lib/analytics');
var BraintreeError = _dereq_('../lib/braintree-error');
var errors = _dereq_('./errors');
var convertMethodsToError = _dereq_('../lib/convert-methods-to-error');
var methods = _dereq_('../lib/methods');
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');

var DELETE_PAYMENT_METHOD_MUTATION = 'mutation DeletePaymentMethodFromSingleUseToken($input: DeletePaymentMethodFromSingleUseTokenInput!) {' +
'  deletePaymentMethodFromSingleUseToken(input: $input) {' +
'    clientMutationId' +
'  }' +
'}';

/**
 * @typedef {array} VaultManager~fetchPaymentMethodsPayload The customer's payment methods.
 * @property {object} paymentMethod The payment method object.
 * @property {string} paymentMethod.nonce A nonce that can be sent to your server to transact on the payment method.
 * @property {boolean} paymentMethod.default Whether or not this is the default payment method for the customer.
 * @property {object} paymentMethod.details Any additional details about the payment method. Varies depending on the type of payment method.
 * @property {string} paymentMethod.type A constant indicating the type of payment method.
 * @property {?string} paymentMethod.description Additional description about the payment method.
 * @property {?object} paymentMethod.binData Bin data about the payment method.
 *
 */

/**
 * @class
 * @param {object} options Options
 * @description <strong>You cannot use this constructor directly. Use {@link module:braintree-web/vault-manager.create|braintree.vault-manager.create} instead.</strong>
 * @classdesc This class allows you to manage a customer's payment methods on the client.
 */
function VaultManager(options) {
  this._createPromise = options.createPromise;
}

/**
 * Fetches payment methods owned by the customer whose id was used to generate the client token used to create the {@link module:braintree-web/client|client}.
 * @public
 * @param {object} [options] Options for fetching payment methods.
 * @param {boolean} [options.defaultFirst = false] If `true`, the payment methods will be returned with the default payment method for the customer first. Otherwise, the payment methods will be returned with the most recently used payment method first.
 * @param {callback} [callback] The second argument is a {@link VaultManager~fetchPaymentMethodsPayload|fetchPaymentMehodsPayload}. This is also what is resolved by the promise if no callback is provided.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * vaultManagerInstance.fetchPaymentMethods(function (err, paymentMethods) {
 *   paymentMethods.forEach(function (paymentMethod) {
 *     // add payment method to UI
 *     // paymentMethod.nonce <- transactable nonce associated with payment method
 *     // paymentMethod.details <- object with additional information about payment method
 *     // paymentMethod.type <- a constant signifying the type
 *   });
 * });
 */
VaultManager.prototype.fetchPaymentMethods = function (options) {
  var defaultFirst;

  options = options || {};

  defaultFirst = options.defaultFirst === true ? 1 : 0;

  return this._createPromise.then(function (client) {
    return client.request({
      endpoint: 'payment_methods',
      method: 'get',
      data: {
        defaultFirst: defaultFirst
      }
    });
  }).then(function (paymentMethodsPayload) {
    analytics.sendEvent(this._createPromise, 'vault-manager.fetch-payment-methods.succeeded');

    return paymentMethodsPayload.paymentMethods.map(formatPaymentMethodPayload);
  }.bind(this));
};

// TODO hide from jsdoc for now until the GraphQL API is on for all merchants by default
/**
 * Deletes a payment method owned by the customer whose id was used to generate the client token used to create the {@link module:braintree-web/client|client}.
 * @public
 * @ignore
 * @param {string} paymentMethodNonce The payment method nonce that references a vaulted payment method.
 * @param {callback} [callback] No data is returned if the operation is successful.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * vaultManagerInstance.deletePaymentMethod('nonce-to-delete', function (err) {
 *   // handle err if it exists
 * });
 */
VaultManager.prototype.deletePaymentMethod = function (paymentMethodNonce) {
  return this._createPromise.then(function (client) {
    var usesClientToken = client.getConfiguration().authorizationType === 'CLIENT_TOKEN';

    if (!usesClientToken) {
      return Promise.reject(new BraintreeError(errors.VAULT_MANAGER_DELETE_PAYMENT_METHOD_NONCE_REQUIRES_CLIENT_TOKEN));
    }

    return client.request({
      api: 'graphQLApi',
      data: {
        query: DELETE_PAYMENT_METHOD_MUTATION,
        variables: {
          input: {
            singleUseTokenId: paymentMethodNonce
          }
        },
        operationName: 'DeletePaymentMethodFromSingleUseToken'
      }
    }).then(function () {
      analytics.sendEvent(client, 'vault-manager.delete-payment-method.succeeded');

      // noop to prevent sending back the raw graphql data
    }).catch(function (error) {
      var originalError = error.details.originalError;
      var formattedError;

      analytics.sendEvent(client, 'vault-manager.delete-payment-method.failed');

      if (originalError[0] && originalError[0].extensions.errorClass === 'NOT_FOUND') {
        formattedError = new BraintreeError({
          type: errors.VAULT_MANAGER_PAYMENT_METHOD_NONCE_NOT_FOUND.type,
          code: errors.VAULT_MANAGER_PAYMENT_METHOD_NONCE_NOT_FOUND.code,
          message: 'A payment method for payment method nonce `' + paymentMethodNonce + '` could not be found.',
          details: {
            originalError: originalError
          }
        });
      }

      if (!formattedError) {
        formattedError = new BraintreeError({
          type: errors.VAULT_MANAGER_DELETE_PAYMENT_METHOD_UNKNOWN_ERROR.type,
          code: errors.VAULT_MANAGER_DELETE_PAYMENT_METHOD_UNKNOWN_ERROR.code,
          message: 'An unknown error occured when attempting to delete the payment method assocaited with the payment method nonce `' + paymentMethodNonce + '`.',
          details: {
            originalError: originalError
          }
        });
      }

      return Promise.reject(formattedError);
    });
  });
};

function formatPaymentMethodPayload(paymentMethod) {
  var formattedPaymentMethod = {
    nonce: paymentMethod.nonce,
    'default': paymentMethod.default,
    details: paymentMethod.details,
    hasSubscription: paymentMethod.hasSubscription,
    type: paymentMethod.type
  };

  if (paymentMethod.description) {
    formattedPaymentMethod.description = paymentMethod.description;
  }

  if (paymentMethod.binData) {
    formattedPaymentMethod.binData = paymentMethod.binData;
  }

  return formattedPaymentMethod;
}

/**
 * Cleanly tear down anything set up by {@link module:braintree-web/vault-manager.create|create}.
 * @public
 * @param {callback} [callback] Called once teardown is complete. No data is returned if teardown completes successfully.
 * @example
 * vaultManagerInstance.teardown();
 * @example <caption>With callback</caption>
 * vaultManagerInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
VaultManager.prototype.teardown = function () {
  convertMethodsToError(this, methods(VaultManager.prototype));

  return Promise.resolve();
};

module.exports = wrapPromise.wrapPrototype(VaultManager);

},{"../lib/analytics":107,"../lib/braintree-error":112,"../lib/convert-methods-to-error":118,"../lib/methods":144,"../lib/promise":146,"./errors":193,"@braintree/wrap-promise":30}],196:[function(_dereq_,module,exports){
'use strict';
/** @module braintree-web/venmo */

var analytics = _dereq_('../lib/analytics');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var errors = _dereq_('./shared/errors');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var BraintreeError = _dereq_('../lib/braintree-error');
var Venmo = _dereq_('./venmo');
var Promise = _dereq_('../lib/promise');
var supportsVenmo = _dereq_('./shared/supports-venmo');
var VERSION = "3.63.0";

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {boolean} [options.allowNewBrowserTab=true] This should be set to false if your payment flow requires returning to the same tab, e.g. single page applications. Doing so causes {@link Venmo#isBrowserSupported|isBrowserSupported} to return true only for mobile web browsers that support returning from the Venmo app to the same tab.
 * @param {boolean} [options.ignoreHistoryChanges=false] When the Venmo app returns to the website, it will modify the hash of the url to include data about the tokenization. By default, the SDK will put the state of the hash back to where it was before the change was made. Pass `true` to handle the hash change instead of the SDK.
 * @param {string} [options.profileId] The Venmo profile ID to be used during payment authorization. Customers will see the business name and logo associated with this Venmo profile, and it will show up in the Venmo app as a "Connected Merchant". Venmo profile IDs can be found in the Braintree Control Panel. Omitting this value will use the default Venmo profile.
 * @param {string} [options.deepLinkReturnUrl] An override for the URL that the Venmo iOS app opens to return from an app switch.
 * @param {callback} [callback] The second argument, `data`, is the {@link Venmo} instance. If no callback is provided, `create` returns a promise that resolves with the {@link Venmo} instance.
 * @example
 * braintree.venmo.create({
 *   client: clientInstance
 * }).then(function (venmoInstance) {
 *   // venmoInstance is ready to be used.
 * }).catch(function (createErr) {
 *   console.error('Error creating Venmo instance', createErr);
 * });
 * @returns {(Promise|void)} Returns the Venmo instance.
 */
function create(options) {
  var name = 'Venmo';

  return basicComponentVerification.verify({
    name: name,
    client: options.client,
    authorization: options.authorization
  }).then(function () {
    var createPromise, instance;

    if (options.profileId && typeof options.profileId !== 'string') {
      return Promise.reject(new BraintreeError(errors.VENMO_INVALID_PROFILE_ID));
    }

    if (options.deepLinkReturnUrl && typeof options.deepLinkReturnUrl !== 'string') {
      return Promise.reject(new BraintreeError(errors.VENMO_INVALID_DEEP_LINK_RETURN_URL));
    }

    createPromise = createDeferredClient.create({
      authorization: options.authorization,
      client: options.client,
      debug: options.debug,
      assetsUrl: createAssetsUrl.create(options.authorization),
      name: name
    }).then(function (client) {
      var configuration = client.getConfiguration();

      options.client = client;

      if (!configuration.gatewayConfiguration.payWithVenmo) {
        return Promise.reject(new BraintreeError(errors.VENMO_NOT_ENABLED));
      }

      return client;
    });

    options.createPromise = createPromise;
    instance = new Venmo(options);

    analytics.sendEvent(createPromise, 'venmo.initialized');

    if (options.client) {
      return createPromise.then(function () {
        return instance;
      });
    }

    return instance;
  });
}

/**
 * @static
 * @function isBrowserSupported
 * @param {object} [options] browser support options:
 * @param {boolean} [options.allowNewBrowserTab=true] This should be set to false if your payment flow requires returning to the same tab, e.g. single page applications.
 * @example
 * if (braintree.venmo.isBrowserSupported()) {
 *   // set up Venmo
 * }
 * @example <caption>Explicitly require browser support returning to the same tab</caption>
 * if (braintree.venmo.isBrowserSupported({
 *   allowNewBrowserTab: false
 * })) {
 *   // set up Venmo
 * }
 * @returns {boolean} Whether or not the browser supports Venmo.
 */
function isBrowserSupported(options) {
  return supportsVenmo.isBrowserSupported(options);
}

module.exports = {
  create: wrapPromise(create),
  isBrowserSupported: isBrowserSupported,
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"../lib/analytics":107,"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/promise":146,"./shared/errors":199,"./shared/supports-venmo":200,"./venmo":201,"@braintree/wrap-promise":30}],197:[function(_dereq_,module,exports){
'use strict';

var isAndroid = _dereq_('@braintree/browser-detection/is-android');
var isChrome = _dereq_('@braintree/browser-detection/is-chrome');
var isIos = _dereq_('@braintree/browser-detection/is-ios');
var isIosSafari = _dereq_('@braintree/browser-detection/is-ios-safari');
var isSamsungBrowser = _dereq_('@braintree/browser-detection/is-samsung');
var isMobileFirefox = _dereq_('@braintree/browser-detection/is-mobile-firefox');

module.exports = {
  isAndroid: isAndroid,
  isChrome: isChrome,
  isIos: isIos,
  isIosSafari: isIosSafari,
  isSamsungBrowser: isSamsungBrowser,
  isMobileFirefox: isMobileFirefox
};

},{"@braintree/browser-detection/is-android":3,"@braintree/browser-detection/is-chrome":5,"@braintree/browser-detection/is-ios":16,"@braintree/browser-detection/is-ios-safari":13,"@braintree/browser-detection/is-mobile-firefox":17,"@braintree/browser-detection/is-samsung":18}],198:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  DOCUMENT_VISIBILITY_CHANGE_EVENT_DELAY: 500,
  DEFAULT_PROCESS_RESULTS_DELAY: 1000,
  VENMO_OPEN_URL: 'https://venmo.com/braintree/checkout'
};

},{}],199:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Venmo - Creation Error Codes
 * @description Errors that occur when [creating the Venmo component](/current/module-braintree-web_venmo.html#.create).
 * @property {MERCHANT} VENMO_NOT_ENABLED Occurs when Venmo is not enabled on the Braintree control panel.
 * @property {MERCHANT} VENMO_INVALID_PROFILE_ID Occurs when Venmo is intilaized with a profile id, but it is invalid.
 */

/**
 * @name BraintreeError.Venmo - tokenize Error Codes
 * @description Errors that occur when using the [`tokenize` method](/current/Venmo.html#tokenize).
 * @property {MERCHANT} VENMO_TOKENIZATION_REQUEST_ACTIVE Occurs when `tokenize` is called when the flow is already in progress.
 * @property {UNKNOWN} VENMO_APP_FAILED Occurs when tokenization fails.
 * @property {CUSTOMER} VENMO_APP_CANCELED Occurs when customer cancels flow from the Venmo app.
 * @property {CUSTOMER} VENMO_CANCELED Occurs when customer cancels the flow or Venmo app is not available.
 */

var BraintreeError = _dereq_('../../lib/braintree-error');

module.exports = {
  VENMO_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'VENMO_NOT_ENABLED',
    message: 'Venmo is not enabled for this merchant.'
  },
  VENMO_TOKENIZATION_REQUEST_ACTIVE: {
    type: BraintreeError.types.MERCHANT,
    code: 'VENMO_TOKENIZATION_REQUEST_ACTIVE',
    message: 'Another tokenization request is active.'
  },
  VENMO_APP_FAILED: {
    type: BraintreeError.types.UNKNOWN,
    code: 'VENMO_APP_FAILED',
    message: 'Venmo app encountered a problem.'
  },
  VENMO_APP_CANCELED: {
    type: BraintreeError.types.CUSTOMER,
    code: 'VENMO_APP_CANCELED',
    message: 'Venmo app authorization was canceled.'
  },
  VENMO_CANCELED: {
    type: BraintreeError.types.CUSTOMER,
    code: 'VENMO_CANCELED',
    message: 'User canceled Venmo authorization, or Venmo app is not available.'
  },
  VENMO_INVALID_PROFILE_ID: {
    type: BraintreeError.types.MERCHANT,
    code: 'VENMO_INVALID_PROFILE_ID',
    message: 'Venmo profile ID is invalid.'
  },
  VENMO_INVALID_DEEP_LINK_RETURN_URL: {
    type: BraintreeError.types.MERCHANT,
    code: 'VENMO_INVALID_DEEP_LINK_RETURN_URL',
    message: 'Venmo deep link return URL is invalid.'
  }
};

},{"../../lib/braintree-error":112}],200:[function(_dereq_,module,exports){
'use strict';

var browserDetection = _dereq_('./browser-detection');

// NEXT_MAJOR_VERSION webviews are not supported, except for the case where
// the merchant themselves is presenting venmo in a webview on iOS and
// using the deep link url to get back to their app. For the next major
// version, we'll need to make that behavior opt in so that this is
// browser supported logic will reflect the case that webviews are not
// supported.
function isBrowserSupported(options) {
  var isAndroidChrome = browserDetection.isAndroid() && browserDetection.isChrome();
  var isIosChrome = browserDetection.isIos() && browserDetection.isChrome();
  var supportsReturnToSameTab = browserDetection.isIosSafari() || isAndroidChrome;
  var supportsReturnToNewTab = isIosChrome || browserDetection.isSamsungBrowser() || browserDetection.isMobileFirefox();

  options = options || {
    allowNewBrowserTab: true
  };

  return supportsReturnToSameTab || (options.allowNewBrowserTab && supportsReturnToNewTab);
}

module.exports = {
  isBrowserSupported: isBrowserSupported
};

},{"./browser-detection":197}],201:[function(_dereq_,module,exports){
(function (global){
'use strict';

var analytics = _dereq_('../lib/analytics');
var isBrowserSupported = _dereq_('./shared/supports-venmo');
var constants = _dereq_('./shared/constants');
var errors = _dereq_('./shared/errors');
var querystring = _dereq_('../lib/querystring');
var methods = _dereq_('../lib/methods');
var convertMethodsToError = _dereq_('../lib/convert-methods-to-error');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var BraintreeError = _dereq_('../lib/braintree-error');
var Promise = _dereq_('../lib/promise');
var ExtendedPromise = _dereq_('@braintree/extended-promise');

/**
 * Venmo tokenize payload.
 * @typedef {object} Venmo~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {string} type The payment method type, always `VenmoAccount`.
 * @property {object} details Additional Venmo account details.
 * @property {string} details.username Username of the Venmo account.
 */

/**
 * @class
 * @param {object} options The Venmo {@link module:braintree-web/venmo.create create} options.
 * @description <strong>Do not use this constructor directly. Use {@link module:braintree-web/venmo.create|braintree-web.venmo.create} instead.</strong>
 * @classdesc This class represents a Venmo component produced by {@link module:braintree-web/venmo.create|braintree-web/venmo.create}. Instances of this class have methods for tokenizing Venmo payments.
 */
function Venmo(options) {
  this._createPromise = options.createPromise;
  this._allowNewBrowserTab = options.allowNewBrowserTab !== false;
  this._profileId = options.profileId;
  this._deepLinkReturnUrl = options.deepLinkReturnUrl;
  this._ignoreHistoryChanges = options.ignoreHistoryChanges;
}

Venmo.prototype.getUrl = function () {
  if (this._url) {
    return Promise.resolve(this._url);
  }

  return this._createPromise.then(function (client) {
    var configuration = client.getConfiguration();
    var params = {};
    var currentUrl = this._deepLinkReturnUrl || window.location.href.replace(window.location.hash, '');
    var venmoConfiguration = configuration.gatewayConfiguration.payWithVenmo;
    var analyticsMetadata = configuration.analyticsMetadata;
    var braintreeData = {
      _meta: {
        version: analyticsMetadata.sdkVersion,
        integration: analyticsMetadata.integration,
        platform: analyticsMetadata.platform,
        sessionId: analyticsMetadata.sessionId
      }
    };

    params['x-success'] = currentUrl + '#venmoSuccess=1';
    params['x-cancel'] = currentUrl + '#venmoCancel=1';
    params['x-error'] = currentUrl + '#venmoError=1';
    params.ua = window.navigator.userAgent;
    /* eslint-disable camelcase */
    params.braintree_merchant_id = this._profileId || venmoConfiguration.merchantId;
    params.braintree_access_token = venmoConfiguration.accessToken;
    params.braintree_environment = venmoConfiguration.environment;
    params.braintree_sdk_data = btoa(JSON.stringify(braintreeData));
    /* eslint-enable camelcase */

    this._url = constants.VENMO_OPEN_URL + '?' + querystring.stringify(params);

    return this._url;
  }.bind(this));
};

/**
 * Returns a boolean indicating whether the current browser supports Venmo as a payment method.
 *
 * If `options.allowNewBrowserTab` is false when calling {@link module:braintree-web/venmo.create|venmo.create}, this method will return true only for browsers known to support returning from the Venmo app to the same browser tab. Currently, this is limited to iOS Safari and Android Chrome.
 * @public
 * @returns {boolean} True if the current browser is supported, false if not.
 */
Venmo.prototype.isBrowserSupported = function () {
  return isBrowserSupported.isBrowserSupported({
    allowNewBrowserTab: this._allowNewBrowserTab
  });
};

/**
 * Returns a boolean indicating whether a Venmo tokenization result is ready to be processed immediately.
 *
 * This method should be called after initialization to see if the result of Venmo authorization is available. If it returns true, call {@link Venmo#tokenize|tokenize} immediately to process the results.
 *
 * @public
 * @returns {boolean} True if the results of Venmo payment authorization are available and ready to process.
 */
Venmo.prototype.hasTokenizationResult = function () {
  return this._hasTokenizationResult();
};

// a private version that lets us pass in a custom hash
// when listening on a hashchange event
Venmo.prototype._hasTokenizationResult = function (hash) {
  var params = getFragmentParameters(hash);

  return typeof (params.venmoSuccess || params.venmoError || params.venmoCancel) !== 'undefined';
};

/**
 * Launches the Venmo flow and returns a nonce payload.
 *
 * If {@link Venmo#hasTokenizationResult|hasTokenizationResult} returns true, calling tokenize will immediately process and return the results without initiating the Venmo payment authorization flow.
 *
 * Only one Venmo flow can be active at a time. One way to achieve this is to disable your Venmo button while the flow is open.
 * @public
 * @param {object} [options] Options for tokenization.
 * @param {number} [options.processResultsDelay=500] The amount of time in milliseeconds to delay processing the results. In most cases, this value should be left as the default.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link Venmo~tokenizePayload|tokenizePayload}. If no callback is provided, the method will return a Promise that resolves with a {@link Venmo~tokenizePayload|tokenizePayload}.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 * @example
 * button.addEventListener('click', function () {
 *   // Disable the button so that we don't attempt to open multiple popups.
 *   button.setAttribute('disabled', 'disabled');
 *
 *   // Because tokenize opens a new window, this must be called
 *   // as a result of a user action, such as a button click.
 *   venmoInstance.tokenize().then(function (payload) {
 *     // Submit payload.nonce to your server
 *     // Use payload.username to get the Venmo username and display any UI
 *   }).catch(function (tokenizeError) {
 *     // Handle flow errors or premature flow closure
 *     switch (tokenizeErr.code) {
 *       case 'VENMO_APP_CANCELED':
 *         console.log('User canceled Venmo flow.');
 *         break;
 *       case 'VENMO_CANCELED':
 *         console.log('User canceled Venmo, or Venmo app is not available.');
 *         break;
 *       default:
 *         console.error('Error!', tokenizeErr);
 *     }
 *   }).then(function () {
 *     button.removeAttribute('disabled');
 *   });
 * });
 */
Venmo.prototype.tokenize = function (options) {
  var self = this;
  var resultProcessingInProgress, visibilityChangeListenerTimeout;

  options = options || {};

  if (this._tokenizationInProgress === true) {
    return Promise.reject(new BraintreeError(errors.VENMO_TOKENIZATION_REQUEST_ACTIVE));
  }

  if (this.hasTokenizationResult()) {
    return this._processResults();
  }

  this._tokenizationInProgress = true;
  this._tokenizePromise = new ExtendedPromise();

  this._previousHash = window.location.hash;

  function completeFlow(hash) {
    var error;

    self._processResults(hash).catch(function (err) {
      error = err;
    }).then(function (res) {
      if (!self._ignoreHistoryChanges && window.location.hash !== self._previousHash) {
        window.location.hash = self._previousHash;
      }
      self._removeVisibilityEventListener();

      if (error) {
        self._tokenizePromise.reject(error);
      } else {
        self._tokenizePromise.resolve(res);
      }
      delete self._tokenizePromise;
    });
  }

  // The Venmo SDK app switches back with the results of the
  // tokenization encoded in the hash
  this._onHashChangeListener = function (e) {
    var hash = e.newURL.split('#')[1];

    if (!self._hasTokenizationResult(hash)) {
      return;
    }

    resultProcessingInProgress = true;
    clearTimeout(visibilityChangeListenerTimeout);
    self._tokenizationInProgress = false;
    completeFlow(hash);
  };

  window.addEventListener('hashchange', this._onHashChangeListener, false);

  // Subscribe to document visibility change events to detect when app switch
  // has returned. Acts as a fallback for the hashchange listener and catches
  // the cancel case via manual app switch back
  this._visibilityChangeListener = function () {
    var delay = options.processResultsDelay || constants.DEFAULT_PROCESS_RESULTS_DELAY;

    if (!window.document.hidden) {
      self._tokenizationInProgress = false;

      if (!resultProcessingInProgress) {
        visibilityChangeListenerTimeout = setTimeout(completeFlow, delay);
      }
    }
  };

  return this.getUrl().then(function (url) {
    if (self._deepLinkReturnUrl) {
      if (isIosWebview()) {
        analytics.sendEvent(self._createPromise, 'venmo.appswitch.start.ios-webview');
        // Deep link URLs do not launch iOS apps from a webview when using window.open or PopupBridge.open.
        window.location.href = url;
      } else if (global.popupBridge && typeof global.popupBridge.open === 'function') {
        analytics.sendEvent(self._createPromise, 'venmo.appswitch.start.popup-bridge');
        window.popupBridge.open(url);
      } else {
        analytics.sendEvent(self._createPromise, 'venmo.appswitch.start.webview');
        window.open(url);
      }
    } else {
      analytics.sendEvent(self._createPromise, 'venmo.appswitch.start.browser');
      window.open(url);
    }

    // Add a brief delay to ignore visibility change events that occur right before app switch
    setTimeout(function () {
      window.document.addEventListener(documentVisibilityChangeEventName(), self._visibilityChangeListener);
    }, constants.DOCUMENT_VISIBILITY_CHANGE_EVENT_DELAY);

    return self._tokenizePromise;
  });
};

/**
 * Cleanly tear down anything set up by {@link module:braintree-web/venmo.create|create}.
 * @public
 * @param {callback} [callback] Called once teardown is complete. No data is returned if teardown completes successfully.
 * @example
 * venmoInstance.teardown();
 * @example <caption>With callback</caption>
 * venmoInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
Venmo.prototype.teardown = function () {
  this._removeVisibilityEventListener();
  convertMethodsToError(this, methods(Venmo.prototype));

  return Promise.resolve();
};

Venmo.prototype._removeVisibilityEventListener = function () {
  window.removeEventListener('hashchange', this._onHashChangeListener);
  window.document.removeEventListener(documentVisibilityChangeEventName(), this._visibilityChangeListener);

  delete this._visibilityChangeListener;
  delete this._onHashChangeListener;
};

Venmo.prototype._processResults = function (hash) {
  var self = this;
  var params = getFragmentParameters(hash);

  return new Promise(function (resolve, reject) {
    if (params.venmoSuccess) {
      analytics.sendEvent(self._createPromise, 'venmo.appswitch.handle.success');
      resolve(formatTokenizePayload(params));
    } else if (params.venmoError) {
      analytics.sendEvent(self._createPromise, 'venmo.appswitch.handle.error');
      reject(new BraintreeError({
        type: errors.VENMO_APP_FAILED.type,
        code: errors.VENMO_APP_FAILED.code,
        message: errors.VENMO_APP_FAILED.message,
        details: {
          originalError: {
            message: decodeURIComponent(params.errorMessage),
            code: params.errorCode
          }
        }
      }));
    } else if (params.venmoCancel) {
      analytics.sendEvent(self._createPromise, 'venmo.appswitch.handle.cancel');
      reject(new BraintreeError(errors.VENMO_APP_CANCELED));
    } else {
      // User has either manually switched back to browser, or app is not available for app switch
      analytics.sendEvent(self._createPromise, 'venmo.appswitch.cancel-or-unavailable');
      reject(new BraintreeError(errors.VENMO_CANCELED));
    }

    self._clearFragmentParameters();
  });
};

Venmo.prototype._clearFragmentParameters = function () {
  if (this._ignoreHistoryChanges) {
    return;
  }

  if (typeof window.history.replaceState === 'function' && window.location.hash) {
    history.pushState({}, '', window.location.href.slice(0, window.location.href.indexOf('#')));
  }
};

function getFragmentParameters(hash) {
  var keyValuesArray = (hash || window.location.hash.substring(1)).split('&');

  return keyValuesArray.reduce(function (toReturn, keyValue) {
    var parts = keyValue.split('=');
    // some Single Page Apps may pre-pend a / to the first value
    // in the hash, assuming it's a route in their app
    // instead of information from Venmo, this removes all
    // non-alphanumeric characters from the keys in the params
    var key = decodeURIComponent(parts[0]).replace(/\W/g, '');
    var value = decodeURIComponent(parts[1]);

    toReturn[key] = value;

    return toReturn;
  }, {});
}

function formatTokenizePayload(fragmentParams) {
  return {
    nonce: fragmentParams.paymentMethodNonce,
    type: 'VenmoAccount',
    details: {
      username: fragmentParams.username
    }
  };
}

// From https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
function documentVisibilityChangeEventName() {
  var visibilityChange;

  if (typeof window.document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
    visibilityChange = 'visibilitychange';
  } else if (typeof window.document.msHidden !== 'undefined') {
    visibilityChange = 'msvisibilitychange';
  } else if (typeof window.document.webkitHidden !== 'undefined') {
    visibilityChange = 'webkitvisibilitychange';
  }

  return visibilityChange;
}

function isIosWebview() {
  // we know it's a webview because this flow only gets
  // used when checking the deep link flow
  // test the platform here to get around custom useragents
  return window.navigator.platform &&
    /iPhone|iPad|iPod/.test(window.navigator.platform);
}

module.exports = wrapPromise.wrapPrototype(Venmo);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../lib/analytics":107,"../lib/braintree-error":112,"../lib/convert-methods-to-error":118,"../lib/methods":144,"../lib/promise":146,"../lib/querystring":147,"./shared/constants":198,"./shared/errors":199,"./shared/supports-venmo":200,"@braintree/extended-promise":22,"@braintree/wrap-promise":30}],202:[function(_dereq_,module,exports){
'use strict';

/**
 * @name BraintreeError.Visa Checkout - Creation Error Codes
 * @description Errors that occur when [creating the Visa Checkout component](/current/module-braintree-web_venmo.html#.create).
 * @property {MERCHANT} VISA_CHECKOUT_NOT_ENABLED Occurs when Visa Checkout is not enabled in the Braintree control panel.
 */

/**
 * @name BraintreeError.Visa Checkout - createInitOptions Error Codes
 * @description Errors that occur when using the [`createInitOptions` method](/current/VisaCheckout.html#createInitOptions).
 * @property {MERCHANT} VISA_CHECKOUT_INIT_OPTIONS_REQUIRED Occurs when no options are provided to method.
 */

/**
 * @name BraintreeError.Visa Checkout - tokenize Error Codes
 * @description Errors that occur when using the [`tokenize` method](/current/VisaCheckout.html#tokenize).
 * @property {MERCHANT} VISA_CHECKOUT_PAYMENT_REQUIRED Occurs when no payment data is not provided.
 * @property {NETWORK} VISA_CHECKOUT_TOKENIZATION Occurs when tokenization fails.
 */

var BraintreeError = _dereq_('../lib/braintree-error');

module.exports = {
  VISA_CHECKOUT_NOT_ENABLED: {
    type: BraintreeError.types.MERCHANT,
    code: 'VISA_CHECKOUT_NOT_ENABLED',
    message: 'Visa Checkout is not enabled for this merchant.'
  },
  VISA_CHECKOUT_INIT_OPTIONS_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'VISA_CHECKOUT_INIT_OPTIONS_REQUIRED',
    message: 'initOptions requires an object.'
  },
  VISA_CHECKOUT_PAYMENT_REQUIRED: {
    type: BraintreeError.types.MERCHANT,
    code: 'VISA_CHECKOUT_PAYMENT_REQUIRED',
    message: 'tokenize requires callid, encKey, and encPaymentData.'
  },
  VISA_CHECKOUT_TOKENIZATION: {
    type: BraintreeError.types.NETWORK,
    code: 'VISA_CHECKOUT_TOKENIZATION',
    message: 'A network error occurred when processing the Visa Checkout payment.'
  }
};

},{"../lib/braintree-error":112}],203:[function(_dereq_,module,exports){
'use strict';

/**
 * @module braintree-web/visa-checkout
 * @description Processes Visa Checkout. *This component is currently in beta and is subject to change.*
 */

var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var BraintreeError = _dereq_('../lib/braintree-error');
var createDeferredClient = _dereq_('../lib/create-deferred-client');
var createAssetsUrl = _dereq_('../lib/create-assets-url');
var VisaCheckout = _dereq_('./visa-checkout');
var analytics = _dereq_('../lib/analytics');
var errors = _dereq_('./errors');
var VERSION = "3.63.0";
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {callback} [callback] The second argument, `data`, is the {@link VisaCheckout} instance. If no callback is provided, `create` returns a promise that resolves with the {@link VisaCheckout} instance.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
function create(options) {
  var name = 'Visa Checkout';

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
    options.client = client;

    if (!options.client.getConfiguration().gatewayConfiguration.visaCheckout) {
      return Promise.reject(new BraintreeError(errors.VISA_CHECKOUT_NOT_ENABLED));
    }

    analytics.sendEvent(options.client, 'visacheckout.initialized');

    return new VisaCheckout(options);
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

},{"../lib/analytics":107,"../lib/basic-component-verification":110,"../lib/braintree-error":112,"../lib/create-assets-url":120,"../lib/create-deferred-client":122,"../lib/promise":146,"./errors":202,"./visa-checkout":204,"@braintree/wrap-promise":30}],204:[function(_dereq_,module,exports){
'use strict';

var BraintreeError = _dereq_('../lib/braintree-error');
var analytics = _dereq_('../lib/analytics');
var errors = _dereq_('./errors');
var jsonClone = _dereq_('../lib/json-clone');
var methods = _dereq_('../lib/methods');
var convertMethodsToError = _dereq_('../lib/convert-methods-to-error');
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var cardTypeTransformMap = {
  Visa: 'VISA',
  MasterCard: 'MASTERCARD',
  Discover: 'DISCOVER',
  'American Express': 'AMEX'
};

/**
 * Visa Checkout Address object.
 * @typedef {object} VisaCheckout~Address
 * @property {string} countryCode The customer's country code.
 * @property {string} extendedAddress The customer's extended address.
 * @property {string} firstName The customer's first name.
 * @property {string} lastName The customer's last name.
 * @property {string} locality The customer's locality.
 * @property {string} postalCode The customer's postal code.
 * @property {string} region The customer's region.
 * @property {string} streetAddress The customer's street address.
 * @property {string} phoneNumber The customer's phone number.
 */

/**
 * Visa Checkout UserData object.
 * @typedef {object} VisaCheckout~UserData
 * @property {string} userEmail The customer's email address.
 * @property {string} userFirstName The customer's first name.
 * @property {string} userLastName The customer's last name.
 * @property {string} userFullName The customer's full name.
 * @property {string} userName The customer's username.
 */

/**
 * Visa Checkout tokenize payload.
 * @typedef {object} VisaCheckout~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {object} details Additional account details.
 * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
 * @property {string} details.lastFour Last four digits of card number.
 * @property {string} details.lastTwo Last two digits of card number.
 * @property {string} description A human-readable description.
 * @property {string} type The payment method type, always `VisaCheckoutCard`.
 * @property {VisaCheckout~Address} billingAddress The customer's billing address.
 * @property {VisaCheckout~Address} shippingAddress The customer's shipping address.
 * @property {VisaCheckout~UserData} userData Information about the customer.
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
 * @class
 * @param {object} options The Visa Checkout {@link module:braintree-web/visa-checkout.create create} options.
 * @description <strong>Do not use this constructor directly. Use {@link module:braintree-web/visa-checkout.create|braintree-web.visa-checkout.create} instead.</strong>
 * @classdesc This class represents a Visa Checkout component produced by {@link module:braintree-web/visa-checkout.create|braintree-web/visa-checkout.create}. Instances of this class have methods for interacting with Visa Checkout's JavaScript library.
 */
function VisaCheckout(options) {
  this._client = options.client;
}

function transformCardTypes(cardTypes) {
  return cardTypes.reduce(function (acc, type) {
    if (cardTypeTransformMap.hasOwnProperty(type)) {
      return acc.concat(cardTypeTransformMap[type]);
    }

    return acc;
  }, []);
}

/**
 * Creates an `initOptions` object from the passed `options`, applying properties that Braintree needs to transact Visa Checkout.
 *
 * Braintree will apply these properties if they do not exist on the given `options`:
 *  - `apikey`
 *  - `externalClientId`
 *  - `settings.payment.cardBrands`
 *
 * Braintree will overwrite `settings.dataLevel = 'FULL'` to access the full payment method.
 * @public
 * @param {object} options The base `initOptions` that will be used to init Visa Checkout.
 * @param {string} [options.apikey] The API key used to initialize Visa Checkout. When not supplied, Braintree will set this property.
 * @param {string} [options.externalClientId] The external client ID key used to initialize Visa Checkout. When not supplied, Braintree will set this property.
 * @param {object} [options.settings] The settings object used to initialize Visa Checkout.
 * @param {string} [options.settings.dataLevel] The data level used to initialize Visa Checkout. Braintree will overwrite this property to 'FULL'.
 * @param {object} [options.settings.payment] The payment object used to initialize Visa Checkout.
 * @param {string[]} [options.settings.payment.cardBrands] The card brands that Visa Checkout will allow the customer to pay with. When not supplied, Braintree will set this property.
 * @returns {object} `initOptions` The `initOptions` that Visa Checkout should be initialized with.
 */
VisaCheckout.prototype.createInitOptions = function (options) {
  var initOptions;
  var gatewayConfiguration = this._client.getConfiguration().gatewayConfiguration;
  var visaCheckoutConfiguration = gatewayConfiguration.visaCheckout;

  if (!options) {
    throw new BraintreeError(errors.VISA_CHECKOUT_INIT_OPTIONS_REQUIRED);
  }

  initOptions = jsonClone(options);
  initOptions.apikey = initOptions.apikey || visaCheckoutConfiguration.apikey;
  initOptions.externalClientId = initOptions.externalClientId || visaCheckoutConfiguration.externalClientId;
  initOptions.settings = initOptions.settings || {};
  initOptions.settings.dataLevel = 'FULL';
  initOptions.settings.payment = initOptions.settings.payment || {};

  if (!initOptions.settings.payment.cardBrands) {
    initOptions.settings.payment.cardBrands = transformCardTypes(gatewayConfiguration.visaCheckout.supportedCardTypes);
  }

  return initOptions;
};

/**
 * Tokenizes the Visa Checkout payload, returning a payment method nonce.
 * @public
 * @param {object} payment The object that Visa Checkout supplies on `payment.success`.
 * @param {string} payment.callid Visa Checkout transaction ID associated with this payment.
 * @param {string} payment.encKey The encrypted key used to decrypt the payment data.
 * @param {string} payment.encPaymentData The encrypted payment data.
 * @param {callback} [callback] The second argument, <code>tokenizePayload</code> is a {@link VisaCheckout~tokenizePayload|tokenizePayload}. If no callback is provided, `tokenize` returns a promise that resolves with the {@link VisaCheckout~tokenizePayload|tokenizePayload}.
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
VisaCheckout.prototype.tokenize = function (payment) {
  var self = this;

  if (!payment.callid || !payment.encKey || !payment.encPaymentData) {
    return Promise.reject(new BraintreeError(errors.VISA_CHECKOUT_PAYMENT_REQUIRED));
  }

  return this._client.request({
    method: 'post',
    endpoint: 'payment_methods/visa_checkout_cards',
    data: {
      _meta: {
        source: 'visa-checkout'
      },
      visaCheckoutCard: {
        callId: payment.callid,
        encryptedPaymentData: payment.encPaymentData,
        encryptedKey: payment.encKey
      }
    }
  }).then(function (response) {
    analytics.sendEvent(self._client, 'visacheckout.tokenize.succeeded');

    return response.visaCheckoutCards[0];
  }).catch(function (err) {
    analytics.sendEvent(self._client, 'visacheckout.tokenize.failed');

    return Promise.reject(new BraintreeError({
      type: errors.VISA_CHECKOUT_TOKENIZATION.type,
      code: errors.VISA_CHECKOUT_TOKENIZATION.code,
      message: errors.VISA_CHECKOUT_TOKENIZATION.message,
      details: {
        originalError: err
      }
    }));
  });
};

/**
 * Cleanly tear down anything set up by {@link module:braintree-web/visa-checkout.create|create}.
 * @public
 * @param {callback} [callback] Called once teardown is complete. No data is returned if teardown completes successfully.
 * @example
 * visaCheckoutInstance.teardown();
 * @example <caption>With callback</caption>
 * visaCheckoutInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {(Promise|void)} Returns a promise if no callback is provided.
 */
VisaCheckout.prototype.teardown = function () {
  convertMethodsToError(this, methods(VisaCheckout.prototype));

  return Promise.resolve();
};

module.exports = wrapPromise.wrapPrototype(VisaCheckout);

},{"../lib/analytics":107,"../lib/braintree-error":112,"../lib/convert-methods-to-error":118,"../lib/json-clone":143,"../lib/methods":144,"../lib/promise":146,"./errors":202,"@braintree/wrap-promise":30}]},{},[105])(105)
});
