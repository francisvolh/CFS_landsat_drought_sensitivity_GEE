/*
Testing: modules/cmi.js
Alec L. Robitaille
*/


// Load modules
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var palettes = require('users/gena/packages:palettes');
var climate = require('users/robitalec/CFS:modules/climate.js');
var vars = require('users/robitalec/CFS:modules/variables.js');


// Load collection
var daymet = climate.daymet
    .filterDate('2015-07-01', '2015-07-30')
    .mean();



// Test calc_CMI
// Usage: calc_CMI(img)
var cmi_daymet = cmi.calc_CMI(daymet);
print(cmi_daymet);
Map.addLayer(cmi_daymet.select('CMI'), vars.cmi_viz);
