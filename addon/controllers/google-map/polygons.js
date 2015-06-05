import Ember from 'ember';
import GoogleMapPolylinesController from './polylines';

/**
 * @class GoogleMapPolygonsController
 * @extends GoogleMapPolylinesController
 */
export default GoogleMapPolylinesController.extend({
  itemController: Ember.computed.alias('parentController.polygonController'),
  model:          Ember.computed.alias('parentController.polygons'),
  pathController: Ember.computed.alias('parentController.polygonPathController')
});
