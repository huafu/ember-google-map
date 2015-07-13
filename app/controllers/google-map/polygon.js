import Ember from 'ember';
import GoogleMapPolylineController from './polyline';

var computed = Ember.computed;
var alias = computed.alias;

/**
 * @class GoogleMapPolygonController
 * @extends GoogleMapPolylineController
 */
export default GoogleMapPolylineController.extend({
  fillColor:   alias('model.fillColor'),
  fillOpacity: alias('model.fillOpacity')
});
