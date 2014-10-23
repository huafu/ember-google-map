import Ember from 'ember';
import {MAP_TYPES} from 'google-map/components/google-map';

export default Ember.Controller.extend({
  lat:     0,
  lng:     0,
  zoom:    5,
  type:    'road',
  mapTypes: MAP_TYPES,
  markers: [
    {title: 'one', lat: 5, lng: 5},
    {title: 'two', lat: 5, lng: 0}
  ]
});
