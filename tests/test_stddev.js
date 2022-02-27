/*
Testing: modules/stddev.js
Alec L. Robitaille
*/

// Load modules
var stddev = require('users/robitalec/CFS:modules/stddev.js');
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var palettes = require('users/gena/packages:palettes');
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');

// Set variables
var years = ee.List.sequence(2010, 2015);
var months = ee.List.sequence(1, 12);
var percentile_list = [5, 10];
var cmi_viz = {min:-30, max:30, palette: palettes.colorbrewer.RdBu[5]};
var stddev_viz = {min:-3, max:3, palette: palettes.colorbrewer.RdBu[5]};

// Load collection
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);



// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

// Antecedent means
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);



// Test get_stddev
// Usage: get_stddev(images)
var stddev_images = stddev.get_stddev(ante_means);
print('Antecedent means'); print(ante_means);
print('Standard deviation images'); print(stddev_images);
Map.addLayer(ante_means.select('CMI_ante3mo_mean'), cmi_viz, '2010-2015 CMI 3 month antecedent means', false);
Map.addLayer(ante_means.select('CMI_ante3mo_mean').first(), cmi_viz, '2010 CMI 3 month antecedent means');
Map.addLayer(stddev_images.select('CMI_ante3mo_mean_stdDev'), stddev_viz, '2010-2015 CMI standard deviations');

