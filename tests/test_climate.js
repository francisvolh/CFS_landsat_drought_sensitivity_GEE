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



// Test climate_normals
// Usage: climate_normals(bioclim_variables);
var climate_normals = climate.climate_normals(['TD', 'MAT']);
print('Climate normals', climate_normals);
Map.addLayer(climate_normals.select('TD_1990_2020_normals'), {min: -12, max: 12});



// Test sampling_collection
// Usage: sampling_collection();
var col = climate.sampling_collection();
print('Sampling collection', col);
