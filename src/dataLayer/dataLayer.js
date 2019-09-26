function makeDataLayer() {
  // existing dataLayer ? merge it
  var dataLayer = window.dataLayer ? [].concat(window.dataLayer, []) : [];

  var _setVars = function(source) {
    try {
      window._satellite.setVar(source)
    } catch(error) {
        console.log('_satellite not loaded on the site.')
    }
  }

  var track = function (eventName) {
    _satellite.track(eventName)
  }

  var _reverseDatalayer = function() {
    // copy avoids persisting the effect of reverse to the dataLayer.
    // it also helps making the function purer
    return [].reverse.call([].concat(dataLayer, []))
  }

  var _currentItemWithKey = function (key) {
    if (!key) { return null };
    var reversed = _reverseDatalayer();
    var found;

    if (reversed.length > 0) {
      found = reversed.filter(function(dataset) {
        if (dataset[key]) {
          return dataset;
        }
      })

      // there may be multiples push containing that key
      // return the freshest.
      if (found.length > 0) {
        return found[0]
      }
    }
    return null;
  }

  var currentValue = function(key) {
    var item = _currentItemWithKey(key);

    if (item && item[key]) {
      return item[key]
    }
    return null
  }

  var push = function() {
    if (arguments && arguments[0]) {
      if (typeof arguments[0] && !Array.isArray(arguments[0])){
        var pushed = arguments[0];
        _setVars(pushed)

        if (pushed.event) {
          _satellite.track(pushed.event)
        }
      }
      [].push.apply(dataLayer, arguments)
    }
  }

  // Public methods
  dataLayer.push = push
  dataLayer.currentValue = currentValue

  return dataLayer
}

module.exports = makeDataLayer