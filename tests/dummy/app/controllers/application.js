import Ember from 'ember';
import {MAP_TYPES} from 'ember-google-map/components/google-map';

export default Ember.Controller.extend({
  lat:         0,
  lng:         0,
  zoom:        5,
  type:        'road',
  mapTypes:    MAP_TYPES,
  markers:     [
    {title: 'one', lat: 5, lng: 5, description: 'hello 1', isDraggable: true},
    {title: 'two', lat: 5, lng: 0, hasInfoWindow: false},
    {title: 'three', lat: 0, lng: 5, infoWindowTemplateName: 'marker-info-window', helloWorld: 'Hello World!'}
  ],
  infoWindows: [
    {title: 'some info window', lat: -5, lng: -5, description: 'hello everybody!'}
  ],

  actions: {
    addMarker:        function () {
      this.get('markers').addObject({title: 'new', lat: 0, lng: 0, isDraggable: true});
    },
    removeMarker:     function (marker) {
      this.get('markers').removeObject(marker);
    },
    addInfoWindow:    function () {
      this.get('infoWindows').addObject({title: 'new iw', description: 'hello', lat: -5, lng: 0});
    },
    removeInfoWindow: function (marker) {
      this.get('infoWindows').removeObject(marker);
    }
  }
});
