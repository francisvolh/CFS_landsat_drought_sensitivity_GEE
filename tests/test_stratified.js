/*
Testing: modules/stratified.js
Alec L. Robitaille

*/


// Load stratified module
var stratified = require('users/robitalec/CFS:modules/stratified.js');

// Load land cover module
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');

// Load Hermosilla land cover
var hermosilla_2022 = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var lc = hermosilla_2022.first();

// Region
var geometry = ee.Geometry.Polygon([[[-96.188, 54.036], [-96.188, 51.866], [-92.233, 51.866], [-92.233, 54.036]]]);

// Test stratified_sample
// Usage: stratified.stratified_sample(img, band, region, n_pts)
var strat = stratified.stratified_sample(lc, 'b1', geometry, 10);
print(strat);
Map.addLayer(geometry);
Map.addLayer(lc);
Map.addLayer(strat);
