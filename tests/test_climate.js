/*
Testing: modules/climate.js
Alec L. Robitaille
*/


// Load modules
var climate = require('users/robitalec/CFS:modules/climate.js');

// Set variables
var year_list = ee.List.sequence(2002, 2002);



// Test daymet
// Usage: daymet();
var daymet = climate.daymet()
  .filter(ee.Filter.inList('year', year_list));
print('Daymet (filter in year list)', daymet);



// Test weekly_daymet
// Usage: weekly_daymet(daymet, year_list);
var week_daymet = climate.weekly_daymet(daymet, year_list);
print('Weekly daymet (limit 2)', week_daymet.limit(2));



// Test annual_mean_temp
// Usage: annual_mean_temp(daymet, year_list);
var ann_mean_t = climate.annual_mean_temp(daymet, year_list);
print('Annual mean temperature', ann_mean_t);
