/*
Testing: modules/soil.js
Alec L. Robitaille
*/


// Load modules
var soil = require('users/robitalec/CFS:modules/soil.js');



// Test get_canopy_height();
// Usage: get_canopy_height();
var canopy_height = soil.get_canopy_height();
print(canopy_height);
Map.addLayer(canopy_height);
