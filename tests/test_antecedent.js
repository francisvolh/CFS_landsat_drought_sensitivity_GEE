/*
Testing: modules/antecedent.js
Alec L. Robitaille
*/

// Load antecedent module
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');

// Load palettes module
var palettes = require('users/gena/packages:palettes');

// Load get_daymet module
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');

// Set years, months
var years = ee.List.sequence(2010, 2015);
var months = ee.List.sequence(5, 7);

// Get Daymet collection
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);

// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);;


// Test antecedent_means
// Usage: antecedent_mean(images, band, year_list)
var ante_means = antecedent.antecedent_means(monthly_daymet, 'CMI', years);
print(ante_means);
Map.addLayer(ante_means.select('prcp'), {min:0, max:500});