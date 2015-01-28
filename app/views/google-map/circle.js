import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleObjectMixin from 'ember-google-map/mixins/google-object';

var computed = Ember.computed;
var alias = computed.alias;
var oneWay = computed.oneWay;
var on = Ember.on;
var fmt = Ember.String.fmt;

/**
 * @class GoogleMapCircleView
 * @extends Ember.View
 * @uses GoogleObjectMixin
 */
export default Ember.View.extend(GoogleObjectMixin, {
  googleFQCN: 'google.maps.Circle',

  googleProperties: {
    isClickable:   {name: 'clickable', optionOnly: true},
    isVisible:     {name: 'visible', event: 'visible_changed'},
    isDraggable:   {name: 'draggable', event: 'draggable_changed'},
    isEditable:    {name: 'editable', event: 'editable_changed'},
    radius:        {event: 'radius_changed', cast: helpers.cast.number},
    strokeColor:   {optionOnly: true},
    strokeOpacity: {optionOnly: true, cast: helpers.cast.number},
    strokeWeight:  {optionOnly: true, cast: helpers.cast.number},
    fillColor:     {optionOnly: true},
    fillOpacity:   {optionOnly: true, cast: helpers.cast.number},
    zIndex:        {cast: helpers.cast.integer, optionOnly: true},
    map:           {readOnly: true},
    'lat,lng':     {
      name:       'center',
      event:      'center_changed',
      toGoogle:   helpers._latLngToGoogle,
      fromGoogle: helpers._latLngFromGoogle
    }
  },

  googleEvents:  computed('controller.googleEvents', function (key, value) {
    if (arguments.length < 2) {
      value = Ember.merge({
        click:      'handleCircleEvent',
        dblclick:   'handleCircleEvent',
        drag:       'handleCircleEvent',
        dragend:    'handleCircleEvent',
        dragstart:  'handleCircleEvent',
        mousedown:  'handleCircleEvent',
        //mousemove:  'handleCircleEvent',
        mouseout:   'handleCircleEvent',
        mouseover:  'handleCircleEvent',
        mouseup:    'handleCircleEvent',
        rightclick: 'handleCircleEvent'
      }, this.get('controller.googleEvents'));
    }
    return value;
  }),

  // aliased from controller so that if they are not defined they use the values from the controller
  radius:        alias('controller.radius'),
  zIndex:        alias('controller.zIndex'),
  isVisible:     alias('controller.isVisible'),
  isDraggable:   alias('controller.isDraggable'),
  isClickable:   alias('controller.isClickable'),
  isEditable:    alias('controller.isEditable'),
  strokeColor:   alias('controller.strokeColor'),
  strokeOpacity: alias('controller.strokeOpacity'),
  strokeWeight:  alias('controller.strokeWeight'),
  fillColor:     alias('controller.fillColor'),
  fillOpacity:   alias('controller.fillOpacity'),
  lat:           alias('controller.lat'),
  lng:           alias('controller.lng'),

  // bound to the google map object of the component
  map:           oneWay('parentView.map'),

  initGoogleCircle: on('didInsertElement', function () {
    // force the creation of the circle
    if (helpers.hasGoogleLib() && !this.get('googleObject')) {
      this.createGoogleObject();
    }
  }),

  destroyGoogleCircle: Ember.on('willDestroyElement', function () {
    var circle = this.get('googleObject');
    if (circle) {
      // detach from the map
      circle.setMap(null);
      this.set('googleObject', null);
    }
  }),

  actions: {
    handleCircleEvent: function () {
      var args = [].slice.call(arguments);
      var event = this.get('lastGoogleEventName');
      Ember.debug(fmt(
        '[google-map] unhandled %@ event %@ with arguments %@',
        this.get('googleName'), event, args.join(', ')
      ));
    }
  }
});
