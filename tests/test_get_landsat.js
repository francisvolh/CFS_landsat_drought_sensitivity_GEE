/*
Testing: modules/get_landsat.js
Alec L. Robitaille
*/


// Load modules
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');

// Set variables
var geometry = ee.Geometry.Polygon([[[-107.279, 59.673], [-107.279, 58.941],
                                    [-105.988, 58.941], [-105.988, 59.673]]]);


var min_mm_dd = '07-01';
var max_mm_dd = '07-31';


// Test SR collection
// Usage: get_landsat.get_SR(min_year, max_year, min_mm_dd, max_mm_dd, region)
var sr_col = get_landsat.get_SR(2014, 2019, min_mm_dd, max_mm_dd, geometry);
print(sr_col);

// Test indices collection
// Usage: get_landsat.get_indices(min_year, max_year, min_mm_dd, max_mm_dd, region, indices)
var indices_col = get_landsat.get_indices(2014, 2019, min_mm_dd, max_mm_dd, geometry, ['NDVI', 'EVI']);
print(indices_col);

// Test indices collection
// Usage: get_landsat.get_indices_greenest(min_year, max_year, min_mm_dd, max_mm_dd, region, indices)
var indices_green_col = get_landsat.get_indices_greenest(2014, 2019, min_mm_dd, max_mm_dd, geometry, ['NDVI', 'EVI']);
print(indices_green_col);


// Map
Map.addLayer(geometry, null, 'region');
Map.addLayer(sr_col.select(['B3', 'B2', 'B1']), {min: 0, max: 1.5}, 'RGB SR collection');
Map.addLayer(indices_col.select(['NDVI']), {min: -0.5, max:1}, 'NDVI collection');
Map.addLayer(indices_green_col.select(['NDVI']), {min: -0.5, max:1}, 'NDVI (greenest) collection');
Map.centerObject(geometry);
