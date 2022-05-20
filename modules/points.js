/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-123.65066691768052, 53.76317973565826],
          [-123.65066691768052, 50.807514646527544],
          [-114.33426066768052, 50.807514646527544],
          [-114.33426066768052, 53.76317973565826]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Build sampling collection
Alec L. Robitaille



*/


var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');

var n_pts = 5//150;

var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada')
  .filterBounds(geometry)

// print(ecoregions)
var lc_homogeneous = land_cover.get_homogeneous_land_cover().reduce(ee.Reducer.mode());
Map.addLayer(lc_homogeneous)

var points = ecoregions.map(function(ft) {
  return stratified.stratified_sample(lc_homogeneous, 'land_cover_mode', 10000, ft.geometry(), n_pts)
    .map(function(f) {
      return f.set({ecoprovince: ft.get('ECOPROV'),
                    ecoregion: ft.get('ECOREGI'),
                    ecozone: ft.get('ECOZONE')});
    });
}).flatten();

print(points)


