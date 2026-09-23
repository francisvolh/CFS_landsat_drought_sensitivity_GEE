/*
Testing: modules/cmi.js
Alec L. Robitaille
*/


// Load modules
var cmi = require('users/francisv/CFS:modules/cmi_era5.js');
var palettes = require('users/gena/packages:palettes');
var climate = require('users/francisv/CFS:modules/climate.js');
var vars = require('users/francisv/CFS:modules/variables.js');


// Load collection
var cmi_era5 = climate.monthly_cmi_era5
    .filterDate('2015-07-01', '2015-07-30')
    .mean();



// Test calc_CMI
// Usage: calc_CMI(img)
var cmi_era5 = cmi.calc_CMI_ERA5(cmi_era5);
print(cmi_era5);
Map.addLayer(cmi_era5.select('CMI'), vars.cmi_viz);
