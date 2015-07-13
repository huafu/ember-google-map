import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';
import GoogleMapCoreView from './core';
import MarkerView from './marker';

var observer = Ember.observer;
var run = Ember.run;
var on = Ember.on;
var scheduleOnce = Ember.run.scheduleOnce;
var computed = Ember.computed;
var alias = computed.alias;
var oneWay = computed.oneWay;

/**
 * @class GoogleMapInfoWindowView
 * @extends GoogleMapCoreView
 */
export default GoogleMapCoreView.extend({
  classNames: ['google-info-window'],

  googleFQCN: 'google.maps.InfoWindow',

  // will be either the marker using us, or the component if this is a detached info-window
  templateName: computed.any('controller.templateName', 'parentView.infoWindowTemplateName'),

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

  isMarkerInfoWindow: computed('parentView', {
    get() {
      return (this.get('parentView') instanceof MarkerView);
    }
  }),

  _coreGoogleEvents: ['closeclick'],

  // aliased from controller so that if they are not defined they use the values from the controller
  zIndex: alias('controller.zIndex'),
  lat:    alias('controller.lat'),
  lng:    alias('controller.lng'),
  anchor: oneWay('parentView.infoWindowAnchor'),

  visible: computed('parentView.isInfoWindowVisible', 'controller.isVisible', {
    get() {
      var value, isMarkerIW = this.get('isMarkerInfoWindow');
      if (isMarkerIW) {
        value = this.get('parentView.isInfoWindowVisible');
      }
      else {
        value = this.getWithDefault('controller.isVisible', true);
        run(this, 'set', 'controller.isVisible', value);
      }
      return value;
    },
    set(key, value) {
      var isMarkerIW = this.get('isMarkerInfoWindow');
      value = Boolean(value);
      if (isMarkerIW) {
        this.set('parentView.isInfoWindowVisible', value);
      }
      else {
        this.set('controller.isVisible', value);
      }
      return value;
    }
  }),

  initGoogleObject: on('didInsertElement', function () {
    scheduleOnce('afterRender', this, '_initGoogleInfoWindow');
  }),

  handleInfoWindowVisibility: observer('visible', function () {
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
    // force the creation of the marker
    if (helpers.hasGoogleLib() && !this.get('googleObject')) {
      this.createGoogleObject({content: this._backupViewElement()});
      this.handleInfoWindowVisibility();
    }
  },

  destroyGoogleObject: on('willDestroyElement', function () {
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

  _handleCoreEvent: function (name) {
    if (name === 'closeclick') {
      this._changingVisible = true;
      this.set('visible', false);
      this._changingVisible = false;
    }
  }
});
