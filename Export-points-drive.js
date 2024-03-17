/*
Export points drive
Based on: tests/test_export_points.js
Alec L. Robitaille
*/

// Modules --------------------------------------------------------------------
// Load modules
var export_points = require('users/robitalec/CFS:modules/export_points.js');
var points = require('users/robitalec/CFS:modules/points.js');



// Variables ------------------------------------------------------------------
// Drive folder
var drive_folder = 'Exports';

// Sample type
var type = 'reduceRegions';

// Asset
var points = ee.FeatureCollection('users/robitalec/CFS/2024-03-17_sampling_points_tiles_0pt01');



// Sample ---------------------------------------------------------------------
var covariates = export_points.covariates;
var res_dict = export_points.res_dict;

print(covariates);
print(res_dict);

export_points.sample_covariates(points, covariates, res_dict, drive_folder, type);