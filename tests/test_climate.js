/*
Testing: modules/climate.js
Alec L. Robitaille
*/


// Load modules
var climate = require('users/robitalec/CFS:modules/climate.js');

// Set variables
var year_list = ee.List.sequence(2002, 2020);



// Test long_term_climate
// Usage: long_term_climate(year_list)
// var long_climate = climate.long_term_climate(years);
// print(long_climate);
// Map.addLayer(long_climate.select('tmean_mean'), {min:-20, max:20}, 'mean annual tmean');
// Map.addLayer(long_climate.select('prcp_mean'), {min:100, max:4000}, 'mean annual sum prcp');



// Test weekly_daymet
// Usage: weekly_daymet(year_list);
var week_daymet = climate.weekly_daymet(year_list);
print('Weekly daymet', week_daymet);



// Test annual_mean_temp
// Usage: annual_mean_temp(year_list);
var week_daymet = climate.annual_mean_temp(year_list);
print('Weekly daymet', week_daymet);