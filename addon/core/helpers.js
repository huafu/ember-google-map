/* globals google */
import Ember from 'ember';

var _hasGoogleLib = {};
var $get = Ember.get;

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

  PLACE_TYPE_ADDRESS:      'geocode',
  PLACE_TYPE_BUSINESS:     'establishment',
  PLACE_TYPE_ADMIN_REGION: '(regions)',
  PLACE_TYPE_LOCALITY:     '(cities)',

  _typeMap: {
    road:      'ROADMAP',
    terrain:   'TERRAIN',
    hybrid:    'HYBRID',
    satellite: 'SATELLITE'
  },

  _autoCompleteService: null,

  cast: cast,

  hasGoogleLib: function (lib) {
    lib = lib || '';
    if (!_hasGoogleLib.hasOwnProperty(lib)) {
      if (lib) {
        helpers.hasGoogleLib('');
      }
      if (lib) {
        _hasGoogleLib[lib] = !!(_hasGoogleLib[''] && google.maps[lib]);
      }
      else {
        _hasGoogleLib[lib] = !!(window.google && google.maps);
      }
      if (!_hasGoogleLib['']) {
        Ember.warn(
          '[google-map] Something went wrong with Google Map library.' +
          ' If you think it is not your side, please report the issue at' +
          ' https://github.com/huafu/ember-google-map/issues.' +
          ' Also be sure to have used `return this.loadGoogleMap()` in one of the 3 `model` hooks' +
          ' of each route which would use the component (only if you have set `google.lazyLoad`' +
          ' to true in your `config/environment.js.`)'
        );
      }
      else if (lib && !_hasGoogleLib[lib]) {
        Ember.warn(
          '[google-map] You are using a module of ember-google-map which needs the %@ google library.' +
          ' But \'%@\' is not in the `ENV.googleMap.libraries` config array of your `config/environment.js`'.fmt(lib)
        );
      }
    }
    return _hasGoogleLib[lib];
  },

  /**
   * Creates an object using arguments (propertyName1, propertyValue1, propertyName2, propertyValue2, ...)
   * @param {String} [propName1]
   * @param {String} [propValue1]
   * @param {String} [others]*
   * @returns {Object}
   */
  makeObj: function () {
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

  /**
   * Converts SW lat/lng + NE lat/lng to a google.map.LatLngBounds object
   * @param {Number} swLat
   * @param {Number} swLng
   * @param {Number} neLat
   * @param {Number} neLng
   * @returns {google.maps.LatLngBounds}
   */
  boundsToGoogle: function (swLat, swLng, neLat, neLng) {
    if (swLat != null && swLng != null && neLat != null && neLng != null && helpers.hasGoogleLib()) {
      return new google.maps.LatLngBounds(
        helpers.latLngToGoogleLatLng(swLat, swLng),
        helpers.latLngToGoogleLatLng(neLat, neLng)
      );
    }
  },

  latLngProperty: function () {
    return Ember.computed({
      get() {
        return {lat: null, lng: null};
      }
    });
  },

  autoCompleteService: function () {
    if (!helpers._autoCompleteService && helpers.hasGoogleLib('places')) {
      helpers._autoCompleteService = new google.maps.places.AutocompleteService();
    }
    return helpers._autoCompleteService;
  },

  autoCompleteAddress: function (options) {
    var service = helpers.autoCompleteService();
    if (service) {
      return new Ember.RSVP.Promise(function (resolve, reject) {
        var Status = google.maps.places.PlacesServiceStatus, err;
        service.getPlacePredictions(options, function (results, status) {
          if (status === Status.OK || status === Status.ZERO_RESULTS) {
            resolve(results || []);
          }
          else {
            err = new Error('error retrieving completion (' + status + ')');
            err.status = status;
            reject(err);
          }
        });
      });
    }
    return Ember.RSVP.reject(new Error('could not access google place library'));
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
    return helpers.latLngToGoogleLatLng($get(obj, latKey || 'lat'), $get(obj, lngKey || 'lng'));
  },
  _boundsToGoogle:   function (swLatKey, swLngKey, neLatKey, neLngKey, obj) {
    if (arguments.length === 1) {
      obj = swLatKey;
      swLatKey = null;
      if (obj && obj.sw && obj.ne) {
        swLatKey = 'sw.lat';
        swLngKey = 'sw.lng';
        neLatKey = 'ne.lat';
        neLngKey = 'ne.lng';
      }
    }
    return helpers.boundsToGoogle(
      $get(obj, swLatKey || 'southWestLat'), $get(obj, swLngKey || 'southWestLng'),
      $get(obj, neLatKey || 'northEastLat'), $get(obj, neLngKey || 'northEastLng')
    );
  }
};

export default helpers;
