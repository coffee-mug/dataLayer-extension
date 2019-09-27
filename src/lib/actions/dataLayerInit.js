'use strict';

var makeDatalayer = require('../../dataLayer/dataLayer')

module.exports = function (settings) {
  window.dataLayer = makeDatalayer();
}