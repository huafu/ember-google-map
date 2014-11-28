/* global google */
import Ember from 'ember';
import helpers from '../core/helpers';
import GoogleObjectMixin from '../mixins/google-object';
import MarkerView from '../views/marker';

var InfoWindowView = Ember.View.extend(GoogleObjectMixin, {
  // will be either the marker using us, or the component if this is a detached info-window
  templateName: Ember.computed('parentView.infoWindowTemplateName', 'controller.templateName', function () {
    return this.get('controller.templateName') || this.get('parentView.infoWindowTemplateName');
  }).readOnly(),

  googleProperties: {
    zIndex:              {event: 'zindex_changed', cast: helpers.cast.integer},
    map:                 {readOnly: true},
    'element.outerHTML': {name: 'content', readOnly: true},
    'lat,lng':           {
      name:       'position',
      event:      'position_changed',
      toGoogle:   helpers._latLngToGoogle,
      fromGoogle: helpers._latLngFromGoogle
    }
  },

  // merge from whatever defined from the controller so we can handle events locally if needed
  googleEvents:     Ember.computed('controller.googleEvents', function (key, value) {
    if (arguments.length < 2) {
      value = Ember.merge({
        closeclick: 'handleInfoWindowEvent',
        domready:   'handleInfoWindowEvent'
      }, this.get('controller.googleEvents') || {});
    }
    return value;
  }),

  // aliased from controller so that if they are not defined they use the values from the controller
  zIndex:           Ember.computed.alias('controller.zIndex'),
  lat:              Ember.computed.alias('controller.lat'),
  lng:              Ember.computed.alias('controller.lng'),
  anchor:           Ember.computed.oneWay('parentView.infoWindowAnchor'),

  visible: Ember.computed('parentView.isInfoWindowVisible', 'controller.isVisible', function (key, value) {
    if (arguments.length < 2) {
      if (this.get('parentView') instanceof MarkerView) {
        value = this.get('parentView.isInfoWindowVisible');
      }
      else {
        value = this.getWithDefault('controller.isVisible', true);
        this.set('controller.isVisible', value);
      }
    }
    else {
      if (this.get('parentView') instanceof MarkerView) {
        this.set('parentView.isInfoWindowVisible', value);
      }
      else {
        this.set('controller.isVisible', value);
      }
    }
    return value;
  }),

  // bound to the google map object of the component
  map:     Ember.computed.oneWay('parentView.map'),

  initGoogleInfoWindow: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, '_initGoogleInfoWindow');
  }),

  handleInfoWindowVisibility: Ember.observer('visible', function () {
    if (this._changingVisible) {
      return;
    }
    var iw = this.get('googleObject');
    if (iw) {
      if (this.get('visible')) {
        iw.open(this.get('map'), this.get('anchor') || undefined);
        this.notifyPropertyChange('element.outerHTML');
      }
      else {
        iw.close();
      }
    }
  }),

  _initGoogleInfoWindow: function () {
    var opt, anchor;
    // force the creation of the marker
    if (helpers.hasGoogleLib() && !this.get('googleObject')) {
      opt = this.serializeGoogleOptions();
      Ember.debug('[google-maps] creating new info-window: %@, anchor: %@'.fmt(opt, anchor));
      this.set('googleObject', new google.maps.InfoWindow(opt));
      this.synchronizeEmberObject();
      this.handleInfoWindowVisibility();
    }
  },

  refreshInfoWindow: Ember.on('willClearRender', function () {
    Ember.run.scheduleOnce('afterRender', this, 'notifyPropertyChange', 'element.outerHTML');
  }),

  destroyGoogleInfoWindow: Ember.on('willDestroyElement', function () {
    var infoWindow = this.get('googleObject');
    if (infoWindow) {
      this._changingVisible = true;
      infoWindow.close();
      // detach from the map
      infoWindow.setMap(null);
      this.set('googleObject', null);
      this._changingVisible = false;
    }
  }),

  actions: {
    handleInfoWindowEvent: function () {
      var args = [].slice.call(arguments);
      var event = this.get('lastGoogleEventName');
      if (event === 'closeclick') {
        this._changingVisible = true;
        this.set('visible', false);
        this._changingVisible = false;
      }
      else {
        Ember.warn('[google-map] unhandled info-window event %@ with arguments %@'.fmt(event, args.join(', ')));
      }
    }
  }
});

export default InfoWindowView;
