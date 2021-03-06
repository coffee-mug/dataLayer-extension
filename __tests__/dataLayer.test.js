const makeDataLayer = require('../src/dataLayer/dataLayer')
const dataElement = require('../src/lib/dataElements/datalayerVariable')

const mockSatellite = () => ({
  _vars: {},
  _directCallRules: {},
  getVar(key) {
    return this._vars[key];
  },
  setVar(key, value) {
    if (typeof key === "object" && !Array.isArray(key) && !value) {
      for (let k of Object.keys(key)) {
        this._vars[k] = key[k];
      }
    } else {
      this._vars[key] = value;
    }
  },
  track(rule) {
    if (this._directCallRules && this._directCallRules[rule]) {
      return this._directCallRules[rule]()
    }
  }
})

const assertCurrentValue = (key, value) => {
  const got = window.dataLayer.currentValue(key)
  expect(got).toBe(value)
}


afterEach(() => {
  window.dataLayer = undefined
  window._satellite = undefined
})

test('Existing dataLayer with existing push is merged at creation', () => {
  window.dataLayer = [
    { pageCategory: 'content', page: 'test' }
  ]

  dataLayer = makeDataLayer();

  expect(dataLayer.length).toBe(1)
  expect(dataLayer[0].pageCategory).toBe('content')
  expect(dataLayer[0].page).toBe('test')
})

test('Pushing an object to the dataLayer sets a launch customVar for every key:value of this object', () => {
  window.dataLayer = makeDataLayer();
  window._satellite = mockSatellite();

  window.dataLayer.push({ page: "test", pageCategory: "content" })

  expect(window.dataLayer.length).toBe(1)
  expect(window._satellite.getVar('page')).toBe('test')
  expect(window._satellite.getVar('pageCategory')).toBe('content')
})

test('Searching for the most recent value of a key (not in emebedded objects)', () => {
  window._satellite = mockSatellite();
  window.dataLayer = makeDataLayer();

  // With a single dataLayer item
  window.dataLayer.push({ page: "test" })
  assertCurrentValue("page", "test")

  // Updating value of an existing item
  window.dataLayer.push({ page: "test2" })
  assertCurrentValue("page", "test2")
})

test('Pushing an event triggers the event\'s name corresponding direct call rule', () => {
  window._satellite = mockSatellite();
  window.dataLayer = makeDataLayer();
  let called = false;

  window._satellite._directCallRules['formStart'] = () => (called = true)

  window.dataLayer.push({ event: "formStart" })
  expect(called).toBe(true)
})

test('Getting currentValue out of an empty dataLayer', () => {
  window._satellite = mockSatellite();
  window.dataLayer = makeDataLayer();

  var got = window.dataLayer.currentValue('lol')

  expect(got).toBe(null);
})

test('Can push variables along the event', () => {
  window._satellite = mockSatellite();
  window.dataLayer = makeDataLayer();

  window.dataLayer.push({ event: "formStart", pageName: "typical pageName" })

  expect(window.dataLayer.currentValue('pageName')).toBe("typical pageName");
})

test('Race condition: accessing data element before the init action', () => {
  // dataLayer has not been "activated" yet
  window.dataLayer = [{ visitorStatus: "loggedin" }];

  expect(dataElement({ item: "visitorStatus" })).toBe("loggedin")
})

test('Pushes in existing dataLayer get mapped as eVar on extension init', () => {
  window._satellite = mockSatellite();
  window.dataLayer = [{ pageName: "my pagename" }];

  window.dataLayer = makeDataLayer();

  expect(window.dataLayer.currentValue('pageName')).toBe("my pagename")
})

test('Existing events in the dataLayer get repushed on page load', () => {
  window._satellite = mockSatellite();
  window.dataLayer = [{ event: "pageLoaded" }];

  let called = false;

  window._satellite._directCallRules['pageLoaded'] = () => (called = true)

  window.dataLayer = makeDataLayer();

  expect(called).toBe(true)
})



