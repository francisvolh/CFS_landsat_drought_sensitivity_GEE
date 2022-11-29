/*
Export points drive
Based on: tests/test_export_points.js
Alec L. Robitaille
*/



// Modules --------------------------------------------------------------------
// Load modules
var export_points = require('users/robitalec/CFS:modules/export_points.js');
var vars = require('users/robitalec/CFS:modules/variables.js');
var eco = require('users/robitalec/CFS:modules/ecoregions.js');
var assets = require('users/robitalec/CFS:modules/assets.js');
var points = require('users/robitalec/CFS:modules/points.js');



// Variables ------------------------------------------------------------------
var drive_folder = 'Exports';
var region = vars.yukon;
var region_name = 'Yukon';

// Load ecoregions
var non_arctic_ecoregions = eco.non_arctic_ecoregions;



// Points ---------------------------------------------------------------------
var factor = 0.01;
var dir = 'users/robitalec/CFS/2022-11-19';
var tiles = assets.collect_img_assets_in_dir(dir);
tiles = tiles.slice(0, 50);
points.export_points_by_tile_asset(tiles, factor);


// Data -----------------------------------------------------------------------
// Load points
// var points = ee.FeatureCollection('users/robitalec/CFS/2022-07-29_Yukon_sampling_points_n250');



// // Sample ---------------------------------------------------------------------
// // Sensitivity
// export_points.export_sensitivity_from_asset(points, 'sample-sensitivity-' + region_name, drive_folder);

// // Soil
// export_points.export_soil(points, 'sample-soil-' + region_name, 'Exports');

// // Vegetation
// export_points.export_vegetation(points, 'sample-vegetation-' + region_name, 'Exports');



// // Hydro
// export_points.export_hydro(points, 'sample-hydro-' + region_name, drive_folder);

// // Topo
// export_points.export_topo(points, 'sample-topo-' + region_name, 'Exports');


// // Climate



// // Topo
