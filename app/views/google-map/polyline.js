/* global google */
import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleObjectMixin from 'ember-google-map/mixins/google-object';

var alias = Ember.computed.alias;
var oneWay = Ember.computed.oneWay;

var PolylineView = Ember.View.extend(GoogleObjectMixin, {
  templateName: 'google-map/polyline',

  googleProperties: {
    isClickable:   {name: 'clickable', optionOnly: true},
    isVisible:     {name: 'visible', event: 'visible_changed'},
    isDraggable:   {name: 'draggable', event: 'draggable_changed'},
    isEditable:    {name: 'editable', event: 'editable_changed'},
    isGeodesic:    {name: 'geodesic', optionOnly: true},
    icons:         {optionOnly: true},
    zIndex:        {optionOnly: true, cast: helpers.cast.integer},
    map:           {readOnly: true},
    strokeColor:   {optionOnly: true},
    strokeWeight:  {optionOnly: true},
    strokeOpacity: {optionOnly: true}
  },

  googleEvents:  Ember.computed('controller.googleEvents', function (key, value) {
    if (arguments.length < 2) {
      value = Ember.merge({
        click:      'handlePolylineEvent',
        dblclick:   'handlePolylineEvent',
        drag:       'handlePolylineEvent',
        dragend:    'handlePolylineEvent',
        dragstart:  'handlePolylineEvent',
        mousedown:  'handlePolylineEvent',
        //mousemove:  'handlePolylineEvent',
        mouseout:   'handlePolylineEvent',
        mouseover:  'handlePolylineEvent',
        mouseup:    'handlePolylineEvent',
        rightclick: 'handlePolylineEvent'
      }, this.get('controller.googleEvents') || {});
    }
    return value;
  }),

  // aliased from controller so that if they are not defined they use the values from the controller
  strokeColor:   alias('controller.strokeColor'),
  strokeWeight:  alias('controller.strokeWeight'),
  strokeOpacity: alias('controller.strokeOpacity'),
  zIndex:        alias('controller.zIndex'),
  isVisible:     alias('controller.isVisible'),
  isDraggable:   alias('controller.isDraggable'),
  isClickable:   alias('controller.isClickable'),
  isEditable:    alias('controller.isEditable'),
  icons:         alias('controller.icons'),

  // bound to the google map object of the component
  map:           oneWay('parentView.map'),

  initGooglePolyline: Ember.on('didInsertElement', function () {
    var opt;
    // force the creation of the polyline
    if (helpers.hasGoogleLib() && !this.get('googleObject')) {
      opt = this.serializeGoogleOptions();
      opt.path = this.get('controller._path.googleArray');
      Ember.debug('[google-maps] creating new polyline: %@'.fmt(opt));
      this.set('googleObject', new google.maps.Polyline(opt));
      this.synchronizeEmberObject();
    }
  }),

  destroyGooglePolyline: Ember.on('willDestroyElement', function () {
    var polyline = this.get('googleObject');
    if (polyline) {
      // detach from the map
      polyline.setMap(null);
      this.set('googleObject', null);
    }
  }),

  actions: {
    handlePolylineEvent: function () {
      var args = [].slice.call(arguments);
      var event = this.get('lastGoogleEventName');
      Ember.warn('[google-map] unhandled polyline event %@ with arguments %@'.fmt(event, args.join(', ')));
    }
  }
});

export default PolylineView;
