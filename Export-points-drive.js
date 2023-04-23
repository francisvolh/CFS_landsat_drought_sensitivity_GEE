/*
Export points drive
Based on: tests/test_export_points.js
Alec L. Robitaille
*/



// Modules --------------------------------------------------------------------
// Load modules
var export_points = require('users/robitalec/CFS:modules/export_points.js');
var eco = require('users/robitalec/CFS:modules/ecoregions.js');
var assets = require('users/robitalec/CFS:modules/assets.js');
var points = require('users/robitalec/CFS:modules/points.js');



// Variables ------------------------------------------------------------------
var drive_folder = 'Exports';

// Load ecoregions
var non_arctic_ecoregions = eco.non_arctic_ecoregions;


// Data -----------------------------------------------------------------------
// Generate points
var factor = 0.005;
var factor_char = '0pt5percent';
var col = ee.ImageCollection('users/robitalec/CFS/2023-02-21/2023-02-21_image_col');
col = col.randomColumn();

Export.table.toAsset(col.filter(ee.Filter.lt('random', 0.25)), filename, 'CFS/' + filename + '_quarter1');
Export.table.toAsset(col.filter(ee.Filter.and(ee.Filter.gte('random', 0.25), ee.Filter.lt('random', 0.50))), filename, 'CFS/' + filename + '_quarter2');
Export.table.toAsset(col.filter(ee.Filter.and(ee.Filter.gte('random', 0.50), ee.Filter.lt('random', 0.75))), filename, 'CFS/' + filename + '_quarter3');
Export.table.toAsset(col.filter(ee.Filter.gte('random', 0.75)), filename, 'CFS/' + filename + '_quarter4');

points.export_points_by_img_col_asset(col, factor, factor_char + '_quarter1');

// Map.addLayer(points)
// Asset
// var points = ee.FeatureCollection('users/robitalec/CFS/2023-12-21_sampling_points_tiles_0pt01percent');
// var points_name = 'tiles_0pt01';



// Sample ---------------------------------------------------------------------
// Soil
export_points.export_soil(points, 'sample-soil-' + points_name, drive_folder);

// Vegetation
export_points.export_vegetation(points, 'sample-vegetation-' + points_name, drive_folder);

// Hydro
export_points.export_hydro(points, 'sample-hydro-' + points_name, drive_folder);

// Topo
export_points.export_topo(points, 'sample-topo-' + points_name, drive_folder);

// Climate
export_points.export_climate(points, 'sample-climate-' + points_name, drive_folder);

// Lc, ecoreg, lon lat
export_points.export_lc_and_ecoreg(points, 'sample-lc-ecoreg-' + points_name, drive_folder);

// Sensitivity
export_points.export_sensitivity_from_asset(points, 'sample-sensitivity-' + points_name, drive_folder);
