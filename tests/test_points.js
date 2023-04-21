/*
Testing: modules/points.js
Alec L. Robitaille
*/



// Modules
var points = require('users/robitalec/CFS:modules/points.js');
var vars = require('users/robitalec/CFS:modules/variables.js');
var assets= require('users/robitalec/CFS:modules/assets.js');



// Region
var region = vars.yukon;
var region_name = 'Yukon';
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada')
  .filterBounds(region);



// Test export_points_asset
// Usage: export_points_asset(n_pts, ecoregions, region_name);
var n_pts = 10;
points.export_points_asset(n_pts, ecoregions, region_name);



// Test export_points_by_img_col_asset
// Usage: export_points_by_img_col_asset(col, factor)
var factor = 0.01;
var col = 'users/robitalec/CFS/2023-02-21/2023-02-21_image_col';
points.export_points_by_img_col_asset(col, factor);
