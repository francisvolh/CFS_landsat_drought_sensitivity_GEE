/*
Testing: modules/get_daymet.js
Alec L. Robitaille
*/


// Load modules
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');

// Set variables
var years = ee.List.sequence(1985, 2021);
var months = ee.List.sequence(5, 7);



// Test get_monthly_daymet
// Usage: get_monthly_daymet(year_list, month_list)
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
print(monthly_daymet);
Map.addLayer(monthly_daymet.select('prcp'), {min:0, max:500});
