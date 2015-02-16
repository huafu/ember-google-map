import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleMapPolylineView from './polyline';

var computed = Ember.computed;
var alias = computed.alias;

/**
 * @class GoogleMapPolygonView
 * @extends GoogleMapPolylineView
 */
export default GoogleMapPolylineView.extend({
  googleFQCN: 'google.maps.Polygon',

  googleProperties: computed(function () {
    return Ember.merge(this._super(), {
      fillColor:   {optionOnly: true},
      fillOpacity: {optionOnly: true, cast: helpers.cast.number}
    });
  }).readOnly(),

  // aliased from controller so that if they are not defined they use the values from the controller
  fillColor:        alias('controller.fillColor'),
  fillOpacity:      alias('controller.fillOpacity')
});
