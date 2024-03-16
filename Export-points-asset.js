/*
Export points asset
Based on: tests/test_points.js
Alec L. Robitaille
*/

// Modules --------------------------------------------------------------------
var points = require('users/robitalec/CFS:modules/points.js');
var eco = require('users/robitalec/CFS:modules/ecoregions.js');



// Sample ---------------------------------------------------------------------
var col_date = '2024-03-09';
var n_pts_char = '7e3per';
var ecoregions = eco.non_arctic_ecoregions;

var col = ee.ImageCollection('users/robitalec/CFS/' + col_date + '/' + col_date + '_image_col');

var n_pts = 7e3 * col.size();
points.export_points_by_tile_asset(ecoregions, n_pts, n_pts_char);
