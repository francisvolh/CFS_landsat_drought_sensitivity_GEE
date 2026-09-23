/*
Testing: modules/antecedent.js
Alec L. Robitaille
*/

// Load modules
var antecedent = require('users/francisv/CFS:modules/antecedent.js');
var cmi = require('users/francisv/CFS:modules/cmi_era5.js');
var climate = require('users/francisv/CFS:modules/climate.js');
var vars = require('users/francisv/CFS:modules/variables.js');



// Set variables
var years = ee.List.sequence(2010, 2015);
var months = ee.List.sequence(1, 12);

// Load collection
var monthly_daymet = climate.monthly_era5(years, months);

// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);



// Test antecedent_means
// Usage: antecedent_mean(images, band, year_list)
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
print(ante_means);
Map.addLayer(ante_means.select('CMI_ante3yr_mean'), vars.cmi_viz, 'CMI ante 3 year');
Map.addLayer(ante_means.filter(ee.Filter.eq('year', 2015)).select('CMI_ante2lag_mean'), vars.cmi_viz, 'CMI ante 2 lag');
