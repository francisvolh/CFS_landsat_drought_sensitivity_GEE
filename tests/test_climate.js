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



// Test temp_annual_mean
// Usage: temp_annual_mean(daymet);
var t_ann_mean = climate.temp_annual_mean(week_daymet);
print('Temperature annual mean', t_ann_mean);
Map.addLayer(t_ann_mean, {min: 0, max: 20}, 'temperature annual mean');



// Test temp_annual_range
// Usage: temp_annual_range(daymet);
var t_ann_range = climate.temp_annual_range(week_daymet);
print('Temperature annual range', t_ann_range);
Map.addLayer(t_ann_range, {min: 0, max: 50}, 'temperature annual range');



// Test prcp_annual
// Usage: prcp_annual(daymet);
var prcp_ann = climate.prcp_annual(week_daymet);
print('Precipitation annual', prcp_ann);
Map.addLayer(prcp_ann, {min: 0, max: 500}, 'prcp annual');