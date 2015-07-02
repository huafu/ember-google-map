import Ember from 'ember';

var computed = Ember.computed;

/**
 * @class GoogleMapPolylineController
 * @extends Ember.ObjectController
 */
export default Ember.ObjectController.extend({
  pathController: computed.alias('parentController.pathController'),

  _path: computed('path', 'pathController', {
    get () {
      return this.container.lookupFactory('controller:' + this.get('pathController')).create({
        parentController: this
      });
    }
  })
});
