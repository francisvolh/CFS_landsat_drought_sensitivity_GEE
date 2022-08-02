/*
Testing: modules/hydro.js
Alec L. Robitaille
*/


// Load modules
var hydro = require('users/robitalec/CFS:modules/hydro.js');

// Palette
var palettes = require('users/gena/packages:palettes');
var p = palettes.crameri.lajolla[50];



// Test proportion_permanent_snow
// Usage: proportion_permanent_snow(focal_dist)
var prop_snow_1000 = hydro.proportion_permanent_snow(1000);
print('Proportion snow 1000 m:', prop_snow_1000);
Map.addLayer(prop_snow_1000, {min:0, max:1}, 'prop snow 1000', false);

var prop_snow_5000 = hydro.proportion_permanent_snow(5000);
print('Proportion snow 500 m:', prop_snow_5000);
Map.addLayer(prop_snow_5000, {min:0, max:1}, 'prop snow 5000');



// Test distance_permanent_snow
// Usage: distance_permanent_snow();
var dist_perm_snow = hydro.distance_permanent_snow();
print('Distance permanent snow:', dist_perm_snow);
Map.addLayer(dist_perm_snow, {min: 0, max:7.5e3});



// Test proportion_water
var prop_water_5000 = hydro.proportion_water(5000);
print('Proportion water lc 5000:', prop_water_5000);
Map.addLayer(prop_water_5000, {min:0, max:1}, 'prop water lc 5000');



// Test distance_water_lc
var dist_water_lc = hydro.distance_water_lc();
print('Distance water lc:', dist_water_lc);
Map.addLayer(dist_water_lc, {min: 0, max: 10e3}, 'distance water lc');



// Test distance_major_lakes
// Usage: distance_major_lakes(min_lake_area)
var dist_major_lake_500 = hydro.distance_major_lakes(500);
print('Distance major lakes > 500 sq km:', dist_major_lake_500);
Map.addLayer(dist_major_lake_500, {min:0, max:10000}, 'dist lakes > 500 sq km');

var dist_major_lake_1000 = hydro.distance_major_lakes(1000);
print('Distance major lakes > 1000 sq km:', dist_major_lake_1000);
Map.addLayer(dist_major_lake_1000, {min:0, max:10000}, 'dist lakes > 1000 sq km', false);



// Test sampling_collection
var col = hydro.sampling_collection();
print('Sampling collection:', col);
