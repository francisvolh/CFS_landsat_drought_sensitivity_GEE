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
Map.addLayer(percentile_images.select('CMI_ante3mo_mean_p85'), cmi_viz, '2010-2015 CMI 85th percentile');



// Test get_percentile_masks
// Usage: get_percentile_masks(antecedent_images, percentile_images)
var percentile_masks = percentile.get_percentile_masks(ante_means, percentile_images);
print('Percentile masks', percentile_masks);
Map.addLayer(percentile_masks.select('CMI_ante3mo_wi_p15_p85').first(), {min:0, max:1}, '2010 CMI wi 15th-85th 3 month antecedent');
Map.addLayer(percentile_masks.select('CMI_ante3mo_lte_p15').first(), {min:0, max:1}, '2010 CMI lte 15th 3 month antecedent');



Map.addLayer(percentile_masks.select('CMI_ante3mo_lte_p15').first()
                             .add(percentile_masks.select('CMI_ante3mo_wi_p15_p85').first().not()), 
             {min:-1, max:0}, '2010 CMI diff wi (not) vs lte 3 month antecedent', false);
