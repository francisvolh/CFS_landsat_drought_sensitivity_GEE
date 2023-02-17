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
        [[[-124.6807470703125, 53.482906635686085],
          [-124.6807470703125, 52.56108424656767],
          [-122.43129638671876, 52.56108424656767],
          [-122.43129638671876, 53.482906635686085]]], null, false),
    imageVisParam = {"opacity":1,"bands":["random"],"palette":["7074ff"]};
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Testing: modules/land_cover.js
Alec L. Robitaille
*/


// Load modules
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var landsat = require('users/robitalec/CFS:modules/landsat.js');



// Variables
// var geometry = ee.Geometry.Polygon([[[-124.68, 53.62], [-124.68, 52.70], [-122.43, 52.70], [-122.43, 53.62]]]);



// Load collection
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var lc_2008 = lc.filterDate('2008-01-01', '2009-01-01').first();
var indices_green_col = landsat.indices_greenest(2008, 2012, '06-01', '09-30', geometry);
Map.addLayer(lc, null, 'raw land cover', false);


// Test mask_classes
// Usage: mask_classes(lc_img)
var masked_lc = land_cover.mask_classes(lc_2008);
print(masked_lc);
Map.addLayer(ee.Image.constant(1), {palette: 'a8b98a'}, 'constant', false);
Map.addLayer(masked_lc, null, 'land_cover.mask_classes(img)', false);



// Test land_cover
// Usage: land_cover()
var lc_collection = land_cover.land_cover();
print(lc_collection);
Map.addLayer(lc_collection, null, 'land_cover.land_cover()', false);



// Test mask_land_cover
// Usage: mask_land_cover(img)
var indices_masked_lc = indices_green_col.map(land_cover.mask_land_cover);
print(indices_masked_lc);
Map.addLayer(indices_masked_lc.select('NDVI'), {palette:'#ffa18b'}, 'land_cover.mask_land_cover(img)', false);

