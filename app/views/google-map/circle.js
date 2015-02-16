import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleMapCoreView from './core';

var computed = Ember.computed;
var alias = computed.alias;

/**
 * @class GoogleMapCircleView
 * @extends GoogleMapCoreView
 */
export default GoogleMapCoreView.extend({
  googleFQCN: 'google.maps.Circle',

  googleProperties: {
    isClickable:   {name: 'clickable', optionOnly: true},
    isVisible:     {name: 'visible', event: 'visible_changed'},
    isDraggable:   {name: 'draggable', event: 'draggable_changed'},
    isEditable:    {name: 'editable', event: 'editable_changed'},
    radius:        {event: 'radius_changed', cast: helpers.cast.number},
    strokeColor:   {optionOnly: true},
    strokeOpacity: {optionOnly: true, cast: helpers.cast.number},
    strokeWeight:  {optionOnly: true, cast: helpers.cast.number},
    fillColor:     {optionOnly: true},
    fillOpacity:   {optionOnly: true, cast: helpers.cast.number},
    zIndex:        {cast: helpers.cast.integer, optionOnly: true},
    map:           {readOnly: true},
    'lat,lng':     {
      name:       'center',
      event:      'center_changed',
      toGoogle:   helpers._latLngToGoogle,
      fromGoogle: helpers._latLngFromGoogle
    }
  },

  // aliased from controller so that if they are not defined they use the values from the controller
  radius:           alias('controller.radius'),
  zIndex:           alias('controller.zIndex'),
  isVisible:        alias('controller.isVisible'),
  isDraggable:      alias('controller.isDraggable'),
  isClickable:      alias('controller.isClickable'),
  isEditable:       alias('controller.isEditable'),
  strokeColor:      alias('controller.strokeColor'),
  strokeOpacity:    alias('controller.strokeOpacity'),
  strokeWeight:     alias('controller.strokeWeight'),
  fillColor:        alias('controller.fillColor'),
  fillOpacity:      alias('controller.fillOpacity'),
  lat:              alias('controller.lat'),
  lng:              alias('controller.lng')
});
