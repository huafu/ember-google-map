import Ember from 'ember';
import {MAP_TYPES} from '../components/google-map';

export default Ember.Controller.extend({
  lat:      13.6439,
  lng:      100.5265,
  zoom:     15,
  type:     'road',
  mapTypes: MAP_TYPES,

  streetView: {
    lat:       13.64543,
    lng:       100.524244,
    isVisible: false,
    heading:   -19.689363,
    pitch:     0
  },

  markers: [
    {
      title:                  'Dummy',
      lat:                    13.6496,
      lng:                    100.5289,
      description:            'Hello, World!',
      infoWindowTemplateName: 'marker-info-window',
      isDraggable:            true
    }
  ],

  infoWindows: [
    {title: 'What?', lat: 13.6481, lng: 100.5231, description: 'I guess 42!'}
  ],

  polylines: [
    {
      isEditable:    false,
      path:          [
        {lat: 13.6446, lng: 100.5147},
        {lat: 13.6447, lng: 100.5183},
        {lat: 13.6423, lng: 100.5215},
        {lat: 13.6381, lng: 100.5172}
      ],
      strokeOpacity: 0.8,
      strokeColor:   'blue',
      strokeWeight:  7
    }
  ],

  polygons: [
    {
      isEditable:    false,
      path:          [
        {lat: 13.6460, lng: 100.5321},
        {lat: 13.6397, lng: 100.5334},
        {lat: 13.6403, lng: 100.5266},
        {lat: 13.6443, lng: 100.5250}
      ],
      strokeOpacity: 0.8,
      strokeColor:   'red',
      fillColor:     'yellow',
      fillOpacity:   0.5
    }
  ],

  circles: [
    {
      isEditable: false,
      lat:        13.6419,
      lng:        100.5171,
      radius:     250
    }
  ],

  actions: {
    addMarker: function () {
      this.get('markers').addObject({
        title:       'new',
        lat:         this.get('lat'),
        lng:         this.get('lng'),
        isDraggable: true
      });
    },

    removeMarker: function (marker) {
      this.get('markers').removeObject(marker);
    },

    addCircle: function () {
      this.get('circles').addObject({
        lat:        this.get('lat'),
        lng:        this.get('lng'),
        radius:     1000,
        isEditable: true
      });
    },

    removeCircle: function (circle) {
      this.get('circles').removeObject(circle);
    },

    addInfoWindow: function () {
      this.get('infoWindows').addObject({
        title:       'new iw',
        description: 'hello',
        lat:         this.get('lat'),
        lng:         this.get('lng')
      });
    },

    removeInfoWindow: function (marker) {
      this.get('infoWindows').removeObject(marker);
    },

    addPolyline: function () {
      this.get('polylines').addObject({
        isEditable: true,
        path:       [
          {lat: this.get('lat'), lng: this.get('lng')},
          {lat: this.get('lat') - 0.005, lng: this.get('lng')}
        ]
      });
    },

    removePolyline: function (polyline) {
      this.get('polylines').removeObject(polyline);
    },

    addPolylinePathItem: function (path) {
      var last = path.get('lastObject');
      path.addObject({lat: last.lat - 0.005, lng: last.lng});
    },

    removePolylinePathItem: function (path, item) {
      path.removeObject(item);
    },

    addPolygon: function () {
      this.get('polygons').addObject({
        isEditable: true,
        path:       [
          {lat: this.get('lat'), lng: this.get('lng')},
          {lat: this.get('lat') - 0.005, lng: this.get('lng')}
        ]
      });
    },

    removePolygon: function (polyline) {
      this.get('polygons').removeObject(polyline);
    },

    addPolygonPathItem: function (path) {
      var last = path.get('lastObject');
      path.addObject({lat: last.lat - 0.005, lng: last.lng});
    },

    removePolygonPathItem: function (path, item) {
      path.removeObject(item);
    }
  }
});
