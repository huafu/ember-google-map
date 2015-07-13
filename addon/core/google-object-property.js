/* globals google */
import Ember from 'ember';
import helpers from './helpers';

var camelize = Ember.String.camelize;
var capitalize = Ember.String.capitalize;

/**
 * Handle the linking between a google and an ember object's properties
 *
 * @class GoogleObjectProperty
 * @param {String} key
 * @param {{name: String, toGoogle: Function, fromGoogle: Function, read: Function, write: Function, event: String, cast: Function, readOnly: Boolean, optionOnly: Boolean}} config
 * @constructor
 */
var GoogleObjectProperty = function (key, config) {
  var props = key.split(',');
  this._cfg = {
    key:        key,
    properties: props,
    name:       config.name || camelize(props.join('_')),
    toGoogle:   config.toGoogle || null,
    fromGoogle: config.fromGoogle || null,
    read:       config.read || null,
    write:      config.write || null,
    event:      config.event || null,
    cast:       config.cast || null,
    readOnly:   config.readOnly || false,
    optionOnly: config.optionOnly || false
  };
};

/**
 * Gets the name of the google property
 *
 * @returns {String}
 */
GoogleObjectProperty.prototype.getName = function () {
  return this._cfg.name;
};

/**
 * Convert the value from google to Ember
 *
 * @method fromGoogleValue
 * @param {*} value
 * @returns {Object}
 */
GoogleObjectProperty.prototype.fromGoogleValue = function (value) {
  var val;
  if (this._cfg.fromGoogle) {
    val = this._cfg.fromGoogle.call(this, value);
  }
  else {
    val = helpers.makeObj(this._cfg.key, value);
  }
  return val;
};

/**
 * Convert the value from Ember to google
 *
 * @method toGoogleValue
 * @param {Object} obj
 * @returns {*}
 */
GoogleObjectProperty.prototype.toGoogleValue = function (obj) {
  var val;
  if (this._cfg.toGoogle) {
    val = this._cfg.toGoogle.call(this, obj);
  }
  else {
    val = this._cfg.properties.length > 1 ? obj : obj[this._cfg.key];
    if (this._cfg.cast) {
      val = this._cfg.cast(val);
    }
  }
  return val;
};

/**
 * Reads the value from the given google object
 *
 * @method readGoogle
 * @param {google.maps.MVCObject} googleObject
 * @returns {Object}
 */
GoogleObjectProperty.prototype.readGoogle = function (googleObject) {
  var val;
  if (this._cfg.read) {
    val = this._cfg.read.call(this, googleObject);
  }
  else if (this._cfg.optionOnly) {
    return Object.create(null);
  }
  else {
    val = googleObject['get' + capitalize(this._cfg.name)]();
  }
  return this.fromGoogleValue(val);
};

/**
 * Writes the given value to the given google object
 *
 * @method writeGoogle
 * @param {google.maps.MVCObject} googleObject
 * @param {Object} obj
 */
GoogleObjectProperty.prototype.writeGoogle = function (googleObject, obj) {
  var val, p, diff = false, actual;
  if (this._cfg.optionOnly) {
    return;
  }
  actual = this.readGoogle(googleObject);
  for (var i = 0; i < this._cfg.properties.length; i++) {
    p = this._cfg.properties[i];
    if ('' + obj[p] !== '' + actual[p]) {
      diff = true;
      break;
    }
  }
  if (!diff) {
    return;
  }
  val = this.toGoogleValue(obj);
  if (this._cfg.write) {
    this._cfg.write.call(this, googleObject, val);
  }
  else {
    googleObject['set' + capitalize(this._cfg.name)](val);
  }
};

/**
 * Links the given google and ember objects together
 *
 * @method link
 * @param {Ember.Object} emberObject
 * @param {google.maps.MVCObject} googleObject
 */
GoogleObjectProperty.prototype.link = function (emberObject, googleObject) {
  var _this = this, event, props, listeners;
  Ember.warn('linking a google object property but it has not been unlinked first', !this._listeners);
  if (emberObject && googleObject && !this._cfg.optionOnly) {
    props = this._cfg.properties;
    event = this._cfg.event;
    // define our listeners
    this._listeners = listeners = {
      ember:  function () {
        var obj = emberObject.getProperties(props);
        this.writeGoogle(googleObject, obj);
      },
      google: Ember.run.bind(this, function () {
        var p, diff = true,
          obj = this.readGoogle(googleObject),
          actual = emberObject.getProperties(props);
        for (var i = 0; i < props.length; i++) {
          p = props[i];
          if ('' + obj[p] !== '' + actual[p]) {
            diff = true;
            break;
          }
        }
        if (!diff) {
          return;
        }
        emberObject.setProperties(obj);
      })
    };
    // listen google event
    if (event) {
      listeners._googleHandle = googleObject.addListener(event, listeners.google);
    }
    // listen change on Ember properties
    props.forEach(function (name) {
      emberObject.addObserver(name, this, listeners.ember);
    }, this);

    // setup the un-linkers
    listeners.unlink = function () {
      props.forEach(function (name) {
        emberObject.removeObserver(name, this, listeners.ember);
      }, _this);
      listeners.ember = null;
      if (event) {
        google.maps.event.removeListener(listeners._googleHandle);
      }
      listeners.google = null;
    };
  }
};

/**
 * Unlink the previously linked ember and google objects, and stop listening for events
 */
GoogleObjectProperty.prototype.unlink = function () {
  if (this._listeners) {
    this._listeners.unlink();
    this._listeners = null;
  }
};

/**
 * Fill a google options object reading the options from the given Ember Object
 *
 * @method toOptions
 * @param {Ember.Object} source
 * @param {Object} options
 */
GoogleObjectProperty.prototype.toOptions = function (source, options) {
  var val = this.toGoogleValue(source.getProperties(this._cfg.properties));
  if (val !== undefined) {
    options[this._cfg.name] = val;
  }
};

export default GoogleObjectProperty;
