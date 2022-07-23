/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-140.98169334224528, 64.89866428936777],
          [-140.98169334224528, 63.10300863803273],
          [-137.86706931880778, 63.10300863803273],
          [-137.86706931880778, 64.89866428936777]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Export single image to drive
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');

// Set variables
var region = ee.FeatureCollection(geometry);
var index = ['NDVI'];
var antecedent = ['3mo'];
var min_year = 1985;
var max_year = 2021;
var min_mm_dd = '07-01';
var max_mm_dd = '07-31';


// File name
var export_name = 'sens_' + index + '_' + antecedent + '_p15_p85';

// Export image to drive
export_img.export_img_drive_greenest(export_name, 'Exports', 30, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
