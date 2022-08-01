/*
Testing: modules/vegetation.js
Alec L. Robitaille
*/


// Load modules
var vegetation = require('users/robitalec/CFS:modules/vegetation.js');



// Test get_canopy_height();
// Usage: get_canopy_height();
var canopy_height = vegetation.get_canopy_height();
print(canopy_height);
Map.addLayer(canopy_height);