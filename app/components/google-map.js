/* globals google */
import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleObjectMixin from 'ember-google-map/mixins/google-object';

var computed = Ember.computed;
var run = Ember.run;
var on = Ember.on;
var observer = Ember.observer;
var fmt = Ember.String.fmt;
var forEach = Ember.EnumerableUtils.forEach;
var getProperties = Ember.getProperties;
var get$ = Ember.get;
var dummyCircle;

var VALID_FIT_BOUND_TYPES = ['markers', 'infoWindows', 'circles', 'polylines', 'polygons'];

function getDummyCircle(center, radius) {
  if (radius == null) {
    radius = get$(center, 'radius');
  }
  if (!(center instanceof google.maps.LatLng)) {
    center = helpers._latLngToGoogle(center);
  }
  if (dummyCircle) {
    dummyCircle.setCenter(center);
    dummyCircle.setRadius(radius);
  }
  else {
    dummyCircle = new google.maps.Circle({center: center, radius: radius});
  }
  return dummyCircle;
}

function collectCoordsOf(type, array, items) {
  if (['markers', 'infoWindows'].indexOf(type) !== -1) {
    // handle simple types
    return array.reduce(function (previous, item) {
      var coords = getProperties(item, 'lat', 'lng');
      if (coords.lat != null && coords.lng != null) {
        previous.push(coords);
      }
      return previous;
    }, items || []);
  }
  else if (type === 'circles') {
    // handle circles
    return array.reduce(function (previous, item) {
      var opt = getProperties(item, 'lat', 'lng', 'radius'), bounds;
      if (opt.lat != null && opt.lng != null && opt.radius != null) {
        bounds = getDummyCircle(opt).getBounds();
        previous.push(helpers._latLngFromGoogle(bounds.getNorthEast()));
        previous.push(helpers._latLngFromGoogle(bounds.getSouthWest()));
      }
      return previous;
    }, items || []);
  }
  else if (['polylines', 'polygons']) {
    // handle complex types
    return array.reduce(function (previous, item) {
      return get$(item, '_path').reduce(function (previous, item) {
        var coords = getProperties(item, 'lat', 'lng');
        if (coords.lat != null && coords.lng != null) {
          previous.push(coords);
        }
        return previous;
      }, items || []);
    }, items || []);
  }
}

function obj(o) {
  return Ember.Object.create(o);
}

export var MAP_TYPES = Ember.A([
  obj({id: 'road', label: 'road'}),
  obj({id: 'satellite', label: 'satellite'}),
  obj({id: 'terrain', label: 'terrain'}),
  obj({id: 'hybrid', label: 'hybrid'})
]);

export var PLACE_TYPES = Ember.A([
  obj({id: helpers.PLACE_TYPE_ADDRESS, label: 'address'}),
  obj({id: helpers.PLACE_TYPE_LOCALITY, label: 'locality'}),
  obj({id: helpers.PLACE_TYPE_ADMIN_REGION, label: 'administrative region'}),
  obj({id: helpers.PLACE_TYPE_BUSINESS, label: 'business'})
]);

/**
 * @class GoogleMapComponent
 * @extends Ember.Component
 * @uses GoogleObjectMixin
 */
