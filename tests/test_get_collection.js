/*
Testing: modules/get_collection.js
Alec L. Robitaille
*/


// Load get_collection module
var get_collection = require('users/robitalec/CFS:modules/get_collection.js');

// Geometry
var geometry = ee.Geometry.Polygon([[[-107.279, 59.673], [-107.279, 58.941],
                                    [-105.988, 58.941], [-105.988, 59.673]]]);

// Test SR collection
var sr_col = get_collection.get_SR({
	'min_year': 2018,
	'max_year': 2019,
	'min_mm_dd': '06-15',
	'max_mm_dd': '07-15',
	'region': geometry
});


// Test indices collection
var indices_col = get_collection.get_indices({
	'min_year': 2018,
	'max_year': 2019,
	'min_mm_dd': '06-15',
	'max_mm_dd': '07-15',
	'region': geometry,
	'indices': ['NDVI', 'EVI']
});