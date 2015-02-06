# ember-google-map

An Ember addon to include a google-map Ember friendly component in your apps. See a bare simple demo [there](http://huafu.github.io/ember-google-map/).

[![NPM](https://nodei.co/npm/ember-google-map.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ember-google-map/)

**Be sure to read [this](https://github.com/huafu/ember-google-map#updating) and the last paragraph or [this](https://github.com/huafu/ember-google-map#here-is-a-very-basic-example) before reporting an issue**

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
    polylines=polylinesArray
    circles=circlesArray
    autoFitBounds='markers,circles'
    fitBoundsArray=arrayOfLatLng
}}
```

* `lat` and `lng`: bindings or static coordinates of the center **(required)**
* `zoom`: binding to the current zoom
* `type`: binding to the type of map (can be found with `import {MAP_TYPES} from 'google-map/components/google-map';`)
* `autoFitBounds`: defines here if you want the map to auto fit bounds on first render so that the map will automatically recenter and change zoom depending on what you set here (default: `false`) - possible values are:
    * ``true`: fit so that anything on the map will be visible
    * `false`: do not auto-fit bounds
    * `string,string,...` (list of string separated by `,`): will make the map fit everything you defined in corresponding arrays 
* `fitBoundsArray`: an array of `{lat: number, lng: number}` coordinates used so that the map will recenter on first render to fit them all in map (if set, `autoFitBounds` will be ignored)
(possible values are `markers`, `infoWindows`, `polylines`, `polygons` or `circles`) - example: `markers,circles`
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
* `polylines`: bindings to an array of polylines
    * `isVisible`: whether the polyline is visible
    * `isEditable`: whether the polyline is editable
    * `isDraggable`: whether the polyline is draggable
    * `strokeColor`: the color of the line
    * `strokeWeight`: the weight of the line
    * `strokeOpacity`: the opacity of the line
    * `zIndex`: polyline's z-index
    * `path`: binding to an array of lat/lng array **(required)**
* `polygons`: bindings to an array of polygons
    * `isVisible`: whether the polygon is visible
    * `isEditable`: whether the polygon is editable
    * `isDraggable`: whether the polygon is draggable
    * `strokeColor`: the color of the line
    * `strokeWeight`: the weight of the line
    * `strokeOpacity`: the opacity of the line
    * `fillColor`: the color of inside the polygon
    * `fillOpacity`: the opacity of inside the polygon
    * `zIndex`: polygon's z-index
    * `path`: binding to an array of lat/lng array **(required)**
* `circles`: bindings to an array of circles
    * `lat` and `lng`: coordinates of the circle's center **(required)**
    * `radius`: radius of the circle **(required)**
    * `isVisible`: whether the circle is visible
    * `isEditable`: whether the circle is editable
    * `isDraggable`: whether the circle is draggable
    * `strokeColor`: the color of the circle border
    * `strokeOpacity`: the opacity of the circle border
    * `strokeWeight`: the weight of the circle border
    * `fillColor`: the fill color of the circle
    * `fillOpacity`: the fill opacity of the circle
    * `zIndex`: circle's z-index

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

* From `0.0.8`, the component has been renamed to `ember-google-map` and merged into your application, so when importing in your js files, change `google-map/...` to `../...`. For example from `app/controllers/application.js`:
```javascript
import {MAP_TYPES} from '../components/google-map';
```
* Until version `0.0.13` it has been tested and working with Ember < `1.9`. From version `0.0.14` it has been updated to work with Ember `1.9.1` and Handlebars `2.0.0`, so be sure to [upgrade your version of Ember](http://emberjs.com/blog/2014/12/08/ember-1-9-0-released.html#toc_handlebars-2-0) to >= `1.9` prior to using this component.


## Usage & configuration

### Google API key configuration

The google map script tag will be inserted in the head section of your index.html.
Also, if you define a `ENV.googleMap.key` variable in your Ember CLI project's configuration file (`config/environment.js`), it will be used as an API Key within this script tag.

Here is an example :

```js
ENV.googleMap = {
  apiKey: 'AbCDeFgHiJkLmNoPqRsTuVwXyZ'
};
```

### Using client ID instead of an API key

Work customer only (see [there](https://developers.google.com/maps/documentation/business/clientside/#client_id)), 
specify your client ID in the `clientId` key of the configuration:

```js
ENV.googleMap = {
  clientId: 'AbCDeFgHiJkLmNoPqRsTuVwXyZ'
};
```

### Lazy-loading of the SDK

If you want to have the SDK loaded only when the user would visit the route(s) where the google map component is used, you can set `ENV.googleMap.lazyLoad` to `true`. Then in each route where you use the component, add this in one of the `beforeModel`, `model` or `afterModel` hooks:

```js
export default Ember.Route.extend({
  model: function (params) {
    return this.loadGoogleMap();
  }
});
```

It'll return a promise which will resolve to whatever you give as parameter, so if you need to still have your model loaded for example:

```js
export default Ember.Route.extend({
  model: function (params) {
    return this._super.apply(this, arguments).then(this.loadGoogleMap);
    // or without using the default ember-data but your own:
    return this.loadGoogleMap(theModelToResolveTo);
  }
});
```

### Including additional Google Map libraries when loading the SDK
 
 If you need to load some Google Map libraries such as `places` when the SDk will be loaded, specify them
 as an array in the `libraries` key of your configuration:
 
```js
ENV.googleMap = {
  libraries: ['places']
};
```


### Here is a very basic example:

```js
// app/controllers/application.js

import Ember from 'ember';
import {MAP_TYPES} from '../components/google-map';

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
{{!--
 DON'T FORGET TO DEFINE `lat`, `lng` AND `zoom` in your controller or to remove them
 from the given parameters here!
 --}}

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

**DO NOT BIND `lat` AND `lng` OF THE MAP TO THE SAME OBJECT AS ANOTHER COMPONENT OF THE MAP**
```handlebars
{{google-map lat=markersArray.firstObject.lat lng=markersArray.firstObject.lng markers=markersArray}}
```
**THIS IS WRONG AND WILL NOT WORK**

Remember that any property is bound, as it is for the map center, so moving the map will change the
first marker's lat and lng, and do some infinite loop between observers and bound properties.


### For a more complex example, visit the [GitHub page](http://huafu.github.io/ember-google-map/) of this repository.


## Authors

![Huafu Gandon](https://s.gravatar.com/avatar/950590a0d4bc96f4a239cac955112eeb?s=24)
Huafu Gandon - Follow me on twitter: [huafu_g](https://twitter.com/huafu_g)


## Contributors

* [List of all contributors](https://github.com/huafu/ember-google-map/graphs/contributors)
