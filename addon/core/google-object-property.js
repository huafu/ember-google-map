import Ember from 'ember';
import helpers from './helpers';

var GoogleObjectProperty = function (key, config) {
  var props = key.split(',');
  this._cfg = {
    key:        key,
    properties: props,
    name:       config.name || props.join('_').camelize(),
    toGoogle:   config.toGoogle || null,
    fromGoogle: config.fromGoogle || null,
    read:       config.read || null,
    write:      config.write || null,
    event:      config.event || null,
    cast:       config.cast || null
  };
};
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
GoogleObjectProperty.prototype.readGoogle = function (googleObject) {
  var val;
  if (this._cfg.read) {
    val = this._cfg.read.call(this, googleObject);
  }
  else {
    val = googleObject['get' + this._cfg.name.capitalize()]();
  }
  return this.fromGoogleValue(val);
};
GoogleObjectProperty.prototype.writeGoogle = function (googleObject, obj) {
  var val, p, diff = false,
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
    googleObject['set' + this._cfg.name.capitalize()](val);
  }
};

GoogleObjectProperty.prototype.link = function (emberObject, googleObject) {
  Ember.warn('linking a google object property but it has not been unlinked first', !this._listeners);
  if (emberObject && googleObject) {
    this._listeners = {
      ember:  function () {
        var obj = emberObject.getProperties(this._cfg.properties);
        //console.warn('setting GOOGLE', obj);
        this.writeGoogle(googleObject, obj);
      },
      google: Ember.run.bind(this, function () {
        var p, diff = true,
          obj = this.readGoogle(googleObject),
          actual = emberObject.getProperties(this._cfg.properties);
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
        //console.warn('setting EMBER', obj);
        emberObject.setProperties(obj);
      })
    };
    if (this._cfg.event) {
      googleObject.addListener(this._cfg.event, this._listeners.google);
    }
    this._cfg.properties.forEach(function (name) {
      emberObject.addObserver(name, this, this._listeners.ember);
    }, this);
  }
};
GoogleObjectProperty.prototype.unlink = function (emberObject, googleObject) {
  if (this._listeners) {

    if (this._cfg.event) {
      googleObject.removeListener(this._cfg.event, this._listeners.google);
    }
    this._cfg.properties.forEach(function (name) {
      emberObject.removeObserver(name, this, this._listeners.ember);
    }, this);
    this._listeners = null;
  }
};
GoogleObjectProperty.prototype.toOptions = function (source, options) {
  var val = this.toGoogleValue(source.getProperties(this._cfg.properties));
  if (val !== undefined) {
    options[this._cfg.name] = val;
  }
};

export default GoogleObjectProperty;
