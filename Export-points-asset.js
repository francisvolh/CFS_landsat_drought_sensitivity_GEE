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
var col = ee.ImageCollection('users/robitalec/CFS/' + col_date + '/' + col_date + '_image_col');

// Generate points
var factor = 0.0001;
var factor_char = '0pt01';

points.export_points_by_img_col_asset(sens, factor, factor_char);
