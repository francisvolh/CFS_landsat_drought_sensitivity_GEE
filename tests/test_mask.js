/*
Testing: modules/mask.js
Alec L. Robitaille
*/




// Load modules
var mask = require('users/robitalec/CFS:modules/mask.js');



// Variables
var img = ee.Image.constant(1);



// Test
Map.addLayer(img.updateMask(mask.atemporal_mask))
