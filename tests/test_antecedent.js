/*
Testing: modules/antecedent.js
Alec L. Robitaille
*/

// Load antecedent module
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');

// Load CMI module
var cmi = require('users/robitalec/CFS:modules/cmi.js');

// Load palettes module
var palettes = require('users/gena/packages:palettes');
var pal = palettes.colorbrewer.RdBu[5]}

// Load get_daymet module
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');

// Set years, months
var years = ee.List.sequence(2010, 2015);
var months = ee.List.sequence(5, 7);

// Get Daymet collection
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);

// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);


// Test antecedent_means
// Usage: antecedent_mean(images, band, year_list)
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
print(ante_means);
Map.addLayer(ante_means.select('CMI_ante3mo_mean'), {min:-30, max:30, palette: palettes.});