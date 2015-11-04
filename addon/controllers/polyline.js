import Ember from 'ember';

var computed = Ember.computed;
var alias = computed.alias;

/**
 * @class GoogleMapPolylineController
 * @extends Ember.Controller
 */
export default Ember.Controller.extend({
  pathController: alias('parentController.pathController'),

  _path: computed('path', 'pathController', {
    get () {
      return this.container.lookupFactory('controller:' + this.get('pathController')).create({
        parentController: this
      });
    }
  }),


  path:          alias('model.path'),
  strokeColor:   alias('model.strokeColor'),
  strokeWeight:  alias('model.strokeWeight'),
  strokeOpacity: alias('model.strokeOpacity'),
  zIndex:        alias('model.zIndex'),
  isVisible:     alias('model.isVisible'),
  isDraggable:   alias('model.isDraggable'),
  isClickable:   alias('model.isClickable'),
  isEditable:    alias('model.isEditable'),
  isGeodesic:    alias('model.isGeodesic'),
  icons:         alias('model.icons')
});
