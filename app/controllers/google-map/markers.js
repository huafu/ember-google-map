import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: Ember.computed.alias('parentController.markerController'),
  model:          Ember.computed.alias('parentController.markers')
})
