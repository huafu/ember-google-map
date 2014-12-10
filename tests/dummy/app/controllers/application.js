import Ember from 'ember';
import {MAP_TYPES} from '../components/google-map';

export default Ember.Controller.extend({
  lat:      0,
  lng:      0,
  zoom:     5,
  type:     'road',
  mapTypes: MAP_TYPES,

  markers: [
    {title: 'one', lat: 5, lng: 5, description: 'hello 1', isDraggable: true},
    {title: 'two', lat: 5, lng: 0, hasInfoWindow: false},
    {
      title:                  'three',
      lat:                    0,
      lng:                    5,
      infoWindowTemplateName: 'marker-info-window',
      helloWorld:             'Hello World!'
    }
  ],

  infoWindows: [
    {title: 'some info window', lat: -5, lng: -5, description: 'hello everybody!'}
  ],

  polylines: [
    {
      isEditable:    true,
      path:          [
        {lat: 2.8, lng: -3.6}, {lat: 1.5, lng: 0.2}, {lat: -3, lng: 2}, {lat: -5.5, lng: -0.8},
        {lat: -5.9, lng: -8.9}, {lat: -3.4, lng: -11.6}, {lat: 1.2, lng: -11.1}, {lat: 2.8, lng: -7}
      ],
      strokeOpacity: 0.8,
      strokeColor:   'blue'
    }
  ],

  actions: {
    addMarker: function () {
      this.get('markers').addObject({title: 'new', lat: 0, lng: 0, isDraggable: true});
    },

    removeMarker: function (marker) {
      this.get('markers').removeObject(marker);
    },

    addInfoWindow: function () {
      this.get('infoWindows').addObject({title: 'new iw', description: 'hello', lat: -5, lng: 0});
    },

    removeInfoWindow: function (marker) {
      this.get('infoWindows').removeObject(marker);
    },

    addPolyline: function () {
      this.get('polylines').addObject({
        isEditable: false,
        path:       [{lat: 0, lng: 0}, {lat: 1, lng: 0}]
      });
    },

    removePolyline: function (polyline) {
      this.get('polylines').removeObject(polyline);
    },

    addPolylinePathItem: function (path) {
      path.addObject({lat: 1, lng: 1});
    },

    removePolylinePathItem: function (path, item) {
      path.removeObject(item);
    }
  }
});
