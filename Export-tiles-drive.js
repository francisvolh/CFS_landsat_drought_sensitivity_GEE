/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #0b4a8b */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-141.0202759524191, 65.60642184410031],
          [-141.0202759524191, 61.347032242738756],
          [-132.2421997805441, 61.347032242738756],
          [-132.2421997805441, 65.60642184410031]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Export tiles
Based on: modules/export_img.js
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');

// Set variables
var region = vars.yukon;
var scale = 30;

var asset_folder = 'users/robitalec/CFS/2022-07-10';
var drive_folder = '2022-07-10';



// Export drive from asset
export_img.export_img_drive_from_asset(asset_folder, geometry_yt, drive_folder, scale);
