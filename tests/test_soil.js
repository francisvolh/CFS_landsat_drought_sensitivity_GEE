/*
Testing: modules/soil.js
Alec L. Robitaille
*/


// Load modules
var soil = require('users/robitalec/CFS:modules/soil.js');



// Test get_soil_percent();
// Usage: get_soil_percent();
var soil_percent = soil.get_soil_percent();
print(soil_percent);
Map.addLayer(soil_percent);
