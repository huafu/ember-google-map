import Ember from 'ember';

/**
 * @class GoogleMapInfoWindowsController
 * @extends Ember.ArrayController
 */
export default Ember.ArrayController.extend({
  itemController: Ember.computed.alias('parentController.infoWindowController'),
  model:          Ember.computed.alias('parentController.infoWindows')
})
