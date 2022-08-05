/*
Testing: modules/vegetation.js
Alec L. Robitaille
*/


// Load modules
var vegetation = require('users/robitalec/CFS:modules/vegetation.js');



// Test canopy_height();
// Usage: canopy_height();
var canopy_height = vegetation.canopy_height();
print(canopy_height);
Map.addLayer(canopy_height);