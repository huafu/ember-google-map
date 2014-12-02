# ember-google-map

An Ember addon to include a google-map Ember friendly component in your apps. See a bare simple demo [there](http://huafu.github.io/ember-google-map/).

**This is a work in progress, plan is to other tools provided by google-map API.**

[![NPM](https://nodei.co/npm/ember-google-map.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ember-google-map/)


## What is implemented for now:

Here is what is working for now:

```handlebars
{{google-map
    lat=centerLat lng=centerLng
    zoom=zoom
    type=type
    markers=markersArray
    markerInfoWindowTemplateName='some/custom/template'
    infoWindows=infoWindowsArray
    infoWindowTemplateName='another/custom/template'
}}
```

* `lat` and `lng`: bindings or static coordinates of the center **(required)**
* `zoom`: binding to the current zoom
* `type`: binding to the type of map (can be found with `import {MAP_TYPES} from 'google-map/components/google-map';`)
* `markerController`: the `ObjectController` to use as a marker controller, must extend from `google-map/controllers/marker`
* `markerInfoWindowTemplateName`: default template for a marker info-window
* `markerHasInfoWindow`: whether to disable all markers info window or not
* `markers`: binding to an array of markers (all properties are bound back an forth)
    * `lat` and `lng`: coordinates of the marker position **(required)**
    * `isClickable`: if the marker is clickable
    * `isVisible`:  marker visibility
    * `isDraggable`: marker draggability
    * `title`: marker's title
    * `opacity`: marker's opacity
    * `icon`: marker's icon
    * `zIndex`: marker's z-index
    * `googleEvents`: an object with a mapping from google event to an Ember action name (string) or a function to be run
    * `hasInfoWindow`: whether it has an info window or not
    * `description`: What to how in the info window if no template specified
    * `isInfoWindowVisible`: whether the info window is visible initially or not
    * `infoWindowTemplateName`: the template name for the info window
* `infoWindowTemplateName`: default template to use for all info-windows
* `infoWindows`: bindings to an array of info-windows (not attached to any marker)
    * `isVisible`: whether the info-window is visible or not (default to true)
    * `lat` and `lng`: coordinates of the info-window position **(required)**
    * `zIndex`: info-window's z-index
    * `title`: if using the default template
    * `description`: if using the default template
    * `templateName`: the name of the template to use with this info-window

* Any component or Ember object corresponding to a Google object can have additional Google options (the hash given to the Google object constructor) defined: they have to be properties on the Ember object, prefixed with `gopt_`. For example to disable the controls of the map (which is `disableDefaultUI` Google option):
```handlebars
{{google-map ... gopt_disableDefaultUI=true}}
```


## TODO:

* Implement an auto-complete input for an address:

    ```handlebars
    {{google-address
        value=theText
        resolvedGoogleData=thePropertyToStoreGoogleData
        resolvedLat=thePropertyWhereToStoreAddressLatitude
        resolvedLng=thePropertyWhereToStoreAddressLongitude
        boundNorthWestLat=optionalBoundNorthWestLatitude
        boundNorthWestLng=optionalBoundNorthWestLongitude
        boundSouthEastLat=optionalBoundSouthEastLatitude
        boundSouthEastLng=optionalBoundSouthEastLongitude
        map=theOptionalMapToBeLinked
    }}
    ```

* Write unit tests!!!


## Installation

* `npm install --save-dev ember-google-map`

## Updating

* From `0.0.8`, the component has been renamed to `ember-google-map`, so when importing in your js files, change `google-map/...` to `ember-google-map/...`:
```javascript
import {MAP_TYPES} from 'ember-google-map/components/google-map';
```


## Usage & configuration

### Google Api key configuration

The google map script tag will be inserted in the head section of your index.html.
Also, if you define a `ENV.googleMap.key` variable in your Ember CLI project's configuration file (`config/environment.js`), it will be used as an API Key within this script tag.

Here is an example :

```js
ENV.googleMap = {
  key: 'AbCDeFgHiJkLmNoPqRsTuVwXyZ'
};
```

### Here is a very basic example:

```js
// app/controllers/application.js

import Ember from 'ember';
import {MAP_TYPES} from 'google-map/components/google-map';

export default Ember.Controller.extend({
  lat:         0,
  lng:         0,
  zoom:        5,
  type:        'road',
  mapTypes:    MAP_TYPES,
});
```

```handlebars
{{! app/templates/application.hbs }}

{{google-map lat=lat lng=lng type=type zoom=zoom}}

<h3>Map settings</h3>
<div>
  <label>Lat: {{input value=lat}}</label>
  <label>Lng: {{input value=lng}}</label>
  <label>Zoom: {{input value=zoom}}</label>
  <label>Type: {{view Ember.Select content=mapTypes
    optionLabelPath='content.label' optionValuePath='content.id' value=type}}
  </label>
</div>

```

### For a more complex example, visit the [GitHub page](http://huafu.github.io/ember-google-map/) of this repository.


## Authors

* ![Huafu Gandon](https://s.gravatar.com/avatar/950590a0d4bc96f4a239cac955112eeb?s=24) [Huafu Gandon](https://github.com/huafu)


## Contributors

* [List of all contributors](https://github.com/huafu/ember-google-map/graphs/contributors)
