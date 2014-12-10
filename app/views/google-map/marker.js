/* global google */
import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleObjectMixin from 'ember-google-map/mixins/google-object';

var computed = Ember.computed;
var alias = computed.alias;
var oneWay = computed.oneWay;

var MarkerView = Ember.View.extend(GoogleObjectMixin, {
  googleProperties:       {
    isClickable: {name: 'clickable', event: 'clickable_changed'},
    isVisible:   {name: 'visible', event: 'visible_changed'},
    isDraggable: {name: 'draggable', event: 'draggable_changed'},
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

  // merge from whatever defined from the controller so we can handle click to show infowindow or such
  googleEvents:           computed('controller.googleEvents', function (key, value) {
    if (arguments.length < 2) {
      value = Ember.merge({
        click:      'handleMarkerEvent',
        dblclick:   'handleMarkerEvent',
        drag:       'handleMarkerEvent',
        dragend:    'handleMarkerEvent',
        dragstart:  'handleMarkerEvent',
        mousedown:  'handleMarkerEvent',
        //mousemove:  'handleMarkerEvent',
        mouseout:   'handleMarkerEvent',
        mouseover:  'handleMarkerEvent',
        mouseup:    'handleMarkerEvent',
        rightclick: 'handleMarkerEvent'
      }, this.get('controller.googleEvents') || {});
    }
    return value;
  }),

  // aliased from controller so that if they are not defined they use the values from the controller
  title:                  alias('controller.title'),
  opacity:                alias('controller.opacity'),
  zIndex:                 alias('controller.zIndex'),
  isVisible:              alias('controller.isVisible'),
  isDraggable:            alias('controller.isDraggable'),
  isClickable:            alias('controller.isClickable'),
  icon:                   alias('controller.icon'),
  lat:                    alias('controller.lat'),
  lng:                    alias('controller.lng'),

  // get the info window template name from the component or own controller
  infoWindowTemplateName: computed('controller.infoWindowTemplateName', 'parentView.markerInfoWindowTemplateName', function () {
    return this.get('controller.infoWindowTemplateName') || this.get('parentView.markerInfoWindowTemplateName');
  }).readOnly(),
  infoWindowAnchor:       oneWay('googleObject'),
  isInfoWindowVisible:    alias('controller.isInfoWindowVisible'),
  hasInfoWindow:          computed('parentView.markerHasInfoWindow', 'controller.hasInfoWindow', function () {
    var fromCtrl = this.get('controller.hasInfoWindow');
    if (fromCtrl === null || fromCtrl === undefined) {
      return !!this.get('parentView.markerHasInfoWindow');
    }
    return fromCtrl;
  }).readOnly(),

  // bound to the google map object of the component
  map:                    oneWay('parentView.map'),

  initGoogleMarker: Ember.on('didInsertElement', function () {
    var opt;
    // force the creation of the marker
    if (helpers.hasGoogleLib() && !this.get('googleObject')) {
      opt = this.serializeGoogleOptions();
      Ember.debug('[google-maps] creating new marker: %@'.fmt(opt));
      this.set('googleObject', new google.maps.Marker(opt));
      this.synchronizeEmberObject();
    }
  }),

  destroyGoogleMarker: Ember.on('willDestroyElement', function () {
    var marker = this.get('googleObject');
    if (marker) {
      // detach from the map
      marker.setMap(null);
      this.set('googleObject', null);
    }
  }),

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
