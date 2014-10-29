module.exports = {
  name: 'google-map',
  contentFor: function(type, config) {
    var googleMapKey = config.googleMapKey;

    if (type === 'head' && googleMapKey) {
      return '<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key='+googleMapKey+'"></script>';
    }

    return '';
  }
};
