/* globals google */
import Ember from 'ember';

var EMPTY = [];

export default Ember.Mixin.create({

  googleArray: Ember.computed(function (key, value) {
    if (arguments.length > 1) {
      // set
      value = value ? value.getArray().slice() : [];
      this.set('observersEnabled', false);
      this.replace(0, this.get('length') || 0, this._google2ember(value, true));
      this.set('observersEnabled', true);
      return value;
    }
    else {
      return new google.maps.MVCArray(this._ember2google(this.toArray().slice()));
    }
  }),

  emberItemFactory:  null,
  googleItemFactory: null,

  _google2ember: function (item, isArray) {
    if (this.emberItemFactory) {
      if (isArray) {
        for (var i = 0; i < item.length; i++) {
          item[i] = this.emberItemFactory(item[i]);
        }
      }
      else {
        item = this.emberItemFactory(item);
      }
    }
    return item;
  },

  _ember2google: function (item, isArray) {
    if (this.googleItemFactory) {
      if (isArray) {
        for (var i = 0; i < item.length; i++) {
          item[i] = this.googleItemFactory(item[i]);
        }
      }
      else {
        item = this.googleItemFactory(item);
      }
    }
    return item;
  },

  googleListenersEnabled: null,

  observersEnabledLevel: 0,

  observersEnabled: Ember.computed(function (key, value) {
    if (arguments.length > 1) {
      // set
      this.incrementProperty('observersEnabledLevel', value ? 1 : -1);
    }
    return (this.get('observersEnabledLevel') === 0);
  }),

  setupGoogleArray: Ember.observer('googleArray', Ember.on('init', function () {
    var googleArray = this.get('googleArray');
    Ember.warn('setting up a google array but it has not been teardown first', !this._googleListeners);
    if (googleArray) {
      // setup observers/events
      this._googleListeners = {
        insertAt: googleArray.addListener('insert_at', Ember.run.bind(this, 'handleGoogleInsertAt')),
        removeAt: googleArray.addListener('remove_at', Ember.run.bind(this, 'handleGoogleRemoveAt')),
        setAt:    googleArray.addListener('set_at', Ember.run.bind(this, 'handleGoogleSetAt'))
      };
    }
  })),

  teardownGoogleArray: Ember.beforeObserver('googleArray', Ember.on('destroy', function () {
    if (this._googleListeners) {
      // teardown observers/events
      for (var k in this._googleListeners) {
        if (this._googleListeners.hasOwnProperty(k)) {
          google.maps.event.removeListener(this._googleListeners[k]);
        }
      }
      this._googleListeners = null;
    }
  })),

  handleGoogleInsertAt: function (index) {
    if (this.get('observersEnabled')) {
      this.set('observersEnabled', false);
      this.replace(index, 0, [this._google2ember(this.get('googleArray').getAt(index))]);
      this.set('observersEnabled', true);
    }
  },

  handleGoogleRemoveAt: function (index) {
    if (this.get('observersEnabled')) {
      this.set('observersEnabled', false);
      this.replace(index, 1, EMPTY);
      this.set('observersEnabled', true);
    }
  },

  handleGoogleSetAt: function (index) {
    if (this.get('observersEnabled')) {
      this.set('observersEnabled', false);
      this.replace(index, 1, [this._google2ember(this.get('googleArray').getAt(index))]);
      this.set('observersEnabled', true);
    }
  },

  arrayContentDidChange: function (start, removeCount, addCount) {
    var i, googleArray, slice;
    this._super.apply(this, arguments);
    if (this.get('observersEnabled')) {
      this.set('observersEnabled', false);
      googleArray = this.get('googleArray');
      for (i = 0; i < removeCount; i++) {
        googleArray.removeAt(start);
      }
      slice = this._ember2google(this.toArray().slice(start, start + addCount), true);
      while (slice.length) {
        googleArray.insertAt(start, slice.pop());
      }
      this.set('observersEnabled', true);
    }
  }
});
