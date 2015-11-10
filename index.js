/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-google-map',

  contentFor: function (type, config) {
    var src, content = '', google = config.googleMap || {}, params = [], apiKey;
    if (type === 'head') {
      src = '//maps.googleapis.com/maps/api/js';
      // shouldn't need encoding, but who knows what version format it can handle
      params.push('v=' + encodeURIComponent(google.version || '3'));
      // grab either API key or client ID
      apiKey = google.key || google.apiKey;
      if (apiKey) {
        if (google.key) {
          console.warn('[google-map][DEPRECATED] Prefer using `apiKey` instead of `key` for the Google Map API key.');
        }
        if (google.clientId) {
          console.warn('[google-map] You set the API key and a client ID, only the API key will be used, if you set client ID you then not need any API key.');
        }
        params.push('key=' + encodeURIComponent(apiKey));
      }
      else if (google.clientId) {
        // add the client ID
        params.push('client=' + encodeURIComponent(google.clientId));
      }
      // add libraries if specified
      if (google.libraries && google.libraries.length) {
        params.push('libraries=' + encodeURIComponent(google.libraries.join(',')));
      }
      // add channel param if specified
      if (google.channel) {
        params.push('channel=' + encodeURIComponent(google.channel));
      }
      // force the protocol if specified
      if (google.protocol) {
        src = google.protocol + ':' + src;
      }
      // build our URL
      src += '?' + params.join('&');
      if (google.lazyLoad) {
        content = '<meta name="ember-google-map-sdk-url" content="' + src + '">';
      }
      else {
        content = '<script type="text/javascript" src="' + src + '"></script>';
      }
    }

    return content;
  }
};
