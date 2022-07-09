/*
Testing: modules/exports_points.js
Alec L. Robitaille
*/

// Load modules
var export_points = require('users/robitalec/CFS:modules/export_points.js');

// Set variables
var geometry = ee.Geometry.Polygon([[[-128.69, 58.70], [-128.69, 50.66], [-111.20, 50.66], [-111.20, 58.70]]]);
var min_year = 2000;
var max_year = 2015;
var min_mm_dd = '06-15';
var max_mm_dd = '07-15';
var percentile_list = [10, 20];
var percentile_low = 15;
var percentile_high = 85;
var antecedent = ['3mo'];
var index_list = ['NDVI', 'NBR'];
var drive_folder = 'Batch-ecoregion-export';
var n_pts = 10;



// Test export_hydro
// Usage: export_hydro(points, drive_name, drive_folder)
export_points.export_hydro(points, 'test-export-hydro', 'Exports');


