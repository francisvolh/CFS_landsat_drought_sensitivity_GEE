/*
Testing: modules/get_hydro.js
Alec L. Robitaille
*/


// Load modules
var get_hydro = require('users/robitalec/CFS:modules/get_hydro.js');

// Palette
var palettes = require('users/gena/packages:palettes');
var p = palettes.crameri.lajolla[50];


// Test get_hand
// Usage: get_hand(resolution, threshold)
var hand_30_100 = get_hydro.get_hand(30, 100);
print(hand_30_100);
Map.addLayer(hand_30_100.select('b1'), {min:0, max:500, palette:p});

var hand_30_1000 = get_hydro.get_hand(30, 1000);
print(hand_30_1000);
Map.addLayer(hand_30_1000.select('b1'), {min:0, max:500, palette:p});

var hand_90_1000 = get_hydro.get_hand(90, 1000);
print(hand_90_1000);
Map.addLayer(hand_90_1000.select('b1'), {min:0, max:500, palette:p});



// Test get_prop_permanent_snow
// Usage: get_prop_permanent_snow(focal_dist)
var prop_snow_1000 = get_hydro.get_prop_permanent_snow(1000);
print(prop_snow_1000);
Map.addLayer(prop_snow_1000, {min:0, max:1});

var prop_snow_5000 = get_hydro.get_prop_permanent_snow(5000);
print(prop_snow_5000);
Map.addLayer(prop_snow_5000, {min:0, max:1});



// Test get_dist_major_lakes
// Usage: get_dist_major_lakes(min_lake_area)
var dist_major_lake_500 = get_hydro.get_dist_major_lakes(500);
print(dist_major_lake_500);
Map.addLayer(dist_major_lake_500, {min:0, max:10000});

var dist_major_lake_1000 = get_hydro.get_dist_major_lakes(1000);
print(dist_major_lake_1000);
Map.addLayer(dist_major_lake_1000, {min:0, max:10000});
