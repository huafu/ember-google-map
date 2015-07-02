import Ember from 'ember';
import GoogleArrayMixin from 'ember-google-map/mixins/google-array';
import helpers from 'ember-google-map/core/helpers';

var computed = Ember.computed;

/**
 * @class GoogleMapPolylinePathController
 * @extends Ember.ArrayController
 */
export default Ember.ArrayController.extend(GoogleArrayMixin, {
  model:                  computed.alias('parentController.path'),
  googleItemFactory:      helpers._latLngToGoogle,
  emberItemFactory:       function (googleLatLng) {
    return Ember.Object.create(helpers._latLngFromGoogle(googleLatLng));
  },
  observeEmberProperties: ['lat', 'lng']
});
