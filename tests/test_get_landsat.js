/*
Testing: modules/get_landsat.js
Alec L. Robitaille
*/


// Load modules
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');

// Set variables
var geometry = ee.Geometry.Polygon([[[-107.279, 59.673], [-107.279, 58.941],
                                    [-105.988, 58.941], [-105.988, 59.673]]]);



// Test SR collection
// Usage: get_landsat.get_SR(min_year, max_year, min_mm_dd, max_mm_dd, region)
var sr_col = get_landsat.get_SR(2014, 2019, '06-15', '07-15', geometry);
print(sr_col);

// Test indices collection
// Usage: get_landsat.get_indices(min_year, max_year, min_mm_dd, max_mm_dd, region, indices)
var indices_col = get_landsat.get_indices(2014, 2019, '06-15', '07-15', geometry, ['NDVI', 'EVI']);
print(indices_col);

// Map
Map.addLayer(geometry);
Map.addLayer(sr_col.select(['B3', 'B2', 'B1']), {min: -100, max: 1500}, 'RGB SR collection');
Map.addLayer(indices_col.select(['NDVI']), {min: -500, max:1200}, 'NDVI collection');
Map.addLayer(indices_col.select(['EVI']), {min: -5e3, max:5e3}, 'EVI collection');
