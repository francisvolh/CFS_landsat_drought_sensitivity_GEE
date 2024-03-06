/*
Testing: modules/landsat.js
Alec L. Robitaille
*/


// Load modules
var landsat = require('users/robitalec/CFS:modules/landsat.js');

// Set variables
var geometry = ee.Geometry.Polygon([[[-107.279, 59.673], [-107.279, 58.941],
                                    [-105.988, 58.941], [-105.988, 59.673]]]);


var min_year = 2012;
var max_year = 2022;
var min_mm_dd = '06-01';
var max_mm_dd = '08-15';



// Test indices collection
// Usage: landsat.indices(min_year, max_year, min_mm_dd, max_mm_dd, region, indices)
var indices_col = landsat.zzz_indices(min_year, max_year, min_mm_dd, max_mm_dd, geometry, ['NDVI', 'EVI']);
print(indices_col);

// Test indices collection
// Usage: landsat.indices_greenest(min_year, max_year, min_mm_dd, max_mm_dd, region)
var indices_green_col = landsat.indices_greenest(min_year, max_year, min_mm_dd, max_mm_dd, geometry);
print(indices_green_col);


// Map
Map.addLayer(geometry, null, 'region');
Map.addLayer(indices_col.select(['NDVI']).first(), {min: -0.5, max:1}, 'NDVI collection');
Map.addLayer(indices_green_col.select(['NDVI']).first(), {min: -0.5, max:1}, 'NDVI (greenest) collection');
Map.centerObject(geometry);
