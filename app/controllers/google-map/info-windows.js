import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: Ember.computed.alias('parentController.infoWindowController'),
  model:          Ember.computed.alias('parentController.infoWindows')
})
