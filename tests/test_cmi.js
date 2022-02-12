/*
Testing: modules/cmi.js
Alec L. Robitaille
*/


// Load CMI module
var cmi = require('users/robitalec/CFS:modules/cmi.js');

// Load palettes module
var palettes = require('users/gena/packages:palettes');


// Load Daymet V4
var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V4").first();


// Test calc_CMI
// Usage: calc_CMI(img)
var cmi_daymet = cmi.calc_CMI(daymet);
print(cmi_daymet);
Map.addLayer(cmi_daymet, {palette: palettes.colorbrewer.RdBu[5]});
