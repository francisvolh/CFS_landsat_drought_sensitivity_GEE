/*
Testing: modules/get_daymet.js
Alec L. Robitaille
*/


// Load get_daymet module
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');

// Set years, months, reducer
var years = ee.List.sequence(2010, 2015);
var months = ee.List.sequence(5, 7);
var reducer = ee.Reducer.mean().combine(ee.Reducer.sum(), null, true);


// Test get_monthly_daymet
// Usage: get_monthly_daymet(year_list, month_list, reducer)
var monthly_daymet = get_monthly_daymet(years, months, reducer)
print(monthly_daymet);
Map.addLayer(monthly_daymet);
