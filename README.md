# ember-google-map

An Ember addon to include a google-map Ember friendly component in your apps.

**This is a work in progress, plan is to other tools provided by google-map API.**

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

## Google Api key configuration

The google map script tag will be inserted in the head section of your index.html.
Also, if you define a `ENV.googleMap.key` variable in your Ember CLI project's configuration file (`config/environment.js`), it will be used as an API Key within this script tag.

Here is an example :

```js
ENV.googleMap = {
  key: 'AbCDeFgHiJkLmNoPqRsTuVwXyZ'
};
```

## Using

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


---

### Here is another example, corresponding to what is on the [GitHub pages](http://huafu.github.io/ember-google-map/) of this repository:

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
  markers:     [
    {title: 'one', lat: 5, lng: 5, description: 'hello 1', isDraggable: true},
    {title: 'two', lat: 5, lng: 0, hasInfoWindow: false},
    {title: 'three', lat: 0, lng: 5, infoWindowTemplateName: 'marker-info-window', helloWorld: 'Hello World!'}
  ],
  infoWindows: [
    {title: 'some info window', lat: -5, lng: -5, description: 'hello everybody!'}
  ],

  actions: {
    addMarker:        function () {
      this.get('markers').addObject({title: 'new', lat: 0, lng: 0, isDraggable: true});
    },
    removeMarker:     function (marker) {
      this.get('markers').removeObject(marker);
    },
    addInfoWindow:    function () {
      this.get('infoWindows').addObject({title: 'new iw', description: 'hello', lat: -5, lng: 0});
    },
    removeInfoWindow: function (marker) {
      this.get('infoWindows').removeObject(marker);
    }
  }
});

```

```handlebars
{{! app/templates/application.hbs }}

{{google-map lat=lat lng=lng type=type zoom=zoom markers=markers infoWindows=infoWindows}}

<h3>Map settings</h3>
<div>
  <label>Lat: {{input value=lat}}</label>
  <label>Lng: {{input value=lng}}</label>
  <label>Zoom: {{input value=zoom}}</label>
  <label>Type: {{view Ember.Select content=mapTypes
  optionLabelPath='content.label' optionValuePath='content.id' value=type}}</label>
</div>
<h3>Markers</h3>
<ul>
  {{#each markers}}
    <li>
      <label>Title: {{input value=title}}</label>
      <label>Lat: {{input value=lat}}</label>
      <label>Lng: {{input value=lng}}</label>
      <label>Is visible: {{input type='checkbox' checked=isVisible}}</label>
      <label>Is draggable: {{input type='checkbox' checked=isDraggable}}</label>
      <label>Description: {{input value=description}}</label>
      <button {{action 'removeMarker' this}}>remove</button>
    </li>
  {{/each}}
  <button {{action 'addMarker'}}>add</button>
</ul>

<h3>Info windows</h3>
<ul>
  {{#each infoWindows}}
    <li>
      <label>Title: {{input value=title}}</label>
      <label>Description: {{input value=description}}</label>
      <label>Lat: {{input value=lat}}</label>
      <label>Lng: {{input value=lng}}</label>
      <label>Is visible: {{input type='checkbox' checked=isVisible}}</label>
      <button {{action 'removeInfoWindow' this}}>remove</button>
    </li>
  {{/each}}
  <button {{action 'addInfoWindow'}}>add</button>
</ul>

```
