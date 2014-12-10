import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: Ember.computed.alias('parentController.circleController'),
  model:          Ember.computed.alias('parentController.circles')
});
