/*
Testing: modules/get_hydro.js
Alec L. Robitaille
*/


// Load modules
var get_hydro = require('users/robitalec/CFS:modules/get_hydro.js');

// Palette
var palettes = require('users/gena/packages:palettes');
var p = palettes.crameri.lajolla[50];



// Test get_prop_permanent_snow
// Usage: get_prop_permanent_snow(focal_dist)
var prop_snow_1000 = get_hydro.get_prop_permanent_snow(1000);
print(prop_snow_1000);
Map.addLayer(prop_snow_1000, {min:0, max:1}, 'prop snow 1000', false);

var prop_snow_5000 = get_hydro.get_prop_permanent_snow(5000);
print(prop_snow_5000);
Map.addLayer(prop_snow_5000, {min:0, max:1}, 'prop snow 5000');


// Test get_prop_water
var prop_water_5000 = get_hydro.get_prop_water(5000);
print(prop_water_5000);
Map.addLayer(prop_water_5000, {min:0, max:1}, 'prop water 5000');



// Test get_dist_major_lakes
// Usage: get_dist_major_lakes(min_lake_area)
var dist_major_lake_500 = get_hydro.get_dist_major_lakes(500);
print(dist_major_lake_500);
Map.addLayer(dist_major_lake_500, {min:0, max:10000}, 'dist lakes > 500');

var dist_major_lake_1000 = get_hydro.get_dist_major_lakes(1000);
print(dist_major_lake_1000);
Map.addLayer(dist_major_lake_1000, {min:0, max:10000}, 'dist lakes > 1000', false);


// Test get_col
var col = get_hydro.get_col();
print(col);