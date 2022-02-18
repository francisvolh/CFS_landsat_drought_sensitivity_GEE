/*
Testing: modules/exports.js
Alec L. Robitaille
*/

// Load modules
var exports = require('users/robitalec/CFS:modules/export.js');

// Set variables
var geometry = ee.Geometry.Polygon([[[-128.69, 58.70], [-128.69, 50.66], [-111.20, 50.66], [-111.20, 58.70]]]);



// Load ecoregions
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');


print(ecoregions.filterBounds(geometry).aggregate_array('ECOREGI').distinct());


// Test export_by_ecoregion
// Usage:

