/*
Testing: modules/cmi.js
Alec L. Robitaille
*/


// Load modules
var cmi = require('users/francisv/CFS:modules/cmi_era5.js');
var palettes = require('users/gena/packages:palettes');
var climate = require('users/francisv/CFS:modules/climate.js');
var vars = require('users/francisv/CFS:modules/variables.js');


// Build year/month lists
var years = ee.List.sequence(2015, 2015);
var months = ee.List.sequence(1, 12);

// Load monthly aggregated collection
var monthly_era5 = climate.monthly_era5(years, months);

// Test calc_CMI_ERA5 — map over each monthly image, then filter/reduce
var cmi_era5 = monthly_era5
    .map(cmi.calc_CMI_ERA5)
    .filterDate('2015-07-01', '2015-07-30')
    .mean();

print(cmi_era5);
Map.addLayer(cmi_era5.select('CMI'), vars.cmi_viz);