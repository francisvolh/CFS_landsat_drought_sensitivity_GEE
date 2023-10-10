/*
Testing: modules/climate.js
Alec L. Robitaille
*/


// Load modules
var climate = require('users/robitalec/CFS:modules/climate.js');

// Set variables
var year_list = ee.List.sequence(2002, 2002);
var week_list = ee.List.sequence(23, 25);
var month_list = ee.List.sequence(5, 7);

// Daymet
var daymet = climate.daymet;

// Test daymet
// Usage: get_daymet();
var get_daymet = climate.get_daymet();
print('Daymet (limit 5)', got_daymet.limit(5));



// Test weekly_daymet
// Usage: weekly_daymet(daymet_col, year_list, week_list);
// var week_daymet = climate.weekly_daymet(daymet, year_list, week_list);
// print('Weekly daymet', week_daymet);



// Test monthly_daymet
// Usage: monthly_daymet(year_list, month_list)
var monthly_daymet = climate.monthly_daymet(year_list, month_list);
print('Monthly daymet', monthly_daymet);
Map.addLayer(monthly_daymet.select('prcp'), {min:0, max:500}, 'monthly_daymet');



// Test climate_normals
// Usage: climate_normals(bioclim_variables);
var climate_normals = climate.climate_normals(['TD', 'MAT']);
print('Climate normals', climate_normals);
Map.addLayer(climate_normals.select('Normal_1991_2020_TD_b1'), {min: -50, max: 50}, 'climate_normals');



// Test sampling_collection
// Usage: climate.sampling_collection;
var col = climate.sampling_collection;
print('Sampling collection', col);
