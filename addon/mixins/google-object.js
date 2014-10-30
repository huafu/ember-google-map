import Ember from 'ember';
import GoogleObjectProperty from '../core/google-object-property';
import GoogleObjectEvent from '../core/google-object-event';

var GoogleObjectMixin = Ember.Mixin.create(Ember.Evented, {
  _listeningForGoogleOptions: null,

  googleProperties:    Ember.required(),
  googleEvents:        Ember.required(),
  googleObject:        null,

  /**
   * @property _compiledProperties
   * @type Array<Object>
   */
  _compiledProperties: function () {
    var def = this.get('googleProperties') || {},
      res = [], d;
    for (var k in def) {
      if (def.hasOwnProperty(k)) {
        d = def[k];
        if (typeof d === 'string') {
          d = {name: d};
        }
        else if (d === true) {
          d = {};
        }
        res.push(new GoogleObjectProperty(k, d));
        d = null;
      }
    }
    return res;
  }.property().readOnly(),
  /**
   * @property _compiledEvents
   * @type Array<Object>
   */
  _compiledEvents:     function () {
    var def = this.get('googleEvents') || {},
      res = [], d;
    for (var k in def) {
      if (def.hasOwnProperty(k)) {
        d = def[k];
        if (typeof d === 'string') {
          d = {action: d};
        }
        else if (d === true) {
          d = {};
        }
        res.push(new GoogleObjectEvent(k, d));
        d = null;
      }
    }
    return res;
  }.property().readOnly(),

  serializeGoogleOptions: function () {
    var res = {}, def = this.get('_compiledProperties');
    for (var i = 0; i < def.length; i++) {
      def[i].toOptions(this, res);
    }
    return res;
  },

  synchronizeEmberObject: function () {
    var def = this.get('_compiledProperties'),
      go = this.get('googleObject');
    if (!go) {
      return;
    }
    this.beginPropertyChanges();
    for (var i = 0; i < def.length; i++) {
      if (!def[i]._cfg.readOnly) {
        this.setProperties(def[i].readGoogle(go));
      }
    }
    this.endPropertyChanges();
  },

  unlinkGoogleObject: function () {
    var old = this.get('googleObject');
    if (old) {
      this.get('_compiledEvents').invoke('unlink', this, old);
      this.get('_compiledProperties').invoke('unlink', this, old);
    }
  }.observesBefore('googleObject'),

  linkGoogleObject: function () {
    var obj = this.get('googleObject');
    if (obj) {
      this.get('_compiledProperties').invoke('link', this, obj);
      this.get('_compiledEvents').invoke('link', this, obj);
    }
  }.observes('googleObject'),

  destroyGoogleObject: function () {
    this.set('googleObject', null);
    this.get('_compiledEvents').clear();
    this.get('_compiledProperties').clear();
  }.on('destroy'),

  setupGoogleOptionsDidChange: function (){
    if(!this._listeningForGoogleOptions){
      this._listeningForGoogleOptions = true;
    }
  }
});

export default GoogleObjectMixin;
