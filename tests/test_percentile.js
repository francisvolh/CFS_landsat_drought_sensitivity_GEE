/*
Testing: modules/percentile.js
Alec L. Robitaille
*/

// Load modules
var percentile = require('users/robitalec/CFS:modules/percentile.js');
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var palettes = require('users/gena/packages:palettes');
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');

// Set variables
var years = ee.List.sequence(2010, 2015);
var months = ee.List.sequence(1, 12);
var percentile_list = [15, 85];
var cmi_viz = {min:-30, max:30, palette: palettes.colorbrewer.RdBu[5]};

// Load collection
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);



// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

// Antecedent means
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);



// Test get_percentile
// Usage: get_percentile(images, percentile_list)
var percentile_images = percentile.get_percentile(ante_means, percentile_list);
print('Antecedent means'); print(ante_means);
print('Percentile images'); print(percentile_images);
Map.addLayer(ante_means.select('CMI_ante3mo_mean'), cmi_viz, '2010-2015 CMI 3 month antecedent means', false);
Map.addLayer(ante_means.select('CMI_ante3mo_mean').first(), cmi_viz, '2010 CMI 3 month antecedent means');
Map.addLayer(percentile_images.select('CMI_ante3mo_mean_p15'), cmi_viz, '2010-2015 CMI 15th percentile');

// Test wi_percentile
// Usage: wi_percentile(antecedent_images, percentile_images)
var wi_percent = percentile.wi_percentile(ante_means, percentile_images);
print('Less than percentile, with cap'); print(wi_percent);
Map.addLayer(wi_percent.select('CMI_ante3mo_lt_p15').first(), {min:0, max:1}, '2010 CMI lt 15th-85th p 3 month antecedent');

