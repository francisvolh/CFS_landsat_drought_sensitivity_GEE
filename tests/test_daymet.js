/*
Testing: modules/daymet.js
Alec L. Robitaille
*/


// Load modules
var daymet = require('users/robitalec/CFS:modules/daymet.js');

// Set variables
var years = ee.List.sequence(1985, 2021);
var months = ee.List.sequence(5, 7);



// Test monthly_daymet
// Usage: monthly_daymet(year_list, month_list)
var monthly_daymet = daymet.monthly_daymet(years, months);
print(monthly_daymet);
Map.addLayer(monthly_daymet.select('prcp'), {min:0, max:500});
