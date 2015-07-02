import Ember from 'ember';

var computed = Ember.computed;

/**
 * @class GoogleMapMarkersController
 * @extends Ember.ArrayController
 */
export default Ember.ArrayController.extend({
  itemController: computed.alias('parentController.markerController'),
  model:          computed.alias('parentController.markers')
});
