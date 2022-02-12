/*
Testing: modules/stratified.js
Alec L. Robitaille

*/


// Load stratified module
var stratified = require('users/robitalec/CFS:modules/stratified.js');

// Load land cover module
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');

// Load land cover image
var lc = land_cover.get_land_cover().first();

// Region
var geometry = ee.Geometry.Polygon([[[-96.188, 54.036], [-96.188, 51.866], [-92.233, 51.866], [-92.233, 54.036]]]);

// Test stratified_sample
// Usage: stratified.stratified_sample(img, band, region, n_pts)
var strat = stratified.stratified_sample(lc, 'land_cover', geometry, 100);

