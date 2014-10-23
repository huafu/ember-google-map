import GoogleMapMarkerView from 'google-map/views/marker';
import GoogleMapInfoWindowView from 'google-map/views/info-window';
import GoogleMapMarkerController from 'google-map/controllers/marker';
import GoogleMapInfoWindowController from 'google-map/controllers/info-window';

export var initialize = function (container, application) {
  // register our factories
  application.register('view:google-map/marker', GoogleMapMarkerView);
  application.register('view:google-map/info-window', GoogleMapInfoWindowView);
  application.register('controller:google-map/marker', GoogleMapMarkerController);
  application.register('controller:google-map/info-window', GoogleMapInfoWindowController);
};

export default {
  name: 'google-map-component',

  initialize: initialize
};
