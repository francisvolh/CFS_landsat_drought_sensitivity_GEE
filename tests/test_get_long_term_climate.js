/*
Testing: modules/get_long_term_climate.js
Alec L. Robitaille
*/


// Load modules
var climate = require('users/robitalec/CFS:modules/get_long_term_climate.js');

// Set variables
var years = ee.List.sequence(1985, 2020);
var months = ee.List.sequence(5, 7);


// Test get_long_term_climate
// Usage: get_long_term_climate(year_list, month_list)
var long_climate = climate.get_long_term_climate(years, months);
print(long_climate);
Map.addLayer(long_climate.select('prcp'), {min:0, max:500});
