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



// Test export_points_by_tile_asset
// Usage: export_points_by_tile_asset(tiles, factor)
var factor = 0.01;
var dir = 'users/robitalec/CFS/2023-02-21';
var tiles = assets.collect_img_assets_in_dir(dir);
points.export_points_by_tile_asset(tiles, factor);
