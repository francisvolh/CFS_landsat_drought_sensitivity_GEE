/*
Testing: modules/climate.js
Alec L. Robitaille
*/


// Load modules
var climate = require('users/robitalec/CFS:modules/climate.js');

// Set variables
var year_list = ee.List.sequence(2002, 2002);
var week_list = ee.List.sequence(23, 25);


// Test daymet
// Usage: daymet();
var daymet = climate.daymet();
print('Daymet (limit 5)', daymet.limit(5));



// Test weekly_daymet
// Usage: weekly_daymet(daymet, year_list, week_list);
var week_daymet = climate.weekly_daymet(daymet, year_list, week_list);
print('Weekly daymet', week_daymet);



// Test annual_mean_temp
// Usage: annual_mean_temp(daymet, year_list);
var ann_mean_t = climate.annual_mean_temp(daymet, year_list);
print('Annual mean temperature', ann_mean_t);
