/*
Build sampling collection
Alec L. Robitaille



*/


var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');

var n_pts = 5//150;

var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada')
  .limit(2);

var lc_homogeneous = land_cover.get_homogeneous_land_cover().limit(2).reduce(ee.Reducer.mode());
Map.addLayer(lc_homogeneous)

var points = ecoregions.map(function(ft) {
  return stratified.stratified_sample(lc_homogeneous, 'land_cover_mode', 30, ft.geometry(), n_pts);
})//.flatten();

print(points)


