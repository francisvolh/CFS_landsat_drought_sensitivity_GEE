/*
Testing: modules/stratified.js
Alec L. Robitaille

*/


// Load stratified module
var stratified = require('users/robitalec/CFS:modules/stratified.js');

// Load land cover module
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');

// Load palettes module
var palettes = require('users/gena/packages:palettes');

// Region
var geometry = ee.Geometry.Polygon([[[-96.677, 52.700], [-96.677, 52.214], [-95.853, 52.214], [-95.853, 52.7]]]);

// Load Hermosilla land cover
var hermosilla_2022 = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var lc = hermosilla_2022.first();

// Test stratified_sample
// Usage: stratified.stratified_sample(img, band, region, n_pts)
var strat = stratified.stratified_sample(lc, 'b1', geometry, 50);
print(strat);
Map.addLayer(geometry);
Map.addLayer(lc, {palette: palettes.crameri.batlow[25]});
Map.addLayer(strat);


// Test stratified_sample for two classes
// Usage: stratified.stratified_sample(img, band, region, n_pts)
lc = lc.updateMask(lc.eq(20).or(lc.eq(220)));
var strat = stratified.stratified_sample(lc, 'b1', geometry, 50);
print(strat);
Map.addLayer(geometry);
Map.addLayer(lc, {palette: palettes.crameri.batlow[25]});
Map.addLayer(strat);

