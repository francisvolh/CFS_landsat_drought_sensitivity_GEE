/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Point([-128.30343550654194, 57.6987913398413]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Land cover mask function
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');



// Data -------------------------------------------------------------
var l5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2');

var lcMask = lcmask.returnLandCover();

// Filter -----------------------------------------------------------
var year = 2012

l5 = l5.filter(ee.Filter.eq('year', year))
       .filterBounds(geometry);

// var lc

// Map --------------------------------------------------------------
Map.addLayer(lcMask)
