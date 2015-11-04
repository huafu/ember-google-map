import Ember from 'ember';

var computed = Ember.computed;

/**
 * @class GoogleMapPolylinesController
 * @extends Ember.ArrayController
 */
export default Ember.ArrayController.extend({
  itemController: computed.alias('parentController.polylineController'),
  model:          computed.alias('parentController.polylines'),
  pathController: computed.alias('parentController.polylinePathController')
});
