'use strict';

var makeDatalayer = require('../../dataLayer/dataLayer')

module.exports = function (settings) {
  if (!window.dataLayer || !window.dataLayer.currentValue) {
    window.dataLayer = makeDatalayer();
  }
  return window.dataLayer.currentValue(settings.item)
};
