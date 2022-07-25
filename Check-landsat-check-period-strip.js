/*
Compare time period for stripping
Based on Testing: modules/get_landsat.js
Alec L. Robitaille
*/


// Load modules
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');

// geeblend
var blend = require('users/jja/public:blend.js');


// Set variables
var geometry = ee.Geometry.Polygon([[[-107.279, 59.673], [-107.279, 58.941],
                                    [-105.988, 58.941], [-105.988, 59.673]]]);

var min_year = 2015;
var max_year = min_year + 1;


var indices_july = get_landsat.get_indices_greenest(min_year, max_year, '07-01', '07-31', geometry).select('NDVI').first();
var indices_june_july = get_landsat.get_indices_greenest(min_year, max_year, '06-01', '07-31', geometry).select('NDVI').first();
var indices_june_aug = get_landsat.get_indices_greenest(min_year, max_year, '06-01', '08-31', geometry).select('NDVI').first();
var indices_june_sep = get_landsat.get_indices_greenest(min_year, max_year, '06-01', '09-30', geometry).select('NDVI').first();


// Map
var ndvi_viz = {min: -0.5, max: 1};

// Blend maps



Map.addLayer(geometry, null, 'region');

Map.addLayer(indices_july, {min: -0.5, max:1}, 'NDVI greenest: July', false);
Map.addLayer(indices_june_july, {min: -0.5, max:1}, 'NDVI greenest: June-July', false);
Map.addLayer(indices_june_aug, {min: -0.5, max:1}, 'NDVI greenest: June-Aug', false);
Map.addLayer(indices_june_sep, {min: -0.5, max:1}, 'NDVI greenest: June-Sep', false);

Map.centerObject(geometry);
