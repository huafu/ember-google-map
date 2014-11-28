/* global google */
import Ember from 'ember';
import helpers from '../core/helpers';
import GoogleObjectMixin from '../mixins/google-object';

var MarkerView = Ember.View.extend(GoogleObjectMixin, {
  googleProperties:       {
    isClickable: { name: 'clickable', event: 'clickable_changed' },
    isVisible:   { name: 'visible', event: 'visible_changed' },
    isDraggable: { name: 'draggable', event: 'draggable_changed' },
    title:       { event: 'title_changed' },
    opacity:     { cast: helpers.cast.number },
    icon:        { event: 'icon_changed' },
    zIndex:      { event: 'zindex_changed', cast: helpers.cast.integer },
    map:         {readOnly: true},
    'lat,lng':   {
      name:       'position',
      event:      'position_changed',
      toGoogle:   helpers._latLngToGoogle,
      fromGoogle: helpers._latLngFromGoogle
    }
  },

  // merge from whatever defined from the controller so we can handle click to show infowindow or such
  googleEvents:           function (key, value) {
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
  title:                  Ember.computed.alias('controller.title'),
  opacity:                Ember.computed.alias('controller.opacity'),
  zIndex:                 Ember.computed.alias('controller.zIndex'),
  isVisible:              Ember.computed.alias('controller.isVisible'),
  isDraggable:            Ember.computed.alias('controller.isDraggable'),
  isClickable:            Ember.computed.alias('controller.isClickable'),
  icon:                   Ember.computed.alias('controller.icon'),
  lat:                    Ember.computed.alias('controller.lat'),
  lng:                    Ember.computed.alias('controller.lng'),

  // get the info window template name from the component or own controller
  infoWindowTemplateName: function () {
    return this.get('controller.infoWindowTemplateName') || this.get('parentView.markerInfoWindowTemplateName');
  }.property('controller.infoWindowTemplateName', 'parentView.markerInfoWindowTemplateName').readOnly(),
  infoWindowAnchor:       Ember.computed.oneWay('googleObject'),
  isInfoWindowVisible:    Ember.computed.alias('controller.isInfoWindowVisible'),
  hasInfoWindow:          function () {
    var fromCtrl = this.get('controller.hasInfoWindow');
    if (fromCtrl === null || fromCtrl === undefined) {
      return !!this.get('parentView.markerHasInfoWindow');
    }
    return fromCtrl;
  }.property('parentView.markerHasInfoWindow', 'controller.hasInfoWindow').readOnly(),

  // bound to the google map object of the component
  map:                    Ember.computed.oneWay('parentView.map'),

  initGoogleMarker: function () {
    var opt;
    // force the creation of the marker
    if (helpers.hasGoogleLib() && !this.get('googleObject')) {
      opt = this.serializeGoogleOptions();
      Ember.debug('[google-maps] creating new marker: %@'.fmt(opt));
      this.set('googleObject', new google.maps.Marker(opt));
      this.synchronizeEmberObject();
    }
  }.on('didInsertElement'),

  destroyGoogleMarker: function () {
    var marker = this.get('googleObject');
    if (marker) {
      // detach from the map
      marker.setMap(null);
      this.set('googleObject', null);
    }
  }.on('willDestroyElement'),

  actions: {
    handleMarkerEvent: function () {
      var args = [].slice.call(arguments);
      var event = this.get('lastGoogleEventName');
      if (event === 'click') {
        this.set('isInfoWindowVisible', true);
      }
      else {
        Ember.warn('[google-map] unhandled marker event %@ with arguments %@'.fmt(event, args.join(', ')));
      }
    }
  }
});

export default MarkerView;
