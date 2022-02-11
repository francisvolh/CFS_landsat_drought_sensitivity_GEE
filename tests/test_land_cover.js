/*
Testing: modules/land_cover.js
Alec L. Robitaille

*/


// Load land cover module
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');


// Load Hermosilla land cover
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var img = lc.first();


// Test mask_classes
// Usage: mask_classes(img)
var masked_lc = land_cover.mask_classes(img);
print(masked_lc);
Map.addLayer(masked_lc, null, 'land_cover.mask_classes(img)');


// Test get_land_cover
// Usage: get_land_cover()
var lc_collection = land_cover.get_land_cover();
print(lc_collection);
Map.addLayer(lc_collection, null, 'land_cover.get_land_cover()');


// Test mask_land_cover
// Usage: mask_land_cover(img)
var img = ee.Image.constant(1);
var img_masked_lc = land_cover.mask_land_cover(img);
print(img_masked_lc);
Map.addLayer(img_masked_lc, null, 'land_cover.mask_land_cover(img)');
