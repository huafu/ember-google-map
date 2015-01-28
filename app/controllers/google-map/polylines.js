import Ember from 'ember';

/**
 * @class GoogleMapPolylinesController
 * @extends Ember.ArrayController
 */
export default Ember.ArrayController.extend({
  itemController: Ember.computed.alias('parentController.polylineController'),
  model:          Ember.computed.alias('parentController.polylines'),
  pathController: Ember.computed.alias('parentController.polylinePathController')
});
