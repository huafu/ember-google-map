import Ember from 'ember';

/**
 * @class GoogleMapMarkersController
 * @extends Ember.ArrayController
 */
export default Ember.ArrayController.extend({
  itemController: Ember.computed.alias('parentController.markerController'),
  model:          Ember.computed.alias('parentController.markers')
})
