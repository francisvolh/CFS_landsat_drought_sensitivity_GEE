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
Map.addLayer(land_cover.mask_classes(img));


// Test get_land_cover
// Usage: get_land_cover()
Map.addLayer(land_cover.get_land_cover());


// Test mask_land_cover
// Usage: mask_land_cover(img)
var img = ee.Image.constant(1);
Map.addLayer(land_cover.mask_land_cover(img));
