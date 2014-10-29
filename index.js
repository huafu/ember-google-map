module.exports = {
  name: 'google-map',
  contentFor: function(type, config) {
    var content='';
    if (type === 'head') {
        var googleMapKey = config.googleMapKey;
        var scriptSrc = "http://maps.googleapis.com/maps/api/js?v=3";
        if (googleMapKey) {
          scriptSrc = scriptSrc + '&key='+googleMapKey;
        }
        content = '<script type="text/javascript" src="'+scriptSrc+'"></script>';
    }

    return content;
  }
};
