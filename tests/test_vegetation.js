/*
Testing: modules/vegetation.js
Alec L. Robitaille
*/


// Load modules
var vegetation = require('users/robitalec/CFS:modules/vegetation.js');



// Test canopy_height();
// Usage: canopy_height();
var canopy_height = vegetation.canopy_height();
print('Canopy height', canopy_height);
Map.addLayer(canopy_height);



// Test forest_carbon();
// Usage: forest_carbon();
var forest_carbon = vegetation.forest_carbon();
print('Forest carbon', forest_carbon);
Map.addLayer(forest_carbon);