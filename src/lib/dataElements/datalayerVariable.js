'use strict';

var makeDatalayer = require('../../dataLayer/dataLayer')

module.exports = function (settings) {
  if (!dataLayer.currentValue) {
    window.dataLayer = makeDatalayer();
  }
  return window.dataLayer.currentValue(settings.item)
};
