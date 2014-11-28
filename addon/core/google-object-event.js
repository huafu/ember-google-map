import Ember from 'ember';

/**
 * @class GoogleObjectEvent
 * @param {String} name
 * @param {{target: Ember.Object, action: String, method: String|Function}} config
 * @constructor
 */
var GoogleObjectEvent = function (name, config) {
  this._cfg = {
    name:   name,
    method: config.method || (config.action ? null : name),
    action: config.action || null,
    target: config.target || null
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
  var method, target = this._cfg.target || emberObject;
  if (this._cfg.action) {
    target.set('lastGoogleEventName', this._cfg.name);
    return target.send.apply(target, [this._cfg.action].concat([].slice.call(arguments, 1)));
  }
  method = this._cfg.method;
  if (typeof method === 'string') {
    method = target[method];
  }
  if (method) {
    return method.apply(target, [].slice.call(arguments).concat([this._cfg.name]));
  }
  else {
    // silently warn that the method does not exists and return
    Ember.warn('the method `%@` was not found on the target, no action taken'.fmt(this._cfg.method));
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
