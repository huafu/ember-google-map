import GoogleMapMarkerView from 'google-map/views/marker';
import GoogleMapInfoWindowView from 'google-map/views/info-window';
import GoogleMapMarkerController from 'google-map/controllers/marker';

export var initialize = function (container, application) {
  // register our factories
  application.register('view:google-map/marker', GoogleMapMarkerView);
  application.register('view:google-map/info-window', GoogleMapInfoWindowView);
  application.register('controller:google-map/marker', GoogleMapMarkerController);
};

export default {
  name: 'google-map-component',

  initialize: initialize
};
