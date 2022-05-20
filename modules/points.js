/*
Build sampling collection
Alec L. Robitaille



*/


var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');

var n_pts = 5//150;

var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');

var lc_homogeneous = land_cover.get_homogeneous_land_cover().mode();


var points = ecoregions.map(function(ft) {
  return stratified.stratified_sample(lc_homogeneous, 'land_cover', 30, ft.geometry(), n_pts);
}).flatten();

print(points)


