import Ember from 'ember';
import {MAP_TYPES} from '../components/google-map';


export default Ember.Controller.extend({
  lat:      10,
  lng:      10,
  zoom:     10,
  type:     'road',
  mapTypes: MAP_TYPES,

  markers: Ember.A([
    {title: 'one', lat: 5, lng: 5, description: 'hello 1', isDraggable: true},
    {title: 'two', lat: 5, lng: 0, hasInfoWindow: false},
    {
      title:                  'three',
      lat:                    0,
      lng:                    5,
      infoWindowTemplateName: 'marker-info-window',
      helloWorld:             'Hello World!'
    }
  ]),

  infoWindows: Ember.A([
    {title: 'some info window', lat: -5, lng: -5, description: 'hello everybody!'}
  ]),

  polylines: Ember.A([
    {
      isEditable:    true,
      path:          Ember.A([
        {lat: 2.8, lng: -3.6}, {lat: 1.5, lng: 0.2}, {lat: -3, lng: 2}, {lat: -5.5, lng: -0.8},
        {lat: -5.9, lng: -8.9}, {lat: -3.4, lng: -11.6}, {lat: 1.2, lng: -11.1}, {lat: 2.8, lng: -7}
      ]),
      strokeOpacity: 0.8,
      strokeColor:   'blue'
    }
  ]),

  polygons: Ember.A([
    {
      isEditable:    true,
      path:          Ember.A([
        {lat: 7.2, lng: -5}, {lat: 7.7, lng: -2}, {lat: 4, lng: -1.5}, {lat: 5, lng: -3.1},
        {lat: 4.8, lng: -6.7}, {lat: 5.3, lng: -9.7}, {lat: 7.9, lng: -10.3}, {lat: 8, lng: -7.3}
      ]),
      strokeOpacity: 0.8,
      strokeColor:   'red',
      fillColor:     'yellow',
      fillOpacity:   0.5
    }
  ]),

  circles: Ember.A([
    {
      isEditable: true,
      lat:        -4.4,
      lng:        6.8,
      radius:     314907
    }
  ]),

  actions: {
    didClickMap: function (view, event) {
      var latLng = event.latLng;
      this.get('markers').pushObject({lat: latLng.lat(), lng: latLng.lng()});
    },

    addMarker: function () {
      this.get('markers').addObject({title: 'new', lat: 0, lng: 0, isDraggable: true});
    },

    removeMarker: function (marker) {
      this.get('markers').removeObject(marker);
    },

    addCircle: function () {
      this.get('circles').addObject({lat: 0, lng: 0, radius: 300000, isEditable: true});
    },

    removeCircle: function (circle) {
      this.get('circles').removeObject(circle);
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
    },

    addPolygon: function () {
      this.get('polygons').addObject({
        isEditable: false,
        path:       [{lat: 0, lng: 0}, {lat: 1, lng: 0}]
      });
    },

    removePolygon: function (polyline) {
      this.get('polygons').removeObject(polyline);
    },

    addPolygonPathItem: function (path) {
      path.addObject({lat: 1, lng: 1});
    },

    removePolygonPathItem: function (path, item) {
      path.removeObject(item);
    }
  }
});
