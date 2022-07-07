/*
Testing: modules/get_climate.js
Alec L. Robitaille
*/


// Load modules
var climate = require('users/robitalec/CFS:modules/get_climate.js');

// Set variables
var years = ee.List.sequence(1985, 2020);



// Test get_long_term_climate
// Usage: get_long_term_climate(year_list)
var long_climate = climate.get_long_term_climate(years);
print(long_climate);
Map.addLayer(long_climate.select('tmean_mean'), {min:-20, max:20}, 'mean annual tmean');
Map.addLayer(long_climate.select('prcp_mean'), {min:100, max:4000}, 'mean annual sum prcp');
