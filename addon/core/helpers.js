/* globals google */
import Ember from 'ember';

var _hasGoogleLib = null;

export var cast = {
  number:  function (val) {
    if (typeof val === 'string') {
      val = Number(val);
    }
    if (val !== null && val !== undefined && typeof val === 'number' && !isNaN(val) && isFinite(val)) {
      return val;
    }
    return undefined;
  },
  integer: function (val) {
    if ((val = cast.number(val)) !== undefined) {
      return Math.round(val);
    }
    return val;
  }
};

var helpers = {
  TYPE_ROAD:      'road',
  TYPE_TERRAIN:   'terrain',
  TYPE_HYBRID:    'hybrid',
  TYPE_SATELLITE: 'satellite',

  _typeMap: {
    road:      'ROADMAP',
    terrain:   'TERRAIN',
    hybrid:    'HYBRID',
    satellite: 'SATELLITE'
  },

  cast: cast,

  hasGoogleLib: function (noCache) {
    if (_hasGoogleLib === null || noCache) {
      if (!noCache) {
        _hasGoogleLib = window.google && google.maps;
      }
      if (!_hasGoogleLib && !noCache) {
        Ember.warn('You must include Google map script tag in your `index.html` to use `google-map` addon');
        Ember.warn('<script src="//maps.googleapis.com/maps/api/js?v=3"></script>');
      }
    }
    return !!_hasGoogleLib;
  },
  makeObj:      function () {
    var res = {};
    for (var i = 0; i < arguments.length; i += 2) {
      res[arguments[i]] = arguments[i + 1];
    }
    return res;
  },

  /**
   * Convert our type to the google one
   * @param {String} type
   * @returns {String}
   */
  typeToGoogleType:     function (type) {
    var name;
    if (helpers.hasGoogleLib() && (name = helpers._typeMap[type])) {
      return google.maps.MapTypeId[name];
    }
  },
  /**
   * Convert google map type to our type
   * @param {String} type
   * @returns {string}
   */
  typeFromGoogleType:   function (type) {
    if (helpers.hasGoogleLib() && type) {
      for (var k in helpers._typeMap) {
        if (helpers._typeMap.hasOwnProperty(k) && google.maps.MapTypeId[helpers._typeMap[k]] === type) {
          return k;
        }
      }
    }
  },
  /**
   * Convert a lat/lng pair to a google one
   * @param {Number} lat
   * @param {Number} lng
   * @returns {google.maps.LatLng}
   */
  latLngToGoogleLatLng: function (lat, lng) {
    if (lat != null && lng != null && helpers.hasGoogleLib()) {
      return new google.maps.LatLng(Number(lat), Number(lng));
    }
  },
  /**
   * Convert a google LatLng object to lat/lng
   * @param {google.maps.LatLng} obj
   * @returns {Array<Number>}
   */
  googleLatLngToLatLng: function (obj) {
    return [obj.lat(), obj.lng()];
  },

  _typeFromGoogle:   function (key, val) {
    if (arguments.length === 1) {
      val = key;
      key = null;
    }
    return helpers.makeObj(key || 'type', helpers.typeFromGoogleType(val));
  },
  _typeToGoogle:     function (key, obj) {
    if (arguments.length === 1) {
      obj = key;
      key = null;
    }
    return helpers.typeToGoogleType(obj[key || 'type']);
  },
  _latLngFromGoogle: function (latKey, lngKey, val) {
    if (arguments.length === 1) {
      val = latKey;
      latKey = null;
    }
    return helpers.makeObj(latKey || 'lat', val.lat(), lngKey || 'lng', val.lng());
  },
  _latLngToGoogle:   function (latKey, lngKey, obj) {
    if (arguments.length === 1) {
      obj = latKey;
      latKey = null;
    }
    return helpers.latLngToGoogleLatLng(obj[latKey || 'lat'], obj[lngKey || 'lng']);
  }
};

export default helpers;
