'use strict';

var Promise = require('./lib/promise');

module.exports = function loadStylesheet(options) {
  var container;
  var stylesheet = document.querySelector('link[href="' + options.href + '"]');

  if (stylesheet) {
    return Promise.resolve(stylesheet);
  }

  stylesheet = document.createElement('link');
  container = options.container || document.head;

  stylesheet.setAttribute('rel', 'stylesheet');
  stylesheet.setAttribute('type', 'text/css');
  stylesheet.setAttribute('href', options.href);
  stylesheet.setAttribute('id', options.id);

  if (container.firstChild) {
    container.insertBefore(stylesheet, container.firstChild);
  } else {
    container.appendChild(stylesheet);
  }

  return Promise.resolve(stylesheet);
};
