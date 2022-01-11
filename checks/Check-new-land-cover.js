/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Point([-128.30343550654194, 57.6987913398413]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Land cover mask function
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');



// Data -------------------------------------------------------------
var l5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2');

var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var lcMask = lcmask.returnLandCover();



// Filter -----------------------------------------------------------
var year = 2008;

l5 = l5.filterDate(ee.Date.fromYMD(year, 8, 1), ee.Date.fromYMD(year + 1, 8, 1))
       .filterBounds(geometry)
       .first();

lc = lc.filterDate(ee.Date.fromYMD(year, 1, 1), ee.Date.fromYMD(year + 1, 1, 1));



// Map --------------------------------------------------------------
Map.addLayer(lc, null, 'lc');

Map.addLayer(lc.first().expression(
  'lc != 0 && lc != 20 && lc != 31 && lc != 32 && ' +
  'lc != 33 && lc != 40 && lc != 80 && lc != 81 && lc != 100',
  {lc: lc.first().select('b1')}), null, 'masked lc');
  
Map.addLayer(l5, null, 'raw l5');
Map.addLayer(lcmask.maskLandCover(l5), null, 'masked l5');