'use strict';

var makeDataLayer = require('../../dataLayer/dataLayer');

var dataLayer = makeDataLayer();

module.exports = function(settings) {
  return dataLayer.currentValue(settings.item)
};
