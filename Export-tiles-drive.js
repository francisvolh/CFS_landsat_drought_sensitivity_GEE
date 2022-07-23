/*
Export tiles
Based on: modules/export_img.js
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');

// Set variables
var ante_list = vars.ante_list;
var min_year =  vars.min_year;
var max_year = vars.max_year;
var min_mm_dd = vars.min_mm_dd;
var max_mm_dd = vars.max_mm_dd;
var region = vars.yukon;
var scale = 30;

var asset_folder = 'users/robitalec/CFS/2022-07-10';
var drive_folder = '2022-07-10';



// Get tiles
var tiler = require('users/gena/packages:tiler');
var tiles = tiler.getTilesForGeometry(region, 7);



// Export drive from asset
export_img.export_img_drive_from_asset(asset_folder, geometry_yt, drive_folder, scale);