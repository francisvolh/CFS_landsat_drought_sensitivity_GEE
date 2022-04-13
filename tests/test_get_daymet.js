/*
Testing: modules/get_daymet.js
Alec L. Robitaille
*/


// Load modules
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');

// Set variables
var years = ee.List.sequence(1985, 2020);
var months = ee.List.sequence(5, 7);



// Test get_monthly_daymet
// Usage: get_monthly_daymet(year_list, month_list)
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
print(monthly_daymet);
Map.addLayer(monthly_daymet.select('prcp'), {min:0, max:500});



// Test get_mean_annual
// Usage: get_mean_annual(year_list)
var mean_annual_daymet = get_daymet.get_mean_annual(years);
print(mean_annual_daymet);
Map.addLayer(mean_annual_daymet.select('prcp_mean_mean'), {min:0, max:20});
Map.addLayer(mean_annual_daymet.select('tmax_mean_mean'), {min:-30, max:30});
