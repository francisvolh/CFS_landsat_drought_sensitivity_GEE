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

// Sample type
var type = 'reduceRegions';



// Points ---------------------------------------------------------------------
// Generate points
var factor = 0.0001;
var factor_char = '0pt01';

// points.export_points_by_img_col_asset(sens, factor, factor_char);

// Asset
var points = ee.FeatureCollection('users/robitalec/CFS/2023-10-06_sampling_points_tiles_0pt01');
var points_name = 'tiles_' + factor_char;



// Sample ---------------------------------------------------------------------
var covariates = export_points.covariates;
var res_dict = export_points.res_dict;

print(covariates);
print(res_dict);

export_points.sample_covariates(points, covariates, res_dict, drive_folder, type);