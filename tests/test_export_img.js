/*
Testing: modules/export_img.js
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');
var vars = require('users/robitalec/CFS:modules/variables.js');



// Set variables
var antecedent_list = vars.ante_list;
var max_year = vars.max_year;
var min_mm_dd = vars.min_mm_dd;
var max_mm_dd = vars.max_mm_dd;
var percentile_low = vars.percentile_low;
var percentile_high = vars.percentile_high;
var months = vars.months;
var percentile_list = [percentile_low, percentile_high];
var region = ee.Geometry.Polygon([[[-125.87, 56.86], [-125.87, 54.98], [-121.87, 54.98], [-121.87, 56.86]]]);

var asset_folder = 'users/robitalec/CFS/2022-07-10';
var drive_folder = 'Test-export-img-drive-from-asset';



// Test export_img_asset_greenest
// Usage: export_img_asset_greenest(asset_name, asset_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list)
export_img.export_img_asset_greenest('test-export-asset-greenest', 'CFS', scale, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);



// Test export_img_drive_greenest
// Usage: export_img_drive_greenest(drive_name, drive_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list)
export_img.export_img_drive_greenest('test-export-drive-greenest', 'CFS', scale, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);

// Test export_img_drive_from_asset
// Usage: export_img_drive_from_asset(asset_folder, bounds, drive_folder, scale)
export_img.export_img_drive_from_asset(asset_folder, region, drive_folder, scale);



// Test export_hydro_sampling_collection
// Usage: export_hydro_sampling_collection(region, region_name, scale);
var region_name = 'Test';
export_img.export_hydro_sampling_collection(region, region_name, scale);



Map.addLayer(region);
