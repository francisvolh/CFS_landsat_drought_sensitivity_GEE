/*
Testing: modules/fire.js
Alec L. Robitaille
*/


// Load modules
var fire = require('users/robitalec/CFS:modules/fire.js');



// Test five_year_fires
// Usage: fire.five_year_fires(year)
var five_year_fires = fire.five_year_fires(2021);
print(five_year_fires);
Map.addLayer(five_year_fires, {min:0, max:1, palette: ['000000', 'ffc781']}, 'five_year_firest');

// Test mask_five_year_fires
// Usage: fire.mask_five_year_fires(img)
var img = ee.Image.constant(1).set('year', 2021);
var mask_five_year_fires = fire.mask_five_year_fires(img);
print(mask_five_year_fires);
Map.addLayer(mask_five_year_fires, null, 'mask_five_year_fires');
