/*
Testing: modules/soil.js
Alec L. Robitaille
*/


// Load modules
var soil = require('users/robitalec/CFS:modules/soil.js');



// Test soil_percent();
// Usage: soil_percent();
var soil_percent = soil.soil_percent();
print('Soil percent', soil_percent);
Map.addLayer(soil_percent, {min: 0, max: 100});



// Test soil_carbon();
// Usage: soil_carbon();
var soil_carbon = soil.soil_carbon();
print('Soil carbon', soil_carbon);
Map.addLayer(soil_carbon, {min: 0, max: 350});



// Test peat_depth();
// Usage: peat_depth();
var peat_depth = soil.peat_depth();
print('Peat depth', peat_depth);
Map.addLayer(peat_depth, {min: 0, max: 350});



// Test sampling_collection();
// Usage: sampling_collection();
var sampling_collection = soil.sampling_collection();
print('Sampling collection', sampling_collection);

