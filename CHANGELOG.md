0.0.17 / 2015-02-02
===================

  * [FEAT] `autoFitBounds` and `fitBoundsArray` + many fixes
  * [MISC] Updated README with the polygons

0.0.15 / 2015-01-28
===================

  * [MISC] Updating .npmignore
  * [MISC] Updating the script to update github pages
  * [FEAT] Implementing polygons
  * [MISC] Changed `warn` to `debug` for unhandled events
  * [MISC] A bit of refactor and more doc
  * [MISC] Improved the README

0.0.14 / 2015-01-08
===================

  * [FIX] Fixed info-window context
  * [FIX] Removed deprecated {{each}}
  * [FEAT] Updating to Ember 1.9.1 and Handlebars 2.0.0
  * [FIX] Fixed `import` instruction in README
  * [FEAT] Updated to ember-cli 0.1.5

0.0.13 / 2014-12-18
===================

  * [FEAT] Added lazy-loading of the SDK (closes #8)

0.0.12 / 2014-12-12
===================

  * [MISC] Fixed the css of the demo
  * [FEAT] Using the view's node directly as the content of an info-window
  * [MISC] Add a class for info windows main element

0.0.11 / 2014-12-11
===================

  * [FEAT] Added circles feature

0.0.10 / 2014-12-10
===================

  * [MISC] Updating README
  * [FIX] Fixed all polyline known bugs
  * [FIX] Fixing the update of lat/lng not being handled
  * [FEAT] Pre-version of polyline
  * [MISC] First version of google array

0.0.9 / 2014-12-07
==================

  * [MISC] Using dynamic views
  * [FIX] Using dedicated array controllers
  * [MISC] Moved everything directly in the app tree
  * [MISC] Updated to EmberCLI 1.3
  * [MISC] Updated readme

0.0.8 / 2014-12-02
==================

  * [MISC] Updated README and moved HISTORY to CHANGELOG
  * [MISC] Removed unused dependencies
  * [BREAK] Updated to ember-cli 0.1.2 + fixed package name (breaking change, see https://github.com/huafu/ember-google-map#updating)
  * [MISC] Updated demo app
  * [MISC] Changed the way of reading option-only properties
  * [FIX] Using non protocol aware URL to import Google map library
  * [FEAT] Adding map options

0.0.7 / 2014-11-29
==================

  * [FIX] Fixed bugs when freeing the map
  * [FIX] Made the addon compatible with projects not using Ember prototype extensions
