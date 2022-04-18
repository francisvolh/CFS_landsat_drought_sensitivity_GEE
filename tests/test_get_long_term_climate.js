/*
Testing: modules/get_long_term_climate.js
Alec L. Robitaille
*/


// Load modules
var climate = require('users/robitalec/CFS:modules/get_long_term_climate.js');

// Set variables
var years = ee.List.sequence(1985, 2020);
var months = ee.List.sequence(5, 7);


// Test get_monthly_daymet
// Usage: get_monthly_daymet(year_list, month_list)
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
print(monthly_daymet);
Map.addLayer(monthly_daymet.select('prcp'), {min:0, max:500});
