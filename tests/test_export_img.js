/*
Testing: modules/export_img.js
Alec L. Robitaille
*/



// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');
var vars = require('users/robitalec/CFS:modules/variables.js');



// Set variables
var region = ee.Geometry.Polygon([[[-122.87, 55.86], [-122.87, 54.98], [-121.87, 54.98], [-121.87, 55.86]]]);
var scale = 30;
var asset_folder = 'users/robitalec/CFS';
var drive_folder = 'Test-export-img-drive-from-asset';



// Test export_img_asset_greenest
// Usage: export_img_asset_greenest(asset_name, asset_path, scale, region)
export_img.export_img_asset_greenest('test-export-asset-greenest', 'CFS', scale, region);



// Test export_img_drive_greenest
// Usage: export_img_drive_greenest(drive_name, drive_path, scale, region)
export_img.export_img_drive_greenest('test-export-drive-greenest', 'CFS', scale, region);



// Test export_img_drive_from_asset
// Usage: export_img_drive_from_asset(asset_folder, bounds, drive_folder, scale)
export_img.export_img_drive_from_asset(asset_folder, region, drive_folder, scale);



// Test export_hydro_sampling_collection
// Usage: export_hydro_sampling_collection(region, region_name, scale);
var region_name = 'Test';
export_img.export_hydro_sampling_collection(region, region_name, scale);



Map.addLayer(region);
