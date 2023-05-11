/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #0b4a8b */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-141.1740845461691, 65.60642184410031],
          [-141.1740845461691, 60.41689355503953],
          [-132.2421997805441, 60.41689355503953],
          [-132.2421997805441, 65.60642184410031]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Export tiles
Based on: modules/export_img.js
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');
var vars = require('users/robitalec/CFS:modules/variables.js');

// Set variables
var ante_list = vars.ante_list;
var min_year =  vars.min_year;
var max_year = vars.max_year;
var min_mm_dd = vars.min_mm_dd;
var max_mm_dd = vars.max_mm_dd;
var region = geometry;
var scale = 500;

var asset_folder = 'users/robitalec/CFS/2023-02-21';
var drive_folder = '2023-02-21';



// Get tiles
var tiler = require('users/gena/packages:tiler');
var tiles = tiler.getTilesForGeometry(region, 7);



// Export drive from asset
//export_img.export_img_drive_from_asset(asset_folder, region, drive_folder, scale);
Export.image.toDrive(ee.ImageCollection('users/robitalec/CFS/2023-02-21/2023-02-21_image_col')
  .filterBounds(region)
  .mosaic(), '2023-05-11_img_col_2023-02-21_Yukon')