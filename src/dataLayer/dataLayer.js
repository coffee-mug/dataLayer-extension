function makeDataLayer() {
  // existing dataLayer ? merge it
  const dataLayer = window.dataLayer ? [].concat(window.dataLayer, []) : [];

  const _setVars = (source) => {
    try {
      window._satellite.setVar(source)
    } catch(error) {
        console.log('_satellite not loaded on the site.')
    }
  }

  const track = (eventName) => {
    _satellite.track(eventName)
  }

  const _reverseDatalayer = () => {
    // copy avoids persisting the effect of reverse to the dataLayer.
    // it also helps making the function purer
    return [].reverse.call([].concat(dataLayer, []))
  }

  const _currentItemWithKey = (key) => {
    if (!key) { return null };

    return _reverseDatalayer().reduce(dataset => {
      if (dataset[key]) {
        return dataset;
      }
    })
  }

  const currentValue = (key) => {
    let item = _currentItemWithKey(key);
    if (item && item[key]) {
      return item[key]
    }
    return null
  }

  const push = function() {
    if (arguments && arguments[0]) {
      if (typeof arguments[0] && !Array.isArray(arguments[0])){
        let pushed = arguments[0];
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