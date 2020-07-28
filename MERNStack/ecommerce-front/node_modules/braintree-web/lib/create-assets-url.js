'use strict';

var ASSETS_URLS = require('./constants').ASSETS_URLS;

function createAssetsUrl(authorization) {

  return ASSETS_URLS.production;
}
/* eslint-enable */

module.exports = {
  create: createAssetsUrl
};
