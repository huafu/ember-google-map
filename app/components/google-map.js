/* globals google */
import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleObjectMixin from 'ember-google-map/mixins/google-object';


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
 * @constructor
 */
var GoogleMapComponent = Ember.Component.extend(GoogleObjectMixin, {
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
   * Our google map object
   * @property googleObject
   * @type {google.maps.Map}
   * @private
   */
  googleObject: null,
  /**
   * Initial center's latitude of the map
   * @property lat
   * @type {Number}
   */
  lat:          0,
  /**
   * Initial center's longitude of the map
   * @property lng
   * @type {Number}
   */
  lng:          0,
  /**
   * Initial zoom of the map
   * @property zoom
   * @type {Number}
   * @default 5
   */
  zoom:         5,

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
  markers:                      null,
  /**
   * Controller to use for each marker
   * @property markerController
   * @type {String}
   * @default 'google-map/marker'
   */
  markerController:             'google-map/marker',
  //FIXME: ember does not allow to set itemView neither itemViewClass bound on that!
  /**
   * View to use for each marker
   * @property markerViewClass
   * @type {String}
   * @default 'google-map/marker'
   */
  markerViewClass:              'google-map/marker',
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
  markerHasInfoWindow:          true,

  /**
   * Array of al info-windows to handle/show (independent from the markers' info-windows)
   * @property infoWindows
   * @type {Array.<{lat: Number, lng: Number, title: String, description: String}>}
   */
  infoWindows:            null,
  /**
   * Controller for each info-window
   * @property infoWindowController
   * @type {String}
   * @default 'google-map/info-window'
   */
  infoWindowController:   'google-map/info-window',
  //FIXME: ember does not allow to set itemView neither itemViewClass bound on that!
  /**
   * View for each info-window
   * @property infoWindowViewClass
   * @type {String}
   * @default 'google-map/info-window'
   */
  infoWindowViewClass:    'google-map/info-window',
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
  map: Ember.computed.oneWay('googleObject'),

  /**
   * Initialize the map
   */
  initGoogleMap: Ember.on('didInsertElement', function () {
    var canvas, opt, map;
    this.destroyGoogleMap();
    if (helpers.hasGoogleLib()) {
      canvas = this.$('div.map-canvas')[0];
      opt = this.serializeGoogleOptions();
      Ember.debug('[google-map] creating map with options: %@'.fmt(opt));
      map = new google.maps.Map(canvas, opt);
      this.set('googleObject', map);
      this.synchronizeEmberObject();
    }
  }),

  /**
   * Destroy the map
   */
  destroyGoogleMap: Ember.on('willDestroyElement', function () {
    if (this.get('googleObject')) {
      Ember.debug('[google-map] destroying map');
      this.set('googleObject', null);
    }
  })
});

export default GoogleMapComponent;
