import Ember from 'ember';

var computed = Ember.computed;
var alias = computed.alias;

/**
 * @class GoogleMapInfoWindowController
 * @extends Ember.Controller
 */
export default Ember.Controller.extend({
  templateName: alias('model.templateName'),
  zIndex:       alias('model.zIndex'),
  lat:          alias('model.lat'),
  lng:          alias('model.lng'),
  isVisible:    alias('model.isVisible'),
  title:        alias('model.title'),
  description:  alias('model.description')
});
