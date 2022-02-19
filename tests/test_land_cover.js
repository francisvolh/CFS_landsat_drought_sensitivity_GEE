/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-125.10511309395461, 58.994758102907085],
          [-125.10511309395461, 58.62851304385702],
          [-124.26877886543899, 58.62851304385702],
          [-124.26877886543899, 58.994758102907085]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Testing: modules/land_cover.js
Alec L. Robitaille
*/


// Load modules
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');

// Variables
var geometry =  ee.Geometry.Polygon([[[-125.10, 58.99], [-125.10, 58.62], [-124.26, 58.62], [-124.26, 58.99]]]);

// Load collection
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var lc_2014 = lc.filterDate('2014-01-01', '2015-01-01').first();
var indices_col = get_landsat.get_indices(2014, 2019, '06-15', '07-15', geometry, ['NDVI', 'EVI']);




// Test mask_classes
// Usage: mask_classes(lc_img)
var masked_lc = land_cover.mask_classes(lc_2014);
print(masked_lc);
Map.addLayer(ee.Image.constant(1), {palette: 'a8b98a'}, 'constant');
Map.addLayer(masked_lc, null, 'land_cover.mask_classes(img)');

// Test get_land_cover
// Usage: get_land_cover()
var lc_collection = land_cover.get_land_cover();
print(lc_collection);
Map.addLayer(lc_collection, null, 'land_cover.get_land_cover()');

// Test mask_land_cover
// Usage: mask_land_cover(img)
var indices_masked_lc = indices_col.map(land_cover.mask_land_cover);
print(indices_masked_lc);
Map.addLayer(indices_masked_lc.select('NDVI'), {palette:'#ffa18b'}, 'land_cover.mask_land_cover(img) - where pink indicates masked fire areas');
Map.centerObject(img);

// Test mask_land_cover_and_fire
// Usage: mask_land_cover_and_fire(img)
var indices_masked_lc_and_fire = indices_col.map(land_cover.mask_land_cover_and_fire);
print(indices_masked_lc_and_fire);
Map.addLayer(indices_masked_lc_and_fire.select('NDVI'), null, 'land_cover.mask_land_cover_and_fire(img)');
Map.centerObject(img);