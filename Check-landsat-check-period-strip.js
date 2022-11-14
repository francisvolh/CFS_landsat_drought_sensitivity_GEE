/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-140.42608435815322, 63.20072748613919],
          [-140.42608435815322, 62.090280046286736],
          [-137.74542029565322, 62.090280046286736],
          [-137.74542029565322, 63.20072748613919]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Compare time period for stripping
Based on Testing: modules/landsat.js
Alec L. Robitaille
*/


// Load modules
var landsat = require('users/robitalec/CFS:modules/landsat.js');
var palettes = require('users/gena/packages:palettes');

// geeblend
var blend = require('users/jja/public:blend.js');


var min_year = 2021;
var max_year = min_year + 1;



var indices_july = landsat.indices_greenest(min_year, max_year, '07-01', '07-31', geometry).select('NDVI').first();
var indices_june_july = landsat.indices_greenest(min_year, max_year, '06-01', '07-31', geometry).select('NDVI').first();
var indices_june_aug = landsat.indices_greenest(min_year, max_year, '06-01', '08-31', geometry).select('NDVI').first();
var indices_june_sep = landsat.indices_greenest(min_year, max_year, '06-01', '09-30', geometry).select('NDVI').first();


// Map
// Map.addLayer(geometry, null, 'region');
var ndvi_viz = {min: -0.5, max: 1};
var blend_viz = {min: -20, max: 20, palette: palettes.crameri.vik[10]};

// Blend maps
var indices_july_viz = indices_july.visualize(ndvi_viz);
var indices_june_july_viz = indices_june_july.visualize(ndvi_viz);
var indices_june_aug_viz = indices_june_aug.visualize(ndvi_viz);
var indices_june_sep_viz = indices_june_sep.visualize(ndvi_viz);

Map.addLayer(blend.difference(indices_july_viz, indices_june_july_viz), blend_viz, 'July - (June-July)');
Map.addLayer(blend.difference(indices_june_july_viz, indices_june_aug_viz), blend_viz, '(June-July) - (June-Aug)');
Map.addLayer(blend.difference(indices_june_aug_viz, indices_june_sep_viz), blend_viz, '(June-Aug) - (June-Sep)');
Map.addLayer(blend.difference(indices_june_july_viz, indices_june_sep_viz), blend_viz, '(June-July) - (June-Sep)');


Map.addLayer(indices_june_july, {min: -0.5, max:1}, 'NDVI greenest: June-July', false);
Map.addLayer(indices_june_aug, {min: -0.5, max:1}, 'NDVI greenest: June-Aug', false);
Map.addLayer(indices_june_sep, {min: -0.5, max:1}, 'NDVI greenest: June-Sep', false);

Map.centerObject(geometry);
