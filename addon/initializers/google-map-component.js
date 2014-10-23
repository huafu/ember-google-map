import GoogleMapMarkerView from 'google-map/views/marker';
import GoogleMapMarkerController from 'google-map/controllers/marker';

export var initialize = function (container, application) {
  // register our factories
  application.register('view:google-map/views/marker', GoogleMapMarkerView);
  application.register('controller:google-map/controllers/marker', GoogleMapMarkerController);
};

export default {
  name: 'google-map-component',

  initialize: initialize
};
