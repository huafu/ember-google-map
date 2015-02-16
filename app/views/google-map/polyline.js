import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleMapCoreView from './core';

var computed = Ember.computed;
var alias = computed.alias;
var on = Ember.on;

/**
 * @class GoogleMapPolylineView
 * @extends GoogleMapCoreView
 */
export default GoogleMapCoreView.extend({
  googleFQCN: 'google.maps.Polyline',

  templateName: 'google-map/polyline',

  googleProperties: computed(function () {
    return {
      isClickable:   {name: 'clickable', optionOnly: true},
      isVisible:     {name: 'visible', event: 'visible_changed'},
      isDraggable:   {name: 'draggable', event: 'draggable_changed'},
      isEditable:    {name: 'editable', event: 'editable_changed'},
      isGeodesic:    {name: 'geodesic', optionOnly: true},
      icons:         {optionOnly: true},
      zIndex:        {optionOnly: true, cast: helpers.cast.integer},
      map:           {readOnly: true},
      strokeColor:   {optionOnly: true},
      strokeWeight:  {optionOnly: true, cast: helpers.cast.number},
      strokeOpacity: {optionOnly: true, cast: helpers.cast.number}
    };
  }).readOnly(),

  // aliased from controller so that if they are not defined they use the values from the controller
  strokeColor:      alias('controller.strokeColor'),
  strokeWeight:     alias('controller.strokeWeight'),
  strokeOpacity:    alias('controller.strokeOpacity'),
  zIndex:           alias('controller.zIndex'),
  isVisible:        alias('controller.isVisible'),
  isDraggable:      alias('controller.isDraggable'),
  isClickable:      alias('controller.isClickable'),
  isEditable:       alias('controller.isEditable'),
  icons:            alias('controller.icons'),

  initGoogleObject: on('didInsertElement', function () {
    // force the creation of the polyline
    if (helpers.hasGoogleLib() && !this.get('googleObject')) {
      this.createGoogleObject({path: this.get('controller._path.googleArray')});
    }
  })
});
