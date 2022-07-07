/*
Testing: modules/get_topo.js
Alec L. Robitaille
*/


// Load modules
var get_topo = require('users/robitalec/CFS:modules/get_topo.js');


// Palette
var palettes = require('users/gena/packages:palettes');
var p = palettes.crameri.lajolla[50];



// Test get_hand
// Usage: get_hand(resolution, threshold)
var hand_30_100 = get_topo.get_hand(30, 100);
print(hand_30_100);
Map.addLayer(hand_30_100, {min:0, max:500, palette:p}, 'hand 30 100');

var hand_30_1000 = get_topo.get_hand(30, 1000);
print(hand_30_1000);
Map.addLayer(hand_30_1000, {min:0, max:500, palette:p}, 'hand 30 1000', false);

var hand_90_1000 = get_topo.get_hand(90, 1000);
print(hand_90_1000);
Map.addLayer(hand_90_1000, {min:0, max:500, palette:p}, 'hand 90 1000', false);
