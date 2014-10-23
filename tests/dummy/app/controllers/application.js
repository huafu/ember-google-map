import Ember from 'ember';
import {MAP_TYPES} from 'google-map/components/google-map';

export default Ember.Controller.extend({
  lat:         0,
  lng:         0,
  zoom:        5,
  type:        'road',
  mapTypes:    MAP_TYPES,
  markers:     [
    {title: 'one', lat: 5, lng: 5, description: 'hello 1'},
    {title: 'two', lat: 5, lng: 0, hasInfoWindow: false},
    {title: 'three', lat: 0, lng: 5, infoWindowTemplateName: 'marker-info-window', helloWorld: 'Hello World!'}
  ],
  infoWindows: [
    {title: 'some info window', lat: -5, lng: -5, description: 'hello everybody!'}
  ]
});
