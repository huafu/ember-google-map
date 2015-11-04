import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleObjectMixin from 'ember-google-map/mixins/google-object';
import GoogleMapComponent from 'ember-google-map/components/google-map';

var computed = Ember.computed;
var oneWay = computed.oneWay;
var on = Ember.on;

/**
 * @class GoogleMapCoreView
 * @extends Ember.View
 * @uses GoogleObjectMixin
 */
export default Ember.View.extend(GoogleObjectMixin, {
  googleMapComponent: computed({
    get() {
      var parent = this.get('parentView');
      while (parent && !(parent instanceof GoogleMapComponent)) {
        parent = parent.get('parentView');
      }
      return parent;
    }
  }),

  googleEventsTarget: oneWay('googleMapComponent.targetObject'),

  map: oneWay('googleMapComponent.map'),

  controller: oneWay('context'),

  initGoogleObject: on('didInsertElement', function () {
    // force the creation of the object
    if (helpers.hasGoogleLib() && !this.get('googleObject')) {
      this.createGoogleObject();
    }
  }),

  destroyGoogleObject: on('willDestroyElement', function () {
    var object = this.get('googleObject');
    if (object) {
      // detach from the map
      object.setMap(null);
      this.set('googleObject', null);
    }
  })
});
