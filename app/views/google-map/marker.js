import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleMapCoreView from './core';

var computed = Ember.computed;
var alias = computed.alias;
var oneWay = computed.oneWay;

/**
 * @class GoogleMapMarkerView
 * @extends GoogleMapCoreView
 */
export default GoogleMapCoreView.extend({
  googleFQCN: 'google.maps.Marker',

  googleProperties: {
    isClickable: {name: 'clickable', event: 'clickable_changed'},
    isVisible:   {name: 'visible', event: 'visible_changed'},
    isDraggable: {name: 'draggable', event: 'draggable_changed'},
    isOptimized: {name: 'optimized', readOnly: true},
    title:       {event: 'title_changed'},
    opacity:     {cast: helpers.cast.number},
    icon:        {event: 'icon_changed'},
    zIndex:      {event: 'zindex_changed', cast: helpers.cast.integer},
    map:         {readOnly: true},
    'lat,lng':   {
      name:       'position',
      event:      'position_changed',
      toGoogle:   helpers._latLngToGoogle,
      fromGoogle: helpers._latLngFromGoogle
    }
  },

  _coreGoogleEvents: ['click'],

  // aliased from controller so that if they are not defined they use the values from the controller
  title:       alias('controller.title'),
  opacity:     alias('controller.opacity'),
  zIndex:      alias('controller.zIndex'),
  isVisible:   alias('controller.isVisible'),
  isDraggable: alias('controller.isDraggable'),
  isClickable: alias('controller.isClickable'),
  icon:        alias('controller.icon'),
  lat:         alias('controller.lat'),
  lng:         alias('controller.lng'),

  // get the info window template name from the component or own controller
  infoWindowTemplateName: computed('controller.infoWindowTemplateName', 'parentView.markerInfoWindowTemplateName', {
    get() {
      return this.get('controller.infoWindowTemplateName') || this.get('parentView.markerInfoWindowTemplateName');
    }
  }),

  infoWindowAnchor: oneWay('googleObject'),

  isInfoWindowVisible: alias('controller.isInfoWindowVisible'),

  hasInfoWindow: computed('parentView.markerHasInfoWindow', 'controller.hasInfoWindow', {
    get() {
      var fromCtrl = this.get('controller.hasInfoWindow');
      if (fromCtrl === null || fromCtrl === undefined) {
        return !!this.get('parentView.markerHasInfoWindow');
      }
      return fromCtrl;
    }
  }),

  /**
   * @inheritDoc
   */
  _handleCoreEvent: function (name) {
    if (name === 'click') {
      this.set('isInfoWindowVisible', true);
    }
  }
});

