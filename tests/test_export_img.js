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
var min_year = 1985; var max_year = 2015;
var years = ee.List.sequence(min_year, max_year);
var months = ee.List.sequence(1, 12);
var min_mm_dd = '07-01';
var max_mm_dd = '07-31';
var percentile_list = [15, 85];
var index_list = ['NDVI', 'NBR'];
var antecedent_list = ['3mo', '12mo', '5yr'];
var scale = 30;

var geometry = ee.Geometry.Polygon([[[-125.87, 56.86], [-125.87, 54.98], [-121.87, 54.98], [-121.87, 56.86]]]);



// Test export_img_asset_greenest
// Usage: export_img_asset_greenest(asset_name, asset_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list)
export_img.export_img_asset_greenest('test-export-asset-greenest', 'CFS', scale, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);


// Test export_img_drive_greeenest
// Usage: export_img_drive_greeenest(drive_name, drive_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list)
export_img.export_img_drive_greeenest('test-export-drive-greenest', 'CFS', scale, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
