/*
Testing: modules/main.js
Alec L. Robitaille
*/

// Load modules
var main = require('users/robitalec/CFS:modules/main.js');
var palettes = require('users/gena/packages:palettes');

// Set variables
var geometry = ee.Geometry.Polygon([[[-128.69, 58.70], [-128.69, 50.66], [-111.20, 50.66], [-111.20, 58.70]]]);
var min_year = 1985;
var max_year = 2019;
var min_mm_dd = '06-15';
var max_mm_dd = '07-15';
var percentile_list = [10, 20, 30];
var index_list = ['NDVI', 'NBR'];
var cmi_viz = {min:-30, max:30, palette: palettes.colorbrewer.RdBu[5]};


// Load ecoregions
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');




// Test main
// Usage: main(output, region, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
var main_relative = main.main('relative sensitivity', ecoregions.first(), min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
Map.addLayer(main_relative)