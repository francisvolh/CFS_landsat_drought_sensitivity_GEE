/*
Testing: modules/fire.js
Alec L. Robitaille
*/


// Load modules
var fire = require('users/robitalec/CFS:modules/fire.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');


// Set variables
var geometry = ee.Geometry.Polygon([[[-107.279, 59.673], [-107.279, 58.941],
                                    [-105.988, 58.941], [-105.988, 59.673]]]);



// Test five_year_fires
// Usage: fire.five_year_fires(year)
var five_year_fires = fire.five_year_fires(2013);
print(five_year_fires);
Map.addLayer(five_year_fires, {min:0, max:1, palette: ['000000', 'ffc781']}, 'five_year_firest');

// Test mask_five_year_fires
// Usage: fire.mask_five_year_fires(img)
var img = land_cover.get_land_cover().filter(ee.Filter.eq('year', 2013)).first();
var mask_five_year_fires = fire.mask_five_year_fires(img);
print(mask_five_year_fires);
Map.addLayer(mask_five_year_fires, null, 'mask_five_year_fires');
