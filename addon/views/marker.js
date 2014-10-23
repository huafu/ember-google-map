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
  googleEvents:     {
    click:      true,
    dblclick:   true,
    drag:       true,
    dragend:    true,
    mousedown:  true,
    mouseout:   true,
    mouseover:  true,
    mouseup:    true,
    rightclick: true
  },

  // aliased from controller so that if they are not defined they use the values from the controller
  title:            Ember.computed.alias('controller.title'),
  opacity:          Ember.computed.alias('controller.opacity'),
  zIndex:           Ember.computed.alias('controller.zIndex'),
  isVisible:        Ember.computed.alias('controller.isVisible'),
  isDraggable:      Ember.computed.alias('controller.isDraggable'),
  isClickable:      Ember.computed.alias('controller.isClickable'),
  icon:             Ember.computed.alias('controller.icon'),
  lat:              Ember.computed.alias('controller.lat'),
  lng:              Ember.computed.alias('controller.lng'),

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
  }
});

export default MarkerView;
