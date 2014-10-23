import Ember from 'ember';

var GoogleObjectEvent = function (name, config) {
  this._cfg = {
    name:   name,
    method: config.method || (config.action ? null : name),
    action: config.action || null,
    target: config.target || null
  };
};

GoogleObjectEvent.prototype.callHandler = function (emberObject) {
  var method, target = this._cfg.target || emberObject;
  if (this._cfg.action) {
    return target.send.apply(target, [this._cfg.action].concat([].slice.call(arguments, 1)));
  }
  method = this._cfg.method;
  if (typeof method === 'string') {
    method = target[method];
  }
  if (method) {
    return method.apply(target, [].slice.call(arguments));
  }
  else {
    // silently warn that the method does not exists and return
    Ember.warn('the method `%@` was not found on the target, no action taken'.fmt(this._cfg.method));
  }
};

GoogleObjectEvent.prototype.link = function (emberObject, googleObject) {
  Ember.warn('linking a google object event but it has not been unlinked first', !this._listener);
  if (emberObject && googleObject) {
    this._listener = Ember.run.bind(this, 'callHandler', emberObject);
    googleObject.addListener(this._cfg.name, this._listener);
    //console.log('linked an event', this._cfg);
  }
};
GoogleObjectEvent.prototype.unlink = function (emberObject, googleObject) {
  if (this._listener) {
    googleObject.removeListener(this._cfg.name, this._listener);
  }
};

export default GoogleObjectEvent;
