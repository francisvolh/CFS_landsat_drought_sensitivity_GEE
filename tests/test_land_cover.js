/*
Testing: modules/land_cover.js
Alec L. Robitaille

*/


// Load land cover module
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');


// Load Hermosilla land cover
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var img = lc.first();

// Test mask_land_cover
// Usage: mask_land_cover(img)
Map.addLayer(land_cover.mask_land_cover(img));
