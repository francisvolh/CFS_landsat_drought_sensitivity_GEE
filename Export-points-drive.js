/*
Export points drive
Based on: tests/test_export_points.js
Alec L. Robitaille
*/



// Modules --------------------------------------------------------------------
// Load modules
var export_points = require('users/robitalec/CFS:modules/export_points.js');
var eco = require('users/robitalec/CFS:modules/ecoregions.js');
var points = require('users/robitalec/CFS:modules/points.js');



// Variables ------------------------------------------------------------------
var drive_folder = 'Exports';

// Load ecoregions
var non_arctic_ecoregions = eco.non_arctic_ecoregions;

// Sensitivity 
var sens = ee.ImageCollection('users/robitalec/CFS/2023-09-26/2023-09-26_image_col');


// Points ---------------------------------------------------------------------
// Generate points
var factor = 0.0001;
var factor_char = '0pt01';

points.export_points_by_img_col_asset(sens, factor, factor_char);

// Asset
var points = ee.FeatureCollection('users/robitalec/CFS/2023-10-06_sampling_points_tiles_0pt01');
var points_name = 'tiles_' + factor_char;



// Sample ---------------------------------------------------------------------
// Soil
export_points.export_soil(points, 'sample-soil-' + points_name, drive_folder, 'reduceRegions');

// Vegetation, sum proportion burned
export_points.export_vegetation(points, 'sample-vegetation-' + points_name, drive_folder, 'sample');

// Hydro
export_points.export_hydro(points, 'sample-hydro-' + points_name, drive_folder, 'reduceRegions');

// Topo
export_points.export_topo(points, 'sample-topo-' + points_name, drive_folder, 'sample');

// Climate
export_points.export_climate(points, 'sample-climate-' + points_name, drive_folder, 'reduceRegions');

// Lc, ecoreg, lon lat
export_points.export_lc_and_ecoreg(points, 'sample-lc_and_ecoreg-' + points_name, drive_folder, 'reduceRegions');

// Sensitivity
sens = sens.mosaic();
export_points.export_to_drive(sens, points, 30, 'sample-sensitivity-' + points_name, drive_folder, 'reduceRegions');
