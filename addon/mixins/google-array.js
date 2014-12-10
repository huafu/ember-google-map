/* globals google */
import Ember from 'ember';

var EMPTY = [];

export default Ember.Mixin.create({

  googleArray: Ember.computed(function (key, value) {
    if (arguments.length > 1) {
      // set
      value = value ? value.getArray().slice() : [];
      this.set('observersEnabled', false);
      this.replace(0, this.get('length') || 0, this._startObservingEmberProperties(
        this._google2ember(value, true), true
      ));
      this.set('observersEnabled', true);
      return value;
    }
    else {
      return new google.maps.MVCArray(
        this._ember2google(this._startObservingEmberProperties(this.toArray(), true).slice(), true)
      );
    }
  }),

  emberItemFactory:       null,
  googleItemFactory:      null,
  observeEmberProperties: null,

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

  _startObservingEmberProperties: function (object, isArray) {
    var props = this.get('observeEmberProperties'), emberArray = this;
    if (props && props.length) {
      var one = function (obj) {
        for (var i = 0; i < props.length; i++) {
          Ember.addObserver(obj, props[i], emberArray, '_handleObjectPropertyChange');
        }
      };
      if (isArray) {
        for (var i = 0; i < object.length; i++) {
          one(object[i]);
        }
      }
      else {
        one(object);
      }
    }
    return object;
  },

  _stopObservingEmberProperties: function (object, isArray) {
    var props = this.get('observeEmberProperties'), emberArray = this;
    if (props && props.length) {
      var one = function (obj) {
        for (var i = 0; i < props.length; i++) {
          Ember.removeObserver(obj, props[i], emberArray, '_handleObjectPropertyChange');
        }
      };
      if (isArray) {
        for (var i = 0; i < object.length; i++) {
          one(object[i]);
        }
      }
      else {
        one(object);
      }
    }
    return object;
  },

  _handleObjectPropertyChange: function (sender, key, value) {
    var index = -1, array, googleArray;
    if (this.get('observersEnabled')) {
      this.set('observersEnabled', false);
      array = this.toArray();
      googleArray = this.get('googleArray');
      while ((index = array.indexOf(sender, index + 1)) !== -1) {
        googleArray.setAt(index, this._ember2google(array[index]));
      }
      this.set('observersEnabled', true);
    }
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
    this._stopObservingEmberProperties(this.toArray(), true);
  })),

  handleGoogleInsertAt: function (index) {
    if (this.get('observersEnabled')) {
      this.set('observersEnabled', false);
      this.replace(index, 0, [
        this._startObservingEmberProperties(this._google2ember(this.get('googleArray').getAt(index)))
      ]);
      this.set('observersEnabled', true);
    }
  },

  handleGoogleRemoveAt: function (index) {
    if (this.get('observersEnabled')) {
      this.set('observersEnabled', false);
      this._stopObservingEmberProperties(this.objectAt(index));
      this.replace(index, 1, EMPTY);
      this.set('observersEnabled', true);
    }
  },

  handleGoogleSetAt: function (index) {
    if (this.get('observersEnabled')) {
      this.set('observersEnabled', false);
      this._stopObservingEmberProperties(this.objectAt(index));
      this.replace(index, 1, [
        this._startObservingEmberProperties(this._google2ember(this.get('googleArray').getAt(index)))
      ]);
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
        this._stopObservingEmberProperties(this.objectAt(start));
        googleArray.removeAt(start);
      }
      slice = this._ember2google(
        this._startObservingEmberProperties(this.toArray().slice(start, start + addCount), true), true
      );
      while (slice.length) {
        googleArray.insertAt(start, slice.pop());
      }
      this.set('observersEnabled', true);
    }
  }
});
