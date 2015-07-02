import Ember from 'ember';

var computed = Ember.computed;
var alias = computed.alias;

/**
 * @class GoogleMapCircleController
 * @extends Ember.Controller
 */
export default Ember.Controller.extend({
  radius:        alias('model.radius'),
  zIndex:        alias('model.zIndex'),
  isVisible:     alias('model.isVisible'),
  isDraggable:   alias('model.isDraggable'),
  isClickable:   alias('model.isClickable'),
  isEditable:    alias('model.isEditable'),
  strokeColor:   alias('model.strokeColor'),
  strokeOpacity: alias('model.strokeOpacity'),
  strokeWeight:  alias('model.strokeWeight'),
  fillColor:     alias('model.fillColor'),
  fillOpacity:   alias('model.fillOpacity'),
  lat:           alias('model.lat'),
  lng:           alias('model.lng')
});
