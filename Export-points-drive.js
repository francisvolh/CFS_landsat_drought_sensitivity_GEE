/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-80.89945867346277, 60.019760642195614],
          [-80.89945867346277, 43.61049031305448],
          [-48.07231023596278, 43.61049031305448],
          [-48.07231023596278, 60.019760642195614]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
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