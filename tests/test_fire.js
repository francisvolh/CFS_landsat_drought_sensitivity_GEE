/*
Testing: modules/fire.js
Alec L. Robitaille

*/


// Load fire module
var fire = require('users/robitalec/CFS:modules/fire.js');

// Load land cover module
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');


// Geometry
var geometry = ee.Geometry.Polygon([[[-107.279, 59.673], [-107.279, 58.941],
                                    [-105.988, 58.941], [-105.988, 59.673]]]);


// Test five_year_fires
// Usage: fire.five_year_fires(year)
var five_year_fires = fire.five_year_fires(2013);
print(five_year_fires);


// Test mask_five_year_fires
// Usage: fire.mask_five_year_fires(img)
var img = land_cover.get_land_cover().filter(ee.Filter.eq('year', 2013)).first();
var mask_five_year_fires = fire.mask_five_year_fires(img);
print(mask_five_year_fires);


// Map
Map.addLayer(five_year_fires);
Map.addLayer(mask_five_year_fires);