/*
Testing: modules/export_img.js (coarse/tractable version)
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/francisv/CFS:modules/export_img.js');
var vars = require('users/francisv/CFS:modules/variables.js');

// Small test region + coarse scale so it actually completes
var region = ee.Geometry.Polygon([[[-122.87, 55.86], [-122.87, 54.98], [-121.87, 54.98], [-121.87, 55.86]]]);
var scale = 10000; // 10 km — coarse, tractable
var output = 'relative sensitivity';

// Must be an EXISTING ImageCollection/folder path
var asset_path = 'projects/perfect-victor-232201/assets/CFS';
var drive_folder = 'Test-export-img';

// Test export_img_asset_greenest
export_img.export_img_asset_greenest(output, 'test_asset_greenest', asset_path, scale, region);

// Test export_img_drive_greenest
export_img.export_img_drive_greenest(output, 'test_drive_greenest', drive_folder, scale, region);

// export_img_drive_from_asset needs an existing collection populated with images —
// skip until 2026-09-22_image_col actually has tiles in it, or point it at a
// folder you know has multiple real image assets in it already.
// export_img.export_img_drive_from_asset(asset_path, region, drive_folder, scale);

Map.addLayer(region);