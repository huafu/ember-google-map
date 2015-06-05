import Ember from 'ember';

/**
 * @class GoogleMapCirclesController
 * @extends Ember.ArrayController
 */
export default Ember.ArrayController.extend({
  itemController: Ember.computed.alias('parentController.circleController'),
  model:          Ember.computed.alias('parentController.circles')
});
