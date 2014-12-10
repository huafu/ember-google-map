import Ember from 'ember';

export default Ember.ObjectController.extend({
  pathController: Ember.computed.alias('parentController.pathController'),

  _path: Ember.computed('path', 'pathController', function () {
    return this.container.lookupFactory('controller:' + this.get('pathController')).create({
      parentController: this
    });
  }).readOnly()
});
