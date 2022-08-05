/*
Test modules/utils.js
Alec L. Robitaille
*/

// Load modules
var utils = require('users/robitalec/CFS:modules/utils.js');

// Data
var img = ee.Image.constant(1).set('system:time_start', ee.Date.fromYMD(2020, 1, 1).millis());
var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V4")
  .filter(ee.Filter.date('2000-01-01', '2002-01-01'));
var year_list = ee.List.sequence(2000, 2002);
var month_list = ee.List.sequence(1, 12);
var reducer = ee.Reducer.mean().combine(ee.Reducer.sum(), null, true);


// Test set_year
// Usage: utils.set_year(image)
img = utils.set_year(img);
print('Set year', img);



// Test add_year_band
// Usage: utils.add_year_band(image)
img = utils.add_year_band(img);
Map.addLayer(img.select('year'));



// Test aggregate_month_year
// Usage: aggregate_month_year(images, year_list, month_list, reducer);
var agg_month_year = utils.aggregate_month_year(daymet, year_list, month_list, reducer);
print('Aggregate month year', agg_month_year);



// Test aggregrate_year
// Usage: aggregrate_year(images, year_list, reducer);
var agg_year = utils.aggregrate_year(daymet, year_list, reducer);
print('Aggregate year', agg_year);



// Test set_week
// Usage: set_week(images);
var test_week = utils.set_week(daymet);
print('Set week', test_week);



// Test aggregrate_week
// Usage: aggregrate_week(images, year_list, reducer);
var agg_wk = utils.aggregrate_week(daymet, year_list, reducer);
print('Aggregate week', agg_wk);


