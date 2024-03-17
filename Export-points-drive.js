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
var sens = ee.ImageCollection('users/robitalec/CFS/2024-03-09/2024-03-09_image_col');

// Sample type
var type = 'reduceRegions';



// Sample ---------------------------------------------------------------------
var covariates = export_points.covariates;
var res_dict = export_points.res_dict;

print(covariates);
print(res_dict);

export_points.sample_covariates(points, covariates, res_dict, drive_folder, type);