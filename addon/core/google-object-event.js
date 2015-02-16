/* globals google */
import Ember from 'ember';

var slice = [].slice;
var fmt = Ember.String.fmt;

/**
 * @class GoogleObjectEvent
 * @param {String} name
 * @param {{target: Ember.Object, action: String, method: String|Function, [prepend]: boolean}} config
 * @constructor
 */
var GoogleObjectEvent = function (name, config) {
  this._cfg = {
    name:    name,
    method:  config.method || (config.action ? null : name),
    action:  config.action || null,
    target:  config.target || null,
    prepend: config.prepend === undefined ? !config.action : !!config.prepend
  };
};

/**
 * Event handler wrapper
 *
 * @method callHandler
 * @param {Ember.Object} emberObject
 * @returns {*}
 */
GoogleObjectEvent.prototype.callHandler = function (emberObject) {
  var method, target = this._cfg.target || emberObject, args;
  args = slice.call(arguments);
  if (this._cfg.prepend) {
    args.unshift(this._cfg.name);
  }
  if (this._cfg.action) {
    args.unshift(this._cfg.action);
    return target.send.apply(target, args);
  }
  method = this._cfg.method;
  if (typeof method === 'string') {
    method = target[method];
  }
  if (method) {
    return method.apply(target, args);
  }
  else {
    // silently warn that the method does not exists and return
    Ember.warn(fmt('[google-map] The method `%@` was not found on the target, no action taken.'));
  }
};

/**
 * Link the given ember object and google object, and start listening for the google event
 *
 * @method link
 * @param {Ember.Object} emberObject
 * @param {google.maps.MVCObject} googleObject
 */
GoogleObjectEvent.prototype.link = function (emberObject, googleObject) {
  var name, listener;
  Ember.warn('linking a google object event but it has not been unlinked first', !this._listener);
  if (emberObject && googleObject) {
    this._listener = listener = Ember.run.bind(this, 'callHandler', emberObject);
    name = this._cfg.name;
    listener._googleHandle = googleObject.addListener(name, listener);
    this._listener.unlink = function () {
      google.maps.event.removeListener(listener._googleHandle);
    };
  }
};

/**
 * Unlink the previously linked ember and google objects, and stop listening for the google event
 *
 * @method unlink
 */
GoogleObjectEvent.prototype.unlink = function () {
  if (this._listener) {
    this._listener.unlink();
    this._listener = null;
  }
};

export default GoogleObjectEvent;
