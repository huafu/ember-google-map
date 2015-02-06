module.exports = {
  name: 'ember-google-map',

  contentFor: function (type, config) {
    var src, content = '', google = config.googleMap || {}, params = [];
    if (type === 'head') {
      src = "//maps.googleapis.com/maps/api/js";
      // shouldn't need encoding, but who knows what version format it can handle
      params.push('v=' + encodeURIComponent(google.version || '3'));
      if (google.key) {
        params.push('key=' + encodeURIComponent(google.key));
      }
      if (typeof google.libraries !== 'undefined' && google.libraries.length > 0) {
        params.push('libraries=' + google.libraries.join());
      }
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
