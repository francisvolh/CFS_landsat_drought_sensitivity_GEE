/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-125.75374796477628, 56.26962911141167],
          [-125.75374796477628, 55.65469597589261],
          [-124.24862101165128, 55.65469597589261],
          [-124.24862101165128, 56.26962911141167]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
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
var scale = 30;
var min_mm_dd = '06-15';
var max_mm_dd = '07-15';
var percentile = [15];
var percentile_low = 15;
var percentile_high = 85;
var index = ['NDVI'];
var antecedent = ['12mo'];




// Test export_img_asset
// Usage: export_img_asset(asset_name, asset_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent)
export_img.export_img_asset('test-export-asset', 'CFS', scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);



// Test export_img_drive
// Usage: export_img_drive(drive_name, drive_folder, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent)
export_img.export_img_drive('test-export-drive', 'Test-export', scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);



// Test export_img_cloud
// Usage: export_img_cloud(cloud_name, cloud_bucket, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent)
export_img.export_img_cloud('test-export-cloud', null, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);


// --- CAP --------------------------------------------------------------------
// Test export_img_asset_cap
// Usage: export_img_asset_cap(asset_name, asset_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent)
export_img.export_img_asset_cap('test-export-asset-cap', 'CFS', scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent);


// Test export_img_drive_cap
// Usage: export_img_drive_cap(drive_name, drive_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent)
export_img.export_img_drive_cap('test-export-drive-cap', 'CFS', scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent);

