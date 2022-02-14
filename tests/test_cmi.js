/*
Testing: modules/cmi.js
Alec L. Robitaille
*/


// Load modules
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var palettes = require('users/gena/packages:palettes');



// Load collection
var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V4")
    .filterDate('2015-07-01', '2015-07-30')
    .mean();



// Test calc_CMI
// Usage: calc_CMI(img)
var cmi_daymet = cmi.calc_CMI(daymet);
print(cmi_daymet);
Map.addLayer(cmi_daymet.select('CMI'), {min: -30, max: 1, palette: palettes.colorbrewer.RdBu[5]});