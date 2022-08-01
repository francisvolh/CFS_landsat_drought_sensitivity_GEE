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
var points = ee.FeatureCollection.randomPoints(geometry, 10);


// Test export_hydro
// Usage: export_hydro(points, drive_name, drive_folder)
// export_points.export_hydro(points, 'test-export-hydro', 'Exports');



// Test export_vegetation
// Usage: export_vegetation(points, drive_name, drive_folder)
export_points.export_vegetation(points, 'test-export-vegetation', 'Exports');



// Test export_soil
// Usage: export_soil(points, drive_name, drive_folder)
export_points.export_soil(points, 'test-export-soil', 'Exports');
