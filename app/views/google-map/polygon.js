import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleMapPolylineView from './polyline';

var computed = Ember.computed;

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
  }).readOnly()
});
