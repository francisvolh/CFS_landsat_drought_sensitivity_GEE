/*
Test modules/utils.js
Alec L. Robitaille
*/

// Load modules
var utils = require('users/robitalec/CFS:modules/utils.js');

var forest_lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_lc_VLCE2");


// Test set_year
// Usage: utils.set_year(image)
var img = forest_lc.first();
print(utils.set_year(img));

// Test add_year_band
// Usage: utils.add_year_band(image)
var img = forest_lc.first();
img = utils.set_year(img);
Map.addLayer(utils.add_year_band(img).select('year'));

