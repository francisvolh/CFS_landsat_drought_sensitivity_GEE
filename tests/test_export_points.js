/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-139.0142730574053, 63.6423407696705],
          [-139.0142730574053, 62.98366563970803],
          [-137.0532134870928, 62.98366563970803],
          [-137.0532134870928, 63.6423407696705]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Testing: modules/exports_points.js
Alec L. Robitaille
*/

// Load modules
var export_points = require('users/robitalec/CFS:modules/export_points.js');
var vars = require('users/robitalec/CFS:modules/variables.js');

// Set variables
var drive_folder = 'Exports';
var n_pts = 10;
var geometry = ee.Geometry.Polygon(
        [[[-139.014, 63.642],
          [-139.014, 62.983],
          [-137.053, 62.983],
          [-137.053, 63.642]]]);
var points = ee.FeatureCollection.randomPoints(geometry, n_pts);

var type = 'reduceRegions';

// Test covariates
// Usage: covariates
var covariates = export_points.covariates;
print(covariates);



// Test res_dict
// Usage: res_dict
var res_dict = export_points.res_dict;
print(res_dict);



// Test sample_covariates
// Usage: sample_covariates(points, covariates, res_dict, drive_folder, type)
export_points.sample_covariates(points, covariates, res_dict, drive_folder, type);