export default Ember.Component.extend(GoogleObjectMixin, {
  googleFQCN: 'google.maps.Map',

  classNames: ['google-map'],

  /**
   * Defines all properties bound to the google map object
   * @property googleProperties
   * @type {Object}
   */
  googleProperties: {
    zoom:      {event: 'zoom_changed', cast: helpers.cast.integer},
    type:      {
      name:       'mapTypeId',
      event:      'maptypeid_changed',
      toGoogle:   helpers._typeToGoogle,
      fromGoogle: helpers._typeFromGoogle
    },
    'lat,lng': {
      name:       'center',
      event:      'center_changed',
      toGoogle:   helpers._latLngToGoogle,
      fromGoogle: helpers._latLngFromGoogle
    }
    /**
     * available options (prepend with `gopt_` to use):
     * `backgroundColor`, `disableDefaultUI`, `disableDoubleClickZoom`, `draggable`, `keyboardShortcuts`,
     * `mapTypeControl`, `maxZoom`, `minZoom`, `overviewMapControl`, `panControl`, `rotateControl`, `scaleControl`,
     * `scrollwheel`, `streetViewControl`, `zoomControl`
     */
  },

  /**
   * @inheritDoc
   */
  googleEvents: {},


  /**
   * Our google map object
   * @property googleObject
   * @type {google.maps.Map}
   * @private
   */
  googleObject: null,

  /**
   * Always auto-fit bounds
   * @property alwaysAutoFitBounds
   * @type {boolean}
   */
  alwaysAutoFitBounds: false,

  /**
   * Auto fit bounds to type of items
   * @property autoFitBounds
   * @type {boolean|string}
   */
  autoFitBounds: false,


  /**
   * Fit bounds to view all coordinates
   * @property fitBoundsArray
   * @type {Array.<{lat: number, lng: number}>}
   */
  fitBoundsArray: computed(
    'autoFitBounds', '_markers.[]', '_infoWindow.[]', '_polylines.@each._path.[]',
    '_polygons.@each._path.[]', '_circles.[]',
    {
      get() {
        var auto, value;
        if (this._fixedFitBoundsArray) {
          value = this._fixedFitBoundsArray;
        }
        else {
          // here comes our computation
          auto = this.get('autoFitBounds');
          if (auto) {
            auto = auto === true ? VALID_FIT_BOUND_TYPES : auto.split(',');
            value = [];
            forEach(auto, function (type) {
              collectCoordsOf(type, this.get('_' + type), value);
            }, this);
          }
          else {
            value = null;
          }
        }
        return value;
      },
      set(key, value) {
        this._fixedFitBoundsArray = value;
      }
    }
  ),


  /**
   * Initial center's latitude of the map
   * @property lat
   * @type {Number}
   */
  lat: 0,

  /**
   * Initial center's longitude of the map
   * @property lng
   * @type {Number}
   */
  lng: 0,

  place: {},

  search: false,
 /**
   * Initial zoom of the map
   * @property zoom
   * @type {Number}
   * @default 5
   */
  zoom: 5,

  /**
   * Initial type of the map
   * @property type
   * @type {String}
   * @enum ['road', 'hybrid', 'terrain', 'satellite']
   * @default 'road'
   */
  type: 'road',

  /**
   * List of markers to handle/show on the map
   * @property markers
   * @type {Array.<{lat: Number, lng: Number, title: String}>}
   */
  markers: [],

  /**
   * The array controller holding the markers
   * @property _markers
   * @type {Ember.ArrayController}
   * @private
   */
  _markers: computed({
    get () {
      return this.container.lookupFactory('controller:google-map/markers').create({
        parentController: this
      });
    }
  }),

  /**
   * Controller to use for each marker
   * @property markerController
   * @type {String}
   * @default 'google-map/marker'
   */
  markerController: 'google-map/marker',

  /**
   * View to use for each marker
   * @property markerViewClass
   * @type {String}
   * @default 'google-map/marker'
   */
  markerViewClass: 'google-map/marker',

  /**
   * Info-window template name to use for each marker
   * @property markerInfoWindowTemplateName
   * @type {String}
   * @default 'google-map/info-window'
   */
  markerInfoWindowTemplateName: 'google-map/info-window',

  /**
   * Whether the markers have an info-window by default
   * @property markerHasInfoWindow
   * @type {Boolean}
   * @default true
   */
  markerHasInfoWindow: true,

  /**
   * List of polylines to handle/show on the map
   * @property polylines
   * @type {Array.<{path: Array.<{lat: Number, lng: Number}>>}
   */
  polylines: null,

  /**
   * The array controller holding the polylines
   * @property _polylines
   * @type {Ember.ArrayController}
   * @private
   */
  _polylines: computed({
    get () {
      return this.container.lookupFactory('controller:google-map/polylines').create({
        parentController: this
      });
    }
  }),

  /**
   * Controller to use for each polyline
   * @property polylineController
   * @type {String}
   * @default 'google-map/polyline'
   */
  polylineController: 'google-map/polyline',

  /**
   * Controller to use for each polyline's path
   * @property polylinePathController
   * @type {String}
   * @default 'google-map/polyline-path'
   */
  polylinePathController: 'google-map/polyline-path',

  /**
   * View to use for each polyline
   * @property polylineViewClass
   * @type {String}
   * @default 'google-map/polyline'
   */
  polylineViewClass: 'google-map/polyline',

  /**
   * List of polygons to handle/show on the map
   * @property polygons
   * @type {Array.<{path: Array.<{lat: Number, lng: Number}>>}
   */
  polygons: null,

  /**
   * The array controller holding the polygons
   * @property _polygons
   * @type {Ember.ArrayController}
   * @private
   */
  _polygons: computed({
    get () {
      return this.container.lookupFactory('controller:google-map/polygons').create({
        parentController: this
      });
    }
  }),

  /**
   * Controller to use for each polygon
   * @property polygonController
   * @type {String}
   * @default 'google-map/polygon'
   */
  polygonController: 'google-map/polygon',

  /**
   * Controller to use for each polygon's path
   * @property polygonPathController
   * @type {String}
   * @default 'google-map/polygon-path'
   */
  polygonPathController: 'google-map/polygon-path',

  /**
   * View to use for each polygon
   * @property polygonViewClass
   * @type {String}
   * @default 'google-map/polygon'
   */
  polygonViewClass: 'google-map/polygon',

  /**
   * List of circles to handle/show on the map
   * @property circles
   * @type {Array.<{lat: Number, lng: Number, radius: Number}>}
   */
  circles: null,

  /**
   * The array controller holding the circles
   * @property _circles
   * @type {Ember.ArrayController}
   * @private
   */
  _circles: computed({
    get () {
      return this.container.lookupFactory('controller:google-map/circles').create({
        parentController: this
      });
    }
  }),

  /**
   * Controller to use for each circle
   * @property circleController
   * @type {String}
   * @default 'google-map/circle'
   */
  circleController: 'google-map/circle',

  /**
   * View to use for each circle
   * @property circleViewClass
   * @type {String}
   * @default 'google-map/circle'
   */
  circleViewClass: 'google-map/circle',

  /**
   * Array of al info-windows to handle/show (independent from the markers' info-windows)
   * @property infoWindows
   * @type {Array.<{lat: Number, lng: Number, title: String, description: String}>}
   */
  infoWindows: null,

  /**
   * The array controller holding the info-windows
   * @property _infoWindows
   * @type {Ember.ArrayController}
   * @private
   */
  _infoWindows: computed({
    get () {
      return this.container.lookupFactory('controller:google-map/info-windows').create({
        parentController: this
      });
    }
  }),

  /**
   * Controller for each info-window
   * @property infoWindowController
   * @type {String}
   * @default 'google-map/info-window'
   */
  infoWindowController: 'google-map/info-window',

  /**
   * View for each info-window
   * @property infoWindowViewClass
   * @type {String}
   * @default 'google-map/info-window'
   */
  infoWindowViewClass: 'google-map/info-window',

  /**
   * Template for each info-window
   * @property infoWindowTemplateName
   * @type {String}
   * @default 'google-map/info-window'
   */
  infoWindowTemplateName: 'google-map/info-window',

  /**
   * The google map object
   * @property map
   * @type {google.maps.Map}
   */
  map: computed.oneWay('googleObject'),

  /**
   * Schedule an auto-fit of the bounds
   *
   * @method _scheduleAutoFitBounds
   */
  _scheduleAutoFitBounds: function () {
    run.schedule('afterRender', this, function () {
      run.debounce(this, '_fitBounds', 200);
    });
  },

  /**
   * Observes the length of the autoFitBounds array
   *
   * @method _observesAutoFitBoundLength
   * @private
   */
  _observesAutoFitBoundLength: on('init', observer('fitBoundsArray.length', function () {
    if (this.get('alwaysAutoFitBounds')) {
      this._scheduleAutoFitBounds();
    }
  })),


  /**
   * Fit the bounds to contain given coordinates
   *
   * @method _fitBounds
   */
  _fitBounds: function () {
    var map, bounds, coords;
    if (this.isDestroying || this.isDestroyed) {
      return;
    }
    map = this.get('googleObject');
    if (this._state !== 'inDOM' || !map) {
      this._scheduleAutoFitBounds(coords);
      return;
    }
    coords = this.get('fitBoundsArray');
    if (!coords) {
      return;
    }
    if (Ember.isArray(coords)) {
      // it's an array of lat,lng
      coords = coords.slice();
      if (get$(coords, 'length')) {
        bounds = new google.maps.LatLngBounds(helpers._latLngToGoogle(coords.shift()));
        forEach(coords, function (point) {
          bounds.extend(helpers._latLngToGoogle(point));
        });
      }
      else {
        return;
      }
    }
    else {
      // it's a bound object
      bounds = helpers._boundsToGoogle(coords);
    }
    if (bounds) {
      // finally make our map to fit
      map.fitBounds(bounds);
    }
  },


  /**
   * Initialize the map
   */
  initGoogleMap: on('didInsertElement', function () {
    var canvas;
    this.destroyGoogleMap();
    if (helpers.hasGoogleLib()) {
      canvas = this.$('div.map-canvas')[0];
      var map = this.createGoogleObject(canvas, null);
      if (this.get('search')) { 
	      //var input = $('<input id="map-input_' + this.elementId + '" class="map-controls map-input" type="text" placeholder="Enter a location">')[0];
	      var markers = this.get('markers');
	      var input = document.getElementById('map-input_' + this.elementId);
	      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	      var searchBox = new google.maps.places.SearchBox(input);
	      google.maps.event.addListenerOnce(map, 'idle', function(){
		input.style.display = "";
	      });
	      var _this = this;
	      google.maps.event.addListener(searchBox, 'places_changed', function() {
		    var places = searchBox.getPlaces();
		    if (places.length == 0) {
		      this.set('lat', null);
		      this.set('lng', null);
		      return;
		    }
		    _this.set('place', places[0]);
		    this.set('lat', places[0].geometry.location.lat());
		    this.set('lng', places[0].geometry.location.lng());

		    for (var i = 0, marker; marker = markers[i]; i++) {
		      marker.setMap(null);
		    }

		    // For each place, get the icon, place name, and location.
		    markers = [];
		    var bounds = new google.maps.LatLngBounds();
		    for (var i = 0, place; place = places[i]; i++) {
		      var image = {
			url: place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(25, 25)
		      };

		      // Create a marker for each place.
		      var marker = new google.maps.Marker({
			map: map,
			icon: image,
			title: place.name,
			position: place.geometry.location
		      });

		      markers.pushObject(marker);

		      bounds.extend(place.geometry.location);
		    }

		    map.fitBounds(bounds);
             });
	     google.maps.event.addListener(map, 'bounds_changed', function() {
		   if (map.getZoom !== 12)
			map.setZoom(12);
	           var bounds = map.getBounds();
		   searchBox.setBounds(bounds);
	     });

      }
      this._scheduleAutoFitBounds();
    }
  }),

  /**
   * Destroy the map
   */
  destroyGoogleMap: on('willDestroyElement', function () {
    if (this.get('googleObject')) {
      Ember.debug(fmt('[google-map] destroying %@', this.get('googleName')));
      this.set('googleObject', null);
    }
  })
});
