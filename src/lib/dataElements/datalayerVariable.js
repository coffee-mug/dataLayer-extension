'use strict';

var makeDataLayer = require('../../dataLayer/dataLayer');


module.exports = function(settings) {
  var dataLayer = makeDataLayer();
  console.log("Settings from dataLayerVariable.js", settings)
  return dataLayer.currentValue(settings.item)
};
