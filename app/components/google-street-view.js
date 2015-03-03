import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleObjectMixin from 'ember-google-map/mixins/google-object';
import GoogleMapComponent from './google-map';

var computed = Ember.computed;
var oneWay = computed.oneWay;
var not = computed.not;
var assert = Ember.assert;
var on = Ember.on;
var fmt = Ember.String.fmt;

/**
 * @class GoogleStreetViewComponent
 * @extends Ember.Component
 * @uses GoogleObjectMixin
 */
export default Ember.Component.extend(GoogleObjectMixin, {
  /**
   * @inheritDoc
   */
  googleFQCN: 'google.maps.StreetViewPanorama',

  /**
   * @inheritDoc
   */
  classNames: ['google-street-view'],

  /**
   * Defines all properties bound to the google street view object
   * @property googleProperties
   * @type {Object}
   */
  googleProperties: {
    zoom:            {event: 'zoom_changed', cast: helpers.cast.integer},
    'lat,lng':       {
      name:       'position',
      event:      'position_changed',
      toGoogle:   helpers._latLngToGoogle,
      fromGoogle: helpers._latLngFromGoogle
    },
    'heading,pitch': {
      name:       'pov',
      event:      'pov_changed',
      toGoogle:   helpers._povToGoogle,
      fromGoogle: helpers._povFromGoogle
    },
    closeButton:     {name: 'enableCloseButton', optionOnly: true},
    isVisible:       {name: 'visible', event: 'visible_changed'}
  },

  /**
   * The events to handle
   * @property googleEvents
   * @type {Object}
   */
  googleEvents: {},


  /**
   * Whether the street view is visible or not
   * @property isVisible
   * @type {boolean}
   */
  isVisible: computed('standalone', function (key, value) {
    if (arguments.length > 1) {
      this._predefIsVisible = value = !!value;
    }
    else {
      value = this._predefIsVisible === undefined ? !!this.get('standalone') : this._predefIsVisible;
    }
    return value;
  }),

  /**
   * Whether to sho the close button or not
   * @property closeButton
   * @type {boolean}
   */
  closeButton: not('standalone'),

  /**
   * The camera heading in degrees relative to true north. True north is 0°, east is 90°, south is 180°, west is 270°.
   * @property heading
   * @type {number}
   */
  heading: 0,

  /**
   * The camera pitch in degrees, relative to the street view vehicle. Ranges from 90° (directly upwards) to -90° (directly downwards).
   * @property pitch
   * @type {number}
   */
  pitch: 0,

  /**
   * The latitude of the position
   * @property lat
   * @type {number}
   */
  lat: oneWay('mapComponent.lat'),

  /**
   * The longitude of the position
   * @property lng
   * @type {number}
   */
  lng: oneWay('mapComponent.lng'),

  /**
   * Whether to force the street view to be outside of the map and uses its own div
   * @property standalone
   * @type {boolean}
   */
  standalone: computed('mapComponent', function (key, value) {
    var mapComponent = this.get('mapComponent');
    if (arguments.length > 1) {
      assert(
        '[google-map] Cannot set the street view `standalone` option after creation.',
        !this.get('googleObject')
      );
      assert(
        '[google-map] A street view component `standalone` option cannot be set to `false` when not used within a map.',
        value || mapComponent
      );
      value = !!value;
      this._standalone = value;
    }
    else {
      if (this._standalone !== undefined) {
        value = this._standalone;
      }
      else {
        value = !mapComponent;
      }
    }
    return value;
  }),

  /**
   * The google map component
   * @property mapComponent
   * @type {GoogleMapComponent}
   */
  mapComponent: computed(function () {
    var parentView = this.get('parentView');
    if (parentView instanceof GoogleMapComponent) {
      return parentView;
    }
  }),

  /**
   * Register this street view as part of the container map if any
   *
   * @method registerInOwnerMap
   */
  registerInOwnerMap: function () {
    var parentMap = this.get('mapComponent');
    if (parentMap) {
      parentMap.set('streetViewComponent', this);
    }
  },

  /**
   * Unregister this street view as part of the container map if any
   *
   * @method unregisterFromOwnerMap
   */
  unregisterFromOwnerMap: function () {
    var parentMap = this.get('mapComponent');
    if (parentMap) {
      parentMap.set('streetViewComponent', null);
    }
  },

  /**
   * Initialize the street view object
   */
  initGoogleStreetView: on('didInsertElement', function () {
    this.destroyGoogleStreetView();
    if (helpers.hasGoogleLib()) {
      this.createGoogleObject(this.$('.street-view-canvas').get(0), null);
      this.registerInOwnerMap();
    }
  }),

  /**
   * Destroy the street view
   */
  destroyGoogleStreetView: on('willDestroyElement', function () {
    if (this.get('googleObject')) {
      Ember.debug(fmt('[google-map] destroying %@', this.get('googleName')));
      this.unregisterFromOwnerMap();
      this.set('googleObject', null);
    }
  })
});
