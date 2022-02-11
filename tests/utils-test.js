/*
Test modules/utils.js
Alec L. Robitaille
*/


// Load utils
var utils = require('users/robitalec/CFS:modules/utils.js');

// Test set_year
// Usage: utils.set_year(image)
var forest_lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var img = forest_lc.first()

print(utils.set_year(img));
