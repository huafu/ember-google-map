/* globals google */
import Ember from 'ember';
import helpers from 'ember-google-map/core/helpers';

var computed = Ember.computed;

var EMPTY = [];

/**
 * @extension GoogleArrayMixin
 * @mixin GoogleArrayMixin
 */
export default Ember.Mixin.create({

  googleArray: computed({
    get() {
      var value;
      if (!helpers.hasGoogleLib()) {
        return;
      }
      value = new google.maps.MVCArray(
        this._ember2google(this._startObservingEmberProperties(this.toArray().slice(), true), true)
      );
      this.setupGoogleArray(value);
      return value;
    },
    set(key, value) {
      var array;
      this.teardownGoogleArray();
      array = value ? value.getArray().slice() : [];
      this.set('observersEnabled', false);
      this.replace(0, this.get('length') || 0, this._startObservingEmberProperties(
        this._google2ember(array, true), true
      ));
      this.set('observersEnabled', true);
      this.setupGoogleArray(value);
      return value;
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

  _handleObjectPropertyChange: function (sender/*, key, value*/) {
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

  observersEnabled: computed({
    get() {
      return this.get('observersEnabledLevel') === 0;
    },
    set(key, value) {
      return this.incrementProperty('observersEnabledLevel', value ? 1 : -1) === 0;
    }
  }),

  setupGoogleArray(googleArray) {
    if (googleArray) {
      // setup observers/events
      this._googleListeners = {
        insertAt: googleArray.addListener('insert_at', this.handleGoogleInsertAt.bind(this)),
        removeAt: googleArray.addListener('remove_at', this.handleGoogleRemoveAt.bind(this)),
        setAt:    googleArray.addListener('set_at', this.handleGoogleSetAt.bind(this))
      };
    }
  },

  teardownGoogleArray: Ember.on('destroy', function () {
    if (this._googleListeners) {
      if (helpers.hasGoogleLib()) {
        // teardown observers/events
        for (var k in this._googleListeners) {
          if (this._googleListeners.hasOwnProperty(k)) {
            google.maps.event.removeListener(this._googleListeners[k]);
          }
        }
      }
      this._googleListeners = null;
    }
    this._stopObservingEmberProperties(this.toArray(), true);
  }),

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
