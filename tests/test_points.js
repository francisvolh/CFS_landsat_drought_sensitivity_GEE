/*
Testing: modules/points.js
Alec L. Robitaille
*/


// Modules
var points = require('users/robitalec/CFS:modules/points.js');
var vars = require('users/robitalec/CFS:modules/variables.js');

// Region
var region = vars.yukon;
var region_name = 'Yukon';
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada')
  .filterBounds(region);



// Test export_points_asset
// Usage: export_points_asset(n_pts, ecoregions, region_name);
var n_pts = 125;
points.export_points_asset(125, ecoregions, region_name);