'use strict';

const makeDataLayer = require('../../dataLayer/dataLayer');

const dataLayer = makeDataLayer();

module.exports = function(settings) {
  return dataLayer.currentValue(settings.item)
};
