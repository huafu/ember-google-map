import Ember from 'ember';
import GoogleMapPolylinesController from './polylines';

var computed = Ember.computed;

/**
 * @class GoogleMapPolygonsController
 * @extends GoogleMapPolylinesController
 */
export default GoogleMapPolylinesController.extend({
  itemController: computed.alias('parentController.polygonController'),
  model:          computed.alias('parentController.polygons'),
  pathController: computed.alias('parentController.polygonPathController')
});
