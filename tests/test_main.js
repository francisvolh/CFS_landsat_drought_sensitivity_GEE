/*
Testing: modules/main.js
Alec L. Robitaille
*/

// Load modules
var main = require('users/robitalec/CFS:modules/main.js');

// Set variables
var geometry = ee.Geometry.Polygon([[[-128.69, 58.70], [-128.69, 50.66], [-111.20, 50.66], [-111.20, 58.70]]]);



// Load ecoregions
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');




// Test main
// Usage: main(output, region, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);

