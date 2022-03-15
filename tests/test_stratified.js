/*
Testing: modules/stratified.js
Alec L. Robitaille
*/


// Load modules
var stratified = require('users/robitalec/CFS:modules/stratified.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var palettes = require('users/gena/packages:palettes');

// Set variables
var geometry = ee.Geometry.Polygon([[[-96.677, 52.700], [-96.677, 52.214], [-95.853, 52.214], [-95.853, 52.7]]]);

// Load collection
var hermosilla_2022 = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var lc = hermosilla_2022.first();



// Test stratified_sample
// Usage: stratified.stratified_sample(img, band, scale, region, n_pts)
var strat = stratified.stratified_sample(lc, 'b1', 30, geometry, 50);
print(strat);
Map.addLayer(geometry);
Map.addLayer(lc, {palette: palettes.crameri.batlow[25]});
Map.addLayer(strat);

// Test stratified_sample for two classes
// Usage: stratified.stratified_sample(img, band, scale, region, n_pts)
lc = lc.updateMask(lc.eq(20).or(lc.eq(220)));
var strat = stratified.stratified_sample(lc, 'b1', 30, geometry, 50);
print(strat);
Map.addLayer(strat);

// Test stratified_sample for modal class
// Usage: stratified.stratified_sample(img, band, scale, region, n_pts)
var lc_modal = land_cover.lc_and_fire.reduce(ee.Reducer.mode());
var strat = stratified.stratified_sample(lc_modal, 'land_cover_mode', 30, geometry, 50);
print(strat);
Map.addLayer(strat);