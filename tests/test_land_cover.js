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
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');



// Variables
// var geometry = ee.Geometry.Polygon([[[-124.68, 53.62], [-124.68, 52.70], [-122.43, 52.70], [-122.43, 53.62]]]);



// Load collection
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var lc_2008 = lc.filterDate('2008-01-01', '2009-01-01').first();
var indices_green_col = get_landsat.get_indices_greenest(2008, 2012, '06-15', '07-15', geometry);
Map.addLayer(lc, null, 'raw land cover');


// Test get_lc_count_mask
// Usage: get_lc_count_mask()
var lc_count_mask = land_cover.get_lc_count_mask();
Map.addLayer(lc_count_mask, null, 'land_cover.get_lc_count_mask()', false);



// Mask with get_lc_count_mask()
var img = ee.Image.random().clip(geometry).updateMask(lc_count_mask);
Map.addLayer(img, {palette: '#7074ff'}, 'mask with get_lc_count_mask()');



// Test lc_transitions
// Usage: lc_transitions()
var lc_transitions = land_cover.lc_transitions();
Map.addLayer(lc_transitions, null, 'land_cover.lc_transitions()', false);



// Mask with lc_transitions()
img = img.updateMask(lc_transitions);
Map.addLayer(img, {palette: '#ff3939'}, 'mask with get_lc_count_mask() and lc_transitions()');



// Test mask_classes
// Usage: mask_classes(lc_img)
var masked_lc = land_cover.mask_classes(lc_2008);
print(masked_lc);
Map.addLayer(ee.Image.constant(1), {palette: 'a8b98a'}, 'constant', false);
Map.addLayer(masked_lc, null, 'land_cover.mask_classes(img)', false);



// Test get_land_cover
// Usage: get_land_cover()
var lc_collection = land_cover.get_land_cover();
print(lc_collection);
Map.addLayer(lc_collection, null, 'land_cover.get_land_cover()', false);



// Test mask_land_cover
// Usage: mask_land_cover(img)
var indices_masked_lc = indices_green_col.map(land_cover.mask_land_cover);
print(indices_masked_lc);
Map.addLayer(indices_masked_lc.select('NDVI'), {palette:'#ffa18b'}, 'land_cover.mask_land_cover(img) - where pink indicates masked fire areas', false);



// Test mask_land_cover_and_fire
// Usage: mask_land_cover_and_fire(img)
var indices_masked_lc_and_fire = indices_green_col.map(land_cover.zzz_mask_land_cover_and_fire);
// print(indices_masked_lc_and_fire);
// Map.addLayer(indices_masked_lc_and_fire.select('NDVI'), null, 'land_cover.zzz_mask_land_cover_and_fire(img)', false);



// Test mask_heterogeneous
// Usage: mask_heterogeneous(img)
var mask_hetero_lc = land_cover.mask_heterogeneous(lc_2008);
// Map.addLayer(lc_2008, {palette:'#abffbd'}, 'constant (lc)', false);
// Map.addLayer(mask_hetero_lc, {palette:'#000000'}, 'land_cover.mask_heterogeneous(img)', false);



// Test get_homogeneous_land_cover
// Usage: get_homogeneous_land_cover()
// var lc_homogeneous = land_cover.get_homogeneous_land_cover();
// print(lc_homogeneous);
