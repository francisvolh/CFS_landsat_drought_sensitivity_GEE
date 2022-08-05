/*
Testing: modules/soil.js
Alec L. Robitaille
*/


// Load modules
var soil = require('users/robitalec/CFS:modules/soil.js');



// Test soil_percent();
// Usage: soil_percent();
var soil_percent = soil.soil_percent();
print(soil_percent);
Map.addLayer(soil_percent, {min: 0, max: 100});



// Test soil_carbon();
// Usage: soil_carbon();
var soil_carbon = soil.soil_carbon();
print(soil_carbon);
Map.addLayer(soil_carbon, {min: 0, max: 350});

