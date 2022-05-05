/*
Export single image to drive
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');

// Set variables
var region = ee.FeatureCollection(geometry);
var percentile = [15];
var index = ['NDVI'];
var antecedent = ['12mo'];
var min_year = 1985;
var max_year = 2020;
var min_mm_dd = '07-01';
var max_mm_dd = '07-31';


// Export image to drive
// Usage: export_img_drive(drive_name, drive_folder, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent)
export_img.export_img_drive('test-export-drive', 'Test-export', 30, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);
