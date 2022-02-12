/*
Testing: modules/land_cover.js
Alec L. Robitaille

*/


// Load land cover module
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');


// Load Hermosilla land cover
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var lc_2014 = lc.filterDate('2014-01-01', '2015-01-01').first();

// Map a constant background
Map.addLayer(ee.Image.constant(1), {palette: 'a8b98a'}, 'constant');

// Test mask_classes
// Usage: mask_classes(lc_img)
var masked_lc = land_cover.mask_classes(lc_2014);
print(masked_lc);
Map.addLayer(masked_lc, null, 'land_cover.mask_classes(img)');


// Test get_land_cover
// Usage: get_land_cover()
var lc_collection = land_cover.get_land_cover();
print(lc_collection);
Map.addLayer(lc_collection, null, 'land_cover.get_land_cover()');


// Test mask_land_cover
// Usage: mask_land_cover(img)
var img = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_060016_20140910');
var img_masked_lc = land_cover.mask_land_cover(img);
print(img_masked_lc);
Map.addLayer(img_masked_lc, null, 'land_cover.mask_land_cover(img)');