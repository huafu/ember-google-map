/* global google */
import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleObjectMixin from 'ember-google-map/mixins/google-object';
import MarkerView from './marker';

var computed = Ember.computed;
var alias = computed.alias;
var oneWay = computed.oneWay;

var InfoWindowView = Ember.View.extend(GoogleObjectMixin, {
  classNames:   ['google-info-window'],
  // will be either the marker using us, or the component if this is a detached info-window
  templateName: computed('parentView.infoWindowTemplateName', 'controller.templateName', function () {
    return this.get('controller.templateName') || this.get('parentView.infoWindowTemplateName');
  }).readOnly(),

  googleProperties: {
    zIndex:    {event: 'zindex_changed', cast: helpers.cast.integer},
    map:       {readOnly: true},
    'lat,lng': {
      name:       'position',
      event:      'position_changed',
      toGoogle:   helpers._latLngToGoogle,
      fromGoogle: helpers._latLngFromGoogle
    }
  },

  // merge from whatever defined from the controller so we can handle events locally if needed
  googleEvents:     computed('controller.googleEvents', function (key, value) {
    if (arguments.length < 2) {
      value = Ember.merge({
        closeclick: 'handleInfoWindowEvent',
        domready:   'handleInfoWindowEvent'
      }, this.get('controller.googleEvents') || {});
    }
    return value;
  }),

  // aliased from controller so that if they are not defined they use the values from the controller
  zIndex:           alias('controller.zIndex'),
  lat:              alias('controller.lat'),
  lng:              alias('controller.lng'),
  anchor:           oneWay('parentView.infoWindowAnchor'),

  visible: computed('parentView.isInfoWindowVisible', 'controller.isVisible', function (key, value) {
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
  map:     oneWay('parentView.map'),

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
      opt.content = this._backupViewElement();
      Ember.debug('[google-maps] creating new info-window: %@, anchor: %@'.fmt(opt, anchor));
      this.set('googleObject', new google.maps.InfoWindow(opt));
      this.synchronizeEmberObject();
      this.handleInfoWindowVisibility();
    }
  },

  destroyGoogleInfoWindow: Ember.on('willDestroyElement', function () {
    var infoWindow = this.get('googleObject');
    if (infoWindow) {
      this._changingVisible = true;
      infoWindow.close();
      // detach from the map
      infoWindow.setMap(null);
      // free the content node
      this._restoreViewElement();
      this.set('googleObject', null);
      this._changingVisible = false;
    }
  }),

  _backupViewElement: function () {
    var element = this.get('element');
    if (!this._placeholderElement) {
      this._placeholderElement = document.createElement(element.nodeName);
      element.parentNode.replaceChild(this._placeholderElement, element);
    }
    return element;
  },

  _restoreViewElement: function () {
    var element = this.get('element');
    if (this._placeholderElement) {
      this._placeholderElement.parentNode.replaceChild(element, this._placeholderElement);
      this._placeholderElement = null;
    }
    return element;
  },

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
