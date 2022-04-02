/*
Testing: modules/export_img.js
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');

// Set variables
var region = ee.FeatureCollection(geometry);
var min_year = 2000;
var max_year = 2015;
var min_mm_dd = '06-15';
var max_mm_dd = '07-15';
var percentile = [15];
var index = ['NDVI'];
var antecedent = ['12mo'];




// Test export_img_asset
// Usage: export_img_asset(asset_name, asset_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent)
export_img.export_img_asset('test-export-asset', 'CFS', 30, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);



// Test export_img_drive
// Usage: export_img_drive(drive_name, drive_folder, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent)
export_img.export_img_drive('test-export-drive', 'Test-export', 30, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);



// Test export_img_cloud
// Usage: export_img_cloud(cloud_name, cloud_bucket, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent)
export_img.export_img_cloud('test-export-cloud', null, 30, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);
