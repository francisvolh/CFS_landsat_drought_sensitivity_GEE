/*
Testing: modules/climate.js
Alec L. Robitaille
*/


// Load modules
var climate = require('users/francisv/CFS:modules/climate.js');



// Set variables
var min_year = 2021;
var max_year = 2022;
var min_mon = 6;
var max_mon = 7;
var year_list = ee.List.sequence(min_year, max_year);
var month_list = ee.List.sequence(min_mon, max_mon);



// Daymet
//var daymet = climate.daymet;
var era5 = climate.monthly_era5;




// Test era5
// Usage: get_era5();
var get_era5 = climate.get_era5_daily();
print('ERA5 (limit 5)', get_era5.limit(5));


// Test monthly_era5
// Usage: monthly_era5(min_year, max_year, min_month, max_month)
var monthly_era5 = climate.monthly_era5(min_year, max_year, min_mon, max_mon);
print('Monthly era5', monthly_era5);
Map.addLayer(monthly_era5.select('prcp'), {min:0, max:500}, 'monthly_era5');




// Test climate_normals
// Usage: climate_normals(bioclim_variables);
var climate_normals = climate.climate_normals(['TD', 'MAT']);
print('Climate normals', climate_normals);
Map.addLayer(climate_normals.select('Normal_1991_2020_TD_b1'), {min: -50, max: 50}, 'climate_normals');

// Test era5_land_climate_normals
// Usage: era5_land_climate_normals();
var era5_climate_normals = climate.era5_land_climate_normals();
print('ERA5 Land climate normals', era5_climate_normals);
Map.addLayer(era5_climate_normals.select('forecast_albedo'), {min: 0, max: 1}, 'normal: forecast albedo');




// Test sampling_collection
// Usage: climate.sampling_collection;
var col = climate.sampling_collection;
print('Sampling collection', col);
