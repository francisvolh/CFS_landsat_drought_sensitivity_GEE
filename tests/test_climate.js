/*
Testing: modules/climate.js
Alec L. Robitaille
*/


// Load modules
var climate = require('users/robitalec/CFS:modules/climate.js');

// Set variables
var year_list = ee.List.sequence(2020, 2022);
var week_list = ee.List.sequence(23, 25);
var month_list = ee.List.sequence(6, 7);

// Daymet
var daymet = climate.daymet;
var era5 = climate.era5;

// Test daymet
// Usage: get_daymet();
var get_daymet = climate.get_daymet();
print('Daymet (limit 5)', get_daymet.limit(5));

// Test era5
// Usage: get_era5();
var get_era5 = climate.get_era5();
print('ERA5 (limit 5)', get_era5.limit(5));



// Test monthly_daymet
// Usage: monthly_daymet(year_list, month_list)
// var monthly_daymet = climate.monthly_daymet(year_list, month_list);
// print('Monthly daymet', monthly_daymet);
// Map.addLayer(monthly_daymet.select('prcp'), {min:0, max:500}, 'monthly_daymet');

// Test monthly_era5
// Usage: monthly_era5(year_list, month_list)
var monthly_era5 = climate.monthly_era5(year_list, month_list);
print('Monthly era5', monthly_era5);
// Map.addLayer(monthly_era5.select('prcp'), {min:0, max:500}, 'monthly_era5');




// Test climate_normals
// Usage: climate_normals(bioclim_variables);
var climate_normals = climate.climate_normals(['TD', 'MAT']);
print('Climate normals', climate_normals);
Map.addLayer(climate_normals.select('Normal_1991_2020_TD_b1'), {min: -50, max: 50}, 'climate_normals');



// Test sampling_collection
// Usage: climate.sampling_collection;
var col = climate.sampling_collection;
print('Sampling collection', col);
