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
Map.addLayer(canopy_height, {bands: 'ch_max_height_250m', min: 0, max: 30}, 'canopy height');



// Test forest_carbon();
// Usage: forest_carbon();
var forest_carbon = vegetation.forest_carbon();
print('Forest carbon', forest_carbon);
Map.addLayer(forest_carbon, {min: 0, max: 12}, 'forest carbon');



// Test forest_age();
// Usage: forest_age();
var forest_age = vegetation.forest_age();
print('Forest age', forest_age);
Map.addLayer(forest_age, {min: 0, max: 151}, 'forest_age');
Map.addLayer(forest_age.eq(255), null, 'forest_age == 255');
print(forest_age.reduceRegion({reducer: ee.Reducer.max(), bestEffort: true}))
print(forest_age.reduceRegion({reducer: ee.Reducer.min(), bestEffort: true}))


// Test sampling_collection();
// Usage: sampling_collection();
var col = vegetation.sampling_collection();
print('Sampling collection', col);
