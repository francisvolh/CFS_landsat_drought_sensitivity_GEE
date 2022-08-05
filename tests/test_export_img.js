/*
Testing: modules/export_img.js
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');
var palettes = require('users/gena/packages:palettes');

// Set variables
var min_year = 1985; var max_year = 2015;
var years = ee.List.sequence(min_year, max_year);
var months = ee.List.sequence(1, 12);
var min_mm_dd = '07-01';
var max_mm_dd = '07-31';
var percentile_list = [15, 85];
var index_list = ['NDVI', 'NBR'];
var antecedent_list = ['3mo', '12mo', '5yr'];
var scale = 30;

var region = ee.Geometry.Polygon([[[-125.87, 56.86], [-125.87, 54.98], [-121.87, 54.98], [-121.87, 56.86]]]);

var p = palettes.crameri.vik[10];
var abs_viz = {min:-0.3, max:0.3, palette: p};

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
// Usage: export_hydro_sampling_collection(region, region_name);
var region_name = 'Test';
export_img.export_hydro_sampling_collection(region, region_name);



Map.addLayer(ee.Image('users/robitalec/CFS/2022-07-09_test-export-asset-greenest').select('Abs_sens_NDVI_ante3mo_p15_p85'), abs_viz, 'Exported image greenest asset');
Map.addLayer(region);