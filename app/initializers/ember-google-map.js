import loadGoogleMap from 'ember-google-map/utils/load-google-map';

export function initialize(container, application) {
  application.register('util:load-google-map', loadGoogleMap, {instantiate: false});
  application.inject('route', 'loadGoogleMap', 'util:load-google-map');
}

export default {
  name:       'ember-google-map',
  initialize: initialize
};
