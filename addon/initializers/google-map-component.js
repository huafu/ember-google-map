import GoogleMapMarkerView from '../views/marker';
import GoogleMapInfoWindowView from '../views/info-window';
import GoogleMapMarkerController from '../controllers/marker';
import GoogleMapInfoWindowController from '../controllers/info-window';
import GoogleMapAutoCompletionAddressController from '../controllers/auto-completion-address';
import GoogleMapPlaceController from '../controllers/place';

export var initialize = function (container/*, application*/) {
  // register our factories
  container.register('view:google-map/marker', GoogleMapMarkerView);
  container.register('view:google-map/info-window', GoogleMapInfoWindowView);

  container.register('controller:google-map/marker', GoogleMapMarkerController);
  container.register('controller:google-map/info-window', GoogleMapInfoWindowController);
  container.register('controller:google-map/auto-completion-address', GoogleMapAutoCompletionAddressController);
  container.register('controller:google-map/place', GoogleMapPlaceController);
};

export default {
  name: 'google-map-component',

  initialize: initialize
};
