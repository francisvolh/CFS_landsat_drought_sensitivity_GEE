/*
Test modules/utils.js
Alec L. Robitaille
*/

// Load modules
var utils = require('users/robitalec/CFS:modules/utils.js');

// Data
var img = ee.Image.constant(1).set('system:time_start', ee.Date.fromYMD(2020, 1, 1).millis());
var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V4")
  .filter(ee.Filter.calendarRange('2000-01-01', '2002-01-01'));


// Test set_year
// Usage: utils.set_year(image)
img = utils.set_year(img);
print('Set year', img);



// Test add_year_band
// Usage: utils.add_year_band(image)
img = utils.add_year_band(img);
Map.addLayer(img.select('year'));



