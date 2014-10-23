/* global google */
import Ember from 'ember';
import helpers from '../core/helpers';
import GoogleObjectMixin from '../mixins/google-object';

var MarkerView = Ember.View.extend(GoogleObjectMixin, {
  googleProperties: {
    isClickable: { name: 'clickable', event: 'clickable_changed' },
    isVisible:   { name: 'visible', event: 'visible_changed' },
    isDraggable: { name: 'draggable', event: 'draggable_changed' },
    title:       { event: 'title_changed' },
    opacity:     { cast: helpers.cast.number },
    icon:        { event: 'icon_changed' },
    zIndex:      { event: 'zindex_changed', cast: helpers.cast.integer },
    map:         true,
    'lat,lng':   {
      name:       'position',
      event:      'position_changed',
      toGoogle:   helpers._latLngToGoogle,
      fromGoogle: helpers._latLngFromGoogle
    }
  },

  // merge from whatever defined from the controller so we can handle click to show infowindow or such
  googleEvents:     function (key, value) {
    if (arguments.length < 2) {
      value = Ember.merge({
        click:      'handleMarkerEvent',
        dblclick:   'handleMarkerEvent',
        drag:       'handleMarkerEvent',
        dragend:    'handleMarkerEvent',
        mousedown:  'handleMarkerEvent',
        mouseout:   'handleMarkerEvent',
        mouseover:  'handleMarkerEvent',
        mouseup:    'handleMarkerEvent',
        rightclick: 'handleMarkerEvent'
      }, this.get('controller.googleEvents') || {});
    }
    return value;
  }.property('controller.googleEvents'),

  // aliased from controller so that if they are not defined they use the values from the controller
  title:            Ember.computed.oneWay('controller.title'),
  opacity:          Ember.computed.oneWay('controller.opacity'),
  zIndex:           Ember.computed.oneWay('controller.zIndex'),
  isVisible:        Ember.computed.oneWay('controller.isVisible'),
  isDraggable:      Ember.computed.oneWay('controller.isDraggable'),
  isClickable:      Ember.computed.oneWay('controller.isClickable'),
  icon:             Ember.computed.oneWay('controller.icon'),
  lat:              Ember.computed.oneWay('controller.lat'),
  lng:              Ember.computed.oneWay('controller.lng'),

  // bound to the google map object of the component
  map:              Ember.computed.oneWay('parentView.googleObject'),

  initGoogleMarker: function () {
    var opt;
    // force the creation of the marker
    if (helpers.hasGoogleLib() && !this.cacheFor('googleObject')) {
      opt = this.serializeGoogleOptions();
      Ember.debug('[google-maps] creating new marker: %@'.fmt(opt));
      this.set('googleObject', new google.maps.Marker(opt));
      this.synchronizeEmberObject();
    }
  }.on('didInsertElement'),

  destroyGoogleMarker: function () {
    var marker = this.cacheFor('googleObject');
    if (marker) {
      // detach from the map
      marker.setMap(null);
    }
  }.on('destroy'),

  actions: {
    handleMarkerEvent: function () {
      var args = [].slice.call(arguments);
      var event = this.get('lastGoogleEventName');
      Ember.warn('[google-map] unhandled marker event %@ with arguments %@'.fmt(event, args.join(', ')));
    }
  }
});

export default MarkerView;
