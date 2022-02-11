/*
Testing: modules/get_collection.js
Alec L. Robitaille
*/


// Load get_collection module
var get_collection = require('users/robitalec/CFS:modules/get_collection.js');

// Geometry
var geometry = ee.Geometry.Polygon([[[-107.279, 59.673], [-107.279, 58.941],
                                    [-105.988, 58.941], [-105.988, 59.673]]]);
Map.addLayer(geometry);


// Test SR collection
// Usage: get_collection.get_SR(min_year, max_year, min_mm_dd, max_mm_dd, region)
var sr_col = get_collection.get_SR(2014, 2019, '06-15', '07-15', geometry);
print(sr_col);

// Test indices collection
// Usage: get_collection.get_indices(min_year, max_year, min_mm_dd, max_mm_dd, region, indices)
var indices_col = get_collection.get_indices(2014, 2019, '06-15', '07-15', geometry, ['NDVI', 'EVI']);
print(indices_col);

// Map
Map.addLayer(geometry);